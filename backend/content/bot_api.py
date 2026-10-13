"""Publishing contract used by the editorial Telegram bot."""

import hmac
import json
import uuid
from io import BytesIO

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import IntegrityError, transaction
from django.http import JsonResponse
from django.http.multipartparser import MultiPartParser, MultiPartParserError
from django.utils import timezone
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from PIL import Image, UnidentifiedImageError

from content.models import Article, Category, ContentKind, Expert, PublishStatus


def error(message, status=400):
    return JsonResponse({"detail": message}, status=status)


def authorized(request):
    secret = settings.BOT_INTEGRATION_TOKEN
    header = request.headers.get("Authorization", "")
    return bool(secret) and header.startswith("Bearer ") and hmac.compare_digest(header[7:], secret)


def protected(view):
    def inner(request, *args, **kwargs):
        if not authorized(request):
            return error("Forbidden", 403)
        return view(request, *args, **kwargs)
    return inner


def article_result(article):
    base = settings.FRONTEND_BASE_URL
    image_url = base + article.image.url if article.image else None
    return {
        "article_id": str(article.pk),
        "status": article.status,
        "url": f"{base}/en/insights/{article.slug}",
        "image_url": image_url,
    }


def available_categories():
    return Category.objects.filter(is_active=True, kind__in=["", ContentKind.ARTICLE]).order_by("name")


@require_http_methods(["GET"])
@protected
def options(request):
    return JsonResponse({
        "version": 1,
        "site": "hashtag-innovations",
        "categories": [{"slug": c.slug, "name": c.name_en or c.name} for c in available_categories()],
        "authors": [{"slug": a.slug, "name": a.name} for a in Expert.objects.filter(is_active=True).order_by("name")],
    })


def validated_payload(request):
    try:
        data = json.loads(request.body)
    except (ValueError, UnicodeDecodeError):
        return None, "Invalid JSON"
    if not isinstance(data, dict):
        return None, "Expected an object"
    try:
        external_id = uuid.UUID(data.get("external_id", ""))
    except (ValueError, TypeError, AttributeError):
        return None, "Invalid external_id"
    title, content, summary = data.get("title"), data.get("content"), data.get("summary", "")
    slugs, author_slug, tags = data.get("category_slugs"), data.get("author_slug"), data.get("tag_names", [])
    if not isinstance(title, str) or not title.strip() or len(title) > 300:
        return None, "Invalid title"
    if not isinstance(content, str) or not content.strip():
        return None, "Invalid content"
    if not isinstance(summary, str) or len(summary) > 1000:
        return None, "Invalid summary"
    if not isinstance(slugs, list) or not slugs or any(not isinstance(s, str) for s in slugs) or len(set(slugs)) != len(slugs):
        return None, "Invalid categories"
    if not isinstance(tags, list) or len(tags) > 10 or any(not isinstance(t, str) or not t.strip() or len(t) > 80 for t in tags):
        return None, "Invalid tags"
    if author_slug is not None and not isinstance(author_slug, str):
        return None, "Invalid author"
    categories = list(available_categories().filter(slug__in=slugs))
    if len(categories) != len(slugs):
        return None, "Unknown category"
    author = None
    if author_slug:
        author = Expert.objects.filter(slug=author_slug, is_active=True).first()
        if author is None:
            return None, "Unknown author"
    canonical = {
        "title": title.strip(), "content": content.strip(), "summary": summary.strip(),
        "category_slugs": sorted(slugs), "author_slug": author_slug or None,
        "tag_names": tags,
    }
    return (external_id, canonical, categories, author), None


@csrf_exempt
@require_http_methods(["POST"])
@protected
def articles(request):
    parsed, problem = validated_payload(request)
    if problem:
        return error(problem)
    external_id, payload, categories, author = parsed
    existing = Article.objects.filter(bot_external_id=external_id).first()
    if existing:
        if existing.bot_payload != payload:
            return error("Conflicting article payload", 409)
        return JsonResponse(article_result(existing))
    base_slug = slugify(payload["title"], allow_unicode=False)[:200] or "article"
    slug = f"{base_slug}-{external_id.hex}"
    try:
        with transaction.atomic():
            article = Article.objects.create(
                title=payload["title"], slug=slug, bot_external_id=external_id,
                bot_payload=payload, author=author, tag_names=payload["tag_names"],
                excerpt=payload["summary"], lead=payload["summary"],
                body={"sections": [{"paragraphs": payload["content"].split("\n\n")}]},
                status=PublishStatus.DRAFT,
            )
            article.categories.set(categories)
    except IntegrityError:
        existing = Article.objects.filter(bot_external_id=external_id).first()
        if existing is None:
            return error("Could not create article", 409)
        if existing.bot_payload != payload:
            return error("Conflicting article payload", 409)
        return JsonResponse(article_result(existing))
    return JsonResponse(article_result(article), status=201)


@require_http_methods(["GET"])
@protected
def article_detail(request, external_id):
    article = Article.objects.filter(bot_external_id=external_id).first()
    return JsonResponse(article_result(article)) if article else error("Article not found", 404)


@csrf_exempt
@require_http_methods(["PUT"])
@protected
def article_image(request, external_id):
    with transaction.atomic():
        article = Article.objects.select_for_update().filter(bot_external_id=external_id).first()
        if article is None:
            return error("Article not found", 404)
        if article.status != PublishStatus.DRAFT:
            return error("Article is not a draft", 409)
        if article.image:
            return JsonResponse(article_result(article))
        try:
            _, files = MultiPartParser(request.META, request, request.upload_handlers).parse()
            upload = files.get("image")
        except MultiPartParserError:
            return error("Invalid multipart upload")
        if upload is None or upload.size > 10 * 1024 * 1024:
            return error("Image is missing or exceeds 10 MiB")
        try:
            image = Image.open(upload)
            image.verify()
            upload.seek(0)
            image = Image.open(upload)
            if image.format not in {"JPEG", "PNG", "WEBP"}:
                return error("Unsupported image format")
            image.load()
            output = BytesIO()
            image.convert("RGB").save(output, format="JPEG", quality=90)
        except (UnidentifiedImageError, OSError, ValueError):
            return error("Invalid image")
        article.image.save(f"bot-{external_id}.jpg", ContentFile(output.getvalue()), save=True)
        return JsonResponse(article_result(article))


@csrf_exempt
@require_http_methods(["POST"])
@protected
def article_publish(request, external_id):
    with transaction.atomic():
        article = Article.objects.select_for_update().filter(bot_external_id=external_id).first()
        if article is None:
            return error("Article not found", 404)
        if article.status == PublishStatus.PUBLISHED:
            return JsonResponse(article_result(article))
        if article.status != PublishStatus.DRAFT:
            return error("Article cannot be published", 409)
        article.status = PublishStatus.PUBLISHED
        article.published_at = timezone.now()
        article.save(update_fields=["status", "published_at", "updated_at"])
        return JsonResponse(article_result(article))

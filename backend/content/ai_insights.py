import base64
import json
import random
import re
from datetime import datetime, time, timedelta
from io import BytesIO

import requests
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import transaction
from django.db.utils import OperationalError, ProgrammingError
from django.utils import timezone
from django.utils.text import slugify
from PIL import Image

from content.models import AIInsightSettings, Article, PublishStatus


OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_IMAGES_URL = "https://openrouter.ai/api/v1/images"
IMAGE_STYLE_PROMPT = (
    "Generate a new editorial business-tech image for a Hashtag Innovations insight article. "
    "Style reference: realistic premium business and technology imagery, like a modern AI conference, "
    "corporate workshop, innovation summit, or diverse leadership meeting in a bright modern office. "
    "Use clean composition, natural people, laptops, screens, diagrams, light European corporate atmosphere, "
    "blue/cyan technology accents when appropriate, professional but warm. "
    "No abstract geometric poster, no flat vector art, no text overlays, no logos, no fake readable words, "
    "no distorted hands or faces. The image must work as a 16:9 article cover."
)
DEFAULT_PROMPT = (
    "Create one publish-ready business insight for the Hashtag Innovations audience. "
    "Choose a fresh topic from business strategy, AI adoption, digital transformation, "
    "startup growth, operations, education, sustainability, or innovation. "
    "Return English and Bulgarian versions. Do not mention or invent an author."
)


def get_ai_insights_prompt():
    config = get_ai_insight_settings()
    return (config.prompt or getattr(settings, "AI_INSIGHTS_PROMPT", "") or DEFAULT_PROMPT).strip()


def get_ai_insight_settings():
    try:
        config = AIInsightSettings.objects.select_related("author").first()
    except (OperationalError, ProgrammingError):
        config = None

    if config:
        return config

    return AIInsightSettings(
        prompt=getattr(settings, "AI_INSIGHTS_PROMPT", "") or DEFAULT_PROMPT,
        interval_days=max(1, int(getattr(settings, "AI_INSIGHTS_INTERVAL_DAYS", 1))),
    )


def ensure_ai_insight_settings():
    config = AIInsightSettings.objects.select_related("author").first()
    if config:
        return config

    return AIInsightSettings.objects.create(
        prompt=getattr(settings, "AI_INSIGHTS_PROMPT", "") or DEFAULT_PROMPT,
        interval_days=max(1, int(getattr(settings, "AI_INSIGHTS_INTERVAL_DAYS", 1))),
    )


def save_ai_insight_settings(payload):
    config = AIInsightSettings.objects.select_related("author").first() or AIInsightSettings()
    if "prompt" in payload:
        config.prompt = str(payload.get("prompt", "") or "").strip()
    if "interval_days" in payload:
        config.interval_days = max(1, int(payload.get("interval_days") or 1))
    if "author" in payload:
        raw_author = str(payload.get("author", "") or "").strip()
        if raw_author:
            config.author = config_author(raw_author)
        else:
            config.author = None

    config.full_clean()
    config.save()
    return config


def config_author(value):
    query = AIInsightSettings._meta.get_field("author").remote_field.model.objects.all()
    if value.isdigit():
        found = query.filter(id=int(value)).first()
        if found:
            return found
    return query.filter(slug=value).first()


def get_ai_insights_interval_days():
    config = get_ai_insight_settings()
    return max(1, int(config.interval_days or getattr(settings, "AI_INSIGHTS_INTERVAL_DAYS", 1)))


def workday_window_for(day):
    start = time(hour=10)
    end = time(hour=18)
    current_tz = timezone.get_current_timezone()
    starts_at = timezone.make_aware(datetime.combine(day, start), current_tz)
    ends_at = timezone.make_aware(datetime.combine(day, end), current_tz)
    return starts_at, ends_at


def random_run_at(day, now=None):
    now = now or timezone.now()
    starts_at, ends_at = workday_window_for(day)
    earliest = max(starts_at, now)
    if earliest >= ends_at:
        return None
    seconds = int((ends_at - earliest).total_seconds())
    return earliest + timedelta(seconds=random.randint(0, seconds))


def generated_slug_prefix(day):
    return f"ai-insight-{day.isoformat()}"


def unique_article_slug(base_slug):
    candidate = base_slug[:240]
    counter = 2

    while Article.objects.filter(slug=candidate).exists():
        suffix = f"-{counter}"
        candidate = f"{base_slug[: 240 - len(suffix)]}{suffix}"
        counter += 1

    return candidate


def already_generated_for_day(day):
    return Article.objects.filter(slug__startswith=generated_slug_prefix(day)).exists()


def extract_json(text):
    text = str(text or "").strip()
    fenced = re.search(r"```(?:json)?\s*(.*?)\s*```", text, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        text = fenced.group(1).strip()
    return json.loads(text)


def normalize_sections(value):
    sections = value if isinstance(value, list) else []
    normalized = []
    for section in sections:
        if not isinstance(section, dict):
            continue
        title = str(section.get("title", "") or "").strip()
        paragraphs = [
            str(item).strip()
            for item in section.get("paragraphs", [])
            if str(item).strip()
        ]
        if title or paragraphs:
            normalized.append({"title": title, "paragraphs": paragraphs})
    return normalized


def normalize_list(value, limit=None):
    items = value if isinstance(value, list) else []
    normalized = [
        str(item).strip()
        for item in items
        if str(item).strip()
    ]
    return normalized[:limit] if limit else normalized


def normalize_faq(value):
    items = value if isinstance(value, list) else []
    normalized = []
    for item in items:
        if not isinstance(item, dict):
            continue
        question = str(item.get("question", "") or "").strip()
        answer = str(item.get("answer", "") or "").strip()
        if question or answer:
            normalized.append({"question": question, "answer": answer})
    return normalized


def normalize_sources(value):
    items = value if isinstance(value, list) else []
    normalized = []
    for item in items:
        if not isinstance(item, dict):
            continue
        title = str(item.get("title", "") or "").strip()
        url = str(item.get("url", "") or "").strip()
        publisher = str(item.get("publisher", "") or "").strip()
        note = str(item.get("note", "") or "").strip()
        if title or url:
            normalized.append({
                "title": title,
                "url": url,
                "publisher": publisher,
                "note": note,
            })
    return normalized


def normalize_statistics(value):
    items = value if isinstance(value, list) else []
    normalized = []
    for item in items:
        if not isinstance(item, dict):
            continue
        label = str(item.get("label", "") or "").strip()
        value_text = str(item.get("value", "") or "").strip()
        source = str(item.get("source", "") or "").strip()
        url = str(item.get("url", "") or "").strip()
        if label or value_text:
            normalized.append({
                "label": label,
                "value": value_text,
                "source": source,
                "url": url,
            })
    return normalized


def normalize_article_payload(data):
    result = {}
    for lang in ("en", "bg"):
        localized = data.get(lang) if isinstance(data.get(lang), dict) else {}
        result[lang] = {
            "title": str(localized.get("title", "") or "").strip()[:220],
            "excerpt": str(localized.get("excerpt", "") or "").strip(),
            "lead": str(localized.get("lead", "") or "").strip(),
            "body": {
                "sections": normalize_sections(localized.get("sections")),
                "faq": normalize_faq(localized.get("faq")),
                "sources": normalize_sources(localized.get("sources")),
                "statistics": normalize_statistics(localized.get("statistics")),
                "image_ideas": normalize_list(localized.get("image_ideas")),
                "social_titles": normalize_list(localized.get("social_titles")),
                "linkedin_post": str(localized.get("linkedin_post", "") or "").strip(),
                "facebook_post": str(localized.get("facebook_post", "") or "").strip(),
                "internal_links": normalize_list(localized.get("internal_links")),
                "external_links": normalize_sources(localized.get("external_links")),
                "seo": localized.get("seo") if isinstance(localized.get("seo"), dict) else {},
                "hashtags": [
                    str(tag).strip().lstrip("#")
                    for tag in localized.get("hashtags", [])
                    if str(tag).strip()
                ][:6],
            },
        }

    if not result["en"]["title"] and result["bg"]["title"]:
        result["en"]["title"] = result["bg"]["title"]
    if not result["bg"]["title"] and result["en"]["title"]:
        result["bg"]["title"] = result["en"]["title"]

    if not result["en"]["title"]:
        raise ValueError("OpenRouter returned an article without a title.")

    image = data.get("image") if isinstance(data.get("image"), dict) else {}
    result["image"] = {
        "headline": str(image.get("headline", "") or result["en"]["title"]).strip(),
        "visual_prompt": str(image.get("visual_prompt", "") or "").strip(),
    }
    return result


def build_generation_messages(recent_titles):
    schema = {
        "en": {
            "title": "Short title",
            "excerpt": "One sentence summary",
            "lead": "Two sentence lead",
            "sections": [
                {"title": "Section title", "paragraphs": ["Paragraph"]}
            ],
            "seo": {
                "meta_title": "SEO title up to 60 characters",
                "meta_description": "SEO description between 140 and 160 characters",
                "url_slug": "seo-friendly-url-slug",
            },
            "faq": [
                {"question": "Question", "answer": "Answer"}
            ],
            "sources": [
                {"title": "Source title", "publisher": "Publisher", "url": "https://example.com", "note": "How it supports the article"}
            ],
            "statistics": [
                {"label": "Statistic label", "value": "Statistic value", "source": "Original source", "url": "https://example.com"}
            ],
            "image_ideas": ["Image idea"],
            "social_titles": ["Social network title"],
            "linkedin_post": "Short LinkedIn post",
            "facebook_post": "Short Facebook post",
            "internal_links": ["Internal linking suggestion"],
            "external_links": [
                {"title": "External source title", "publisher": "Publisher", "url": "https://example.com", "note": "Why it is authoritative"}
            ],
            "hashtags": ["Business", "AI"],
        },
        "bg": {
            "title": "Bulgarian title",
            "excerpt": "Bulgarian summary",
            "lead": "Bulgarian lead",
            "sections": [
                {"title": "Bulgarian section title", "paragraphs": ["Bulgarian paragraph"]}
            ],
            "seo": {
                "meta_title": "Bulgarian SEO title up to 60 characters",
                "meta_description": "Bulgarian SEO description between 140 and 160 characters",
                "url_slug": "bulgarian-seo-friendly-url-slug",
            },
            "faq": [
                {"question": "Bulgarian question", "answer": "Bulgarian answer"}
            ],
            "sources": [
                {"title": "Source title", "publisher": "Publisher", "url": "https://example.com", "note": "Bulgarian note"}
            ],
            "statistics": [
                {"label": "Bulgarian statistic label", "value": "Statistic value", "source": "Original source", "url": "https://example.com"}
            ],
            "image_ideas": ["Bulgarian image idea"],
            "social_titles": ["Bulgarian social network title"],
            "linkedin_post": "Short Bulgarian LinkedIn post",
            "facebook_post": "Short Bulgarian Facebook post",
            "internal_links": ["Bulgarian internal linking suggestion"],
            "external_links": [
                {"title": "External source title", "publisher": "Publisher", "url": "https://example.com", "note": "Why it is authoritative"}
            ],
            "hashtags": ["Business", "AI"],
        },
        "image": {
            "headline": "Three to six words for the cover image",
            "visual_prompt": "Brief image prompt describing a realistic business-tech scene for this article",
        },
    }
    user_prompt = {
        "content_prompt": get_ai_insights_prompt(),
        "recent_titles_to_avoid": recent_titles,
        "requirements": [
            "Return valid JSON only.",
            "Write no author name, byline, signature, or disclaimer.",
            "Follow content_prompt exactly for article length, structure, source requirements, SEO assets, FAQ, and supporting materials.",
            "Do not shorten, summarize, or omit requested sections unless the content_prompt explicitly asks for a shorter format.",
            "Make the content specific, useful, and non-generic for business readers.",
            "Use English hashtags in both locales for filtering.",
            "Write image.visual_prompt in English and make it suitable for realistic image generation.",
        ],
        "json_shape": schema,
    }
    return [
        {
            "role": "system",
            "content": "You generate publish-ready business insight articles as strict JSON.",
        },
        {
            "role": "user",
            "content": json.dumps(user_prompt, ensure_ascii=False),
        },
    ]


def call_openrouter_for_article():
    if not settings.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not configured.")

    recent_titles = list(
        Article.objects.filter(status=PublishStatus.PUBLISHED)
        .order_by("-published_at", "-created_at")
        .values_list("title", flat=True)[:12]
    )
    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": build_generation_messages(recent_titles),
        "temperature": float(getattr(settings, "AI_INSIGHTS_TEMPERATURE", 0.8)),
        "max_tokens": int(getattr(settings, "AI_INSIGHTS_MAX_TOKENS", 12000)),
        "response_format": {"type": "json_object"},
    }
    response = requests.post(
        OPENROUTER_CHAT_URL,
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.FRONTEND_BASE_URL,
            "X-OpenRouter-Title": "Hashtag Innovations AI Insights",
        },
        json=payload,
        timeout=60,
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as error:
        raise ValueError(f"OpenRouter text generation failed: {response.text[:500]}") from error
    data = response.json()
    choices = data.get("choices") if isinstance(data, dict) else []
    message = choices[0].get("message", {}) if choices else {}
    return normalize_article_payload(extract_json(message.get("content", "")))


def build_cover_prompt(article_payload):
    sections = article_payload["en"].get("body", {}).get("sections", [])
    section_titles = [
        str(section.get("title", "")).strip()
        for section in sections
        if isinstance(section, dict) and str(section.get("title", "")).strip()
    ]
    topic_prompt = article_payload.get("image", {}).get("visual_prompt", "")
    if not topic_prompt:
        topic_prompt = article_payload["en"].get("excerpt", "") or article_payload["en"].get("title", "")

    return "\n".join(
        [
            IMAGE_STYLE_PROMPT,
            f"Article title: {article_payload['en'].get('title', '')}",
            f"Article summary: {article_payload['en'].get('excerpt', '')}",
            f"Article topics: {', '.join(section_titles[:3])}",
            f"Scene direction: {topic_prompt}",
        ]
    )


def cover_crop(image, size=(1200, 675)):
    target_width, target_height = size
    source_width, source_height = image.size
    target_ratio = target_width / target_height
    source_ratio = source_width / source_height

    if source_ratio > target_ratio:
        crop_width = int(source_height * target_ratio)
        left = (source_width - crop_width) // 2
        box = (left, 0, left + crop_width, source_height)
    else:
        crop_height = int(source_width / target_ratio)
        top = (source_height - crop_height) // 2
        box = (0, top, source_width, top + crop_height)

    return image.crop(box).resize(size, Image.Resampling.LANCZOS)


def create_cover_image(article_payload):
    if not settings.OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is not configured.")

    payload = {
        "model": settings.OPENROUTER_IMAGE_MODEL,
        "prompt": build_cover_prompt(article_payload),
        "n": 1,
        "aspect_ratio": settings.AI_INSIGHTS_IMAGE_ASPECT_RATIO,
        "resolution": settings.AI_INSIGHTS_IMAGE_RESOLUTION,
        "quality": settings.AI_INSIGHTS_IMAGE_QUALITY,
        "output_format": "png",
    }
    response = requests.post(
        OPENROUTER_IMAGES_URL,
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.FRONTEND_BASE_URL,
            "X-OpenRouter-Title": "Hashtag Innovations AI Insight Covers",
        },
        json=payload,
        timeout=180,
    )
    try:
        response.raise_for_status()
    except requests.HTTPError as error:
        raise ValueError(f"OpenRouter image generation failed: {response.text[:500]}") from error
    data = response.json()
    images = data.get("data") if isinstance(data, dict) else []
    image_data = images[0] if images and isinstance(images[0], dict) else {}
    encoded_image = image_data.get("b64_json")
    if not encoded_image:
        raise ValueError("OpenRouter image generation returned no image.")

    image = Image.open(BytesIO(base64.b64decode(encoded_image))).convert("RGB")
    image = cover_crop(image)

    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=90, optimize=True)
    return ContentFile(buffer.getvalue())


def create_ai_insight(publish_at=None, dry_run=False, force=False):
    publish_at = publish_at or timezone.now()
    local_day = timezone.localtime(publish_at).date()
    config = get_ai_insight_settings()

    with transaction.atomic():
        if not force and already_generated_for_day(local_day):
            return None

        article_payload = call_openrouter_for_article()
        base_slug = slugify(article_payload["en"]["title"], allow_unicode=False) or "business-insight"
        slug = unique_article_slug(f"{generated_slug_prefix(local_day)}-{base_slug}")

        article = Article(
            title=article_payload["en"]["title"],
            slug=slug,
            author=config.author,
            author_name="",
            excerpt=article_payload["en"]["excerpt"],
            lead=article_payload["en"]["lead"],
            body={
                **article_payload["en"]["body"],
                "_ai_generated": True,
                "_lang": "en",
            },
            translations={
                "en": article_payload["en"],
                "bg": article_payload["bg"],
            },
            published_at=publish_at,
            status=PublishStatus.PUBLISHED,
        )
        if dry_run:
            return article

        image_file = create_cover_image(article_payload)
        article.image.save(f"{slug}.jpg", image_file, save=False)
        article.full_clean()
        article.save()
        return article

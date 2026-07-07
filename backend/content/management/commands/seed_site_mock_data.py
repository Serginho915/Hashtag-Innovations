import json
from datetime import datetime
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.text import slugify

from content.models import (
    Article,
    ArticleType,
    Category,
    ContentKind,
    Event,
    Expert,
    LearnMaterial,
    Organization,
    Project,
    PublishStatus,
    Tag,
)


def as_list(value):
    return value if isinstance(value, list) else []


def image_name(value):
    if not value:
        return ""
    return str(value).lstrip("/")


def make_slug(value, fallback):
    return slugify(str(value), allow_unicode=True)[:220] or fallback


def base_localized_id(value):
    text = str(value or "")
    text = text.replace("-en-", "-").replace("-bg-", "-")
    for suffix in ("-en", "-bg"):
        if text.endswith(suffix):
            return text[: -len(suffix)]
    return text


def parse_iso(value):
    parsed = parse_datetime(str(value)) if value else None
    if parsed and timezone.is_naive(parsed):
        parsed = timezone.make_aware(parsed, timezone=timezone.utc)
    return parsed


def parse_date(value):
    if not value:
        return None
    try:
        return datetime.strptime(str(value), "%d/%m/%Y").date()
    except ValueError:
        return None


def parse_price(value):
    if value is None or value == "":
        return None
    cleaned = "".join(ch for ch in str(value) if ch.isdigit() or ch in ".,")
    if not cleaned:
        return None
    return Decimal(cleaned.replace(",", "."))


class Command(BaseCommand):
    help = "Seed the database with the frontend mock data currently used by the site."

    def handle(self, *args, **options):
        fixture_path = Path(__file__).resolve().parents[2] / "fixtures" / "site_mock_data.json"
        data = json.loads(fixture_path.read_text(encoding="utf-8"))

        self.organization, _ = Organization.objects.update_or_create(
            slug="hashtag-innovations",
            defaults={
                "name": "Hashtag Innovations",
                "logo": image_name("/images/Logo.svg"),
                "website_url": "https://hashtag-innovations.com",
                "description": "Main platform organization.",
                "is_active": True,
            },
        )

        self.seed_experts(data)
        self.seed_articles(data)
        self.seed_events(data)
        self.seed_learn_materials(data)
        self.seed_projects(data)

        self.stdout.write(self.style.SUCCESS("Seeded site mock data into the database."))

    def get_category(self, name, kind):
        category, _ = Category.objects.update_or_create(
            slug=make_slug(f"{kind}-{name}", f"{kind}-category"),
            defaults={
                "name": str(name or "General"),
                "kind": kind,
                "is_active": True,
            },
        )
        return category

    def get_tags(self, names, kind):
        tags = []
        for name in as_list(names):
            tag, _ = Tag.objects.update_or_create(
                slug=make_slug(f"{kind}-{name}", f"{kind}-tag"),
                defaults={
                    "name": str(name),
                    "kind": kind,
                    "is_active": True,
                },
            )
            tags.append(tag)
        return tags

    def seed_experts(self, data):
        grouped = {}
        for lang, experts in data["experts"].items():
            for item in experts:
                mock_id = str(item.get("id", "expert"))
                grouped.setdefault(mock_id, {})[lang] = item

        for mock_id, translations_source in grouped.items():
            fallback = translations_source.get("en") or translations_source.get("bg") or {}
            translations = {}

            for lang, item in translations_source.items():
                translations[lang] = {
                    "name": item.get("name", ""),
                    "role": item.get("role", ""),
                    "company_name": item.get("company", ""),
                    "quote": item.get("quote", ""),
                    "bio": as_list(item.get("bio")),
                    "expertise": as_list(item.get("expertise")),
                    "industries": as_list(item.get("industries")),
                    "languages": as_list(item.get("languages")),
                    "experience": as_list(item.get("experienceList")),
                }

            expert, _ = Expert.objects.update_or_create(
                slug=mock_id,
                defaults={
                    "name": fallback.get("name", ""),
                    "role": fallback.get("role", ""),
                    "company_name": fallback.get("company", ""),
                    "organization": self.organization,
                    "photo": image_name(fallback.get("imageUrl")),
                    "quote": fallback.get("quote", ""),
                    "bio": "\n".join(as_list(fallback.get("bio"))),
                    "expertise": as_list(fallback.get("expertise")),
                    "industries": as_list(fallback.get("industries")),
                    "languages": as_list(fallback.get("languages")),
                    "experience": as_list(fallback.get("experienceList")),
                    "translations": translations,
                    "analytics": {
                        **(fallback.get("analytics") or {}),
                        "_mock_id": mock_id,
                        "availableDates": as_list(fallback.get("availableDates")),
                        "availableTimes": fallback.get("availableTimes") or {},
                        "availableFor": as_list(fallback.get("availableFor")),
                    },
                    "is_available_for_consultation": bool(fallback.get("availableFor")),
                    "service_consultation": True,
                    "service_consultation_price": fallback.get("price"),
                    "service_mentorship": True,
                    "service_mentorship_price": fallback.get("price"),
                    "service_project_analysis": True,
                    "service_project_analysis_price": fallback.get("price"),
                    "is_featured": mock_id in {"expert-1", "expert-4"},
                    "is_active": True,
                },
            )
            expert.tags.set(self.get_tags(fallback.get("expertise"), ContentKind.EXPERT))

    def seed_articles(self, data):
        grouped = {}
        for lang, articles in data["news"].items():
            for item in articles:
                grouped.setdefault(base_localized_id(item.get("id")), {})[lang] = item

        for article_id, translations_source in grouped.items():
            fallback = translations_source.get("en") or translations_source.get("bg") or {}
            translations = {}

            for lang, item in translations_source.items():
                translations[lang] = {
                    "title": item.get("title", ""),
                    "author_name": item.get("authorName", ""),
                    "excerpt": item.get("excerpt", ""),
                    "lead": item.get("lead", ""),
                    "promoted_label": item.get("promotedLabel", ""),
                    "body": {
                        "sections": as_list(item.get("bodySections")),
                        "hashtags": as_list(item.get("hashtags")),
                        "displayDate": item.get("displayDate"),
                        "timeToRead": item.get("timeToRead"),
                        "readTime": item.get("readTime"),
                        "_mock_id": item.get("id"),
                    },
                }

            fallback_translation = translations.get("en") or translations.get("bg") or {}
            fallback_body = fallback_translation.get("body", {})
            category = self.get_category(fallback.get("category"), ContentKind.ARTICLE)
            author_slug = fallback.get("authorExpertId")
            author = Expert.objects.filter(slug=author_slug).first() if author_slug else None
            article, _ = Article.objects.update_or_create(
                slug=article_id,
                defaults={
                    "article_type": ArticleType.NEWS,
                    "title": fallback_translation.get("title", ""),
                    "category": category,
                    "author": author,
                    "author_name": fallback_translation.get("author_name", ""),
                    "image": image_name(fallback.get("imageUrl")),
                    "excerpt": fallback_translation.get("excerpt", ""),
                    "lead": fallback_translation.get("lead", ""),
                    "body": fallback_body,
                    "translations": translations,
                    "promoted_label": fallback_translation.get("promoted_label", ""),
                    "read_time": parse_price(fallback.get("readTime")) or 5,
                    "published_at": parse_iso(fallback.get("date") or fallback.get("createdAt")),
                    "status": PublishStatus.PUBLISHED,
                    "is_featured": bool(fallback.get("promotedLabel")),
                },
            )
            article.tags.set(self.get_tags(fallback.get("tags"), ContentKind.ARTICLE))

    def seed_events(self, data):
        for item in data["events"]:
            raw = item.copy()
            category = self.get_category((item.get("tags") or ["event"])[0], ContentKind.EVENT)
            event, _ = Event.objects.update_or_create(
                slug=str(item.get("id")),
                defaults={
                    "title": item.get("title", ""),
                    "category": category,
                    "description": item.get("description", ""),
                    "detail_description": json.dumps(raw, ensure_ascii=False),
                    "starts_at": parse_iso(item.get("date")) or timezone.now(),
                    "timezone": item.get("timezone", ""),
                    "location": item.get("location", ""),
                    "price_label": item.get("price", ""),
                    "image": image_name(item.get("imageSrc")),
                    "hero_image": image_name(item.get("heroImageSrc") or item.get("imageSrc")),
                    "status": PublishStatus.PUBLISHED,
                    "is_featured_hero": item.get("id") == "evt-1",
                },
            )
            event.tags.set(self.get_tags(item.get("tags"), ContentKind.EVENT))

    def seed_learn_materials(self, data):
        for lang, materials in data["textbooks"].items():
            for item in materials:
                category = self.get_category(item.get("category"), ContentKind.LEARN_MATERIAL)
                material, _ = LearnMaterial.objects.update_or_create(
                    slug=f"{item.get('id')}-{lang}",
                    defaults={
                        "title": item.get("title", ""),
                        "category": category,
                        "author_name": item.get("authorName", ""),
                        "excerpt": item.get("excerpt", ""),
                        "cover_image": image_name(item.get("imageUrl")),
                        "pdf_file": image_name(item.get("pdfUrl")),
                        "preview_pdf_file": image_name(item.get("previewPdfUrl")),
                        "sales_url": item.get("salesUrl", ""),
                        "format_label": item.get("format", ""),
                        "price": parse_price(item.get("price")),
                        "badge": item.get("badge", ""),
                        "has_preview": bool(item.get("hasPreview")),
                        "is_trending": bool(item.get("isTrending")),
                        "status": PublishStatus.PUBLISHED,
                        "published_at": parse_iso(item.get("createdAt")),
                    },
                )
                material.tags.set(self.get_tags([item.get("format"), item.get("badge")], ContentKind.LEARN_MATERIAL))

    def seed_projects(self, data):
        for lang, projects in data["projects"].items():
            for item in projects:
                category = self.get_category("Projects", ContentKind.PROJECT)
                project, _ = Project.objects.update_or_create(
                    slug=f"{item.get('id')}-{lang}",
                    defaults={
                        "title": item.get("title", ""),
                        "category": category,
                        "organization": self.organization,
                        "description": item.get("description", ""),
                        "code": item.get("code", ""),
                        "project_date": parse_date(item.get("date")),
                        "image": image_name(item.get("imageUrl")),
                        "status": PublishStatus.PUBLISHED,
                        "is_featured": True,
                    },
                )
                project.tags.set(self.get_tags(["Projects"], ContentKind.PROJECT))

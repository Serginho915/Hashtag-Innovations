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
    Category,
    ContentKind,
    Event,
    Expert,
    LearnMaterial,
    Organization,
    Project,
    PublishStatus,
)


def as_list(value):
    return value if isinstance(value, list) else []


def compact_list(values):
    return [str(value) for value in values if value not in (None, "")]


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


BG_CATEGORY_TO_EN = {
    "Бизнес": "Business",
    "Изкуствен интелект": "Artificial Intelligence",
    "Иновации": "Innovation",
    "Образование": "Education",
    "Стратегия": "Strategy",
    "Технологии": "Technology",
    "Проекти": "Projects",
}
EN_CATEGORY_TO_BG = {value: key for key, value in BG_CATEGORY_TO_EN.items()}


def category_names(name, name_bg=None):
    raw_name = str(name or "General")
    raw_bg = str(name_bg or "")

    if raw_name in BG_CATEGORY_TO_EN:
        return BG_CATEGORY_TO_EN[raw_name], raw_name

    return raw_name, raw_bg or EN_CATEGORY_TO_BG.get(raw_name, "")


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

    def get_category(self, name, kind, name_bg=None):
        name_en, translated_bg = category_names(name, name_bg)
        category, _ = Category.objects.update_or_create(
            slug=make_slug(f"{kind}-{name_en}", f"{kind}-category"),
            defaults={
                "name": name_en,
                "name_en": name_en,
                "name_bg": translated_bg,
                "kind": kind,
                "is_active": True,
            },
        )
        return category

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
                    "experience": as_list(item.get("experienceList")),
                }
                if lang == "en":
                    translations[lang].update(
                        {
                            "expertise": as_list(item.get("expertise")),
                            "industries": as_list(item.get("industries")),
                            "languages": as_list(item.get("languages")),
                        }
                    )

            Expert.objects.update_or_create(
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
                    "body": {
                        "sections": as_list(item.get("bodySections")),
                        "_mock_id": item.get("id"),
                    },
                }
                if lang == "en":
                    translations[lang]["body"]["hashtags"] = as_list(item.get("hashtags"))

            fallback_translation = translations.get("en") or translations.get("bg") or {}
            fallback_body = fallback_translation.get("body", {})
            author_slug = fallback.get("authorExpertId")
            author = Expert.objects.filter(slug=author_slug).first() if author_slug else None
            Article.objects.update_or_create(
                slug=article_id,
                defaults={
                    "title": fallback_translation.get("title", ""),
                    "author": author,
                    "author_name": fallback_translation.get("author_name", ""),
                    "image": image_name(fallback.get("imageUrl")),
                    "excerpt": fallback_translation.get("excerpt", ""),
                    "lead": fallback_translation.get("lead", ""),
                    "body": fallback_body,
                    "translations": translations,
                    "published_at": parse_iso(fallback.get("date") or fallback.get("createdAt")),
                    "status": PublishStatus.PUBLISHED,
                    "is_featured": False,
                },
            )

    def seed_events(self, data):
        for item in data["events"]:
            tags = as_list(item.get("tags"))
            category = self.get_category((item.get("tags") or ["event"])[0], ContentKind.EVENT)
            translations = {
                "en": {
                    "title": item.get("title", ""),
                    "short_description": item.get("description", ""),
                    "detail_description": item.get("detailDescription", ""),
                },
                "bg": {
                    "title": item.get("titleBg", ""),
                    "short_description": item.get("descriptionBg", ""),
                    "detail_description": item.get("detailDescriptionBg", ""),
                },
            }
            Event.objects.update_or_create(
                slug=str(item.get("id")),
                defaults={
                    "title": item.get("title", ""),
                    "category": category,
                    "tags": tags,
                    "short_description": item.get("description", ""),
                    "detail_description": item.get("detailDescription", ""),
                    "translations": translations,
                    "starts_at": parse_iso(item.get("date")) or timezone.now(),
                    "location": item.get("location", ""),
                    "price": item.get("price", ""),
                    "image": image_name(item.get("imageSrc")),
                    "status": PublishStatus.PUBLISHED,
                },
            )

    def seed_learn_materials(self, data):
        grouped = {}
        for lang, materials in data["textbooks"].items():
            for item in materials:
                grouped.setdefault(str(item.get("id")), {})[lang] = item

        for material_id, translations_source in grouped.items():
            fallback = translations_source.get("en") or translations_source.get("bg") or {}
            translations = {}

            for lang, item in translations_source.items():
                translations[lang] = {
                    "title": item.get("title", ""),
                    "excerpt": item.get("excerpt", ""),
                    "badge": item.get("badge", ""),
                }

            fallback_translation = translations.get("en") or translations.get("bg") or {}
            category = self.get_category(fallback.get("category"), ContentKind.LEARN_MATERIAL)
            author_name = fallback.get("authorName", "")
            author = Expert.objects.filter(name=author_name).first() if author_name else None
            LearnMaterial.objects.update_or_create(
                slug=material_id,
                defaults={
                    "title": fallback_translation.get("title", ""),
                    "category": category,
                    "tags": compact_list([fallback.get("badge")]),
                    "author": author,
                    "excerpt": fallback_translation.get("excerpt", ""),
                    "translations": translations,
                    "cover_image": image_name(fallback.get("imageUrl")),
                    "pdf_file": image_name(fallback.get("pdfUrl")),
                    "preview_pdf_file": image_name(fallback.get("previewPdfUrl")),
                    "price": parse_price(fallback.get("price")),
                    "badge": fallback_translation.get("badge", ""),
                    "is_trending": bool(fallback.get("isTrending")),
                    "status": PublishStatus.PUBLISHED,
                    "published_at": parse_iso(fallback.get("createdAt")),
                },
            )

    def seed_projects(self, data):
        grouped = {}
        for lang, projects in data["projects"].items():
            for item in projects:
                grouped.setdefault(str(item.get("id")), {})[lang] = item

        for project_id, translations_source in grouped.items():
            fallback = translations_source.get("en") or translations_source.get("bg") or {}
            translations = {}

            for lang, item in translations_source.items():
                description = item.get("description", "")
                translations[lang] = {
                    "title": item.get("title", ""),
                    "excerpt": description,
                    "lead": description,
                    "description": description,
                    "body": {
                        "sections": [{"html": f"<p>{description}</p>"}] if description else [],
                    },
                }
                if lang == "en":
                    translations[lang]["body"]["hashtags"] = []

            fallback_translation = translations.get("en") or translations.get("bg") or {}
            fallback_body = fallback_translation.get("body", {})
            project_date = parse_date(fallback.get("date"))
            published_at = (
                timezone.make_aware(datetime.combine(project_date, datetime.min.time()), timezone=timezone.utc)
                if project_date
                else timezone.now()
            )
            category = self.get_category("Projects", ContentKind.PROJECT)
            Project.objects.update_or_create(
                slug=project_id,
                defaults={
                    "title": fallback_translation.get("title", ""),
                    "category": category,
                    "tags": ["Projects"],
                    "organization": self.organization,
                    "excerpt": fallback_translation.get("excerpt", ""),
                    "lead": fallback_translation.get("lead", ""),
                    "body": fallback_body,
                    "translations": translations,
                    "code": fallback.get("code", ""),
                    "published_at": published_at,
                    "image": image_name(fallback.get("imageUrl")),
                    "status": PublishStatus.PUBLISHED,
                    "is_featured": True,
                },
            )

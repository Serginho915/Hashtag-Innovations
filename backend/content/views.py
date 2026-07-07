import ast
import json
from decimal import Decimal, InvalidOperation

from django.conf import settings
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models import Q
from django.http import JsonResponse
from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from django.utils.text import slugify
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_http_methods
from django.views.decorators.http import require_POST

from content.models import (
    Article,
    Category,
    Event,
    Expert,
    LearnMaterial,
    Organization,
    Project,
    Tag,
)


@csrf_exempt
@require_POST
def admin_login(request):
    try:
        payload = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid request"}, status=400)

    username = str(payload.get("username", "")).strip()
    password = str(payload.get("password", ""))
    user = authenticate(request, username=username, password=password)

    if not user or not user.is_active or not (user.is_staff or user.is_superuser):
        return JsonResponse({"detail": "Invalid administrator credentials"}, status=401)

    return JsonResponse(
        {
            "ok": True,
            "username": user.get_username(),
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        }
    )


def file_url(field):
    if not field:
        return ""
    name = getattr(field, "name", "") or ""
    if not name:
        return ""
    if name.startswith(("http://", "https://", "/")):
        return name
    if name.startswith(("images/", "pdfs/")):
        return f"/{name}"
    url = getattr(field, "url", "")
    if url:
        return url
    return f"/{name}"


def text_list_value(value):
    if isinstance(value, list):
        return [str(item) for item in value if str(item)]
    if not value:
        return []

    text = str(value).strip()

    for parser in (json.loads, ast.literal_eval):
        try:
            parsed = parser(text)
        except (ValueError, SyntaxError, TypeError, json.JSONDecodeError):
            continue

        if isinstance(parsed, list):
            return [str(item) for item in parsed if str(item)]

    return [paragraph.strip() for paragraph in text.splitlines() if paragraph.strip()]


def lang_filter(queryset, lang):
    return queryset.filter(Q(slug__endswith=f"-{lang}") | ~Q(slug__regex=r"-(en|bg)$"))


def article_matches_lang(article, lang):
    body = article.body if isinstance(article.body, dict) else {}
    return not body.get("_lang") or body.get("_lang") == lang


def localized_public_id(slug, lang):
    text = str(slug)
    suffixes = [f"-{lang}"] if lang else ["-bg", "-en"]
    for suffix in suffixes:
        if suffix and text.endswith(suffix):
            return text[: -len(suffix)]
    return text


EXPERT_TRANSLATED_FIELDS = (
    "name",
    "role",
    "company_name",
    "quote",
    "bio",
    "expertise",
    "industries",
    "languages",
    "experience",
)

EXPERT_SERVICE_TEMPLATES = {
    "consultation": {
        "flag": "service_consultation",
        "price_field": "service_consultation_price",
        "title": {
            "en": "Consultation",
            "bg": "Консултация",
            "ru": "Консультация",
        },
        "subtitle": {
            "en": "Focused expert consultation",
            "bg": "Фокусирана експертна консултация",
            "ru": "Фокусная экспертная консультация",
        },
        "description": {
            "en": "A practical session for a specific question, challenge or decision.",
            "bg": "Практическа сесия за конкретен въпрос, предизвикателство или решение.",
            "ru": "Практическая сессия по конкретному вопросу, задаче или решению.",
        },
    },
    "mentorship": {
        "flag": "service_mentorship",
        "price_field": "service_mentorship_price",
        "title": {
            "en": "Mentorship",
            "bg": "Менторство",
            "ru": "Менторство",
        },
        "subtitle": {
            "en": "Guided expert support",
            "bg": "Насочена експертна подкрепа",
            "ru": "Экспертное сопровождение",
        },
        "description": {
            "en": "Ongoing guidance for founders, teams or professionals who need expert direction.",
            "bg": "Насоки за основатели, екипи или професионалисти, които имат нужда от експертна посока.",
            "ru": "Сопровождение для основателей, команд или специалистов, которым нужен экспертный ориентир.",
        },
    },
    "project_analysis": {
        "flag": "service_project_analysis",
        "price_field": "service_project_analysis_price",
        "title": {
            "en": "Project analysis",
            "bg": "Анализ на проект",
            "ru": "Анализ проекта",
        },
        "subtitle": {
            "en": "Structured project review",
            "bg": "Структуриран преглед на проект",
            "ru": "Структурный разбор проекта",
        },
        "description": {
            "en": "An expert review of the current state, risks and next steps for a project.",
            "bg": "Експертен преглед на текущото състояние, рисковете и следващите стъпки на проект.",
            "ru": "Экспертный обзор текущего состояния, рисков и следующих шагов проекта.",
        },
    },
}


def expert_translation(expert, lang):
    translations = expert.translations if isinstance(expert.translations, dict) else {}
    translated = translations.get(lang) if isinstance(translations.get(lang), dict) else {}
    fallback_lang = "en" if lang != "en" else "bg"
    fallback = translations.get(fallback_lang) if isinstance(translations.get(fallback_lang), dict) else {}

    def get(field):
        value = translated.get(field)
        if value not in (None, "", [], {}):
            return value
        value = fallback.get(field)
        if value not in (None, "", [], {}):
            return value
        return getattr(expert, field)

    return {field: get(field) for field in EXPERT_TRANSLATED_FIELDS}


def serialize_expert(expert, lang="en"):
    analytics = expert.analytics or {}
    translated = expert_translation(expert, lang)
    service_lang = lang if lang in {"en", "bg", "ru"} else "en"
    sessions = []

    for service_id, template in EXPERT_SERVICE_TEMPLATES.items():
        if not getattr(expert, template["flag"]):
            continue

        service_price = getattr(expert, template["price_field"])
        if service_price is None:
            service_price = expert.consultation_price

        sessions.append(
            {
                "id": service_id,
                "title": template["title"][service_lang],
                "subtitle": template["subtitle"][service_lang],
                "description": template["description"][service_lang],
                "price": float(service_price) if service_price is not None else 0,
            }
        )

    return {
        "id": analytics.get("_mock_id") or localized_public_id(expert.slug, ""),
        "name": translated["name"],
        "role": translated["role"],
        "company": translated["company_name"],
        "imageUrl": file_url(expert.photo),
        "quote": translated["quote"],
        "availableFor": analytics.get("availableFor", []),
        "expertise": translated["expertise"] or [],
        "price": float(expert.consultation_price) if expert.consultation_price is not None else None,
        "languages": translated["languages"] or [],
        "industries": translated["industries"] or [],
        "bio": text_list_value(translated["bio"]),
        "sessions": sessions,
        "experienceList": translated["experience"] or [],
        "analytics": {
            "consultations": analytics.get("consultations", ""),
            "attendance": analytics.get("attendance", ""),
            "experienceYears": analytics.get("experienceYears", ""),
        },
        "availableDates": analytics.get("availableDates", []),
        "availableTimes": analytics.get("availableTimes", {}),
    }


def serialize_article(article):
    body = article.body or {}
    return {
        "id": body.get("_mock_id") or article.slug,
        "category": article.category.name if article.category else "",
        "title": article.title,
        "date": article.published_at.isoformat() if article.published_at else "",
        "displayDate": body.get("displayDate"),
        "timeToRead": body.get("timeToRead"),
        "readTime": body.get("readTime"),
        "imageUrl": file_url(article.image),
        "excerpt": article.excerpt,
        "lead": article.lead,
        "bodySections": body.get("sections", []),
        "promotedLabel": article.promoted_label,
        "hashtags": body.get("hashtags", []),
        "authorName": article.author_name,
        "authorLabel": body.get("authorLabel"),
        "authorExpertId": body.get("authorExpertId"),
        "authorAvatarUrl": body.get("authorAvatarUrl"),
        "tags": [tag.name for tag in article.tags.all()],
    }


def serialize_event(event):
    try:
        raw = json.loads(event.detail_description or "{}")
    except json.JSONDecodeError:
        raw = {}
    if raw:
        return raw
    return {
        "id": event.slug,
        "title": event.title,
        "speaker": {"id": "", "name": event.expert.name if event.expert else ""},
        "description": event.description,
        "date": event.starts_at.isoformat(),
        "displayDate": event.starts_at.strftime("%a, %d %b"),
        "location": event.location,
        "imageSrc": file_url(event.image),
        "heroImageSrc": file_url(event.hero_image),
        "tags": [tag.name for tag in event.tags.all()],
        "price": event.price_label,
        "timezone": event.timezone,
    }


def serialize_upcoming_event(event, lang):
    raw = serialize_event(event)
    title = raw.get("titleBg") if lang == "bg" and raw.get("titleBg") else raw.get("title", event.title)
    description = (
        raw.get("descriptionBg")
        if lang == "bg" and raw.get("descriptionBg")
        else raw.get("description", event.description)
    )
    speaker = raw.get("speaker") or {}
    speaker_name = speaker.get("nameBg") if lang == "bg" and speaker.get("nameBg") else speaker.get("name", "")
    location = raw.get("locationBg") if lang == "bg" and raw.get("locationBg") else raw.get("location", "")
    return {
        "id": event.id,
        "eventId": event.slug,
        "isFeaturedHero": event.is_featured_hero,
        "title": title,
        "speakerName": speaker_name,
        "speakerExpertId": speaker.get("expertId"),
        "description": description,
        "dateIso": event.starts_at.isoformat(),
        "location": location,
    }


def serialize_material(material):
    raw = material.slug
    lang = ""
    if str(raw).endswith("-bg"):
        lang = "bg"
    elif str(raw).endswith("-en"):
        lang = "en"
    slug = localized_public_id(raw, lang)
    return {
        "id": slug,
        "title": material.title,
        "excerpt": material.excerpt,
        "authorLabel": "Author:",
        "authorName": material.author_name,
        "imageUrl": file_url(material.cover_image),
        "pdfUrl": file_url(material.pdf_file),
        "previewPdfUrl": file_url(material.preview_pdf_file),
        "salesUrl": material.sales_url,
        "category": material.category.name if material.category else "",
        "format": material.format_label,
        "price": f"€{material.price:g}" if material.price is not None else "",
        "badge": material.badge,
        "hasPreview": material.has_preview,
        "isTrending": material.is_trending,
        "createdAt": material.published_at.isoformat() if material.published_at else "",
    }


def serialize_project(project, lang):
    project_id = localized_public_id(project.slug, lang)

    return {
        "id": project_id,
        "title": project.title,
        "description": project.description,
        "category": project.category.name if project.category else "",
        "organization": project.organization.name if project.organization else "",
        "tags": [tag.name for tag in project.tags.all()],
        "code": project.code,
        "date": project.project_date.strftime("%d/%m/%Y") if project.project_date else "",
        "dateIso": project.project_date.isoformat() if project.project_date else "",
        "imageUrl": file_url(project.image),
        "href": f"/{lang}/projects/{project_id}",
    }


def admin_file_value(field):
    name = getattr(field, "name", "") or ""
    return file_url(field) if name else ""


def admin_json_value(value):
    return json.dumps(value, ensure_ascii=False, indent=2) if value not in (None, "", [], {}) else ""


def admin_datetime_value(value):
    return value.isoformat(timespec="minutes") if value else ""


def admin_date_value(value):
    return value.isoformat() if value else ""


def admin_decimal_value(value):
    return float(value) if value is not None else 0


def admin_related_names(items):
    return ", ".join(str(item) for item in items)


def serialize_admin_category(category):
    return {
        "id": str(category.id),
        "name": category.name,
        "slug": category.slug,
        "kind": category.kind,
        "is_active": category.is_active,
    }


def serialize_admin_tag(tag):
    return {
        "id": str(tag.id),
        "name": tag.name,
        "slug": tag.slug,
        "kind": tag.kind,
        "is_active": tag.is_active,
    }


def serialize_admin_organization(organization):
    return {
        "id": str(organization.id),
        "name": organization.name,
        "slug": organization.slug,
        "logo": admin_file_value(organization.logo),
        "website_url": organization.website_url,
        "description": organization.description,
        "is_active": organization.is_active,
    }


def admin_expert_translation_value(expert, lang, field):
    translated = expert_translation(expert, lang)
    value = translated[field]

    if field in {"bio", "expertise", "industries", "languages", "experience"}:
        if field == "bio":
            value = text_list_value(value)
        return admin_json_value(value)

    return value or ""


def serialize_admin_expert(expert):
    return {
        "id": str(expert.id),
        "name": expert.name,
        "name_en": admin_expert_translation_value(expert, "en", "name"),
        "name_bg": admin_expert_translation_value(expert, "bg", "name"),
        "slug": expert.slug,
        "role": expert.role,
        "role_en": admin_expert_translation_value(expert, "en", "role"),
        "role_bg": admin_expert_translation_value(expert, "bg", "role"),
        "company_name": expert.company_name,
        "company_name_en": admin_expert_translation_value(expert, "en", "company_name"),
        "company_name_bg": admin_expert_translation_value(expert, "bg", "company_name"),
        "organization": str(expert.organization) if expert.organization else "",
        "photo": admin_file_value(expert.photo),
        "quote": expert.quote,
        "quote_en": admin_expert_translation_value(expert, "en", "quote"),
        "quote_bg": admin_expert_translation_value(expert, "bg", "quote"),
        "bio": admin_json_value(text_list_value(expert.bio)),
        "bio_en": admin_expert_translation_value(expert, "en", "bio"),
        "bio_bg": admin_expert_translation_value(expert, "bg", "bio"),
        "expertise": admin_json_value(expert.expertise),
        "expertise_en": admin_expert_translation_value(expert, "en", "expertise"),
        "expertise_bg": admin_expert_translation_value(expert, "bg", "expertise"),
        "industries": admin_json_value(expert.industries),
        "industries_en": admin_expert_translation_value(expert, "en", "industries"),
        "industries_bg": admin_expert_translation_value(expert, "bg", "industries"),
        "languages": admin_json_value(expert.languages),
        "languages_en": admin_expert_translation_value(expert, "en", "languages"),
        "languages_bg": admin_expert_translation_value(expert, "bg", "languages"),
        "experience": admin_json_value(expert.experience),
        "experience_en": admin_expert_translation_value(expert, "en", "experience"),
        "experience_bg": admin_expert_translation_value(expert, "bg", "experience"),
        "analytics": admin_json_value(expert.analytics),
        "consultation_price": admin_decimal_value(expert.consultation_price),
        "is_available_for_consultation": expert.is_available_for_consultation,
        "service_consultation": expert.service_consultation,
        "service_consultation_price": admin_decimal_value(expert.service_consultation_price),
        "service_mentorship": expert.service_mentorship,
        "service_mentorship_price": admin_decimal_value(expert.service_mentorship_price),
        "service_project_analysis": expert.service_project_analysis,
        "service_project_analysis_price": admin_decimal_value(expert.service_project_analysis_price),
        "is_featured": expert.is_featured,
        "is_active": expert.is_active,
    }


def serialize_admin_expert_session(session):
    return {
        "id": str(session.id),
        "expert": str(session.expert),
        "title": session.title,
        "subtitle": session.subtitle,
        "description": session.description,
        "price": admin_decimal_value(session.price),
        "is_active": session.is_active,
    }


def serialize_admin_article(article):
    return {
        "id": str(article.id),
        "article_type": article.article_type,
        "title": article.title,
        "slug": article.slug,
        "category": str(article.category) if article.category else "",
        "tags": admin_related_names(article.tags.all()),
        "author": str(article.author) if article.author else "",
        "author_name": article.author_name,
        "image": admin_file_value(article.image),
        "excerpt": article.excerpt,
        "lead": article.lead,
        "body": admin_json_value(article.body),
        "promoted_label": article.promoted_label,
        "read_time": article.read_time or 0,
        "published_at": admin_datetime_value(article.published_at),
        "status": article.status,
        "is_featured": article.is_featured,
    }


def serialize_admin_event(event):
    return {
        "id": str(event.id),
        "title": event.title,
        "slug": event.slug,
        "category": str(event.category) if event.category else "",
        "tags": admin_related_names(event.tags.all()),
        "expert": str(event.expert) if event.expert else "",
        "organizers": admin_related_names(event.organizers.all()),
        "partners": admin_related_names(event.partners.all()),
        "related_articles": admin_related_names(event.related_articles.all()),
        "description": event.description,
        "detail_description": event.detail_description,
        "starts_at": admin_datetime_value(event.starts_at),
        "timezone": event.timezone,
        "location": event.location,
        "price_label": event.price_label,
        "image": admin_file_value(event.image),
        "hero_image": admin_file_value(event.hero_image),
        "status": event.status,
        "is_featured_hero": event.is_featured_hero,
    }


def serialize_admin_learn_material(material):
    return {
        "id": str(material.id),
        "title": material.title,
        "slug": material.slug,
        "category": str(material.category) if material.category else "",
        "tags": admin_related_names(material.tags.all()),
        "author": str(material.author) if material.author else "",
        "author_name": material.author_name,
        "excerpt": material.excerpt,
        "cover_image": admin_file_value(material.cover_image),
        "pdf_file": admin_file_value(material.pdf_file),
        "preview_pdf_file": admin_file_value(material.preview_pdf_file),
        "sales_url": material.sales_url,
        "format_label": material.format_label,
        "price": admin_decimal_value(material.price),
        "badge": material.badge,
        "has_preview": material.has_preview,
        "is_trending": material.is_trending,
        "status": material.status,
        "published_at": admin_datetime_value(material.published_at),
    }


def serialize_admin_project(project):
    return {
        "id": str(project.id),
        "title": project.title,
        "slug": project.slug,
        "category": str(project.category) if project.category else "",
        "tags": admin_related_names(project.tags.all()),
        "organization": str(project.organization) if project.organization else "",
        "description": project.description,
        "code": project.code,
        "project_date": admin_date_value(project.project_date),
        "image": admin_file_value(project.image),
        "status": project.status,
        "is_featured": project.is_featured,
    }


ADMIN_SERIALIZERS = {
    "categories": serialize_admin_category,
    "tags": serialize_admin_tag,
    "organizations": serialize_admin_organization,
    "experts": serialize_admin_expert,
    "articles": serialize_admin_article,
    "events": serialize_admin_event,
    "learn_materials": serialize_admin_learn_material,
    "projects": serialize_admin_project,
}

ADMIN_RESOURCE_CONFIG = {
    "categories": {
        "model": Category,
        "fields": ["name", "slug", "kind", "is_active"],
        "slug_source": "name",
    },
    "tags": {
        "model": Tag,
        "fields": ["name", "slug", "kind", "is_active"],
        "slug_source": "name",
    },
    "organizations": {
        "model": Organization,
        "fields": ["name", "slug", "logo", "website_url", "description", "is_active"],
        "slug_source": "name",
    },
    "experts": {
        "model": Expert,
        "fields": [
            "slug",
            "organization",
            "photo",
            "analytics",
            "consultation_price",
            "is_available_for_consultation",
            "service_consultation",
            "service_consultation_price",
            "service_mentorship",
            "service_mentorship_price",
            "service_project_analysis",
            "service_project_analysis_price",
            "is_featured",
            "is_active",
        ],
        "foreign_keys": {"organization": Organization},
        "json_fields": {"analytics": dict},
        "slug_source": "name_en",
    },
    "articles": {
        "model": Article,
        "fields": [
            "article_type",
            "title",
            "slug",
            "category",
            "tags",
            "author",
            "author_name",
            "image",
            "excerpt",
            "lead",
            "body",
            "promoted_label",
            "read_time",
            "published_at",
            "status",
            "is_featured",
        ],
        "foreign_keys": {"category": Category, "author": Expert},
        "many_to_many": {"tags": Tag},
        "json_fields": {"body": dict},
        "slug_source": "title",
    },
    "events": {
        "model": Event,
        "fields": [
            "title",
            "slug",
            "category",
            "tags",
            "expert",
            "organizers",
            "partners",
            "related_articles",
            "description",
            "detail_description",
            "starts_at",
            "timezone",
            "location",
            "price_label",
            "image",
            "hero_image",
            "status",
            "is_featured_hero",
        ],
        "foreign_keys": {"category": Category, "expert": Expert},
        "many_to_many": {"tags": Tag, "organizers": Organization, "partners": Organization, "related_articles": Article},
        "slug_source": "title",
    },
    "learn_materials": {
        "model": LearnMaterial,
        "fields": [
            "title",
            "slug",
            "category",
            "tags",
            "author",
            "author_name",
            "excerpt",
            "cover_image",
            "pdf_file",
            "preview_pdf_file",
            "sales_url",
            "format_label",
            "price",
            "badge",
            "has_preview",
            "is_trending",
            "status",
            "published_at",
        ],
        "foreign_keys": {"category": Category, "author": Expert},
        "many_to_many": {"tags": Tag},
        "slug_source": "title",
    },
    "projects": {
        "model": Project,
        "fields": [
            "title",
            "slug",
            "category",
            "tags",
            "organization",
            "description",
            "code",
            "project_date",
            "image",
            "status",
            "is_featured",
        ],
        "foreign_keys": {"category": Category, "organization": Organization},
        "many_to_many": {"tags": Tag},
        "slug_source": "title",
    },
}


def admin_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def admin_config(resource_key):
    return ADMIN_RESOURCE_CONFIG.get(resource_key)


def parse_payload(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        raise ValueError("Invalid JSON request body")


def split_related_values(value):
    if value in (None, ""):
        return []
    if isinstance(value, list):
        return [str(item).strip() for item in value if str(item).strip()]
    return [item.strip() for item in str(value).split(",") if item.strip()]


def normalize_file_name(value):
    if not value:
        return ""
    name = str(value).strip()
    media_url = getattr(settings, "MEDIA_URL", "/media/")
    if media_url and name.startswith(media_url):
        name = name[len(media_url) :]
    return name.lstrip("/")


def coerce_json_value(value, default_factory):
    if value in (None, ""):
        return default_factory()
    if isinstance(value, (list, dict)):
        return value
    text = str(value).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        if default_factory is list:
            return text_list_value(text)
        raise ValidationError("Enter valid JSON.")


def coerce_value(model, field_name, value, config):
    field = model._meta.get_field(field_name)

    if field_name in config.get("json_fields", {}):
        return coerce_json_value(value, config["json_fields"][field_name])

    if field_name == "bio" and isinstance(value, str):
        try:
            parsed = json.loads(value)
        except json.JSONDecodeError:
            parsed = None
        if isinstance(parsed, list):
            return "\n".join(str(item) for item in parsed)
        return value

    if field.__class__.__name__ in {"ImageField", "FileField"}:
        return normalize_file_name(value)

    if field.get_internal_type() == "BooleanField":
        if isinstance(value, bool):
            return value
        return str(value).strip().lower() in {"1", "true", "yes", "on"}

    if field.get_internal_type() in {"IntegerField", "PositiveIntegerField", "PositiveSmallIntegerField"}:
        return int(value) if value not in (None, "") else None

    if field.get_internal_type() == "DecimalField":
        if value in (None, ""):
            return None
        try:
            return Decimal(str(value).replace(",", "."))
        except InvalidOperation:
            raise ValidationError("Enter a valid number.")

    if field.get_internal_type() == "DateField":
        if value in (None, ""):
            return None
        parsed = parse_date(str(value))
        if not parsed:
            raise ValidationError("Enter a valid date.")
        return parsed

    if field.get_internal_type() == "DateTimeField":
        if value in (None, ""):
            return None
        parsed = parse_datetime(str(value))
        if not parsed:
            raise ValidationError("Enter a valid date and time.")
        if timezone.is_naive(parsed):
            parsed = timezone.make_aware(parsed, timezone=timezone.get_current_timezone())
        return parsed

    return "" if value is None else str(value)


def resolve_related(model, value):
    values = split_related_values(value)
    if not values:
        return None

    lookup = values[0]
    queryset = model.objects.all()
    if lookup.isdigit():
        found = queryset.filter(id=int(lookup)).first()
        if found:
            return found

    query = Q()
    if hasattr(model, "slug"):
        query |= Q(slug=lookup)
    if hasattr(model, "name"):
        query |= Q(name=lookup)
    if hasattr(model, "title"):
        query |= Q(title=lookup)

    return queryset.filter(query).first()


def resolve_many(model, value):
    related = []
    for lookup in split_related_values(value):
        item = resolve_related(model, lookup)
        if item:
            related.append(item)
    return related


def make_unique_slug(model, base, instance=None):
    slug = slugify(str(base or "item"), allow_unicode=True)[:220] or "item"
    candidate = slug
    counter = 2

    while model.objects.filter(slug=candidate).exclude(id=getattr(instance, "id", None)).exists():
        suffix = f"-{counter}"
        candidate = f"{slug[: 240 - len(suffix)]}{suffix}"
        counter += 1

    return candidate


def ensure_slug(model, instance, payload, config):
    if not hasattr(model, "slug"):
        return
    if str(getattr(instance, "slug", "") or "").strip():
        return
    source_field = config.get("slug_source")
    source = payload.get(source_field, "") if source_field else ""
    if not source and source_field == "name_en":
        source = payload.get("name_bg", "")
    instance.slug = make_unique_slug(model, source, instance)


def coerce_expert_translation_field(field, value):
    if field in {"expertise", "industries", "languages", "experience"}:
        fallback = list
        return coerce_json_value(value, fallback)

    if field == "bio":
        return text_list_value(value)

    return "" if value is None else str(value)


def apply_expert_translations(instance, payload):
    translations = dict(instance.translations or {})

    for lang in ("en", "bg"):
        current = dict(translations.get(lang) or {})

        for field in EXPERT_TRANSLATED_FIELDS:
            payload_key = f"{field}_{lang}"
            if payload_key not in payload:
                continue
            current[field] = coerce_expert_translation_field(field, payload[payload_key])

        translations[lang] = current

    en_translation = translations.get("en") or {}
    bg_translation = translations.get("bg") or {}
    fallback = en_translation if en_translation.get("name") else bg_translation
    for field in EXPERT_TRANSLATED_FIELDS:
        value = fallback.get(field)
        if value in (None, "", [], {}):
            continue
        if field == "bio" and isinstance(value, list):
            value = "\n".join(str(item) for item in value)
        setattr(instance, field, value)

    instance.translations = translations


def save_admin_record(resource_key, payload, instance=None):
    config = admin_config(resource_key)
    if not config:
        raise ValidationError("Unknown admin resource.")

    model = config["model"]
    instance = instance or model()
    many_to_many_values = {}

    if resource_key == "experts":
        apply_expert_translations(instance, payload)

    for field_name in config["fields"]:
        if field_name not in payload:
            continue

        if field_name in config.get("many_to_many", {}):
            many_to_many_values[field_name] = resolve_many(config["many_to_many"][field_name], payload[field_name])
            continue

        if field_name in config.get("foreign_keys", {}):
            setattr(instance, field_name, resolve_related(config["foreign_keys"][field_name], payload[field_name]))
            continue

        setattr(instance, field_name, coerce_value(model, field_name, payload[field_name], config))

    ensure_slug(model, instance, payload, config)
    instance.full_clean()
    instance.save()

    for field_name, values in many_to_many_values.items():
        getattr(instance, field_name).set(values)

    return instance


@csrf_exempt
@require_POST
def admin_resource_create(request, resource_key):
    config = admin_config(resource_key)
    if not config:
        return admin_error("Unknown admin resource.", 404)

    try:
        payload = parse_payload(request)
        with transaction.atomic():
            instance = save_admin_record(resource_key, payload)
    except ValueError as error:
        return admin_error(str(error))
    except ValidationError as error:
        return admin_error(error.message_dict if hasattr(error, "message_dict") else error.messages)
    except IntegrityError:
        return admin_error("A record with these unique values already exists.")

    return JsonResponse(ADMIN_SERIALIZERS[resource_key](instance), status=201)


@csrf_exempt
@require_http_methods(["PATCH", "PUT", "DELETE"])
def admin_resource_detail(request, resource_key, record_id):
    config = admin_config(resource_key)
    if not config:
        return admin_error("Unknown admin resource.", 404)

    instance = config["model"].objects.filter(id=record_id).first()
    if not instance:
        return admin_error("Record not found.", 404)

    if request.method == "DELETE":
        instance.delete()
        return JsonResponse({"ok": True})

    try:
        payload = parse_payload(request)
        with transaction.atomic():
            instance = save_admin_record(resource_key, payload, instance)
    except ValueError as error:
        return admin_error(str(error))
    except ValidationError as error:
        return admin_error(error.message_dict if hasattr(error, "message_dict") else error.messages)
    except IntegrityError:
        return admin_error("A record with these unique values already exists.")

    return JsonResponse(ADMIN_SERIALIZERS[resource_key](instance))


@require_GET
def admin_resources(request):
    return JsonResponse(
        {
            "categories": [serialize_admin_category(item) for item in Category.objects.all()],
            "tags": [serialize_admin_tag(item) for item in Tag.objects.all()],
            "organizations": [
                serialize_admin_organization(item)
                for item in Organization.objects.all()
            ],
            "experts": [
                serialize_admin_expert(item)
                for item in Expert.objects.select_related("organization").prefetch_related("tags")
            ],
            "articles": [
                serialize_admin_article(item)
                for item in Article.objects.select_related("category", "author").prefetch_related("tags")
            ],
            "events": [
                serialize_admin_event(item)
                for item in Event.objects.select_related("category", "expert").prefetch_related(
                    "tags",
                    "organizers",
                    "partners",
                    "related_articles",
                )
            ],
            "learn_materials": [
                serialize_admin_learn_material(item)
                for item in LearnMaterial.objects.select_related("category", "author").prefetch_related("tags")
            ],
            "projects": [
                serialize_admin_project(item)
                for item in Project.objects.select_related("category", "organization").prefetch_related("tags")
            ],
        }
    )


@require_GET
def site_data(request):
    lang = request.GET.get("lang", "bg")
    if lang not in {"en", "bg"}:
        lang = "bg"

    experts = [
        serialize_expert(expert, lang)
        for expert in Expert.objects.filter(is_active=True)
    ]
    news = [
        serialize_article(article)
        for article in Article.objects.filter(status="published").order_by("-published_at")
        if article_matches_lang(article, lang)
    ]
    events = [serialize_event(event) for event in Event.objects.filter(status="published").order_by("starts_at")]
    upcoming_events = [
        serialize_upcoming_event(event, lang)
        for event in Event.objects.filter(status="published").order_by("starts_at")
    ]
    textbooks = [
        serialize_material(material)
        for material in lang_filter(LearnMaterial.objects.filter(status="published"), lang).order_by("-published_at")
    ]
    projects = [
        serialize_project(project, lang)
        for project in lang_filter(
            Project.objects.filter(status="published").select_related("category", "organization").prefetch_related("tags"),
            lang,
        ).order_by("-project_date")
    ]

    return JsonResponse(
        {
            "experts": experts,
            "news": news,
            "upcomingEvents": upcoming_events,
            "communityEvents": events,
            "textbooks": textbooks,
            "popularInsights": news,
            "insights": news,
            "relatedEvents": events,
            "projects": projects,
        }
    )

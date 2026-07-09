import ast
import hmac
import html
import json
import re
import uuid
from decimal import Decimal, InvalidOperation

import requests
import stripe
from django.conf import settings
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
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
    ChatConversation,
    ChatMessage,
    Event,
    Expert,
    LearnMaterial,
    Organization,
    Project,
    PublishStatus,
    Sale,
)


OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"


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


def category_name(category, lang="en"):
    if not category:
        return ""
    if lang == "bg":
        return category.name_bg or category.name_en or category.name
    return category.name_en or category.name


ARTICLE_TRANSLATED_FIELDS = (
    "title",
    "excerpt",
    "lead",
    "body",
)

PROJECT_TRANSLATED_FIELDS = (
    "title",
    "excerpt",
    "lead",
    "body",
)

EVENT_TRANSLATED_FIELDS = (
    "title",
    "short_description",
    "detail_description",
)

LEARN_MATERIAL_TRANSLATED_FIELDS = (
    "title",
    "excerpt",
)

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

EXPERT_ENGLISH_ONLY_TAG_FIELDS = {"expertise", "industries", "languages"}

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
    english = translations.get("en") if isinstance(translations.get("en"), dict) else {}

    def get(field):
        if field in EXPERT_ENGLISH_ONLY_TAG_FIELDS:
            value = english.get(field)
            if value not in (None, "", [], {}):
                return value
            value = getattr(expert, field)
            return value if value not in (None, "", [], {}) else []

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
        "price": float(expert.service_consultation_price) if expert.service_consultation_price is not None else None,
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


def article_translation(article, lang):
    translations = article.translations if isinstance(article.translations, dict) else {}
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
        return getattr(article, field)

    return {field: get(field) for field in ARTICLE_TRANSLATED_FIELDS}


def serialize_article(article, lang="en"):
    translated = article_translation(article, lang)
    body = translated["body"] if isinstance(translated["body"], dict) else {}
    english_body = article_translation(article, "en")["body"]
    english_body = english_body if isinstance(english_body, dict) else {}
    author = article.author
    author_translated = expert_translation(author, lang) if author else {}
    author_name = author_translated.get("name") or translated.get("author_name") or article.author_name
    author_expert_id = localized_public_id(author.slug, "") if author else ""
    author_avatar_url = file_url(author.photo) if author else ""
    display_date = article.published_at.strftime("%d/%m/%Y") if article.published_at else ""

    return {
        "id": body.get("_mock_id") or article.slug,
        "category": "",
        "title": translated["title"],
        "date": article.published_at.isoformat() if article.published_at else "",
        "displayDate": display_date,
        "imageUrl": file_url(article.image),
        "excerpt": translated["excerpt"],
        "lead": translated["lead"],
        "bodySections": body.get("sections", []),
        "hashtags": text_list_value(english_body.get("hashtags", [])),
        "authorName": author_name,
        "authorLabel": "by" if lang == "en" else "от",
        "authorExpertId": author_expert_id,
        "authorAvatarUrl": author_avatar_url,
        "tags": [],
    }


def event_translation(event, lang):
    translations = event.translations if isinstance(event.translations, dict) else {}
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
        return getattr(event, field, "")

    return {
        field: get(field)
        for field in EVENT_TRANSLATED_FIELDS
    }


def serialize_event(event, lang="en"):
    translated = event_translation(event, lang)
    expert_translated = expert_translation(event.expert, lang) if event.expert else {}
    speaker_name = expert_translated.get("name") if event.expert else ""
    speaker = {
        "id": str(event.expert.id) if event.expert else "",
        "name": speaker_name,
        "expertId": localized_public_id(event.expert.slug, "") if event.expert else "",
        "role": expert_translated.get("role", "") if event.expert else "",
        "avatarSrc": file_url(event.expert.photo) if event.expert else "",
    }

    return {
        "id": event.slug,
        "title": translated["title"],
        "speaker": speaker,
        "description": translated["short_description"],
        "date": event.starts_at.isoformat(),
        "displayDate": event.starts_at.strftime("%a, %d %b"),
        "location": event.location,
        "imageSrc": file_url(event.image),
        "tags": text_list_value(event.tags),
        "price": event.price,
        "startTime": event.starts_at.strftime("%H:%M"),
        "detailDescription": translated["detail_description"],
        "speakers": [speaker] if event.expert else [],
        "organizers": [serialize_event_organization(item) for item in event.organizers.all()],
        "partners": [serialize_event_organization(item) for item in event.partners.all()],
    }


def serialize_event_organization(organization):
    return {
        "id": str(organization.id),
        "name": organization.name,
        "logoSrc": file_url(organization.logo),
    }


def serialize_upcoming_event(event, lang):
    translated = event_translation(event, lang)
    expert_translated = expert_translation(event.expert, lang) if event.expert else {}
    return {
        "id": event.id,
        "eventId": event.slug,
        "title": translated["title"],
        "speakerName": expert_translated.get("name", "") if event.expert else "",
        "speakerExpertId": localized_public_id(event.expert.slug, "") if event.expert else "",
        "description": translated["short_description"],
        "dateIso": event.starts_at.isoformat(),
        "location": event.location,
    }


def learn_material_translation(material, lang):
    translations = material.translations if isinstance(material.translations, dict) else {}
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
        return getattr(material, field, "")

    return {
        field: get(field)
        for field in LEARN_MATERIAL_TRANSLATED_FIELDS
    }


def serialize_material(material, lang="en"):
    translated = learn_material_translation(material, lang)
    author_translated = expert_translation(material.author, lang) if material.author else {}
    return {
        "id": material.slug,
        "title": translated["title"],
        "excerpt": translated["excerpt"],
        "authorLabel": "Author:",
        "authorName": author_translated.get("name", "") if material.author else "",
        "authorExpertId": localized_public_id(material.author.slug, "") if material.author else "",
        "imageUrl": file_url(material.cover_image),
        "pdfUrl": file_url(material.pdf_file),
        "previewPdfUrl": file_url(material.preview_pdf_file),
        "category": category_name(material.category, lang),
        "price": f"â‚¬{material.price:g}" if material.price is not None else "",
        "badge": material.badge,
        "isTrending": material.is_trending,
        "createdAt": material.published_at.isoformat() if material.published_at else "",
    }


def serialize_project(project, lang):
    project_id = localized_public_id(project.slug, lang)
    translations = project.translations if isinstance(project.translations, dict) else {}
    translated = translations.get(lang) if isinstance(translations.get(lang), dict) else {}
    english = translations.get("en") if isinstance(translations.get("en"), dict) else {}
    author_translated = expert_translation(project.author, lang) if project.author else {}
    fallback_lang = "en" if lang != "en" else "bg"
    fallback = translations.get(fallback_lang) if isinstance(translations.get(fallback_lang), dict) else {}

    def get(field):
        value = translated.get(field)
        if value not in (None, "", [], {}):
            return value
        value = fallback.get(field)
        if value not in (None, "", [], {}):
            return value
        return getattr(project, field, "")

    body = get("body") if isinstance(get("body"), dict) else {}
    english_body = english.get("body") if isinstance(english.get("body"), dict) else {}
    published_at = project.published_at
    display_date = published_at.strftime("%d/%m/%Y") if published_at else ""
    date_iso = published_at.isoformat() if published_at else ""
    description = get("lead") or get("excerpt")

    return {
        "id": project_id,
        "title": get("title"),
        "description": description,
        "authorName": author_translated.get("name", "") if project.author else project.author_name,
        "authorExpertId": localized_public_id(project.author.slug, "") if project.author else "",
        "code": project.code,
        "date": display_date,
        "dateIso": date_iso,
        "imageUrl": file_url(project.image),
        "bodySections": body.get("sections", []),
        "hashtags": text_list_value(english_body.get("hashtags", [])),
        "tags": text_list_value(english_body.get("hashtags", [])),
        "href": f"/{lang}/projects/{project_id}",
    }


def admin_file_value(field):
    name = getattr(field, "name", "") or ""
    return file_url(field) if name else ""


def admin_json_value(value):
    return json.dumps(value, ensure_ascii=False, indent=2) if value not in (None, "", [], {}) else ""


def admin_datetime_value(value):
    return timezone.localtime(value).strftime("%Y-%m-%dT%H:%M") if value else ""


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
        "name_en": category.name_en,
        "name_bg": category.name_bg,
        "slug": category.slug,
        "kind": category.kind,
        "is_active": category.is_active,
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
        "organization": expert.organization.slug if expert.organization else "",
        "photo": admin_file_value(expert.photo),
        "quote": expert.quote,
        "quote_en": admin_expert_translation_value(expert, "en", "quote"),
        "quote_bg": admin_expert_translation_value(expert, "bg", "quote"),
        "bio": admin_json_value(text_list_value(expert.bio)),
        "bio_en": admin_expert_translation_value(expert, "en", "bio"),
        "bio_bg": admin_expert_translation_value(expert, "bg", "bio"),
        "expertise": admin_json_value(expert.expertise),
        "expertise_en": admin_expert_translation_value(expert, "en", "expertise"),
        "industries": admin_json_value(expert.industries),
        "industries_en": admin_expert_translation_value(expert, "en", "industries"),
        "languages": admin_json_value(expert.languages),
        "languages_en": admin_expert_translation_value(expert, "en", "languages"),
        "experience": admin_json_value(expert.experience),
        "experience_en": admin_expert_translation_value(expert, "en", "experience"),
        "experience_bg": admin_expert_translation_value(expert, "bg", "experience"),
        "analytics": admin_json_value(expert.analytics),
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


def raw_article_translation(article, lang):
    translations = article.translations if isinstance(article.translations, dict) else {}
    translated = translations.get(lang)

    if isinstance(translated, dict):
        return translated

    if translations:
        return {}

    return {
        "title": article.title,
        "excerpt": article.excerpt,
        "lead": article.lead,
        "body": article.body if isinstance(article.body, dict) else {},
    }


def admin_article_translation_value(article, lang, field):
    translated = raw_article_translation(article, lang)
    value = translated.get(field)
    if field == "body":
        return value if isinstance(value, dict) else {}
    return value or ""


def article_sections_admin_value(body):
    sections = body.get("sections", []) if isinstance(body, dict) else []
    if not isinstance(sections, list):
        return ""

    html_parts = []
    for section in sections:
        if not isinstance(section, dict):
            text = str(section).strip()
            if text:
                html_parts.append(f"<p>{html.escape(text)}</p>")
            continue

        raw_html = section.get("html")
        if raw_html:
            html_parts.append(str(raw_html))
            continue

        title = str(section.get("title", "") or "").strip()
        if title:
            html_parts.append(f"<h2>{html.escape(title)}</h2>")

        for paragraph in text_list_value(section.get("paragraphs", [])):
            html_parts.append(f"<p>{html.escape(paragraph)}</p>")

    return "\n".join(html_parts)


def serialize_admin_article(article):
    body_en = admin_article_translation_value(article, "en", "body")
    body_bg = admin_article_translation_value(article, "bg", "body")
    shared_body = body_en or body_bg

    return {
        "id": str(article.id),
        "title": article.title,
        "title_en": admin_article_translation_value(article, "en", "title"),
        "title_bg": admin_article_translation_value(article, "bg", "title"),
        "slug": article.slug,
        "author": article.author.slug if article.author else "",
        "author_name": article.author_name,
        "image": admin_file_value(article.image),
        "excerpt": article.excerpt,
        "excerpt_en": admin_article_translation_value(article, "en", "excerpt"),
        "excerpt_bg": admin_article_translation_value(article, "bg", "excerpt"),
        "lead": article.lead,
        "lead_en": admin_article_translation_value(article, "en", "lead"),
        "lead_bg": admin_article_translation_value(article, "bg", "lead"),
        "body": admin_json_value(article.body),
        "body_sections_en": article_sections_admin_value(body_en),
        "body_sections_bg": article_sections_admin_value(body_bg),
        "hashtags_en": admin_json_value(body_en.get("hashtags", [])),
        "published_at": admin_datetime_value(article.published_at),
        "status": article.status,
        "is_featured": article.is_featured,
    }


def serialize_admin_event(event):
    translations = event.translations if isinstance(event.translations, dict) else {}
    en = translations.get("en") if isinstance(translations.get("en"), dict) else {}
    bg = translations.get("bg") if isinstance(translations.get("bg"), dict) else {}

    return {
        "id": str(event.id),
        "title": event.title,
        "title_en": en.get("title", event.title),
        "title_bg": bg.get("title", ""),
        "slug": event.slug,
        "category": event.category.slug if event.category else "",
        "tags": admin_json_value(event.tags),
        "expert": event.expert.slug if event.expert else "",
        "organizers": admin_related_names(event.organizers.all()),
        "partners": admin_related_names(event.partners.all()),
        "short_description": event.short_description,
        "short_description_en": en.get("short_description", event.short_description),
        "short_description_bg": bg.get("short_description", ""),
        "detail_description": event.detail_description,
        "detail_description_en": en.get("detail_description", event.detail_description),
        "detail_description_bg": bg.get("detail_description", ""),
        "starts_at": admin_datetime_value(event.starts_at),
        "location": event.location,
        "price": event.price,
        "image": admin_file_value(event.image),
        "status": event.status,
    }


def serialize_admin_learn_material(material):
    translations = material.translations if isinstance(material.translations, dict) else {}
    en = translations.get("en") if isinstance(translations.get("en"), dict) else {}
    bg = translations.get("bg") if isinstance(translations.get("bg"), dict) else {}

    return {
        "id": str(material.id),
        "title": material.title,
        "title_en": en.get("title", material.title),
        "title_bg": bg.get("title", ""),
        "slug": material.slug,
        "category": material.category.slug if material.category else "",
        "tags": admin_json_value(material.tags),
        "author": material.author.slug if material.author else "",
        "excerpt": material.excerpt,
        "excerpt_en": en.get("excerpt", material.excerpt),
        "excerpt_bg": bg.get("excerpt", ""),
        "cover_image": admin_file_value(material.cover_image),
        "pdf_file": admin_file_value(material.pdf_file),
        "preview_pdf_file": admin_file_value(material.preview_pdf_file),
        "price": admin_decimal_value(material.price),
        "badge": material.badge,
        "is_trending": material.is_trending,
        "status": material.status,
        "published_at": admin_datetime_value(material.published_at),
    }


def raw_project_translation(project, lang):
    translations = project.translations if isinstance(project.translations, dict) else {}
    translated = translations.get(lang)

    if isinstance(translated, dict):
        return translated

    if translations:
        return {}

    return {
        "title": project.title,
        "excerpt": project.excerpt or project.lead,
        "lead": project.lead or project.excerpt,
        "description": project.lead or project.excerpt,
        "body": project.body if isinstance(project.body, dict) else {},
    }


def admin_project_translation_value(project, lang, field):
    translated = raw_project_translation(project, lang)
    value = translated.get(field)
    if field == "body":
        return value if isinstance(value, dict) else {}
    return value or ""


def serialize_admin_project(project):
    body_en = admin_project_translation_value(project, "en", "body")
    body_bg = admin_project_translation_value(project, "bg", "body")
    shared_body = body_en or body_bg

    return {
        "id": str(project.id),
        "title": project.title,
        "title_en": admin_project_translation_value(project, "en", "title"),
        "title_bg": admin_project_translation_value(project, "bg", "title"),
        "slug": project.slug,
        "code": project.code,
        "author": project.author.slug if project.author else "",
        "author_name": project.author_name,
        "image": admin_file_value(project.image),
        "excerpt_en": admin_project_translation_value(project, "en", "excerpt"),
        "excerpt_bg": admin_project_translation_value(project, "bg", "excerpt"),
        "lead_en": admin_project_translation_value(project, "en", "lead"),
        "lead_bg": admin_project_translation_value(project, "bg", "lead"),
        "body_sections_en": article_sections_admin_value(body_en),
        "body_sections_bg": article_sections_admin_value(body_bg),
        "hashtags_en": admin_json_value(body_en.get("hashtags", [])),
        "published_at": admin_datetime_value(project.published_at),
        "status": project.status,
        "is_featured": project.is_featured,
    }


def serialize_admin_sale(sale):
    return {
        "id": str(sale.id),
        "created_at": admin_datetime_value(sale.created_at),
        "purchase_type": sale.purchase_type,
        "status": sale.status,
        "customer_name": sale.customer_name,
        "customer_email": sale.customer_email,
        "item_id": sale.item_id,
        "item_title": sale.item_title,
        "amount": admin_decimal_value(sale.amount),
        "currency": sale.currency.upper(),
        "stripe_checkout_session_id": sale.stripe_checkout_session_id,
        "expert": sale.expert.slug if sale.expert else "",
        "event": sale.event.slug if sale.event else "",
        "learn_material": sale.learn_material.slug if sale.learn_material else "",
        "metadata": admin_json_value(sale.metadata),
    }


def serialize_admin_chat_conversation(conversation):
    messages = list(conversation.messages.all())
    user_messages = [message for message in messages if message.role == ChatMessage.Role.USER]
    assistant_messages = [message for message in messages if message.role == ChatMessage.Role.ASSISTANT]
    last_user_message = user_messages[-1].content if user_messages else ""
    last_assistant_message = assistant_messages[-1].content if assistant_messages else ""

    return {
        "id": str(conversation.id),
        "session_id": str(conversation.session_id),
        "created_at": admin_datetime_value(conversation.created_at),
        "last_message_at": admin_datetime_value(conversation.last_message_at),
        "language": conversation.language,
        "title": conversation.title,
        "message_count": len(messages),
        "last_user_message": last_user_message[:180],
        "last_assistant_message": last_assistant_message[:180],
        "user_agent": conversation.user_agent,
        "ip_address": conversation.ip_address or "",
        "messages": admin_json_value(
            [
                {
                    "role": message.role,
                    "content": message.content,
                    "created_at": admin_datetime_value(message.created_at),
                }
                for message in messages
            ]
        ),
    }


ADMIN_SERIALIZERS = {
    "categories": serialize_admin_category,
    "organizations": serialize_admin_organization,
    "experts": serialize_admin_expert,
    "articles": serialize_admin_article,
    "events": serialize_admin_event,
    "learn_materials": serialize_admin_learn_material,
    "projects": serialize_admin_project,
    "sales": serialize_admin_sale,
    "chat_conversations": serialize_admin_chat_conversation,
}

ADMIN_RESOURCE_CONFIG = {
    "categories": {
        "model": Category,
        "fields": ["name_en", "name_bg", "slug", "kind", "is_active"],
        "slug_source": "name_en",
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
            "slug",
            "author",
            "image",
            "published_at",
            "status",
            "is_featured",
        ],
        "foreign_keys": {"author": Expert},
        "slug_source": "title_en",
    },
    "events": {
        "model": Event,
        "fields": [
            "slug",
            "category",
            "tags",
            "expert",
            "organizers",
            "partners",
            "starts_at",
            "location",
            "price",
            "image",
            "status",
        ],
        "foreign_keys": {"category": Category, "expert": Expert},
        "many_to_many": {"organizers": Organization, "partners": Organization},
        "json_fields": {"tags": list},
        "slug_source": "title_en",
    },
    "learn_materials": {
        "model": LearnMaterial,
        "fields": [
            "slug",
            "category",
            "tags",
            "author",
            "cover_image",
            "pdf_file",
            "preview_pdf_file",
            "price",
            "badge",
            "is_trending",
            "status",
            "published_at",
        ],
        "foreign_keys": {"category": Category, "author": Expert},
        "json_fields": {"tags": list},
        "slug_source": "title_en",
    },
    "projects": {
        "model": Project,
        "fields": [
            "slug",
            "code",
            "author",
            "author_name",
            "image",
            "published_at",
            "status",
            "is_featured",
        ],
        "foreign_keys": {"author": Expert},
        "slug_source": "title_en",
    },
}


def admin_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def admin_api_is_authorized(request):
    token = request.headers.get("X-Admin-Api-Token", "")
    expected_token = getattr(settings, "ADMIN_API_TOKEN", "")

    if expected_token and hmac.compare_digest(token, expected_token):
        return True

    user = getattr(request, "user", None)
    return bool(user and user.is_authenticated and user.is_active and (user.is_staff or user.is_superuser))


def require_admin_api(request):
    if admin_api_is_authorized(request):
        return None

    return JsonResponse({"error": "Unauthorized"}, status=401)


def admin_config(resource_key):
    return ADMIN_RESOURCE_CONFIG.get(resource_key)


def json_error(message, status=400):
    return JsonResponse({"error": message}, status=status)


def client_ip(request):
    forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR") or None


def compact_text(value, limit=220):
    text = re.sub(r"\s+", " ", str(value or "")).strip()
    return text[:limit]


ENGLISH_CHAT_SIGNAL_WORDS = {
    "a",
    "about",
    "ai",
    "am",
    "an",
    "and",
    "are",
    "assistant",
    "book",
    "business",
    "buy",
    "can",
    "consultation",
    "consultations",
    "contact",
    "do",
    "does",
    "event",
    "events",
    "expert",
    "experts",
    "for",
    "from",
    "hashtag",
    "hello",
    "help",
    "hey",
    "hi",
    "how",
    "i",
    "innovation",
    "innovations",
    "insight",
    "insights",
    "is",
    "learn",
    "learning",
    "material",
    "materials",
    "me",
    "mentorship",
    "of",
    "on",
    "payment",
    "price",
    "pricing",
    "project",
    "projects",
    "refund",
    "register",
    "site",
    "startup",
    "strategy",
    "tell",
    "the",
    "ticket",
    "tickets",
    "to",
    "website",
    "what",
    "when",
    "where",
    "who",
    "with",
    "you",
}


def detect_chat_response_language(message):
    text = str(message or "").strip()
    if not text:
        return "bg"

    if re.search(r"[\u0400-\u04FF]", text):
        return "bg"

    if any(character.isalpha() and ord(character) > 127 for character in text):
        return "bg"

    words = [word.lower() for word in re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?", text)]
    if not words:
        return "bg"

    signal_count = sum(1 for word in words if word in ENGLISH_CHAT_SIGNAL_WORDS)
    signal_ratio = signal_count / max(len(words), 1)

    if signal_count >= 2 or signal_ratio >= 0.35:
        return "en"

    if len(words) <= 2 and any(word in ENGLISH_CHAT_SIGNAL_WORDS for word in words):
        return "en"

    return "bg"


def build_chat_site_context(lang):
    lang = lang if lang in {"en", "bg"} else "en"
    now = timezone.now()

    experts = [
        serialize_expert(expert, lang)
        for expert in Expert.objects.filter(is_active=True).order_by("name")[:8]
    ]
    events = [
        serialize_event(event, lang)
        for event in Event.objects.filter(status=PublishStatus.PUBLISHED, starts_at__gte=now)
        .select_related("expert", "category")
        .prefetch_related("organizers", "partners")
        .order_by("starts_at")[:8]
    ]
    materials = [
        serialize_material(material, lang)
        for material in LearnMaterial.objects.filter(status=PublishStatus.PUBLISHED)
        .select_related("category", "author")
        .order_by("-published_at", "-created_at")[:8]
    ]
    insights = [
        serialize_article(article, lang)
        for article in Article.objects.filter(status=PublishStatus.PUBLISHED)
        .select_related("author")
        .order_by("-published_at", "-created_at")[:6]
    ]
    projects = [
        serialize_project(project, lang)
        for project in Project.objects.filter(status=PublishStatus.PUBLISHED)
        .select_related("author")
        .order_by("-published_at", "-created_at")[:6]
    ]

    return {
        "site": "Hashtag Innovations",
        "purpose": "Platform for business community, expert consultations, events, learning materials, insights and projects.",
        "navigation": ["/experts", "/events", "/learn", "/insights", "/projects"],
        "experts": [
            {
                "name": item.get("name"),
                "role": item.get("role"),
                "company": item.get("company"),
                "services": [session.get("title") for session in item.get("sessions", [])],
            }
            for item in experts
        ],
        "upcoming_events": [
            {
                "title": item.get("title"),
                "date": item.get("displayDate"),
                "time": item.get("startTime"),
                "location": item.get("location"),
                "price": item.get("price"),
            }
            for item in events
        ],
        "learning_materials": [
            {
                "title": item.get("title"),
                "category": item.get("category"),
                "price": item.get("price"),
                "author": item.get("authorName"),
            }
            for item in materials
        ],
        "insights": [
            {
                "title": item.get("title"),
                "excerpt": compact_text(item.get("excerpt"), 160),
            }
            for item in insights
        ],
        "projects": [
            {
                "title": item.get("title"),
                "description": compact_text(item.get("description"), 160),
            }
            for item in projects
        ],
    }


def chat_system_prompt(lang):
    language_name = "Bulgarian" if lang == "bg" else "English"
    return (
        "You are the Hashtag Innovations website assistant. "
        f"Answer in {language_name}. "
        "Help visitors understand the website, find experts, events, learning materials, insights and projects, "
        "and answer general questions about innovation, digital transformation, startups, product strategy, AI, "
        "business community, education and entrepreneurship. "
        "Use the provided site context for concrete site facts. Do not invent unavailable events, prices, people or guarantees. "
        "For payments, refunds, account issues, legal questions or private support, give general guidance and suggest contacting the team through the website. "
        "Keep answers friendly, practical and concise."
    )


def openrouter_chat_reply(conversation, user_message, lang):
    context = build_chat_site_context(lang)
    recent_messages = [
        {"role": message.role, "content": message.content}
        for message in conversation.messages.order_by("-created_at", "-id")[:10]
    ]
    recent_messages.reverse()

    payload = {
        "model": settings.OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": chat_system_prompt(lang)},
            {
                "role": "system",
                "content": "Current website context JSON:\n" + json.dumps(context, ensure_ascii=False),
            },
            *recent_messages,
        ],
        "temperature": 0.45,
        "max_tokens": 650,
    }
    response = requests.post(
        OPENROUTER_CHAT_URL,
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": settings.FRONTEND_BASE_URL,
            "X-OpenRouter-Title": "Hashtag Innovations",
        },
        json=payload,
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    choices = data.get("choices") if isinstance(data, dict) else []
    message = choices[0].get("message", {}) if choices else {}
    answer = str(message.get("content", "")).strip()
    if not answer:
        raise ValueError("OpenRouter returned an empty assistant response.")
    return answer


def conversation_from_payload(payload, request, lang):
    raw_session_id = str(payload.get("conversationId", "") or "").strip()

    if raw_session_id:
        try:
            session_id = uuid.UUID(raw_session_id)
        except ValueError:
            session_id = None

        if session_id:
            conversation = ChatConversation.objects.filter(session_id=session_id).first()
            if conversation:
                return conversation

    return ChatConversation.objects.create(
        language=lang,
        user_agent=str(request.META.get("HTTP_USER_AGENT", ""))[:1000],
        ip_address=client_ip(request),
        last_message_at=timezone.now(),
    )


@csrf_exempt
@require_POST
def chat_reply(request):
    if not settings.OPENROUTER_API_KEY:
        return json_error("OpenRouter API key is not configured.", 500)

    try:
        payload = parse_payload(request)
    except ValueError as error:
        return json_error(str(error))

    message = str(payload.get("message", "") or "").strip()
    if not message:
        return json_error("Message is required.")
    if len(message) > 1200:
        return json_error("Message is too long.")

    lang = detect_chat_response_language(message)
    conversation = conversation_from_payload(payload, request, lang)
    user_chat_message = ChatMessage.objects.create(
        conversation=conversation,
        role=ChatMessage.Role.USER,
        content=message,
    )

    if not conversation.title:
        conversation.title = compact_text(message, 80)
    conversation.language = lang
    conversation.last_message_at = user_chat_message.created_at
    conversation.save(update_fields=["title", "language", "last_message_at", "updated_at"])

    try:
        answer = openrouter_chat_reply(conversation, message, lang)
    except requests.RequestException as error:
        return json_error(f"Assistant service is unavailable: {error}", 502)
    except Exception as error:
        return json_error(f"Assistant could not answer: {error}", 502)

    assistant_message = ChatMessage.objects.create(
        conversation=conversation,
        role=ChatMessage.Role.ASSISTANT,
        content=answer,
    )
    conversation.last_message_at = assistant_message.created_at
    conversation.save(update_fields=["last_message_at", "updated_at"])

    return JsonResponse(
        {
            "conversationId": str(conversation.session_id),
            "message": answer,
        }
    )


def parse_price_amount(value):
    if value in (None, ""):
        return None

    if isinstance(value, Decimal):
        return value

    text = str(value).strip()
    if not text or text.lower() in {"free", "gratis", "0", "0.00"}:
        return None

    match = re.search(r"\d+(?:[\.,]\d{1,2})?", text)
    if not match:
        return None

    try:
        return Decimal(match.group(0).replace(",", "."))
    except InvalidOperation:
        return None


def stripe_unit_amount(amount):
    return int((amount * Decimal("100")).quantize(Decimal("1")))


def find_expert_for_checkout(item_id):
    lookup = str(item_id or "").strip()
    if not lookup:
        return None

    query = Q(slug=lookup)
    if lookup.isdigit():
        query |= Q(id=int(lookup))

    expert = Expert.objects.filter(query).first()
    if expert:
        return expert

    for candidate in Expert.objects.all():
        if localized_public_id(candidate.slug, "") == lookup:
            return candidate

    return None


def resolve_checkout_item(payload):
    purchase_type = str(payload.get("purchaseType", "")).strip()
    item_id = str(payload.get("itemId", "")).strip()
    lang = str(payload.get("lang", "bg")).strip()
    lang = lang if lang in {"en", "bg", "ru"} else "bg"

    if purchase_type == Sale.PurchaseType.LEARN_MATERIAL:
        material = LearnMaterial.objects.filter(slug=item_id, status=PublishStatus.PUBLISHED).first()
        if not material:
            raise ValidationError("Learning material was not found.")

        amount = parse_price_amount(material.price)
        translated = learn_material_translation(material, lang if lang in {"en", "bg"} else "en")
        return {
            "purchase_type": purchase_type,
            "item_id": material.slug,
            "item_title": translated["title"] or material.title,
            "amount": amount,
            "learn_material": material,
            "metadata": {"material_slug": material.slug},
        }

    if purchase_type == Sale.PurchaseType.EVENT_TICKET:
        event = Event.objects.filter(slug=item_id, status=PublishStatus.PUBLISHED).first()
        if not event:
            raise ValidationError("Event was not found.")

        amount = parse_price_amount(event.price)
        translated = event_translation(event, lang if lang in {"en", "bg"} else "en")
        return {
            "purchase_type": purchase_type,
            "item_id": event.slug,
            "item_title": translated["title"] or event.title,
            "amount": amount,
            "event": event,
            "metadata": {"event_slug": event.slug},
        }

    if purchase_type == Sale.PurchaseType.CONSULTATION:
        expert = find_expert_for_checkout(item_id)
        session_id = str(payload.get("sessionId", "")).strip()
        template = EXPERT_SERVICE_TEMPLATES.get(session_id)

        if not expert or not template or not getattr(expert, template["flag"]):
            raise ValidationError("Consultation session was not found.")

        amount = parse_price_amount(getattr(expert, template["price_field"]))
        service_lang = lang if lang in {"en", "bg", "ru"} else "en"
        expert_translated = expert_translation(expert, lang if lang in {"en", "bg"} else "en")
        session_title = template["title"][service_lang]
        expert_name = expert_translated.get("name") or expert.name
        return {
            "purchase_type": purchase_type,
            "item_id": f"{expert.slug}:{session_id}",
            "item_title": f"{session_title} - {expert_name}",
            "amount": amount,
            "expert": expert,
            "metadata": {
                "expert_slug": expert.slug,
                "session_id": session_id,
                "session_title": session_title,
            },
        }

    raise ValidationError("Unknown purchase type.")


def frontend_checkout_url(base_url, lang, result):
    return f"{base_url}/{lang}/payment/{result}"


@csrf_exempt
@require_POST
def create_checkout_session(request):
    if not settings.STRIPE_SECRET_KEY:
        return json_error("Stripe secret key is not configured.", 500)

    try:
        payload = parse_payload(request)
        checkout_item = resolve_checkout_item(payload)
    except ValueError as error:
        return json_error(str(error))
    except ValidationError as error:
        message = error.messages[0] if getattr(error, "messages", None) else str(error)
        return json_error(message)

    customer_name = str(payload.get("customerName", "")).strip()
    customer_email = str(payload.get("customerEmail", "")).strip()
    lang = str(payload.get("lang", "bg")).strip()
    lang = lang if lang in {"en", "bg", "ru"} else "bg"
    amount = checkout_item["amount"]

    if not customer_name:
        return json_error("Customer name is required.")

    try:
        validate_email(customer_email)
    except ValidationError:
        return json_error("A valid customer email is required.")

    if amount is None or amount <= 0:
        return json_error("This item does not have a paid price.")

    currency = settings.STRIPE_CURRENCY
    frontend_base_url = str(payload.get("frontendBaseUrl") or settings.FRONTEND_BASE_URL).rstrip("/")
    metadata = {
        **checkout_item.get("metadata", {}),
        "purchase_type": checkout_item["purchase_type"],
        "item_id": checkout_item["item_id"],
        "customer_name": customer_name,
        "customer_email": customer_email,
        "lang": lang,
    }
    if payload.get("additional"):
        metadata["additional"] = str(payload.get("additional"))[:450]
    stripe_metadata = {key: str(value)[:500] for key, value in metadata.items() if value not in (None, "")}

    stripe.api_key = settings.STRIPE_SECRET_KEY

    try:
        checkout_session = stripe.checkout.Session.create(
            mode="payment",
            customer_email=customer_email,
            success_url=f"{frontend_checkout_url(frontend_base_url, lang, 'success')}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=frontend_checkout_url(frontend_base_url, lang, "cancel"),
            line_items=[
                {
                    "price_data": {
                        "currency": currency,
                        "product_data": {
                            "name": checkout_item["item_title"],
                            "metadata": {
                                "purchase_type": checkout_item["purchase_type"],
                                "item_id": checkout_item["item_id"],
                            },
                        },
                        "unit_amount": stripe_unit_amount(amount),
                    },
                    "quantity": 1,
                }
            ],
            metadata=stripe_metadata,
            payment_intent_data={"metadata": stripe_metadata},
        )
    except Exception as error:
        return json_error(f"Stripe checkout session could not be created: {error}", 502)

    checkout_url = getattr(checkout_session, "url", "") or checkout_session.get("url", "")
    checkout_session_id = getattr(checkout_session, "id", "") or checkout_session.get("id", "")

    sale = Sale.objects.create(
        purchase_type=checkout_item["purchase_type"],
        status=Sale.Status.PENDING_PAYMENT,
        customer_name=customer_name,
        customer_email=customer_email,
        item_id=checkout_item["item_id"],
        item_title=checkout_item["item_title"],
        amount=amount,
        currency=currency,
        stripe_checkout_session_id=checkout_session_id,
        stripe_checkout_url=checkout_url,
        expert=checkout_item.get("expert"),
        event=checkout_item.get("event"),
        learn_material=checkout_item.get("learn_material"),
        metadata=metadata,
    )

    return JsonResponse(
        {
            "checkoutUrl": checkout_url,
            "checkoutSessionId": checkout_session_id,
            "saleId": str(sale.id),
        },
        status=201,
    )


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
    try:
        parsed = json.loads(str(value))
    except json.JSONDecodeError:
        parsed = None
    if isinstance(parsed, list):
        return [str(item).strip() for item in parsed if str(item).strip()]
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


def rich_text_list_value(value):
    if isinstance(value, list):
        return text_list_value(value)

    text = "" if value is None else str(value).strip()
    if not text or text in {"<p></p>", "<p><br></p>"}:
        return []

    try:
        parsed = json.loads(text)
    except json.JSONDecodeError:
        parsed = None

    if isinstance(parsed, list):
        return text_list_value(parsed)

    return [text]


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
    if not source and source_field == "title_en":
        source = payload.get("title_bg", "")
    instance.slug = make_unique_slug(model, source, instance)


def coerce_expert_translation_field(field, value):
    if field in {"expertise", "industries", "languages", "experience"}:
        fallback = list
        return coerce_json_value(value, fallback)

    if field == "bio":
        return rich_text_list_value(value)

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

        if lang == "bg":
            for field in EXPERT_ENGLISH_ONLY_TAG_FIELDS:
                current.pop(field, None)

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


def normalize_article_sections(value):
    if isinstance(value, str):
        text = value.strip()
        if not text:
            return []
        try:
            sections = json.loads(text)
        except json.JSONDecodeError:
            return [{"html": text}]
    elif isinstance(value, list):
        sections = value
    else:
        sections = coerce_json_value(value, list)

    if isinstance(sections, dict):
        sections = [sections]

    normalized = []

    for section in sections:
        if isinstance(section, dict):
            raw_html = str(section.get("html", "") or "").strip()
            if raw_html:
                normalized.append({"html": raw_html})
                continue

            paragraphs = section.get("paragraphs", [])
            normalized.append(
                {
                    "title": str(section.get("title", "") or ""),
                    "paragraphs": text_list_value(paragraphs),
                }
            )
            continue

        text = str(section).strip()
        if text:
            normalized.append({"title": "", "paragraphs": [text]})

    return normalized


def coerce_article_body(payload, lang, current_body):
    body = dict(current_body) if isinstance(current_body, dict) else {}

    field_map = {
        f"body_sections_{lang}": ("sections", normalize_article_sections),
    }
    if lang == "en":
        field_map[f"hashtags_{lang}"] = ("hashtags", text_list_value)

    for payload_key, (body_key, coercer) in field_map.items():
        if payload_key not in payload:
            continue

        value = payload[payload_key]
        if coercer is str:
            body[body_key] = "" if value is None else str(value)
        else:
            body[body_key] = coercer(value)

    if lang == "bg":
        body.pop("hashtags", None)

    body.pop("_lang", None)
    body.pop("timeToRead", None)
    body.pop("readTime", None)
    body.pop("displayDate", None)
    body.pop("authorLabel", None)
    body.pop("authorExpertId", None)
    body.pop("authorAvatarUrl", None)
    return body


def apply_article_translations(instance, payload):
    translations = dict(instance.translations or {})
    body_keys = {
        "body_sections",
        "hashtags",
    }

    for lang in ("en", "bg"):
        current = dict(translations.get(lang) or {})

        for field in ("title", "excerpt", "lead"):
            payload_key = f"{field}_{lang}"
            if payload_key in payload:
                current[field] = "" if payload[payload_key] is None else str(payload[payload_key])

        if any(f"{key}_{lang}" in payload for key in body_keys):
            current["body"] = coerce_article_body(payload, lang, current.get("body"))

        translations[lang] = current

    en_translation = translations.get("en") or {}
    bg_translation = translations.get("bg") or {}
    fallback = en_translation if en_translation.get("title") else bg_translation

    for field in ARTICLE_TRANSLATED_FIELDS:
        value = fallback.get(field)
        if value in (None, "", [], {}):
            continue
        setattr(instance, field, value)

    instance.translations = translations


def apply_project_translations(instance, payload):
    translations = dict(instance.translations or {})
    body_keys = {
        "body_sections",
        "hashtags",
    }

    for lang in ("en", "bg"):
        current = dict(translations.get(lang) or {})

        for field in ("title", "excerpt", "lead"):
            payload_key = f"{field}_{lang}"
            if payload_key in payload:
                current[field] = "" if payload[payload_key] is None else str(payload[payload_key])

        if "lead" in current:
            current["description"] = current.get("lead", "")

        if any(f"{key}_{lang}" in payload for key in body_keys):
            current["body"] = coerce_article_body(payload, lang, current.get("body"))

        translations[lang] = current

    en_translation = translations.get("en") or {}
    bg_translation = translations.get("bg") or {}
    fallback = en_translation if en_translation.get("title") else bg_translation

    for field in PROJECT_TRANSLATED_FIELDS:
        value = fallback.get(field)
        if value in (None, "", [], {}):
            continue
        if hasattr(instance, field):
            setattr(instance, field, value)

    instance.translations = translations


def apply_event_translations(instance, payload):
    translations = dict(instance.translations or {})

    for lang in ("en", "bg"):
        current = dict(translations.get(lang) or {})

        for field in EVENT_TRANSLATED_FIELDS:
            payload_key = f"{field}_{lang}"
            if payload_key in payload:
                current[field] = "" if payload[payload_key] is None else str(payload[payload_key])

        translations[lang] = current

    en_translation = translations.get("en") or {}
    bg_translation = translations.get("bg") or {}
    fallback = en_translation if en_translation.get("title") else bg_translation

    for field in EVENT_TRANSLATED_FIELDS:
        value = fallback.get(field)
        if value in (None, "", [], {}):
            continue
        setattr(instance, field, value)

    instance.translations = translations


def apply_learn_material_translations(instance, payload):
    translations = dict(instance.translations or {})

    for lang in ("en", "bg"):
        current = dict(translations.get(lang) or {})

        for field in LEARN_MATERIAL_TRANSLATED_FIELDS:
            payload_key = f"{field}_{lang}"
            if payload_key in payload:
                current[field] = "" if payload[payload_key] is None else str(payload[payload_key])

        translations[lang] = current

    en_translation = translations.get("en") or {}
    bg_translation = translations.get("bg") or {}
    fallback = en_translation if en_translation.get("title") else bg_translation

    for field in LEARN_MATERIAL_TRANSLATED_FIELDS:
        value = fallback.get(field)
        if value in (None, "", [], {}):
            continue
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
    if resource_key == "articles":
        apply_article_translations(instance, payload)
    if resource_key == "projects":
        apply_project_translations(instance, payload)
    if resource_key == "events":
        apply_event_translations(instance, payload)
    if resource_key == "learn_materials":
        apply_learn_material_translations(instance, payload)

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

    if resource_key == "categories":
        instance.name = (
            str(payload.get("name_en") or "").strip()
            or str(payload.get("name_bg") or "").strip()
            or instance.name
        )

    ensure_slug(model, instance, payload, config)
    instance.full_clean()
    instance.save()

    for field_name, values in many_to_many_values.items():
        getattr(instance, field_name).set(values)

    return instance


@csrf_exempt
@require_POST
def admin_resource_create(request, resource_key):
    unauthorized = require_admin_api(request)
    if unauthorized:
        return unauthorized

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
    unauthorized = require_admin_api(request)
    if unauthorized:
        return unauthorized

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
    unauthorized = require_admin_api(request)
    if unauthorized:
        return unauthorized

    return JsonResponse(
        {
            "categories": [serialize_admin_category(item) for item in Category.objects.all()],
            "organizations": [
                serialize_admin_organization(item)
                for item in Organization.objects.all()
            ],
            "experts": [
                serialize_admin_expert(item)
                for item in Expert.objects.select_related("organization")
            ],
            "articles": [
                serialize_admin_article(item)
                for item in Article.objects.select_related("author")
            ],
            "events": [
                serialize_admin_event(item)
                for item in Event.objects.select_related("category", "expert").prefetch_related(
                    "organizers",
                    "partners",
                )
            ],
            "learn_materials": [
                serialize_admin_learn_material(item)
                for item in LearnMaterial.objects.select_related("category", "author")
            ],
            "projects": [
                serialize_admin_project(item)
                for item in Project.objects.select_related("author")
            ],
            "sales": [
                serialize_admin_sale(item)
                for item in Sale.objects.select_related("expert", "event", "learn_material")
            ],
            "chat_conversations": [
                serialize_admin_chat_conversation(item)
                for item in ChatConversation.objects.prefetch_related("messages")
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
        serialize_article(article, lang)
        for article in Article.objects.filter(status="published")
        .select_related("author")
        .order_by("-published_at")
    ]
    events_queryset = Event.objects.filter(status="published").select_related("expert").prefetch_related(
        "organizers",
        "partners",
    ).order_by("starts_at")
    events = [serialize_event(event, lang) for event in events_queryset]
    upcoming_events = [
        serialize_upcoming_event(event, lang)
        for event in events_queryset
    ]
    textbooks = [
        serialize_material(material, lang)
        for material in LearnMaterial.objects.filter(status="published")
        .select_related("category", "author")
        .order_by("-published_at")
    ]
    projects = [
        serialize_project(project, lang)
        for project in Project.objects.filter(status="published")
        .select_related("author")
        .order_by("-published_at")
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

import ast
import json

from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from django.views.decorators.http import require_POST

from content.models import (
    Article,
    Category,
    Event,
    Expert,
    ExpertSession,
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
    return queryset.filter(slug__endswith=f"-{lang}")


def serialize_expert(expert):
    analytics = expert.analytics or {}
    sessions = [
        {
            "id": f"session-{session.id}",
            "title": session.title,
            "subtitle": session.subtitle,
            "description": session.description,
            "price": float(session.price) if session.price is not None else 0,
        }
        for session in expert.sessions.filter(is_active=True)
    ]
    return {
        "id": analytics.get("_mock_id") or expert.slug.rsplit("-", 1)[0],
        "name": expert.name,
        "role": expert.role,
        "company": expert.company_name,
        "imageUrl": file_url(expert.photo),
        "quote": expert.quote,
        "availableFor": analytics.get("availableFor", []),
        "expertise": expert.expertise or [],
        "price": float(expert.consultation_price) if expert.consultation_price is not None else None,
        "languages": expert.languages or [],
        "industries": expert.industries or [],
        "bio": text_list_value(expert.bio),
        "sessions": sessions,
        "experienceList": expert.experience or [],
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
    slug = material.slug.rsplit("-", 1)[0]
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
    project_id = project.slug.rsplit("-", 1)[0]

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


def serialize_admin_expert(expert):
    return {
        "id": str(expert.id),
        "name": expert.name,
        "slug": expert.slug,
        "role": expert.role,
        "company_name": expert.company_name,
        "organization": str(expert.organization) if expert.organization else "",
        "photo": admin_file_value(expert.photo),
        "quote": expert.quote,
        "bio": admin_json_value(text_list_value(expert.bio)),
        "expertise": admin_json_value(expert.expertise),
        "industries": admin_json_value(expert.industries),
        "languages": admin_json_value(expert.languages),
        "experience": admin_json_value(expert.experience),
        "analytics": admin_json_value(expert.analytics),
        "consultation_price": admin_decimal_value(expert.consultation_price),
        "is_available_for_consultation": expert.is_available_for_consultation,
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
            "expert_sessions": [
                serialize_admin_expert_session(item)
                for item in ExpertSession.objects.select_related("expert")
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

    experts = [serialize_expert(expert) for expert in lang_filter(Expert.objects.filter(is_active=True), lang)]
    news = [
        serialize_article(article)
        for article in Article.objects.filter(status="published", slug__contains=f"-{lang}-").order_by("-published_at")
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

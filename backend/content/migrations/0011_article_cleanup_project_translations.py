from datetime import datetime, time

from django.db import migrations, models
from django.utils import timezone


PROJECT_TRANSLATED_FIELDS = (
    "title",
    "excerpt",
    "lead",
    "description",
    "promoted_label",
    "body",
)


def project_lang(value):
    text = str(value or "")
    if "-en-" in text or text.endswith("-en"):
        return "en"
    if "-bg-" in text or text.endswith("-bg"):
        return "bg"
    return ""


def base_project_slug(value):
    text = str(value or "")
    text = text.replace("-en-", "-").replace("-bg-", "-")
    for suffix in ("-en", "-bg"):
        if text.endswith(suffix):
            return text[: -len(suffix)]
    return text


def project_body(project):
    body = project.body if isinstance(project.body, dict) else {}
    if body.get("sections"):
        return body
    if project.description:
        return {"sections": [{"html": f"<p>{project.description}</p>"}]}
    return {}


def project_translation(project):
    return {
        "title": project.title,
        "excerpt": project.excerpt or project.description,
        "lead": project.lead or project.description,
        "description": project.description,
        "promoted_label": project.promoted_label,
        "body": project_body(project),
    }


def project_datetime(project):
    if project.published_at:
        return project.published_at
    if project.project_date:
        value = datetime.combine(project.project_date, time.min)
        return timezone.make_aware(value, timezone=timezone.get_current_timezone())
    return None


def migrate_project_translations(apps, schema_editor):
    Project = apps.get_model("content", "Project")

    grouped = {}
    for project in Project.objects.all().order_by("id"):
        grouped.setdefault(base_project_slug(project.slug), []).append(project)

    through = Project.tags.through

    for slug, projects in grouped.items():
        primary = next((project for project in projects if not project_lang(project.slug)), None)
        primary = primary or next((project for project in projects if project_lang(project.slug) == "en"), None)
        primary = primary or projects[0]

        translations = dict(primary.translations or {})
        for project in projects:
            lang = project_lang(project.slug)
            if lang:
                translations[lang] = project_translation(project)

        fallback = translations.get("en") or translations.get("bg") or project_translation(primary)
        for field in PROJECT_TRANSLATED_FIELDS:
            value = fallback.get(field)
            if value in (None, "", [], {}):
                continue
            if field == "description":
                primary.description = value
            elif hasattr(primary, field):
                setattr(primary, field, value)

        primary.slug = slug
        primary.translations = translations
        primary.published_at = project_datetime(primary)
        primary.save()

        for project in projects:
            if project.id == primary.id:
                continue

            for relation in through.objects.filter(project_id=project.id):
                through.objects.get_or_create(project_id=primary.id, tag_id=relation.tag_id)

            project.delete()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0010_article_author_links"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="article",
            name="article_type",
        ),
        migrations.AddField(
            model_name="project",
            name="excerpt",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="project",
            name="lead",
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name="project",
            name="body",
            field=models.JSONField(blank=True, default=list, help_text="Structured project content sections."),
        ),
        migrations.AddField(
            model_name="project",
            name="translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="project",
            name="promoted_label",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="project",
            name="read_time",
            field=models.PositiveSmallIntegerField(
                blank=True,
                help_text="Estimated reading time in minutes.",
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="published_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(migrate_project_translations, noop_reverse),
    ]

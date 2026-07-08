import json

from django.db import migrations, models


def migrate_event_translations(apps, schema_editor):
    Event = apps.get_model("content", "Event")

    for event in Event.objects.all():
        try:
            raw = json.loads(event.detail_description or "{}")
        except json.JSONDecodeError:
            raw = {}

        raw = raw if isinstance(raw, dict) else {}
        translations = event.translations if isinstance(event.translations, dict) else {}
        next_translations = dict(translations)

        detail_en = raw.get("detailDescription") or event.detail_description
        detail_bg = raw.get("detailDescriptionBg") or ""

        if detail_en and detail_en.strip().startswith("{"):
            detail_en = ""

        next_translations["en"] = {
            "title": raw.get("title") or event.title,
            "short_description": raw.get("description") or event.short_description,
            "detail_description": detail_en,
        }

        next_translations["bg"] = {
            "title": raw.get("titleBg") or "",
            "short_description": raw.get("descriptionBg") or "",
            "detail_description": detail_bg,
        }

        event.translations = next_translations
        event.title = next_translations["en"]["title"] or next_translations["bg"]["title"] or event.title
        event.short_description = (
            next_translations["en"]["short_description"]
            or next_translations["bg"]["short_description"]
            or event.short_description
        )
        event.detail_description = (
            next_translations["en"]["detail_description"]
            or next_translations["bg"]["detail_description"]
            or ""
        )
        event.save(update_fields=["title", "short_description", "detail_description", "translations"])


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0018_remove_promoted_label"),
    ]

    operations = [
        migrations.RenameField(
            model_name="event",
            old_name="description",
            new_name="short_description",
        ),
        migrations.RenameField(
            model_name="event",
            old_name="price_label",
            new_name="price",
        ),
        migrations.AddField(
            model_name="event",
            name="translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.RunPython(migrate_event_translations, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="event",
            name="related_articles",
        ),
        migrations.RemoveField(
            model_name="event",
            name="timezone",
        ),
        migrations.RemoveField(
            model_name="event",
            name="hero_image",
        ),
        migrations.RemoveField(
            model_name="event",
            name="is_featured_hero",
        ),
    ]

from django.db import migrations


READ_TIME_KEYS = ("timeToRead", "readTime")


def strip_read_time_from_body(body):
    if not isinstance(body, dict):
        return body, False

    next_body = dict(body)
    changed = False
    for key in READ_TIME_KEYS:
        if key in next_body:
            next_body.pop(key)
            changed = True

    return next_body, changed


def clean_read_time_json(apps, schema_editor):
    for model_name in ("Article", "Project"):
        model = apps.get_model("content", model_name)

        for obj in model.objects.all():
            changed = False
            body, body_changed = strip_read_time_from_body(obj.body)
            if body_changed:
                obj.body = body
                changed = True

            translations = obj.translations if isinstance(obj.translations, dict) else {}
            next_translations = dict(translations)
            for lang, value in translations.items():
                if not isinstance(value, dict):
                    continue

                translated_body, translated_body_changed = strip_read_time_from_body(value.get("body"))
                if translated_body_changed:
                    next_value = dict(value)
                    next_value["body"] = translated_body
                    next_translations[lang] = next_value
                    changed = True

            if changed:
                obj.translations = next_translations
                obj.save(update_fields=["body", "translations"])


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0016_remove_article_category_tags"),
    ]

    operations = [
        migrations.RunPython(clean_read_time_json, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="article",
            name="read_time",
        ),
        migrations.RemoveField(
            model_name="project",
            name="read_time",
        ),
    ]

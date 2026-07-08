from django.db import migrations


def clean_promoted_label_translations(apps, schema_editor):
    for model_name in ("Article", "Project"):
        model = apps.get_model("content", model_name)

        for obj in model.objects.all():
            translations = obj.translations if isinstance(obj.translations, dict) else {}
            next_translations = dict(translations)
            changed = False

            for lang, value in translations.items():
                if not isinstance(value, dict) or "promoted_label" not in value:
                    continue

                next_value = dict(value)
                next_value.pop("promoted_label", None)
                next_translations[lang] = next_value
                changed = True

            if changed:
                obj.translations = next_translations
                obj.save(update_fields=["translations"])


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0017_remove_read_time"),
    ]

    operations = [
        migrations.RunPython(clean_promoted_label_translations, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="article",
            name="promoted_label",
        ),
        migrations.RemoveField(
            model_name="project",
            name="promoted_label",
        ),
    ]

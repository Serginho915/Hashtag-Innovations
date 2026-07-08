from django.db import migrations


EXPERT_TAG_FIELDS = ("expertise", "industries", "languages")


def clean_body_hashtags(translations):
    if not isinstance(translations, dict):
        return translations, False

    bg = translations.get("bg")
    if not isinstance(bg, dict):
        return translations, False

    body = bg.get("body")
    if not isinstance(body, dict) or "hashtags" not in body:
        return translations, False

    translations = dict(translations)
    bg = dict(bg)
    body = dict(body)
    body.pop("hashtags", None)
    bg["body"] = body
    translations["bg"] = bg
    return translations, True


def clean_expert_tags(apps, schema_editor):
    Expert = apps.get_model("content", "Expert")

    for expert in Expert.objects.all():
        translations = expert.translations if isinstance(expert.translations, dict) else {}
        bg = translations.get("bg")

        if not isinstance(bg, dict):
            continue

        next_bg = dict(bg)
        changed = False

        for field in EXPERT_TAG_FIELDS:
            if field in next_bg:
                next_bg.pop(field, None)
                changed = True

        if changed:
            next_translations = dict(translations)
            next_translations["bg"] = next_bg
            expert.translations = next_translations
            expert.save(update_fields=["translations"])


def clean_content_hashtags(apps, schema_editor):
    for model_name in ("Article", "Project"):
        Model = apps.get_model("content", model_name)

        for item in Model.objects.all():
            next_translations, changed = clean_body_hashtags(item.translations)
            if changed:
                item.translations = next_translations
                item.save(update_fields=["translations"])


def remove_bulgarian_tags(apps, schema_editor):
    clean_expert_tags(apps, schema_editor)
    clean_content_hashtags(apps, schema_editor)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0013_replace_tag_model_with_lists"),
    ]

    operations = [
        migrations.RunPython(remove_bulgarian_tags, noop_reverse),
    ]

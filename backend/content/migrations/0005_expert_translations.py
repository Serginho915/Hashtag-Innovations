from django.db import migrations, models


TRANSLATED_FIELDS = (
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


def base_slug(slug):
    text = str(slug)
    for suffix in ("-en", "-bg"):
        if text.endswith(suffix):
            return text[: -len(suffix)]
    return text


def lang_from_slug(slug):
    text = str(slug)
    if text.endswith("-en"):
        return "en"
    if text.endswith("-bg"):
        return "bg"
    return ""


def translation_from_expert(expert):
    return {field: getattr(expert, field) for field in TRANSLATED_FIELDS}


def migrate_expert_translations(apps, schema_editor):
    Expert = apps.get_model("content", "Expert")
    ExpertSession = apps.get_model("content", "ExpertSession")
    Article = apps.get_model("content", "Article")
    Event = apps.get_model("content", "Event")
    LearnMaterial = apps.get_model("content", "LearnMaterial")

    grouped = {}
    for expert in Expert.objects.all().order_by("id"):
        grouped.setdefault(base_slug(expert.slug), []).append(expert)

    for slug, experts in grouped.items():
        primary = next((expert for expert in experts if not lang_from_slug(expert.slug)), None)
        primary = primary or next((expert for expert in experts if lang_from_slug(expert.slug) == "en"), None)
        primary = primary or experts[0]

        translations = dict(primary.translations or {})
        for expert in experts:
            lang = lang_from_slug(expert.slug)
            if lang:
                translations[lang] = translation_from_expert(expert)

        if "en" in translations:
            for field, value in translations["en"].items():
                setattr(primary, field, value)
        elif "bg" in translations:
            for field, value in translations["bg"].items():
                setattr(primary, field, value)

        analytics = dict(primary.analytics or {})
        analytics.pop("_lang", None)
        analytics.setdefault("_mock_id", slug)

        primary.slug = slug
        primary.translations = translations
        primary.analytics = analytics
        primary.save()

        for expert in experts:
            if expert.id == primary.id:
                continue

            ExpertSession.objects.filter(expert_id=expert.id).update(expert=primary)
            Article.objects.filter(author_id=expert.id).update(author=primary)
            Event.objects.filter(expert_id=expert.id).update(expert=primary)
            LearnMaterial.objects.filter(author_id=expert.id).update(author=primary)
            expert.delete()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0004_remove_project_external_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="expert",
            name="translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.RunPython(migrate_expert_translations, noop_reverse),
    ]

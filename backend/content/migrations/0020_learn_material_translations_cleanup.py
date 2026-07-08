from django.db import migrations, models


TRANSLATED_FIELDS = ("title", "excerpt", "badge")


def slug_parts(slug):
    text = str(slug or "")
    if text.endswith("-bg"):
        return text[:-3], "bg"
    if text.endswith("-en"):
        return text[:-3], "en"
    return text, "en"


def material_translation(material):
    return {
        "title": material.title or "",
        "excerpt": material.excerpt or "",
        "badge": material.badge or "",
    }


def find_author(Expert, author_name):
    name = str(author_name or "").strip()
    if not name:
        return None

    direct = Expert.objects.filter(name=name).first()
    if direct:
        return direct

    for expert in Expert.objects.exclude(translations={}):
        translations = expert.translations if isinstance(expert.translations, dict) else {}
        for translated in translations.values():
            if isinstance(translated, dict) and str(translated.get("name") or "").strip() == name:
                return expert

    return None


def merge_learn_material_translations(apps, schema_editor):
    LearnMaterial = apps.get_model("content", "LearnMaterial")
    Expert = apps.get_model("content", "Expert")
    groups = {}

    for material in LearnMaterial.objects.order_by("id"):
        base_slug, lang = slug_parts(material.slug)
        groups.setdefault(base_slug, []).append((lang, material))

    for base_slug, items in groups.items():
        canonical = next((item for lang, item in items if item.slug == base_slug), None)
        if canonical is None:
            canonical = next((item for lang, item in items if lang == "en"), items[0][1])

        translations = canonical.translations if isinstance(canonical.translations, dict) else {}
        translations = dict(translations)

        for lang, material in items:
            current = translations.get(lang) if isinstance(translations.get(lang), dict) else {}
            current = dict(current)
            for field, value in material_translation(material).items():
                if value:
                    current[field] = value
            translations[lang] = current

        fallback = translations.get("en") or translations.get("bg") or {}
        for field in TRANSLATED_FIELDS:
            value = fallback.get(field)
            if value not in (None, "", [], {}):
                setattr(canonical, field, value)

        if canonical.slug != base_slug and not LearnMaterial.objects.filter(slug=base_slug).exclude(id=canonical.id).exists():
            canonical.slug = base_slug

        author_id = canonical.author_id
        if not author_id:
            author_id = next((material.author_id for lang, material in items if material.author_id), None)
        if not author_id:
            for lang, material in items:
                author = find_author(Expert, material.author_name)
                if author:
                    author_id = author.id
                    break

        canonical.translations = translations
        canonical.author_id = author_id
        canonical.save(update_fields=["slug", "title", "excerpt", "badge", "translations", "author"])

        for lang, material in items:
            if material.id != canonical.id:
                material.delete()


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0019_event_translations_cleanup"),
    ]

    operations = [
        migrations.AddField(
            model_name="learnmaterial",
            name="translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.RunPython(merge_learn_material_translations, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name="learnmaterial",
            name="author_name",
        ),
        migrations.RemoveField(
            model_name="learnmaterial",
            name="sales_url",
        ),
        migrations.RemoveField(
            model_name="learnmaterial",
            name="format_label",
        ),
        migrations.RemoveField(
            model_name="learnmaterial",
            name="has_preview",
        ),
    ]

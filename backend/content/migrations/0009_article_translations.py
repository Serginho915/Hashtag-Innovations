from django.db import migrations, models


TRANSLATED_FIELDS = (
    "title",
    "author_name",
    "excerpt",
    "lead",
    "promoted_label",
    "body",
)


def article_lang(value):
    text = str(value or "")
    if "-en-" in text or text.endswith("-en"):
        return "en"
    if "-bg-" in text or text.endswith("-bg"):
        return "bg"
    return ""


def base_article_slug(value):
    text = str(value or "")
    text = text.replace("-en-", "-").replace("-bg-", "-")
    for suffix in ("-en", "-bg"):
        if text.endswith(suffix):
            return text[: -len(suffix)]
    return text


def clean_body(body):
    if not isinstance(body, dict):
        return {}
    cleaned = dict(body)
    cleaned.pop("_lang", None)
    return cleaned


def article_translation(article):
    return {
        "title": article.title,
        "author_name": article.author_name,
        "excerpt": article.excerpt,
        "lead": article.lead,
        "promoted_label": article.promoted_label,
        "body": clean_body(article.body),
    }


def grouping_key(article):
    body = article.body if isinstance(article.body, dict) else {}
    return base_article_slug(body.get("_mock_id") or article.slug)


def migrate_article_translations(apps, schema_editor):
    Article = apps.get_model("content", "Article")
    Event = apps.get_model("content", "Event")

    grouped = {}
    for article in Article.objects.all().order_by("id"):
        grouped.setdefault(grouping_key(article), []).append(article)

    through = Event.related_articles.through

    for slug, articles in grouped.items():
        primary = next((article for article in articles if not article_lang(article.slug)), None)
        primary = primary or next((article for article in articles if article_lang(article.slug) == "en"), None)
        primary = primary or articles[0]

        translations = dict(primary.translations or {})
        for article in articles:
            lang = article_lang((article.body or {}).get("_mock_id") if isinstance(article.body, dict) else article.slug)
            lang = lang or article_lang(article.slug)
            if lang:
                translations[lang] = article_translation(article)

        fallback = translations.get("en") or translations.get("bg") or {}
        for field in TRANSLATED_FIELDS:
            value = fallback.get(field)
            if value in (None, "", [], {}):
                continue
            setattr(primary, field, value)

        primary.slug = slug
        primary.translations = translations
        primary.save()

        for article in articles:
            if article.id == primary.id:
                continue

            for relation in through.objects.filter(article_id=article.id):
                through.objects.get_or_create(event_id=relation.event_id, article_id=primary.id)

            article.delete()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0008_remove_expert_consultation_price"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.RunPython(migrate_article_translations, noop_reverse),
    ]

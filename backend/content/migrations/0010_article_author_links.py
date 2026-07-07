from django.db import migrations


def clean_body(body):
    if not isinstance(body, dict):
        return {}, ""

    cleaned = dict(body)
    author_slug = str(cleaned.get("authorExpertId") or "").strip()
    cleaned.pop("authorLabel", None)
    cleaned.pop("authorExpertId", None)
    cleaned.pop("authorAvatarUrl", None)

    time_to_read = cleaned.get("timeToRead") or cleaned.get("readTime")
    if time_to_read:
        cleaned["timeToRead"] = time_to_read
        cleaned["readTime"] = time_to_read

    return cleaned, author_slug


def migrate_article_authors(apps, schema_editor):
    Article = apps.get_model("content", "Article")
    Expert = apps.get_model("content", "Expert")

    for article in Article.objects.all():
        translations = dict(article.translations or {})
        author_slug = ""

        for lang in ("en", "bg"):
            translated = dict(translations.get(lang) or {})
            body, body_author_slug = clean_body(translated.get("body"))
            if body_author_slug and not author_slug:
                author_slug = body_author_slug
            if body:
                translated["body"] = body
                translations[lang] = translated

        fallback_body, body_author_slug = clean_body(article.body)
        if body_author_slug and not author_slug:
            author_slug = body_author_slug

        update_fields = ["translations", "body"]
        article.translations = translations
        article.body = fallback_body

        if author_slug and not article.author_id:
            author = Expert.objects.filter(slug=author_slug).first()
            if author:
                article.author = author
                update_fields.append("author")

        article.save(update_fields=update_fields)


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0009_article_translations"),
    ]

    operations = [
        migrations.RunPython(migrate_article_authors, noop_reverse),
    ]

from django.db import migrations, models


BG_TO_EN = {
    "Бизнес": "Business",
    "Изкуствен интелект": "Artificial Intelligence",
    "Иновации": "Innovation",
    "Образование": "Education",
    "Стратегия": "Strategy",
    "Технологии": "Technology",
    "Проекти": "Projects",
}
EN_TO_BG = {value: key for key, value in BG_TO_EN.items()}


def category_names(category):
    name = str(category.name or "").strip()

    if name in BG_TO_EN:
        return BG_TO_EN[name], name

    return name, EN_TO_BG.get(name, "")


def merge_category_duplicates(apps, schema_editor):
    Category = apps.get_model("content", "Category")
    Article = apps.get_model("content", "Article")
    Event = apps.get_model("content", "Event")
    LearnMaterial = apps.get_model("content", "LearnMaterial")
    Project = apps.get_model("content", "Project")

    groups = {}

    for category in Category.objects.all().order_by("id"):
        name_en, name_bg = category_names(category)
        key = (category.kind or "", name_en.casefold())
        groups.setdefault(key, []).append((category, name_en, name_bg))

    for (_kind, _name_key), items in groups.items():
        primary_tuple = next(
            (
                item
                for item in items
                if str(item[0].name or "").strip() == item[1]
            ),
            items[0],
        )
        primary, primary_name_en, primary_name_bg = primary_tuple
        name_bg = primary_name_bg or next((item[2] for item in items if item[2]), "")

        primary.name = primary_name_en
        primary.name_en = primary_name_en
        primary.name_bg = name_bg
        primary.save(update_fields=["name", "name_en", "name_bg"])

        duplicate_ids = [category.id for category, _name_en, _name_bg in items if category.id != primary.id]
        if not duplicate_ids:
            continue

        for model in (Article, Event, LearnMaterial, Project):
            model.objects.filter(category_id__in=duplicate_ids).update(category_id=primary.id)

        Category.objects.filter(id__in=duplicate_ids).delete()


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0014_remove_bulgarian_tag_translations"),
    ]

    operations = [
        migrations.AddField(
            model_name="category",
            name="name_en",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.AddField(
            model_name="category",
            name="name_bg",
            field=models.CharField(blank=True, max_length=120),
        ),
        migrations.RunPython(merge_category_duplicates, noop_reverse),
    ]

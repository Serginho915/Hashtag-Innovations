from django.db import migrations, models


def tag_names(instance):
    names = []
    seen = set()

    for tag in instance.tags.all().order_by("name"):
        name = str(tag.name or "").strip()
        key = name.lower()
        if not name or key in seen:
            continue
        seen.add(key)
        names.append(name)

    return names


def copy_tag_relations_to_lists(apps, schema_editor):
    Article = apps.get_model("content", "Article")
    Event = apps.get_model("content", "Event")
    LearnMaterial = apps.get_model("content", "LearnMaterial")
    Project = apps.get_model("content", "Project")

    for model in (Article, Event, LearnMaterial, Project):
        for instance in model.objects.all():
            instance.tag_list = tag_names(instance)
            instance.save(update_fields=["tag_list"])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0012_remove_project_legacy_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="article",
            name="tag_list",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="event",
            name="tag_list",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="learnmaterial",
            name="tag_list",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="project",
            name="tag_list",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.RunPython(copy_tag_relations_to_lists, noop_reverse),
        migrations.RemoveField(
            model_name="article",
            name="tags",
        ),
        migrations.RemoveField(
            model_name="event",
            name="tags",
        ),
        migrations.RemoveField(
            model_name="expert",
            name="tags",
        ),
        migrations.RemoveField(
            model_name="learnmaterial",
            name="tags",
        ),
        migrations.RemoveField(
            model_name="project",
            name="tags",
        ),
        migrations.RenameField(
            model_name="article",
            old_name="tag_list",
            new_name="tags",
        ),
        migrations.RenameField(
            model_name="event",
            old_name="tag_list",
            new_name="tags",
        ),
        migrations.RenameField(
            model_name="learnmaterial",
            old_name="tag_list",
            new_name="tags",
        ),
        migrations.RenameField(
            model_name="project",
            old_name="tag_list",
            new_name="tags",
        ),
        migrations.DeleteModel(
            name="Tag",
        ),
    ]

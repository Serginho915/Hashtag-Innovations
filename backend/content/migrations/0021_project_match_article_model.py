from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("content", "0020_learn_material_translations_cleanup"),
    ]

    operations = [
        migrations.AddField(
            model_name="project",
            name="author",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="projects",
                to="content.expert",
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="author_name",
            field=models.CharField(blank=True, max_length=160),
        ),
        migrations.RemoveField(
            model_name="project",
            name="category",
        ),
        migrations.RemoveField(
            model_name="project",
            name="organization",
        ),
        migrations.RemoveField(
            model_name="project",
            name="tags",
        ),
    ]

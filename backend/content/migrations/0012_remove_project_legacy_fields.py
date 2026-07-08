from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0011_article_cleanup_project_translations"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="project",
            options={"ordering": ["-published_at", "-created_at"]},
        ),
        migrations.RemoveField(
            model_name="project",
            name="description",
        ),
        migrations.RemoveField(
            model_name="project",
            name="project_date",
        ),
    ]

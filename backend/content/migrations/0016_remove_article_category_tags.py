from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0015_category_translations"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="article",
            name="category",
        ),
        migrations.RemoveField(
            model_name="article",
            name="tags",
        ),
    ]

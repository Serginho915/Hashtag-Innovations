from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0007_expert_service_prices"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="expert",
            name="consultation_price",
        ),
    ]

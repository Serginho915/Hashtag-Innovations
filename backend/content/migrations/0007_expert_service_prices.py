from django.db import migrations, models


def copy_default_service_prices(apps, schema_editor):
    Expert = apps.get_model("content", "Expert")

    for expert in Expert.objects.all():
        expert.service_consultation_price = expert.consultation_price
        expert.service_mentorship_price = expert.consultation_price
        expert.service_project_analysis_price = expert.consultation_price
        expert.save(update_fields=[
            "service_consultation_price",
            "service_mentorship_price",
            "service_project_analysis_price",
        ])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0006_expert_services"),
    ]

    operations = [
        migrations.AddField(
            model_name="expert",
            name="service_consultation_price",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="expert",
            name="service_mentorship_price",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="expert",
            name="service_project_analysis_price",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.RunPython(copy_default_service_prices, noop_reverse),
    ]

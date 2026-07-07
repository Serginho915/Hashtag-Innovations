from django.db import migrations, models


def enable_services_for_existing_experts(apps, schema_editor):
    Expert = apps.get_model("content", "Expert")
    ExpertSession = apps.get_model("content", "ExpertSession")

    expert_ids_with_sessions = set(
        ExpertSession.objects.filter(is_active=True).values_list("expert_id", flat=True)
    )

    for expert in Expert.objects.all():
        has_services = expert.is_available_for_consultation or expert.id in expert_ids_with_sessions
        if not has_services:
            continue

        expert.service_consultation = True
        expert.service_mentorship = True
        expert.service_project_analysis = True
        expert.save(update_fields=[
            "service_consultation",
            "service_mentorship",
            "service_project_analysis",
        ])


def noop_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0005_expert_translations"),
    ]

    operations = [
        migrations.AddField(
            model_name="expert",
            name="service_consultation",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="expert",
            name="service_mentorship",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="expert",
            name="service_project_analysis",
            field=models.BooleanField(default=False),
        ),
        migrations.RunPython(enable_services_for_existing_experts, noop_reverse),
    ]

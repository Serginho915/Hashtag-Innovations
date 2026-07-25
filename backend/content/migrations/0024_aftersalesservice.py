from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0023_chatconversation_chatmessage"),
    ]

    operations = [
        migrations.CreateModel(
            name="AfterSalesService",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("ticket_number", models.CharField(blank=True, max_length=80)),
                ("customer_name", models.CharField(blank=True, max_length=160)),
                ("customer_email", models.EmailField(blank=True, max_length=254)),
                ("customer_phone", models.CharField(blank=True, max_length=80)),
                ("company_name", models.CharField(blank=True, max_length=180)),
                ("product_or_service", models.CharField(blank=True, max_length=220)),
                ("purchase_reference", models.CharField(blank=True, max_length=160)),
                ("subject", models.CharField(blank=True, max_length=220)),
                ("issue_description", models.TextField(blank=True)),
                ("resolution_notes", models.TextField(blank=True)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("new", "New"),
                            ("in_progress", "In progress"),
                            ("waiting_customer", "Waiting customer"),
                            ("resolved", "Resolved"),
                            ("closed", "Closed"),
                        ],
                        default="new",
                        max_length=32,
                    ),
                ),
                (
                    "priority",
                    models.CharField(
                        choices=[
                            ("low", "Low"),
                            ("medium", "Medium"),
                            ("high", "High"),
                            ("urgent", "Urgent"),
                        ],
                        default="medium",
                        max_length=16,
                    ),
                ),
                ("assigned_to", models.CharField(blank=True, max_length=160)),
                ("opened_at", models.DateTimeField(blank=True, null=True)),
                ("due_date", models.DateField(blank=True, null=True)),
                ("resolved_at", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "ordering": ["-opened_at", "-created_at"],
            },
        ),
    ]

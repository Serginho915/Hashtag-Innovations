from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("content", "0021_project_match_article_model"),
    ]

    operations = [
        migrations.CreateModel(
            name="Sale",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "purchase_type",
                    models.CharField(
                        choices=[
                            ("consultation", "Consultation"),
                            ("learn_material", "Learn material"),
                            ("event_ticket", "Event ticket"),
                        ],
                        max_length=32,
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("pending_payment", "Pending payment"),
                            ("paid", "Paid"),
                            ("canceled", "Canceled"),
                        ],
                        default="pending_payment",
                        max_length=32,
                    ),
                ),
                ("customer_name", models.CharField(max_length=160)),
                ("customer_email", models.EmailField(max_length=254)),
                ("item_id", models.CharField(max_length=240)),
                ("item_title", models.CharField(max_length=240)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("currency", models.CharField(default="eur", max_length=8)),
                ("stripe_checkout_session_id", models.CharField(blank=True, max_length=255)),
                ("stripe_checkout_url", models.TextField(blank=True)),
                ("metadata", models.JSONField(blank=True, default=dict)),
                (
                    "event",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="sales",
                        to="content.event",
                    ),
                ),
                (
                    "expert",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="sales",
                        to="content.expert",
                    ),
                ),
                (
                    "learn_material",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="sales",
                        to="content.learnmaterial",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]

from django.core.management.base import BaseCommand

from content.ai_insights import create_ai_insight


class Command(BaseCommand):
    help = "Generate and publish one AI business insight article via OpenRouter."

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Generate content without saving the article or image.",
        )

    def handle(self, *args, **options):
        article = create_ai_insight(dry_run=options["dry_run"])
        if article is None:
            self.stdout.write(self.style.WARNING("AI insight already exists for today."))
            return

        action = "Generated" if options["dry_run"] else "Published"
        self.stdout.write(self.style.SUCCESS(f"{action}: {article.title}"))

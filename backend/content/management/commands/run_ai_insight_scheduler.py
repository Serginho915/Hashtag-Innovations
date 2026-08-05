import time
from datetime import timedelta

from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.utils import timezone

from content.ai_insights import already_generated_for_day, get_ai_insights_interval_days, random_run_at


class Command(BaseCommand):
    help = "Run the daily AI insight scheduler."

    def schedule_next_run(self, now, interval_days, start_day=None):
        candidate_day = start_day or timezone.localdate(now)
        for _ in range(31):
            next_run_at = random_run_at(candidate_day, now)
            if next_run_at and not already_generated_for_day(candidate_day):
                return candidate_day, next_run_at
            candidate_day += timedelta(days=interval_days)
        return None, None

    def handle(self, *args, **options):
        check_seconds = max(30, int(getattr(settings, "AI_INSIGHTS_CHECK_SECONDS", 300)))
        next_run_at = None
        scheduled_day = None

        while True:
            now = timezone.now()

            if next_run_at is None:
                interval_days = get_ai_insights_interval_days()
                scheduled_day, next_run_at = self.schedule_next_run(now, interval_days)
                if next_run_at:
                    self.stdout.write(f"Next AI insight run: {next_run_at.isoformat()}")

            if next_run_at and now >= next_run_at:
                try:
                    call_command("generate_ai_insight")
                except Exception as error:
                    self.stderr.write(f"AI insight generation failed: {error}")
                finally:
                    now_after_run = timezone.now()
                    interval_days = get_ai_insights_interval_days()
                    next_day = timezone.localdate(now_after_run) + timedelta(days=interval_days)
                    scheduled_day, next_run_at = self.schedule_next_run(now_after_run, interval_days, next_day)
                    if next_run_at:
                        self.stdout.write(f"Next AI insight run: {next_run_at.isoformat()}")

            time.sleep(check_seconds)

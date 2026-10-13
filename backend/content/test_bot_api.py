import json
import tempfile
import uuid
from io import BytesIO

from django.test import Client, TestCase, override_settings
from PIL import Image

from content.models import Article, Category, PublishStatus


@override_settings(
    BOT_INTEGRATION_TOKEN="integration-test-secret",
    FRONTEND_BASE_URL="https://consultation.bg",
    MEDIA_ROOT=tempfile.mkdtemp(),
)
class BotApiTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.headers = {"HTTP_AUTHORIZATION": "Bearer integration-test-secret"}
        self.external_id = uuid.uuid4()
        self.category = Category.objects.create(name="Business", name_en="Business", slug="business", kind="article")
        self.payload = {
            "external_id": str(self.external_id), "title": "A test article", "content": "First paragraph\n\nSecond paragraph",
            "summary": "A summary", "category_slugs": ["business"], "author_slug": None, "tag_names": ["strategy"],
        }

    def create(self, payload=None, **headers):
        return self.client.post(
            "/api/bot/v1/articles/", json.dumps(payload or self.payload),
            content_type="application/json", **(headers or self.headers),
        )

    def test_auth_options_and_validation(self):
        self.assertEqual(self.client.get("/api/bot/v1/options/").status_code, 403)
        self.assertEqual(self.client.get("/api/bot/v1/options/", HTTP_AUTHORIZATION="Bearer wrong").status_code, 403)
        options = self.client.get("/api/bot/v1/options/", **self.headers).json()
        self.assertEqual(options["version"], 1)
        self.assertIn({"slug": "business", "name": "Business"}, options["categories"])
        invalid = {**self.payload, "category_slugs": ["missing"]}
        self.assertEqual(self.create(invalid).status_code, 400)
        self.assertEqual(self.client.get(f"/api/bot/v1/articles/{self.external_id}/", **self.headers).status_code, 404)
        with override_settings(BOT_INTEGRATION_TOKEN=""):
            self.assertEqual(self.client.get("/api/bot/v1/options/", **self.headers).status_code, 403)

    def test_idempotent_draft_recovery_and_publication(self):
        first = self.create()
        self.assertEqual(first.status_code, 201)
        self.assertEqual(first.json()["status"], "draft")
        self.assertEqual(self.create().json(), first.json())
        self.assertEqual(Article.objects.filter(bot_external_id=self.external_id).count(), 1)
        detail = self.client.get(f"/api/bot/v1/articles/{self.external_id}/", **self.headers)
        self.assertEqual(detail.json(), first.json())
        conflict = self.create({**self.payload, "title": "Different"})
        self.assertEqual(conflict.status_code, 409)
        publish_url = f"/api/bot/v1/articles/{self.external_id}/publish/"
        published = self.client.post(publish_url, **self.headers)
        self.assertEqual(published.json()["status"], "published")
        self.assertEqual(published.json()["url"], "https://consultation.bg/en/insights/" + Article.objects.get(bot_external_id=self.external_id).slug)
        timestamp = Article.objects.get(bot_external_id=self.external_id).published_at
        self.assertEqual(self.client.post(publish_url, **self.headers).json(), published.json())
        self.assertEqual(Article.objects.get(bot_external_id=self.external_id).published_at, timestamp)
        article = Article.objects.get(bot_external_id=self.external_id)
        self.assertEqual(article.status, PublishStatus.PUBLISHED)
        self.assertEqual(list(article.categories.values_list("slug", flat=True)), ["business"])
        site = self.client.get("/api/site-data/?lang=en").json()
        self.assertTrue(any(item["id"] == article.slug and item["category"] == "Business" for item in site["insights"]))

    def test_image_upload_and_repeat(self):
        self.create()
        image = Image.new("RGB", (2, 2), "red")
        stream = BytesIO()
        image.save(stream, "PNG")
        path = f"/api/bot/v1/articles/{self.external_id}/image/"
        def upload(data):
            boundary = "test-boundary"
            body = (f"--{boundary}\r\nContent-Disposition: form-data; name=\"image\"; filename=\"photo.png\"\r\n"
                    "Content-Type: image/png\r\n\r\n").encode() + data + f"\r\n--{boundary}--\r\n".encode()
            return self.client.put(path, body, content_type=f"multipart/form-data; boundary={boundary}", **self.headers)
        self.assertEqual(upload(b"bad").status_code, 400)
        first = upload(stream.getvalue())
        self.assertEqual(first.status_code, 200, first.content)
        self.assertTrue(first.json()["image_url"].startswith("https://consultation.bg/media/articles/images/"))
        self.assertEqual(upload(stream.getvalue()).json(), first.json())
        self.client.post(f"/api/bot/v1/articles/{self.external_id}/publish/", **self.headers)
        self.assertEqual(upload(stream.getvalue()).status_code, 409)
        site = self.client.get("/api/site-data/?lang=en").json()
        self.assertTrue(any(item["imageUrl"].startswith("/media/articles/images/") for item in site["insights"]))

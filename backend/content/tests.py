import json
import tempfile
from datetime import timedelta
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import Client, TestCase, override_settings
from django.utils import timezone

from content.ai_insights import call_openrouter_for_article, recent_article_topics
from content.models import Article, PublishStatus


ADMIN_HEADERS = {"HTTP_X_ADMIN_API_TOKEN": "test-admin-token"}
TINY_PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
    b"\x08\x04\x00\x00\x00\xb5\x1c\x0c\x02\x00\x00\x00\x0bIDATx\xdac\xfc"
    b"\xff\x1f\x00\x03\x03\x02\x00\xef\xbf\xa7\xdb\x00\x00\x00\x00IEND\xaeB`\x82"
)


class FakeOpenRouterResponse:
    def __init__(self, content, finish_reason="stop"):
        self.content = content
        self.finish_reason = finish_reason
        self.text = json.dumps(self.json())

    def json(self):
        return {
            "choices": [
                {
                    "finish_reason": self.finish_reason,
                    "message": {"content": self.content},
                }
            ]
        }

    def raise_for_status(self):
        return None


@override_settings(ADMIN_API_TOKEN="test-admin-token", MEDIA_ROOT=tempfile.mkdtemp())
class AdminResourceCreateTests(TestCase):
    def setUp(self):
        self.client = Client()

    def post_resource(self, resource_key, payload):
        return self.client.post(
            f"/api/admin/resources/{resource_key}/",
            data=json.dumps(payload),
            content_type="application/json",
            **ADMIN_HEADERS,
        )

    def assert_created(self, resource_key, payload):
        response = self.post_resource(resource_key, payload)
        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.json().get("id"))
        return response.json()

    def test_article_multipart_image_upload(self):
        response = self.client.post(
            "/api/admin/resources/articles/",
            data={
                "slug": "multipart-image-upload-article",
                "title_en": "Multipart Image Upload Article",
                "title_bg": "Multipart Image Upload Article BG",
                "author": "",
                "image": SimpleUploadedFile("tiny.png", TINY_PNG, content_type="image/png"),
                "published_at": "2026-07-24T10:00",
                "excerpt_en": "Excerpt",
                "excerpt_bg": "Excerpt BG",
                "lead_en": "Lead",
                "lead_bg": "Lead BG",
                "body_sections_en": "<p>Article body</p>",
                "body_sections_bg": "<p>Article body BG</p>",
                "hashtags_en": '["admin"]',
                "status": "draft",
                "is_featured": False,
            },
            **ADMIN_HEADERS,
        )

        self.assertEqual(response.status_code, 201, response.content)
        article = Article.objects.get(slug="multipart-image-upload-article")
        self.assertTrue(article.image.name.startswith("articles/images/"))
        self.assertTrue(response.json()["image"].startswith("/media/articles/images/"))

    def test_can_create_all_editable_admin_resources(self):
        category = self.assert_created(
            "categories",
            {
                "name_en": "Admin Test Category",
                "name_bg": "Admin Test Category BG",
                "slug": "admin-test-category",
                "kind": "article",
                "is_active": True,
            },
        )
        organization = self.assert_created(
            "organizations",
            {
                "name": "Admin Test Organization",
                "slug": "admin-test-organization",
                "logo": "",
                "website_url": "https://example.com",
                "description": "Created by admin tests.",
                "is_active": True,
            },
        )
        expert = self.assert_created(
            "experts",
            {
                "slug": "admin-test-expert",
                "name_en": "Admin Test Expert",
                "name_bg": "Admin Test Expert BG",
                "role_en": "Advisor",
                "role_bg": "Advisor BG",
                "company_name_en": "Admin Test Organization",
                "company_name_bg": "Admin Test Organization BG",
                "organization": organization["slug"],
                "photo": "",
                "quote_en": "Quote",
                "quote_bg": "Quote BG",
                "bio_en": "<p>Bio</p>",
                "bio_bg": "<p>Bio BG</p>",
                "expertise_en": '["Strategy"]',
                "industries_en": '["SaaS"]',
                "languages_en": '["English"]',
                "experience_en": '[{"role":"Advisor","company":"Example","period":"2026"}]',
                "experience_bg": '[{"role":"Advisor BG","company":"Example","period":"2026"}]',
                "analytics": '{"consultations":"1"}',
                "is_available_for_consultation": True,
                "service_consultation": True,
                "service_consultation_price": "120",
                "service_mentorship": False,
                "service_mentorship_price": "",
                "service_project_analysis": False,
                "service_project_analysis_price": "",
                "is_featured": False,
                "is_active": True,
            },
        )
        self.assert_created(
            "articles",
            {
                "slug": "admin-test-article",
                "title_en": "Admin Test Article",
                "title_bg": "Admin Test Article BG",
                "author": expert["slug"],
                "image": "http://localhost:8000/media/articles/images/from-admin.jpg",
                "published_at": "2026-07-23T10:00",
                "excerpt_en": "Excerpt",
                "excerpt_bg": "Excerpt BG",
                "lead_en": "Lead",
                "lead_bg": "Lead BG",
                "body_sections_en": "<p>Article body</p>",
                "body_sections_bg": "<p>Article body BG</p>",
                "hashtags_en": '["admin"]',
                "status": "draft",
                "is_featured": False,
            },
        )
        self.assert_created(
            "events",
            {
                "slug": "admin-test-event",
                "category": category["slug"],
                "title_en": "Admin Test Event",
                "title_bg": "Admin Test Event BG",
                "price": "Free",
                "expert": expert["slug"],
                "organizers": f'["{organization["slug"]}"]',
                "partners": f'["{organization["slug"]}"]',
                "short_description_en": "Short",
                "short_description_bg": "Short BG",
                "detail_description_en": "<p>Details</p>",
                "detail_description_bg": "<p>Details BG</p>",
                "starts_at": "2026-07-24T09:30",
                "location": "Sofia",
                "tags": '["admin"]',
                "image": "",
                "status": "draft",
            },
        )
        self.assert_created(
            "learn_materials",
            {
                "slug": "admin-test-material",
                "title_en": "Admin Test Material",
                "title_bg": "Admin Test Material BG",
                "cover_image": "",
                "tags": '["admin"]',
                "author": expert["slug"],
                "excerpt_en": "Excerpt",
                "excerpt_bg": "Excerpt BG",
                "preview_pdf_file": "",
                "pdf_file": "",
                "category": category["slug"],
                "price": "49",
                "badge": "PDF",
                "is_trending": False,
                "status": "draft",
                "published_at": "2026-07-23T10:00",
            },
        )
        self.assert_created(
            "projects",
            {
                "slug": "admin-test-project",
                "code": "ADM-1",
                "title_en": "Admin Test Project",
                "title_bg": "Admin Test Project BG",
                "author": expert["slug"],
                "author_name": "",
                "image": "",
                "published_at": "2026-07-23T10:00",
                "excerpt_en": "Excerpt",
                "excerpt_bg": "Excerpt BG",
                "lead_en": "Lead",
                "lead_bg": "Lead BG",
                "body_sections_en": "<p>Project body</p>",
                "body_sections_bg": "<p>Project body BG</p>",
                "hashtags_en": '["admin"]',
                "status": "draft",
                "is_featured": False,
            },
        )
        self.assert_created(
            "after_sales_services",
            {
                "ticket_number": "AS-001",
                "customer_name": "Admin Test Customer",
                "customer_email": "customer@example.com",
                "customer_phone": "+359 88 000 0000",
                "company_name": "Admin Test Organization",
                "product_or_service": "Consultation",
                "purchase_reference": "SALE-001",
                "subject": "Follow-up support request",
                "issue_description": "Customer needs help after purchase.",
                "resolution_notes": "Initial contact planned.",
                "status": "new",
                "priority": "medium",
                "assigned_to": "Support team",
                "opened_at": "2026-07-24T10:00",
                "due_date": "2026-07-31",
                "resolved_at": "",
            },
        )

    def test_article_absolute_media_url_is_saved_as_relative_file_name(self):
        response = self.post_resource(
            "articles",
            {
                "slug": "absolute-media-url-article",
                "title_en": "Absolute Media URL Article",
                "title_bg": "Absolute Media URL Article BG",
                "author": "",
                "image": "https://example.com/media/articles/images/from-prod.jpg",
                "published_at": "2026-07-23T10:00",
                "excerpt_en": "Excerpt",
                "excerpt_bg": "Excerpt BG",
                "lead_en": "Lead",
                "lead_bg": "Lead BG",
                "body_sections_en": "<p>Article body</p>",
                "body_sections_bg": "<p>Article body BG</p>",
                "hashtags_en": '["admin"]',
                "status": "draft",
                "is_featured": False,
            },
        )

        self.assertEqual(response.status_code, 201, response.content)
        article = Article.objects.get(slug="absolute-media-url-article")
        self.assertEqual(article.image.name, "articles/images/from-prod.jpg")
        self.assertEqual(response.json()["image"], "/media/articles/images/from-prod.jpg")

    def test_article_validation_error_names_the_invalid_field(self):
        response = self.post_resource(
            "articles",
            {
                "slug": "invalid-article",
                "title_en": "",
                "title_bg": "",
                "author": "",
                "image": "",
                "published_at": "2026-07-23T10:00",
                "excerpt_en": "Excerpt",
                "excerpt_bg": "Excerpt BG",
                "lead_en": "Lead",
                "lead_bg": "Lead BG",
                "body_sections_en": "<p>Article body</p>",
                "body_sections_bg": "<p>Article body BG</p>",
                "hashtags_en": '["admin"]',
                "status": "draft",
                "is_featured": False,
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Title", response.json()["error"])
        self.assertIn("cannot be blank", response.json()["error"])

    def test_article_illegal_local_file_path_returns_clear_error(self):
        response = self.post_resource(
            "articles",
            {
                "slug": "illegal-file-path-article",
                "title_en": "Illegal File Path Article",
                "title_bg": "Illegal File Path Article BG",
                "author": "",
                "image": r"C:\Users\admin\Desktop\image.jpg",
                "published_at": "2026-07-23T10:00",
                "excerpt_en": "Excerpt",
                "excerpt_bg": "Excerpt BG",
                "lead_en": "Lead",
                "lead_bg": "Lead BG",
                "body_sections_en": "<p>Article body</p>",
                "body_sections_bg": "<p>Article body BG</p>",
                "hashtags_en": '["admin"]',
                "status": "draft",
                "is_featured": False,
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("File path must be an uploaded file", response.json()["error"])


class AIInsightTopicContextTests(TestCase):
    def test_recent_article_topics_uses_last_50_published_articles(self):
        now = timezone.now()
        for index in range(55):
            Article.objects.create(
                title=f"Published Topic {index}",
                slug=f"published-topic-{index}",
                excerpt=f"Published excerpt {index}",
                lead=f"Published lead {index}",
                body={
                    "sections": [{"title": f"Strategic angle {index}", "paragraphs": ["Body"]}],
                    "hashtags": [f"Tag{index}"],
                },
                published_at=now + timedelta(minutes=index),
                status=PublishStatus.PUBLISHED,
            )
        Article.objects.create(
            title="Draft Topic",
            slug="draft-topic",
            excerpt="Draft excerpt",
            published_at=now + timedelta(days=1),
            status=PublishStatus.DRAFT,
        )

        topics = recent_article_topics()

        self.assertEqual(len(topics), 50)
        self.assertEqual(topics[0]["title"], "Published Topic 54")
        self.assertEqual(topics[-1]["title"], "Published Topic 5")
        self.assertNotIn("Draft Topic", [topic["title"] for topic in topics])
        self.assertEqual(topics[0]["section_titles"], ["Strategic angle 54"])
        self.assertEqual(topics[0]["hashtags"], ["Tag54"])

    @override_settings(OPENROUTER_API_KEY="test-key")
    def test_call_openrouter_repairs_unterminated_json_string(self):
        malformed_json = '{"en":{"title":"Broken","excerpt":"Open string'
        repaired_json = json.dumps({
            "en": {
                "title": "Repaired Article",
                "excerpt": "Excerpt",
                "lead": "Lead",
                "sections": [{"title": "Section", "paragraphs": ["Paragraph"]}],
                "hashtags": ["Business"],
            },
            "bg": {
                "title": "Repaired Article BG",
                "excerpt": "Excerpt BG",
                "lead": "Lead BG",
                "sections": [{"title": "Section BG", "paragraphs": ["Paragraph BG"]}],
                "hashtags": ["Business"],
            },
            "image": {
                "headline": "Repaired Article",
                "visual_prompt": "Business editorial scene",
            },
        })

        with patch(
            "content.ai_insights.requests.post",
            side_effect=[
                FakeOpenRouterResponse(malformed_json),
                FakeOpenRouterResponse(repaired_json),
            ],
        ):
            payload = call_openrouter_for_article()

        self.assertEqual(payload["en"]["title"], "Repaired Article")
        self.assertEqual(payload["bg"]["title"], "Repaired Article BG")

    @override_settings(OPENROUTER_API_KEY="test-key")
    def test_call_openrouter_continues_cut_off_json_before_repair(self):
        partial_json = '{"en":{"title":"Continued Article","excerpt":"Open'
        continuation = (
            ' string","lead":"Lead","sections":[{"title":"Section","paragraphs":["Paragraph"]}],'
            '"hashtags":["Business"]},'
            '"bg":{"title":"Continued Article BG","excerpt":"Excerpt BG","lead":"Lead BG",'
            '"sections":[{"title":"Section BG","paragraphs":["Paragraph BG"]}],"hashtags":["Business"]},'
            '"image":{"headline":"Continued Article","visual_prompt":"Business editorial scene"}}'
        )

        with patch(
            "content.ai_insights.requests.post",
            side_effect=[
                FakeOpenRouterResponse(partial_json, finish_reason="length"),
                FakeOpenRouterResponse(continuation),
            ],
        ):
            payload = call_openrouter_for_article()

        self.assertEqual(payload["en"]["title"], "Continued Article")
        self.assertEqual(payload["en"]["excerpt"], "Open string")

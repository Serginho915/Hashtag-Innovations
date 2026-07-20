from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from django.views.static import serve
from content.views import (
    admin_login,
    admin_resource_create,
    admin_resource_detail,
    admin_resources,
    chat_reply,
    create_checkout_session,
    checkout_status,
    site_data,
    stripe_webhook,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/admin/login/", admin_login),
    path("api/admin/resources/", admin_resources),
    path("api/admin/resources/<str:resource_key>/", admin_resource_create),
    path("api/admin/resources/<str:resource_key>/<int:record_id>/", admin_resource_detail),
    path("api/chat/", chat_reply),
    path("api/payments/checkout/", create_checkout_session),
    path("api/payments/checkout-status/", checkout_status),
    path("api/payments/webhook/stripe/", stripe_webhook),
    path("api/site-data/", site_data),
    path("api-auth/", include("rest_framework.urls")),
    path("media/<path:path>", serve, {"document_root": settings.MEDIA_ROOT}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from content.views import admin_login


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/admin/login/", admin_login),
    path("api-auth/", include("rest_framework.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

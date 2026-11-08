
from account_auth import urls as auth_urls
from django.urls import include, path, re_path
from wishlist import urls as wishlist_api_urls

from .views import (
    InstanceBackupView,
    InstanceSettingsView,
    VersionCheckView,
    health_view,
    modules_view,
    protected_media_view,
)

urlpatterns = [
    path("api/health", health_view, name="health"),
    path("api/modules/", modules_view, name="modules"),
    path("api/instance-settings/backup/", InstanceBackupView.as_view(), name="instance-backup"),
    path("api/instance-settings/version-check/", VersionCheckView.as_view(), name="version-check"),
    path("api/instance-settings/", InstanceSettingsView.as_view(), name="instance-settings"),
    # Deactivate the admin panel for security reasons, maybe activate it later (optionally!)
    #path('admin/', admin.site.urls),
    
    path("api/", include(wishlist_api_urls)),
    path("api/", include(auth_urls)),
]

urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', protected_media_view, name='media'),
]

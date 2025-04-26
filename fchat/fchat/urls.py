from django.urls import path, include
from django.contrib import admin
from apps.chat.views import ChatListView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', include('apps.chat.urls')),
    path('accounts/', include('apps.accounts.urls')),
]

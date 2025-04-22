from django.urls import path
from .views import ChatListView, CreateEventView


app_name = "chat"

urlpatterns = [
    path('<uuid:group_uuid>/', ChatListView.as_view(), name='group'),
    path('add/', CreateEventView.as_view(), name='group-add'),
]

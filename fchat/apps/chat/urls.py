from django.urls import path
from .views import MainPageTemplateView, ChatListView, CreateEventView, CreateGroupView


app_name = "chat"

urlpatterns = [
    path('main/', MainPageTemplateView.as_view(), name='main-page'),
    path('<uuid:group_uuid>/', ChatListView.as_view(), name='group'),
    path('add/', CreateEventView.as_view(), name='group-add'),
    path('create/', CreateGroupView.as_view(), name='group-create'),
]

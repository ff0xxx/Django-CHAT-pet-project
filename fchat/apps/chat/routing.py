from django.urls import path
from  .consumers import ChatConsumer


websocket_urlpatterns = [
    path('ws/chat/<uuid:group_uuid>/', ChatConsumer.as_asgi()),
]
from django.urls import path
from .views import ChatAPIView , ping

urlpatterns = [
    path('chat/', ChatAPIView.as_view(), name='chat_api'),
    path("ping", ping),
]

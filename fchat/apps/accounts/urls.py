from django.urls import path
from django.contrib.auth.views import LogoutView

from .views import LoginUser


app_name = "accounts"

urlpatterns = [
    path("", LoginUser.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),

    # To Be Continued
    # path("register/", RegisterView.as_view(), name="signup"),

]
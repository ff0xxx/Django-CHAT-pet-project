from django.urls import path
from django.contrib.auth.views import (LogoutView, PasswordChangeView, PasswordChangeDoneView, PasswordResetView,
                                       PasswordResetConfirmView, PasswordResetCompleteView, PasswordResetDoneView)
from .views import LoginUser, RegistrationView


app_name = "accounts"

urlpatterns = [
    path("login/", LoginUser.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("register/", RegistrationView.as_view(), name="register"),

# Не бэкендерское это дело, столько времени на html&css спускать
# поэтому переопределено только 2 шаблона - просто показать, что могу.
    path("password_change/",        PasswordChangeView.as_view(template_name='registration/password_change.html'), name="password_change"),
    path("password_change/done/",   PasswordChangeDoneView.as_view(), name="password_change_done"),
    path("password_reset/",         PasswordResetView.as_view(template_name='registration/password_reset.html'), name="password_reset"),
    # FIXME: password_reset - email isn't send
    path("password_reset/done/",    PasswordResetDoneView.as_view(), name="password_reset_done"),
    path("reset/<uid64>/<token>/",  PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    path("reset/done/",             PasswordResetCompleteView.as_view(), name="password_reset_complete"),
]

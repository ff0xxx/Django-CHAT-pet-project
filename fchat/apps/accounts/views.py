from django.urls import reverse
from django.contrib.auth.views import LoginView
from django.contrib.auth.views import AuthenticationForm


class LoginUser(LoginView):
    template_name = 'chat/login.html'
    form_class = AuthenticationForm

    def get_success_url(self):
        return reverse('chat:main-page')


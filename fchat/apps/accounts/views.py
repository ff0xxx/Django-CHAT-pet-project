from django.urls import reverse
from django.contrib.auth.views import LoginView
from django.contrib.auth.views import AuthenticationForm
from django.contrib.auth import get_user_model
from django.views.generic import CreateView
from django.urls import reverse_lazy

from .forms import RegistrationForm


class LoginUser(LoginView):
    template_name = 'accounts/login.html'
    form_class = AuthenticationForm

    def get_success_url(self):
        return reverse('chat:main-page')


User = get_user_model()

class RegistrationView(CreateView):
    form_class = RegistrationForm
    template_name = 'accounts/registration.html'
    success_url = reverse_lazy('accounts:login')

    def form_valid(self, form):
        response = super().form_valid(form)
        # can add: email send
        return response
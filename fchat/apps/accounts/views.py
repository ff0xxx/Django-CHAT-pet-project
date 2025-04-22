from django.urls import reverse
from django.contrib.auth.views import LoginView
from django.contrib.auth.views import AuthenticationForm


class LoginUser(LoginView):
    template_name = 'chat/index.html'
    form_class = AuthenticationForm

    def get_success_url(self):
        user_group = self.request.user.user_groups.first()
        return reverse('chat:group', kwargs={'group_uuid': user_group.uuid})


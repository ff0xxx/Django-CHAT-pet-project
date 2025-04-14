from django.urls import reverse
from django.contrib.auth.views import LoginView
from django.contrib.auth.views import AuthenticationForm


class LoginUser(LoginView):
    template_name = 'chat/index.html'
    form = AuthenticationForm

    def get_success_url(self):
        return reverse('group', args=[self.request.user.user_groups.get(id=1).uuid])
    

# To Be Continued

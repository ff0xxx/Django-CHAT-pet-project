from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.views.generic.list import ListView
from django.views.generic import View, TemplateView, CreateView
from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json

from .models import Group


class MainPageTemplateView(LoginRequiredMixin, TemplateView):
    template_name = 'chat/base.html'

    def get_context_data(self,  *args, **kwargs):
            context = super().get_context_data()
            context['group_list'] = self.request.user.user_groups.all()
            return context
    

@method_decorator(login_required, name="dispatch")
class ChatListView(ListView):
    model = Group
    template_name = 'chat/room.html'
    context_object_name = 'group_list'
    
    def get_queryset(self,  *args, **kwargs):
        return self.request.user.user_groups.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group = Group.objects.get(uuid=self.kwargs['group_uuid'])
        context['current_group'] = group
        return context
    

class CreateEventView(LoginRequiredMixin, View):
    def post(self, request):
        # Парсим JSON вручную, т.к. это обычный View
        try:
            data = json.loads(request.body)
            group_uuid = data['uuid']
        except (json.JSONDecodeError, KeyError):
            return JsonResponse({
                'status': 'error',
                'message': 'Invalid request data'
            }, status=400)

        group = get_object_or_404(Group, uuid=group_uuid)
        
        try:
            group.add_user_to_group(request.user)
            return JsonResponse({
                'message': 'You joined to the group',
                'redirect_url': reverse('chat:group', kwargs={'group_uuid': group_uuid})
            })
        except ValidationError as e:
            return JsonResponse({
                'message': str(e)
            }, status=400)
        
    def delete(self, request):
        data = json.loads(request.body)
        group_uuid = data['uuid']

        group = get_object_or_404(Group, uuid=group_uuid)

        try:
            group.remove_user_from_group(request.user)
            
            return JsonResponse({
                'message': 'You left the group',
                'redirect_url': reverse('chat:main-page'),
            }) 
        except ValidationError as e:
            return JsonResponse({
                'message': str(e)
            }, status=400)
        

User = get_user_model()

class CreateGroupView(LoginRequiredMixin, CreateView):
    model = Group
    fields = '__all__'
    template_name = 'chat/create_group.html'

    def get_context_data(self,  *args, **kwargs):
            context = super().get_context_data()
            context['group_list'] = self.request.user.user_groups.all()
            context['users']= User.objects.all()
            return context
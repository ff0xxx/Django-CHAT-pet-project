from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.views.generic.list import ListView
from django.views.generic import View
from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.http import JsonResponse
import json

from .models import Group


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
        try:
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
                    'status': 'success',
                    'message': 'You joined to the group',
                    'redirect_url': reverse('group', kwargs={'group_uuid': group_uuid})
                })
            except ValidationError as e:
                return JsonResponse({
                    'status': 'error',
                    'message': str(e)
                }, status=400)
                
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': 'Server error'
            }, status=500)
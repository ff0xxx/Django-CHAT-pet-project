from django.views.generic.list import ListView

from .models import Group


class ChatListView(ListView):
    model = Group
    template_name = 'chat/room.html'
    context_object_name = 'group_list'
    
    def get_queryset(self):
        group_list = self.request.user.user_groups.all()
        return super().get_queryset()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        group_uuid = self.kwargs['group_uuid']
        group_name = Group.objects.get(uuid=group_uuid)
        context['group_name'] = group_name
        context['group_uuid'] = group_uuid
        context['current_user'] = self.request.user
        return context
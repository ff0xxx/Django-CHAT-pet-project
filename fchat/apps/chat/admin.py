from django.contrib import admin
from .models import Group, Message, Event


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('uuid', 'name') 

# admin.site.register(Message)
admin.site.register(Event)

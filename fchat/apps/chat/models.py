from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse
import uuid


User = get_user_model()

class Group(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=28)
    members = models.ManyToManyField(User, related_name='user_groups')

    def __str__(self):
        return f"{self.name} - {len(self.members.all())}"
    
    def get_absolute_url(self):
        return reverse("room", args=[str(self.uuid)])
    
    def add_user_to_group(self, user: User):
        pass

    def remove_user_from_group(self, user: User):
        pass


class Message(models.Model):
    author = models.ForeignKey(to=User, on_delete=models.DO_NOTHING)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(to=Group, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.group} - {self.author}: {self.content}\n{self.timestamp}"


class Event(models.Model):
    CHOICES = [
        ('Leave', 'leave'),
        ('Join', 'join'),
    ]

    type = models.CharField(max_length=10, choices=CHOICES)
    description = models.TextField(editable=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(to=User, on_delete=models.DO_NOTHING)
    group = models.ForeignKey(to=Group, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.description = f"{self.user} {self.type} the {self.group.name} group"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.description
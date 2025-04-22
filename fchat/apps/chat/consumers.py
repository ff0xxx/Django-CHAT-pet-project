from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_uuid = str(self.scope['url_route']['kwargs']['group_uuid'])
        self.room_group_uuid = f'chat_{self.group_uuid}'
        
        user = self.scope['user']
        print(f'Connection attempt by user: {user}, group: {self.group_uuid}')

        if isinstance(user, AnonymousUser):
            print('Rejected: Anonymous user')
            await self.close()
            return

        # Добавляем в группу ДО принятия соединения
        await self.channel_layer.group_add(
            self.room_group_uuid,
            self.channel_name
        )
     
        await self.accept()
        print(f'Accepted connection for {user} in group {self.group_uuid}') # переделать в logging

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_uuid,
            self.channel_name
        )
        print(f'Disconnected from {self.group_uuid}, code: {close_code}')

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            user = self.scope['user']
            
            await self.channel_layer.group_send(
                self.room_group_uuid,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender': str(user.username)
                }
            )
        except Exception as e:
            print(f'Error processing message: {e}')
            await self.close()

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender']
        }))
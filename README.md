# 🚀 Чат на Django
### 📌 с использованием:
- Django Channels (WebSockets)
- Redis (сервер для брокера сообщений)
- Асинхронная обработка сообщений

### ⚙️ Установка и запуск

1. Клонировать репозиторий
```
git clone https://github.com/ff0xxx/Django-CHAT-pet-project.git
cd .\fchat\
```
2. Установить зависимости
```
pip -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```
3. Применить миграции  
`python manage.py migrate`  
   и создать суперпользователя  
`python manage.py createsuperuser`  
4. Запустить Redis (redis-server, в wsl, например)
```
sudo service redis-server start
( sudo service redis-server status )
```
5. Запустить сервер
```
python manage.py runserver
```

### 🧭 Функционал чата

1️⃣ **Переходите на** `localhost:8000/accounts/login/` **и вводите свои username & password**

![image](https://github.com/user-attachments/assets/48324e5d-ccb3-4af3-ac17-0ed1a7a4884e)

2️⃣ **Вы на main-page с отображением приветствия и списка ваших чатов (слева)**

![image](https://github.com/user-attachments/assets/e1448668-303b-42c0-b0ff-a5c7c978cdc7)

3️⃣ **Про группы**  

Если вы только запустили проект:
1) Нажмите на желтую кнопочку (Create Group)
2) Укажите название и выберите участников
   ![image](https://github.com/user-attachments/assets/604b7768-7744-421b-8d06-04cc3f37e2dd)

Если с вами поделились UUID существующей группы, просто: 
1) Нажмите зеленую кнопочку (Add new Group)
2) Впишите UUID в единственное поле формы
   ![image](https://github.com/user-attachments/assets/13382656-bede-4766-945d-2f256fca080f)


4️⃣ **Общайтесь!** :)

![image](https://github.com/user-attachments/assets/a1a48b01-a4e4-497e-bdcc-456c20feb647)


5️⃣ **Дополнительно можно изучить**

- Аутентификация через Django
- Left the Group
- Работа с админкой

... продолжение следует

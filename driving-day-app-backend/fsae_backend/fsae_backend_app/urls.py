from django.urls import path
from .views import user_registration

urlpatterns = [
    path('user-registration/', user_registration, name='user-registration'),
]
from django.urls import path
from .views import driver_profiles

urlpatterns = [
    path('driver-profiles/', driver_profiles, name='driver-profiles'),
]
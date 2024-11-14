from django.urls import path
from .views import user_registration, upload_ld
from .views import driver_profiles

urlpatterns = [
    path('user-registration/', user_registration, name='user-registration'),
    path('upload-data/', upload_ld, name='upload-data'),
    path('driver-profiles/', driver_profiles, name='driver-profiles'),
]
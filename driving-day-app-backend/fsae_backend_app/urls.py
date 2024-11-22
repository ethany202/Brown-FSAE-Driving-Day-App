from django.urls import path
from .views import upload_ld, driver_profiles

urlpatterns = [
    path('upload-data/', upload_ld, name='upload-data'),
    path('driver-profiles/', driver_profiles, name='driver-profiles'),
]
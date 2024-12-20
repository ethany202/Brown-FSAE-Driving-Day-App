from django.urls import path
from .views import upload_ld, add_driver, get_driver_profiles

urlpatterns = [
    path('upload-data/', upload_ld, name='upload-data'),
    path('driver-profiles/', add_driver, name='driver-profiles'),
    path('driver-data/', get_driver_profiles, name='driver-data'),
]
from django.urls import path
from .views import upload_files, add_driver, get_driver_profiles

urlpatterns = [
    path('upload-files/', upload_files, name='upload-files'),
    path('driver-profiles/', add_driver, name='driver-profiles'),
    path('driver-data/', get_driver_profiles, name='driver-data'),
]
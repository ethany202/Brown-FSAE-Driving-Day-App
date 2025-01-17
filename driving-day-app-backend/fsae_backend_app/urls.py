from django.urls import path
from .views import upload_files_call, add_driver_call, get_all_drivers_call

urlpatterns = [
    path('upload-files/', upload_files_call, name='upload-files'),
    path('driver-profiles/', add_driver_call, name='driver-profiles'),
    path('driver-data/', get_all_drivers_call, name='driver-data'),
    # path('user-registration/', user_registration, name='user-registration'),
    path('all-data/', get_all_data, name='all-data'),
]
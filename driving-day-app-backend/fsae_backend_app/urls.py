from django.urls import path
from .views import upload_ld, add_driver, get_driver_profiles

urlpatterns = [
    # path('user-registration/', user_registration, name='user-registration'),
    path('upload-data/', upload_ld, name='upload-data'),
    path('driver-profiles/', driver_profiles, name='driver-profiles'),
    path('get-all-data/', get_all_data, name='get-all-data'),
]
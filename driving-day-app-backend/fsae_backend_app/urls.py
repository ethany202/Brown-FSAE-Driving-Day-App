from django.urls import path
from .views import upload_ld
from .views import driver_profiles
from .views import get_all_data

urlpatterns = [
    # path('user-registration/', user_registration, name='user-registration'),
    path('upload-data/', upload_ld, name='upload-data'),
    path('driver-profiles/', driver_profiles, name='driver-profiles'),
    path('get-all-data/', get_all_data, name='get-all-data'),
]
from django.urls import path
from .views import user_registration, upload_ld

urlpatterns = [
    path('user-registration/', user_registration, name='user-registration'),
    path('upload-data/', upload_ld, name='upload-data'),
]
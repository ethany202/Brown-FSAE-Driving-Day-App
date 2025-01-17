from django.urls import path
from .views import upload_files_call, add_driver_call, get_all_drivers_call, get_all_data

urlpatterns = [
    # POST Requests (indicated by /)
    path('upload-files/', upload_files_call, name='upload-files'),
    path('add-driver/', add_driver_call, name='add-driver'),

    # GET Requests (indicated by NO /)
    path('all-drivers', get_all_drivers_call, name='all-drivers'),
    path('all-data', get_all_data, name='all-data'),
]
from django.urls import path
from .views import *

urlpatterns = [
    # POST Requests (indicated by /)
    path('upload-files/', upload_files_call, name='upload-files'),
    path('add-driver/', add_driver_call, name='add-driver'),

    # GET Requests (indicated by NO /)
    path('all-drivers', get_all_drivers_call, name='all-drivers'),
    path('all-data', get_all_data, name='all-data'),
    path('general-run-data', get_general_run_data_call, name='general-run-data'),
    path('specific-run-data', get_specific_run_data_call, name='specific-run-data')
]
from django.urls import path
from .views import *

urlpatterns = [
    # POST Requests (indicated by /)
    path('upload-files/', upload_files_call, name='upload-files'),
    path('add-driver/', add_driver_call, name='add-driver'),
    path('add-issue/', add_issue_call, name='add-issue'),
    
    # PUT Requests
    path('update-issue/<str:issue_id>/', update_issue_call, name='update-issue'),
    
    # DELETE Requests
    path('delete-issue/<str:issue_id>/', delete_issue_call, name='delete-issue'),

    # GET Requests (indicated by NO /)
    path('all-drivers', get_all_drivers_call, name='all-drivers'),
    path('general-run-data', get_general_run_data_call, name='general-run-data'),
    path('specific-run-data', get_specific_run_data_call, name='specific-run-data'),
    path('specific-run-data-paginated', get_specific_run_data_paginated_call, name='specific-run-data-paginated'),
    path('all-issues', get_all_issues_call, name='all-issues'),
    path('get-csrf-token', get_csrf_token, name='get-csrf-token'),
]
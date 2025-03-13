from django.http import JsonResponse
from django.http import HttpResponse
from rest_framework.decorators import api_view
from .ld_parser.main import process_and_upload_ld_files, process_and_upload_inputted_ld_file
import json
from .firebase.firestore import *

# TODO: Create Standard JSON Response Body

def homepage(request):
    return JsonResponse({
        "message": "Welcome to the FSAE Backend!",
        "status": "success"
    })

@api_view(['POST'])
def add_driver_call(request):
    """
    Handles user registration via a POST request.

    This endpoint allows a new user to create and register an account on the platform.
    The request must contain the necessary user details (e.g., username, password, 
    email) in the request body. Upon successful registration, it returns a JSON response 
    with a success message. If the request method is not POST, it returns an error message.

    Methods:
    - POST: Register a new user with the provided data.

    Returns:
    - JSON response with a success message if the registration is successful.
    - JSON response with an error message if the request method is not POST.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            add_driver(data)
            return JsonResponse({"message": "User registration successful!"}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
        
    return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)

@api_view(['GET'])
def get_all_drivers_call(request):
    """
    Get all drivers with optional height/weight filtering
    """
    if request.method == 'GET':
        try:
            height = request.GET.get('height')
            weight = request.GET.get('weight')
            
            filters = {}
            if int(height) != -1:
                filters['height'] = float(height)
            if int(weight) != -1:
                filters['weight'] = float(weight)
            
            drivers = get_all_drivers(filters=filters if filters else None)
            
            return JsonResponse({
                "drivers": drivers,
                "message": "Drivers retrieved successfully"
            }, status=200)
            
        except Exception as e:
            return JsonResponse({
                "error": str(e),
                "message": "Error retrieving drivers"
            }, status=400)
            
    return JsonResponse({
        "error": "Invalid request method. Use GET."
    }, status=400)



@api_view(['POST'])
def upload_files_call(request):
    """
    Handle the GET request to upload and process LD files.

    This view function processes LD files from the specified input directory, converts
    them into DataFrames, and saves the resulting data as CSV files in the output directory.
    After saving, each CSV file is uploaded to Firestore for further use.

    Request Method:
        GET: Triggers the `process_and_upload_ld_files` function to convert and upload
        all LD files in the input directory. 

    Returns:
        JsonResponse: A JSON response indicating success or failure of the upload process.
        - On Success: Returns a JSON message with HTTP 200 status indicating that the data upload
          was successful.
        - On Failure: Returns an error message with HTTP 400 status if a non-GET request is made.

    Example:
        GET /api/upload-data/ -> Triggers the upload process and returns success status.

    """
    if request.method == 'POST':

        try:
            # Pull Metadata:
            all_files = request.FILES

            data_file = all_files.get('dataFile')
            media_files = list(all_files.keys())
            media_files.pop(0)

            # Driver ID
            driver_id = request.POST.get('driverId')
            # Run Date
            run_date=request.POST.get('runDate')
            # Title for Run
            run_title = request.POST.get('runTitle')

            # Upload to S3
            # Obtain Image URLs:
            process_and_upload_inputted_ld_file(driver_id, run_date, run_title, data_file)
            return JsonResponse({"message": "Successfully uploaded LD data to database!"}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)
    
@api_view(['GET'])
def get_all_data(request):
    """
    Handle the GET request to retrieve all data from Firestore.

    This view function retrieves all data from Firestore and returns it as a JSON response.

    Request Method:
        GET: Retrieves all data from Firestore.

    Returns:
        JsonResponse: A JSON response containing all data from Firestore.

    Example:
        GET /api/get-all-data/ -> Retrieves all data from Firestore.

    """
    return JsonResponse({"error": "Avoid fetching all data."}, status=500)


@api_view(['GET'])
def get_general_run_data_call(request):

    if request.method == 'GET':
        try:
            data = get_simplified_run_data(filter_limit=10)
            
            return JsonResponse({"recentRuns": data}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=400)



@api_view(['GET'])
def get_specific_run_data_call(request):
    if request.method == 'GET':
        try:
            document_name = request.GET.get('runTitle')
            categories = request.GET.get('categories')

            categories_list = categories.strip().split(",")

            data = get_specific_document_data(document_name, categories_list)
            key_points = {
                "Highest Coolant Temperature": "-100"
            }

            return JsonResponse({"runDataPoints": data, "keyPoints": key_points}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
    
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=400)

@api_view(['POST'])
def add_issue_call(request):
    """
    Handles adding a new issue via a POST request.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            result = add_issue(data)
            
            if result is None:
                return JsonResponse({"error": "Failed to create issue"}, status=400)
                
            return JsonResponse({
                "message": "Issue created successfully!",
                "issue_id": result["issue_id"]
            }, status=201)
            
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
        
    return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)

@api_view(['GET'])
def get_all_issues_call(request):
    """
    Retrieves all issues with optional filtering.
    """
    if request.method == 'GET':
        try:
            filters = {}
            driver_filter = request.GET.get('driver')
            subsystem_filter = request.GET.get('subsystem')
            
            if driver_filter:
                filters['driver'] = driver_filter
            if subsystem_filter:
                filters['subsystem'] = subsystem_filter
            
            issues = get_all_issues(filters if filters else None)
            
            if issues is None:
                return JsonResponse({"error": "Failed to retrieve issues"}, status=500)
            
            return JsonResponse({
                "issues": issues,
                "message": "Issues retrieved successfully",
                "count": len(issues)
            }, status=200)
            
        except Exception as e:
            return JsonResponse({
                "error": f"An unexpected error occurred: {str(e)}"
            }, status=500)
    
    return JsonResponse({"error": "Invalid request method. Use GET."}, status=400)

@api_view(['PUT'])
def update_issue_call(request, issue_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))
            result = update_issue(issue_id, data)
            
            if result is None:
                return JsonResponse({"error": "Failed to update issue or issue not found"}, status=400)
                
            return JsonResponse({
                "message": "Issue updated successfully!",
                "issue_id": result["issue_id"]
            }, status=200)
            
        except Exception as e:
            return JsonResponse({"error": f"An unexpected error occurred: {str(e)}"}, status=500)
        
    return JsonResponse({"error": "Invalid request method. Use PUT."}, status=400)
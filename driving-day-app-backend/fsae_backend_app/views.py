from django.http import JsonResponse
from django.http import HttpResponse
from rest_framework.decorators import api_view
from .firebase.firestore import add_user, get_all_users
from .ld_parser.main import process_and_upload_ld_files
import json

def homepage():
    return JsonResponse({
        "message": "Welcome to the FSAE Backend!",
        "status": "success"
    })

@api_view(['POST'])
def add_driver(request):
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
        print("Successfully connected!")
        data = json.loads(request.body.decode('utf-8'))
        add_user(data)
        return JsonResponse({"message": "User registration successful!"}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)

@api_view(['GET'])
def get_driver_profiles(request):
    """
    Get all drivers with optional height/weight filtering
    """
    if request.method == 'GET':
        try:
            height = request.GET.get('height')
            weight = request.GET.get('weight')
            
            filters = {}
            if height:
                filters['height'] = float(height)
            if weight:
                filters['weight'] = float(weight)
            
            drivers = get_all_users(filters=filters if filters else None)
            
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
def upload_files(request):
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

        # Pull LD file
        all_files = request.FILES
        data_file = all_files.get('data_file')
        print(data_file)

        # Pull media files
        # process_and_upload_ld_files()
        print("Successfully connected!")
        return JsonResponse({"message": "Successfully uploaded LD data to database!"}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .firebase.firestore import add_user
from .ld_parser.main import process_and_upload_ld_files
import json

@api_view(['POST'])
def driver_profiles(request):
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
def upload_ld(request):
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
    if request.method == 'GET':
        process_and_upload_ld_files()
        print("Successfully connected!")
        return JsonResponse({"message": "Successfully uploaded LD data to database!"}, status=200)
    else:
        return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)
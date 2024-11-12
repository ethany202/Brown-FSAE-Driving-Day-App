from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .firebase.firestore import add_user
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
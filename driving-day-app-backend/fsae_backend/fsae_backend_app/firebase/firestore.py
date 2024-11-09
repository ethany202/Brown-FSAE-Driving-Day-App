"""
firestore.py

This module is strictly for all Firestore database interactions in the project. 
It provides functions to interact with the Firestore database, such as adding, 
retrieving, and managing user data or other collections. 

Any logic or operations related to Firestore must be placed in this module to 
maintain separation of concerns and ensure a modular codebase.
"""
from .firebase import firebase_app
from firebase_admin import firestore
import csv

db = firestore.client()

def add_user(data):
    """
    Adds a user document to the 'driver-profiles' collection in Firestore.

    Args:
        data (dict): A dictionary containing user information to be stored.
                     Example: {"name": "John Doe", "email": "john@example.com"}

    Raises:
        ValueError: If the input is not a dictionary or if it's empty.

    Returns:
        dict: A reference to the added Firestore document on success.
        None: If an error occurs during the operation.
    """
    try:
        if not isinstance(data, dict):
            raise ValueError("Input must be a dictionary.")

        if not data:
            raise ValueError("Input dictionary cannot be empty.")

        doc_ref = db.collection('driver-profiles').add(data)
        print(f"Document added successfully with ID: {doc_ref[1].id}")
        return doc_ref

    except ValueError as ve:
        print(f"ValueError: {ve}")
        return None

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def upload_csv_to_firestore(csv_file_path):
    """
    Uploads data from a CSV file to a Firestore subcollection.

    Args:
        csv_file_path (string): A string representing the path to the csv file.

    Returns:
        None
    """
    main_collection = 'ecu-data'
    main_document = 'sample run'
    subcollection = 'data'

    main_doc_ref = db.collection(main_collection).document(main_document)
    subcollection_ref = main_doc_ref.collection(subcollection)
    
    with open(csv_file_path, mode='r') as file:
        reader = csv.DictReader(file)
        
        second_counter = 0
        for row in reader:
            doc_id = f'second_{second_counter:04}'
            subcollection_ref.document(doc_id).set(row)
            print(f"{doc_id} uploaded")
            second_counter += 1
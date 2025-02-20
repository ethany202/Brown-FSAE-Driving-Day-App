"""
firestore.py

This module is strictly for all Firestore database interactions in the project. 
It provides functions to interact with the Firestore database, such as adding, 
retrieving, and managing user data or other collections. 

Any logic or operations related to Firestore must be placed in this module to 
maintain separation of concerns and ensure a modular codebase.
"""
import csv
import os
from .firebase import firebase_app
from firebase_admin import firestore
from django.core.paginator import Paginator

db = firestore.client()
# Declares the MAX number of entries to read into Firebase
# 1200 seconds = 20 minutes
max_entries_counter = 1200

def add_driver(data):
    """
    Adds a driver document to the 'driver-profiles' collection in Firestore.

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

        main_db = db.collection('driver-profiles')
        existing_driver_query = main_db.where('firstName', '==', data['firstName']).where('lastName', '==', data['lastName']).stream()
        driver_exists = any(existing_driver_query)
        if not driver_exists:
            main_db.add(data)
            print(f"Driver profile for {data['firstName']} {data['lastName']} added.")
        else:
            print(f"Driver profile for {data['firstName']} {data['lastName']} already exists.")


    except ValueError as ve:
        print(f"ValueError: {ve}")
        return None

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def get_all_drivers(filters=None):
    """
    Retrieves all users from the 'driver-profiles' collection with optional filtering.
    
    Args:
        filters (dict, optional): Dictionary of filter conditions.
    
    Returns:
        list: List of dictionaries containing user data
    """
    try:
        main_db = db.collection('driver-profiles')
        query = main_db
        
        if filters:
            for key, value in filters.items():
                if value is not None:
                    query = query.where(key, '==', value)
        
        docs = query.stream()
        
        drivers = []
        for doc in docs:
            driver_data = doc.to_dict()
            driver_data['driverId'] = doc.id
            drivers.append(driver_data)
                        
        return drivers
    
    except Exception as e:
        print(f"An error occurred while retrieving users: {e}")
        return []

def upload_csv_to_firestore(csv_file_path):
    """
    Uploads data from a CSV file to a Firestore subcollection within a document named after the CSV file.

    Args:
        csv_file_path (str): The path to the CSV file to be uploaded.

    Returns:
        None

    Example:
        upload_csv_to_firestore('/path/to/data.csv')
    """
    # Document referencing to correctly insert into Firebase hierarchy
    # ecu-data/`file_name`/`data`/(actual data)
    main_collection = 'ecu-data'
    subcollection = 'data'

    file_name = os.path.splitext(os.path.basename(csv_file_path))[0]
    main_document = file_name
    
    main_doc_ref = db.collection(main_collection).document(main_document)

    main_doc_ref.set({
        "run-date": file_name[0:10]
    })

    subcollection_ref = main_doc_ref.collection(subcollection)
    
    try:

        # Opening and iterating through CSV file
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            document_counter = 0
            
            for row_number, row in enumerate(reader):
                # If the number of rows EXCEEDS the max_entries_counter
                if document_counter >= max_entries_counter:
                    print(f"Reached the max entry number: {document_counter}")
                    break

                # When the CSV file stops giving complete values
                if any(value == '' for value in row.values()):
                    print(f"Stopping processing at row {row_number}.")
                    break
                
                doc_id = f'data_{document_counter:04}'
                subcollection_ref.document(doc_id).set(row)
                
                # Print every 100 documents uploaded
                if document_counter % 100 == 0: 
                    print(f"Document {doc_id} uploaded to '{subcollection}' subcollection.")
                document_counter += 1

        print(f"All data from {csv_file_path} has been successfully uploaded to Firestore under document '{main_document}'.")
    
    except FileNotFoundError:
        print(f"Error: The file {csv_file_path} does not exist.")
    
    except Exception as e:
        print(f"An error occurred while uploading CSV to Firestore: {e}")
        
def upload_csv_columns_as_documents(csv_file_path):
    """
    Uploads data from a CSV file to Firestore where each column in the CSV is a document, and each
    row is stored as a field within that document.

    Args:
        csv_file_path (str): The path to the CSV file to be uploaded.

    Returns:
        None

    Example:
        upload_csv_columns_as_documents('/path/to/data.csv')
    """
    # Define the main collection and subcollection structure
    main_collection = 'ecu-data'
    subcollection = 'columns'

    file_name = os.path.splitext(os.path.basename(csv_file_path))[0]
    main_document = file_name
    
    main_doc_ref = db.collection(main_collection).document(main_document)
    subcollection_ref = main_doc_ref.collection(subcollection)
    
    try:
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            headers = reader.fieldnames
                        
            for row_number, row in enumerate(reader):
                for header in headers:
                    field_name = f'second_{row_number:04}'
                    subcollection_ref.document(header).set({field_name: row[header]}, merge=True)
                if row_number % 100 == 0:
                    print(f"Processed row {row_number}")

        print(f"All data from {csv_file_path} has been successfully uploaded to Firestore under document '{main_document}' with each column as a document.")
    
    except FileNotFoundError:
        print(f"Error: The file {csv_file_path} does not exist.")
    
    except Exception as e:
        print(f"An error occurred while uploading CSV to Firestore: {e}")


def get_specific_document_data(document_name, categories_list):
    try:
        # Access the 'ecu-data' collection and the 'sample_test' document
        document_query = db.collection('ecu-data')\
            .document(document_name)\
                .collection('data')
                    
        if len(categories_list) > 0:
            categories_formatted = [f'`{c}`' for c in categories_list]
            document_query = document_query.select(categories_formatted)
        # Stream all documents in the 'data' sub-collection
        document_data = document_query.stream()
        
        data_list = []
        for doc in document_data:
            # Append the document data along with the document ID
            doc_data = doc.to_dict()
            doc_data['id'] = doc.id  # Include the document ID if needed
            data_list.append(doc_data)
                
        return data_list

    except Exception as e:
        print(f"An unexpected error occurred when pulling specific document data: {e}")
        return None 


def get_simplified_run_data(filter_limit=10, filtered_date=None, filtered_driver=None):
    """
    Retrieves run-relevant data in a simplified format from the Firestore database,
    as demonstrated in the /run-data path. To support pagination, the 10 most recent entries are taken

    Args:
        filtered_date (datetime): Corresponds to the datetime to filter the run data by
        filtered_driver (str): Corresponds the str to filter the run data by

    Returns:
        List of all simplified results

    """
    try:
        # Access the 'ecu-data' collection and the 'sample_test' document
        filtered_docs_query = db.collection('ecu-data')\
            .order_by('`run-date`', direction=firestore.Query.DESCENDING)\
                .limit(filter_limit)

        filtered_docs = filtered_docs_query.stream()

        data_list = []
        for doc in filtered_docs:
            doc_data = doc.to_dict()
            doc_data['id'] = doc.id
            data_list.append(doc_data)
            # data_list.append(get_specific_document_data(doc.id))
        
        return data_list
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

def get_user_by_email(email):
    """
    Retrieves a user document from Firestore by email.

    Args:
        email (str): The user's email address

    Returns:
        dict: User data if found
        None: If user not found or error occurs
    """
    try:
        user_doc = db.collection('users').document(email).get()
        if user_doc.exists:
            return user_doc.to_dict()
        return None
    except Exception as e:
        print(f"Error retrieving user: {e}")
        return None

def update_user_last_login(email):
    """
    Updates the user's last login timestamp.

    Args:
        email (str): The user's email address
    """
    try:
        db.collection('users').document(email).update({
            'lastLogin': firestore.SERVER_TIMESTAMP
        })
    except Exception as e:
        print(f"Error updating last login: {e}")


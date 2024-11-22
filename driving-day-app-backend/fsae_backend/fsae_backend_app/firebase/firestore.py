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
    subcollection_ref = main_doc_ref.collection(subcollection)
    
    try:
        # Opening and iterating through CSV file
        with open(csv_file_path, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            document_counter = 0
            
            for row_number, row in enumerate(reader):
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


def get_all_data_rows_from_firestore():
    """
    Retrieves all documents from the 'data' sub-collection in Firestore.

    Returns:
        list: A list of dictionaries containing all data from the 'data' sub-collection.
        None: If an error occurs during the operation.
    """
    try:
        # Access the 'ecu-data' collection and the 'sample_test' document
        sample_test_ref = db.collection('ecu-data').document('sample_test')
        
        # Access the 'data' sub-collection
        data_subcollection = sample_test_ref.collection('data')
        
        # Stream all documents in the 'data' sub-collection
        all_data_docs = data_subcollection.stream()
        
        data_list = []
        for doc in all_data_docs:
            # Append the document data along with the document ID
            doc_data = doc.to_dict()
            doc_data['id'] = doc.id  # Include the document ID if needed
            data_list.append(doc_data)
        
        return data_list

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


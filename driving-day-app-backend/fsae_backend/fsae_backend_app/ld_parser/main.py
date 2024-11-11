import os
from django.conf import settings
from .data_containers import ldData
from ..firebase.firestore import upload_csv_to_firestore
from ..firebase.firebase import firebase_app
from firebase_admin import firestore

db = firestore.client()

def process_and_upload_ld_files():
    '''
        Process LD (Logical Data) files in the data directory, convert them to CSV format, and upload the CSV files to Firestore.

    This function performs the following steps:
    '''
    data_path = settings.DATA_DIR
    os.makedirs(data_path, exist_ok=True)

    for filename in os.listdir(data_path):
        file_path = os.path.join(data_path, filename)

        # Checking if file has already been stored in the database
        main_collection = 'ecu-data'
        main_document = os.path.splitext(filename)[0]
        main_doc_ref = db.collection(main_collection).document(main_document)
        doc_snapshot = main_doc_ref.get()
        print("Document exists:", doc_snapshot.exists)

        if doc_snapshot.exists:
            print(f"Document '{main_document}' already exists in Firestore. Skipping upload.")
            return
        # Parsing LD into CSV
        l = ldData.fromfile(file_path)
        df = l.to_dataframe()

        csv_filename = os.path.join(data_path, os.path.splitext(filename)[0] + '.csv')
        df.to_csv(csv_filename, index=False)
        print(f"Data saved to {csv_filename}")
        
        # Uploading CSV to Firebase
        upload_csv_to_firestore(csv_filename)
        print(f"Data from {csv_filename} uploaded to Firestore")

if __name__ == '__main__':
    process_and_upload_ld_files()

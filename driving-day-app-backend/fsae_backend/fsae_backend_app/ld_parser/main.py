import os
from .data_containers import ldData
from ..firebase.firestore import upload_csv_to_firestore
from django.conf import settings
import glob

def process_and_upload_ld_files():
    ''''
    '''
    data_path = settings.DATA_DIR

    os.makedirs(data_path, exist_ok=True)

    for filename in os.listdir(data_path):
        file_path = os.path.join(data_path, filename)
        
        l = ldData.fromfile(file_path)
        df = l.to_dataframe()
        
        ld_file = glob.glob(os.path.join(data_path, '*.ld'))
        if ld_file:
            csv_filename = os.path.join(data_path, os.path.splitext(filename)[0] + '.csv')
            df.to_csv(csv_filename, index=False)
            print(f"Data saved to {csv_filename}")
        else:
            print("LD file already exists")
        
        upload_csv_to_firestore(csv_filename)
        print(f"Data from {csv_filename} uploaded to Firestore")

if __name__ == '__main__':
    process_and_upload_ld_files()

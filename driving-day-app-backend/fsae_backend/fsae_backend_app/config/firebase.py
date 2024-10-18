# config/firebase.py
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Path to your service account key
cred = credentials.Certificate("config/serviceAccountKey.json")

# Initialize the Firebase app
firebase_app = firebase_admin.initialize_app(cred)

# Firestore and Auth instances
db = firestore.client()
auth_instance = auth

# Export these objects to use elsewhere in your Django app
__all__ = ["db", "auth_instance"]

import boto3
from django.conf import settings
import os


def upload_to_s3(file_obj, s3_key, bucket_name):
    s3 = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )

    s3.upload_fileobj(file_obj, bucket_name, s3_key)

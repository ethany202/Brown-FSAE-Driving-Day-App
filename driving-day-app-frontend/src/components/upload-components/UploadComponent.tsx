import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { postFiles } from '../../api/api';

registerPlugin(FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileValidateType);
registerPlugin(FilePondPluginFileValidateSize);

export default function UploadComponent() {

    const [uploadedData, setUploadedData] = useState<any>()
    const [uploadedMedia, setUploadedMedia] = useState<any>([])

    const submitUpload = async () => {
        const fileData = {
            dataFile: uploadedData,
            mediaFiles: uploadedMedia
        }
        // const result = await postFiles(fileData)

        window.location.href = "/run-data"
    }

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="w-3/4 py-4 justify-center">
                <div className="text-center p-2">
                    <p>Upload CSV or LD File</p>
                </div>
                <FilePond
                    allowMultiple={true}
                    onupdatefiles={setUploadedData}
                    maxFiles={1}
                    name="files" />
            </div>

            <div className="w-3/4 py-4 justify-center">
                <div className="text-center p-2">
                    <p>Upload Media Files</p>
                </div>
                <FilePond
                    allowMultiple={true}
                    onupdatefiles={setUploadedMedia}
                    maxFiles={5}
                    name="files"
                    maxFileSize={"10MB"}
                    imagePreviewHeight={192}
                    imagePreviewMaxHeight={228}
                    acceptedFileTypes={["image/*", "video/*"]} />
            </div>

            <div className="flex justify-center py-8">
                <button onClick={submitUpload}>
                    <p>Upload Data</p>
                </button>
            </div>
        </div>
    )
}
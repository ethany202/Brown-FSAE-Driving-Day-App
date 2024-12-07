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

    const [uploadedData, setUploadedData] = useState<File>()
    const [uploadedMedia, setUploadedMedia] = useState<File[]>([])

    const [runMonth, setRunMonth] = useState<string>("1")
    const [runDate, setRunDate] = useState<string>("1")
    const [runYear, setRunYear] = useState<string>("2024")
    const [runTitle, setRunTitle] = useState<string>("Shifting-Test-1")

    const handleDataFile = (newFiles: any) => {
        if (newFiles.length > 0) {
            setUploadedData(newFiles[0].file as File)
        }
    }

    const handleMediaFiles = (newFiles: any) => {
        let mediaFiles: File[] = []
        for (var i = 0; i < newFiles.length; i++) {
            mediaFiles.push(newFiles[i].file as File)
        }
        setUploadedMedia(mediaFiles)
    }

    const submitUpload = async () => {
        const formData = new FormData();

        if (uploadedData) {
            formData.append('data_file', uploadedData);
        }
        if (uploadedMedia) {
            for (var i = 0; i < uploadedMedia.length; i++) {
                formData.append(`media_file_${i}`, uploadedMedia[i])
            }
        }
        formData.append("runMonth", runMonth)
        formData.append("runDate", runDate)
        formData.append("runYear", runYear)
        formData.append("runTitle", runTitle)

        // TODO: Set screen to be unclickable while file is uploading

        const result = await postFiles(formData)
        if (result.status == 200) {
            window.location.href = "/run-data"
        }
        else {
            // Set error pop-up
        }
    }

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="w-3/4 py-4 justify-center">
                <div className="text-center p-2">
                    <p>Upload CSV or LD File</p>
                </div>
                <FilePond
                    allowMultiple={true}
                    onupdatefiles={handleDataFile}
                    maxFiles={1}
                    name="files"
                    server={null} />
            </div>

            <div className="w-3/4 py-4 justify-center">
                <div className="text-center p-2">
                    <p>Upload Media Files</p>
                </div>
                <FilePond
                    allowMultiple={true}
                    onupdatefiles={handleMediaFiles}
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
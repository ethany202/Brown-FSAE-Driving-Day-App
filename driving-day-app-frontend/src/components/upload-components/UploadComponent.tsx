import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

interface UploadComponentProps {
    maxFiles: number,
    fileDesc: string
}

export default function UploadComponent({ maxFiles, fileDesc }: UploadComponentProps) {

    const [uploadedFiles, setUploadedFiles] = useState<any>([])

    registerPlugin(FilePondPluginImagePreview);

    return (
        <div className="w-3/4 py-4 justify-center">
            <div className="text-center p-2">
                <p>{fileDesc}</p>
            </div>
            <FilePond
                allowMultiple={true}
                onupdatefiles={setUploadedFiles}
                maxFiles={maxFiles}
                name="files"
                imagePreviewHeight={192}
                imagePreviewMaxHeight={228}
                acceptedFileTypes={["ld", "csv"]} />
        </div>
    )
}
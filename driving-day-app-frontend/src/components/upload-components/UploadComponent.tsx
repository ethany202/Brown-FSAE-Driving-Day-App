import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import "react-datepicker/dist/react-datepicker.css";
import { postFiles, getAllDrivers } from '../../api/api';
import './UploadComponent.css';
import { Driver } from '../../utils/Driver';

registerPlugin(FilePondPluginImagePreview);
registerPlugin(FilePondPluginFileValidateType);
registerPlugin(FilePondPluginFileValidateSize);

export default function UploadComponent() {

    const [drivers, setDrivers] = useState<Driver[]>([])

    const [uploadedData, setUploadedData] = useState<File>()
    const [uploadedMedia, setUploadedMedia] = useState<File[]>([])

    // const [runMonth, setRunMonth] = useState<string>("")
    // const [runDate, setRunDate] = useState<string>("")
    // const [runYear, setRunYear] = useState<string>("")
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [runTitle, setRunTitle] = useState<string>("")
    const [driverId, setDriverId] = useState<string>("")

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

        // TODO: Do not submit unless LD file and Metadata is filled out
        if (uploadedData) {
            formData.append('data_file', uploadedData);
        }
        if (uploadedMedia) {
            for (var i = 0; i < uploadedMedia.length; i++) {
                formData.append(`media_file_${i}`, uploadedMedia[i])
            }
        }
        // formData.append("runMonth", runMonth)
        // formData.append("runDate", runDate)
        // formData.append("runYear", runYear)
        formData.append("runTitle", runTitle)
        formData.append("driverId", driverId)

        // TODO: Set screen to be unclickable while file is uploading

        const result = await postFiles(formData)
        if (result.status == 200) {
            window.location.href = "/run-data"
        }
        else {
            // Set error pop-up
        }
    }

    useEffect(() => {
        const fetchDrivers = async () => {
            const response = await getAllDrivers();
            setDrivers(response);
        };

        fetchDrivers();
    }, []);

    return (
        <div className="flex justify-center flex-col items-center">
            <div className="grid grid-cols-2 w-full justify-center items-center">
                <div className="flex flex-col justify-center items-center">
                    <div className="w-10/12 py-4 justify-center">
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

                    <div className="w-10/12 py-4 justify-center">
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
                </div>

                <div className="upload-metadata flex flex-col items-center w-full">

                    <p>
                        <input placeholder='Enter run title...' onChange={(event) => setRunTitle(event.target.value)}></input>
                    </p>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                    />
                    <p>
                        <select onChange={(event) => setDriverId(event.target.value)}>
                            <option value="">
                                Select Driver
                            </option>

                            {drivers && drivers.map(currentDriver => {
                                return (
                                    <option
                                        value={currentDriver.driverId}
                                        className="driver-option"
                                        key={currentDriver.driverId}>
                                        {currentDriver.firstName} {currentDriver.lastName}
                                    </option>
                                )
                            })}
                        </select>
                    </p>
                </div>
            </div>


            <div className="flex justify-center py-10">
                <button onClick={submitUpload}>
                    <p>Upload Data</p>
                </button>
            </div>
        </div >
    )
}
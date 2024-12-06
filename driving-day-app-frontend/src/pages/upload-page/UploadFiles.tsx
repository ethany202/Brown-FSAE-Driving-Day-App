import React, { useState, useEffect } from "react";
import UploadComponent from "../../components/upload-components/UploadComponent";

export default function UploadFiles({ }) {

    return (
        <div className="page-content-main">
            <div className="flex justify-center py-16 textxs/[24px]">
                <h1>Upload Data</h1>
            </div>

            { /** File input system */}
            <div className="flex justify-center flex-col items-center">
                <UploadComponent
                    fileDesc="Upload a CSV or LD file"
                    maxFiles={1} />

                <UploadComponent
                    fileDesc="Upload Images or Videos"
                    maxFiles={5} />
            </div>
        </div>
    )
}
import React, { useState, useEffect } from "react";
import UploadComponent from "../../components/upload-components/UploadComponent";

export default function UploadFiles({ }) {

    return (
        <div className="page-content-main">
            <div className="flex justify-center py-16">
                <h1>Upload Data</h1>
            </div>
            <UploadComponent />
        </div>
    )
}
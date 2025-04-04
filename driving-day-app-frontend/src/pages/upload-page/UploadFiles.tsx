import React, { useState, useEffect } from "react";
import UploadComponent from "../../components/upload-components/UploadComponent";
import PageBase from "../../components/base-component/PageBase";

export default function UploadFiles({ }) {

    return (
        <PageBase>
            <h1>Upload Data</h1>
            <UploadComponent />
        </PageBase>
    )
}
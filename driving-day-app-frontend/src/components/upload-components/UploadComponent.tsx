import React from 'react';
import * as FilePond from 'filepond';

export default function UploadComponent({ }) {

    const pond = FilePond.create({
        multiple: true,
        name: 'filepond'
    })


}
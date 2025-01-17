import React, { useState } from "react";
import Alert from 'react-bootstrap/Alert';

interface CustomAlertProps {
    variant: string,
    headingMsg: string,
    bodyMsg: string,
    onClose: (a: any, b: any) => void,
}

export default function CustomAlert({ variant, headingMsg, bodyMsg, onClose }: CustomAlertProps) {
    return (
        <Alert
            variant={variant}
            onClose={onClose}
            dismissible>
            <Alert.Heading>{headingMsg}</Alert.Heading>
            <p>{bodyMsg}</p>
        </Alert>

    )
}
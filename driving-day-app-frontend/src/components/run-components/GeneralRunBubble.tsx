import React, {useState, useEffect} from "react";
import './RunBubble.css';
import { Driver } from "../../utils/DriverType";

interface GeneralRunBubbleProps {
  runTitle: string,
  driver: Driver,
  onClick?: () => void;
}

export default function GeneralRunBubble({
  runTitle,
  driver,
  onClick,
}: GeneralRunBubbleProps) {

    const [runDate, setRunDate] = useState<string>("2025-01-01");
    
    const parseDate = () => {
        setRunDate(runTitle.substring(0, 10));
    }

    useEffect(() => {
        parseDate()
    }, [])

    return (
        <div
            className="font-face bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            onClick={onClick}
            role="button"
            tabIndex={0}
            >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100 flex-col">
            <span className="text-lg font-medium">
                <p>{runTitle}</p>
            </span>
            <div className="text-sm text-gray-600">
                <span className="mr-2">Driver: {driver.firstName} {driver.lastName}</span>
                <span>Date: {runDate}</span>
            </div>
        </div>
        {/**Replace with description of RUN "Test Coolant " */}
        <div className="flex flex-col">
            {/* <div
                className="flex justify-between items-center"
            >
                <span className="text-gray-600">Description</span>
                <span className="font-medium">YAYAYA</span>
            </div> */}
            <div>
                <span className="text-gray-600">Desc: </span>
                <span className="font-medium">Coolant Test</span>
            </div>
        </div>
        </div>
    );
};
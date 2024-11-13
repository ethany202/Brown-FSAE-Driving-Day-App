import React from "react";
import { Driver } from "./Driver";

const defaultDriverData: Driver[] = [
    { name: "John Doe", height: 180, weight: 75 },
    { name: "Jane Smith", height: 165, weight: 60 },
    { name: "Mike Brown", height: 170, weight: 68 },
    { name: "Emily Davis", height: 158, weight: 55 },
    { name: "Chris Johnson", height: 185, weight: 85 },
    { name: "Sarah Wilson", height: 162, weight: 58 },
];

export const SpecificDriverProfile = ({ driver }: { driver: Driver }) => (
    <div className="justify-center bg-white border rounded-lg shadow-lg flex flex-col items-center w-full m-8">
        <div className="rounded-full bg-orange-500 w-32 h-32 mb-6 flex items-center justify-center">
            {/* Placeholder for a profile image, replace with actual image if available */}
            <span className="text-3xl text-white">{driver.name[0]}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{driver.name}</h1>
        <p className="text-lg font-semibold text-gray-600">Driver</p>
        <div className="text-lg text-gray-700 mt-4">
            <p className="mb-2">
                <span className="font-semibold">Height:</span> {driver.height} cm
            </p>
            <p className="mb-2">
                <span className="font-semibold">Weight:</span> {driver.weight} kg
            </p>
        </div>
    </div>
);
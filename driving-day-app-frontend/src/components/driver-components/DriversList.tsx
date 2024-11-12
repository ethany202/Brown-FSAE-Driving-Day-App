// DriversList.tsx
import React, { useState, useEffect } from "react";
import { postDriverProfile } from "../../api/api";

interface Driver {
    firstName: string;
    lastName: string;
    height: number;
    weight: number;
    pedalBoxPos: number;
}

interface DriversListProps {
    allDrivers?: Driver[];
}

const defaultDriverData: Driver[] = [
    { firstName: "John", lastName: "Doe", height: 180, weight: 75, pedalBoxPos: 1 },
    { firstName: "Jane", lastName: "Smith", height: 165, weight: 60, pedalBoxPos: 2 },
    { firstName: "Mike", lastName: "Brown", height: 170, weight: 68, pedalBoxPos: 3 },
    { firstName: "Emily", lastName: "Davis", height: 158, weight: 55, pedalBoxPos: 4 },
    { firstName: "Chris", lastName: "Johnson", height: 185, weight: 85, pedalBoxPos: 5 },
    { firstName: "Sarah", lastName: "Wilson", height: 162, weight: 58, pedalBoxPos: 6 },
];


const SpecificDriverProfile = ({ driver }: { driver: Driver }) => (
    <div className="p-8 bg-white border rounded-lg shadow-lg w-full max-w-md flex flex-col items-center ml-8">
        <div className="rounded-full bg-orange-500 w-32 h-32 mb-6 flex items-center justify-center">
            {/* Placeholder for a profile image, replace with actual image if available */}
            <span className="text-3xl text-white">{driver.firstName[0]}</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{driver.firstName}</h1>
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

export default function DriversList({ allDrivers = defaultDriverData }: DriversListProps) {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    useEffect(() => {
        const postAllDriverProfiles = async () => {
            for (let i = 0; i < defaultDriverData.length; i++) {
                await postDriverProfile(defaultDriverData[i]);
            }
        };
        
        postAllDriverProfiles();
    }, []);    

    return (
        <div className="flex">
            {/* Table with driver list */}
            <div className="drivers-list-wrapper p-4 w-3/4 max-w-3xl">
                <table className="drivers-table w-full border-collapse">
                    <thead className="table-columns bg-gray-200">
                        <tr>
                            <th className="border p-4">Name</th>
                            <th className="border p-4">Height (cm)</th>
                            <th className="border p-4">Weight (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allDrivers.map((driver, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => setSelectedDriver(driver)} // Set selected driver on click
                            >
                                <td className="border p-4 text-blue-600 underline">{driver.firstName}</td>
                                <td className="border p-4">{driver.height}</td>
                                <td className="border p-4">{driver.weight}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Show profile on the right when a driver is selected */}
            {selectedDriver && (
                <div className="w-1/4 flex justify-center">
                    <SpecificDriverProfile driver={selectedDriver} />
                </div>
            )}
        </div>
    );
}

// DriversList.tsx
import React, { useState, useEffect } from "react";
import { Driver } from "./Driver";
import { SpecificDriverProfile } from "./SpecificDriverProfile";
import { postDriverProfile } from "../../api/api";

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
        <div className="drivers-list grid grid-cols-2">
            {/* Table with driver list */}
            <div className="drivers-list p-8 w-full">
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
            <div className="flex w-full">
                {selectedDriver ?
                    <SpecificDriverProfile driver={selectedDriver} />
                    : <SpecificDriverProfile driver={{ firstName: "(Select a Driver)", lastName: "", height: 0, weight: 0, pedalBoxPos: -1 }} />
                }
            </div>
        </div>
    );
}

// DriversList.tsx
import React, { useState } from "react";
import { Driver } from "./Driver";
import { SpecificDriverProfile } from "./SpecificDriverProfile";


interface DriversListProps {
    allDrivers?: Driver[];
}

const defaultDriverData: Driver[] = [
    { name: "John Doe", height: 180, weight: 75 },
    { name: "Jane Smith", height: 165, weight: 60 },
    { name: "Mike Brown", height: 170, weight: 68 },
    { name: "Emily Davis", height: 158, weight: 55 },
    { name: "Chris Johnson", height: 185, weight: 85 },
    { name: "Sarah Wilson", height: 162, weight: 58 },
];


export default function DriversList({ allDrivers = defaultDriverData }: DriversListProps) {
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

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
                                <td className="border p-4 text-blue-600 underline">{driver.name}</td>
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
                    : <SpecificDriverProfile driver={{ name: "(Select a Driver)", height: 0, weight: 0 }} />
                }
            </div>
        </div>
    );
}

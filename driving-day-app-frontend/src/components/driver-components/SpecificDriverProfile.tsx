// // SpecificDriverProfile.tsx
// import React from "react";
// import { useParams } from "react-router-dom";

// interface Driver {
//     name: string;
//     height: number;
//     weight: number;
// }

// const defaultDriverData: Driver[] = [
//     { name: "John Doe", height: 180, weight: 75 },
//     { name: "Jane Smith", height: 165, weight: 60 },
//     { name: "Mike Brown", height: 170, weight: 68 },
//     { name: "Emily Davis", height: 158, weight: 55 },
//     { name: "Chris Johnson", height: 185, weight: 85 },
//     { name: "Sarah Wilson", height: 162, weight: 58 },
// ];

// export default function SpecificDriverProfile() {
//     const { index } = useParams<{ index: string }>();
//     const driver = defaultDriverData[parseInt(index || "0", 10)]; // Get driver by index

//     if (!driver) return <div>Driver not found.</div>;

//     return (
//         <div className="p-8 bg-white border rounded-lg shadow-lg max-w-md mx-auto">
//             <h1 className="text-2xl font-bold mb-4 text-gray-800">{driver.name}'s Profile</h1>
//             <p className="text-lg"><strong>Height:</strong> {driver.height} cm</p>
//             <p className="text-lg"><strong>Weight:</strong> {driver.weight} kg</p>
//         </div>
//     );
// }
export { }

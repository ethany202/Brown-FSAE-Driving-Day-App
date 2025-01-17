import React, { useState, useEffect } from "react";
import { getAllDrivers, postDriverProfile } from "../../api/api";
import { Driver } from "../../utils/Driver";
import { SpecificDriverProfile } from "./SpecificDriverProfile";

const DriversList = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);

  // Place API call outside:
  const fetchDrivers = async () => {
    const response = await getAllDrivers()
    if (response.status === 200) {
      setDrivers(response.data)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Adding driver functionality
  //   const handleAddDriver = async (driver: Driver) => {
  //     try {
  //       const response = await postDriverProfile(driver);
  //       if (response.status === 200) {
  //         const updatedDrivers = await getAllDrivers();
  //         setDrivers(updatedDrivers);
  //       }
  //     } catch (err) {
  //       setError("Failed to add driver. Please try again.");
  //     }
  //   };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading drivers...
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Driver Profiles</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-8">
          <div className="drivers-list">
            <table className="w-full">
              <thead className="bg-gray-100 border-none">
                <tr>
                  <th className="border p-4 text-left">Name</th>
                  <th className="border p-4 text-left">Height (cm)</th>
                  <th className="border p-4 text-left">Weight (kg)</th>
                  <th className="border p-4 text-left">Pedal Box Position</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedDriver(driver)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="border p-4 text-[#24a0ed]">
                      {`${driver.firstName} ${driver.lastName}`}
                    </td>
                    <td className="border p-4">{driver.height}</td>
                    <td className="border p-4">{driver.weight}</td>
                    <td className="border p-4">{driver.pedalBoxPos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="selected-driver">
            {selectedDriver ? (
              <SpecificDriverProfile driver={selectedDriver} />
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                Select a driver to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriversList;

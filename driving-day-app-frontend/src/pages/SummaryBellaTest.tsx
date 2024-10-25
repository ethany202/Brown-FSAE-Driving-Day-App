import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar-components/Navbar";

const SummaryBellaTest = () => {
  const rides = ["Run 1", "Run 2", "Run 3", "Run 4"];

  return (
    <div className="flex flex-col items-center p-5 bg-gray-100 min-h-screen">
      <div className="bg-white p-5 rounded-lg shadow-md max-w-3xl w-full mt-5 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Available Runs
        </h2>
        <div className="flex flex-col items-center gap-4">
          {rides.map((ride, index) => (
            <Link
              key={index}
              to={`/run-${index + 1}`}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 w-full text-center"
            >
              {ride}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryBellaTest;

import React from 'react'
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar-components/Navbar';


const RunDetail = () => {
    const location = useLocation();
    const runNumber = location.state?.runNumber;

    return (
      <div className="flex min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 ml-64">
          <div className="p-6 max-w-7xl mx-auto">
            <h1 className="mb-6 text-2xl font-semibold">{`Welcome to ${runNumber ? `Run ${runNumber}` : "Run Page"}`}</h1>
  
            {/* <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="10/15/2024">Date: 10/15/2024</option>
              </select>
  
              <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="all">Driver: All</option>
              </select>
  
              <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
                <option value="engine">Filter by: Engine</option>
              </select>
            </div> */}
            
          </div>
        </div>
      </div>
    );
    
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-gray-600">
        {`Welcome to ${runNumber ? `Run ${runNumber}` : "Run Page"}`}
      </div>
    );
  };
  
  export default RunDetail;
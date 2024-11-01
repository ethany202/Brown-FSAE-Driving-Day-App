import React from 'react'
import { useLocation } from 'react-router-dom';


const RunPage = () => {
    const location = useLocation();
    const runNumber = location.state?.runNumber;
    
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-gray-600">
        {`Welcome to ${runNumber ? `Run ${runNumber}` : "Run Page"}`}
      </div>
    );
  };
  
  export default RunPage;
import React from 'react'
import { useParams } from 'react-router-dom';


const RunPage = () => {
    const { runId } = useParams();
  
    return (
      <div className="flex items-center justify-center h-screen text-2xl text-gray-600">
        {`Welcome to ${runId}`}
      </div>
    );
  };
  
  export default RunPage;
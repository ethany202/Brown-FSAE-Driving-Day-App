import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar-components/Navbar';
import RunBubble from '../components/run-components/runBubble';


interface Metric {
  label: string;
  value: string;
}

interface Run {
  runNumber: number;
  driver: string;
  date: string;
  metrics: Metric[];
}

const runs: Run[] = [
  {
    runNumber: 1,
    driver: "xxx",
    date: "10/15/2024",
    metrics: [
      { label: "Engine", value: "xxx" },
      { label: "Cooling", value: "xxx" },
      { label: "Metric 3", value: "xxx" },
      { label: "Metric 4", value: "xxx" },
      { label: "Metric 5", value: "xxx" },
      { label: "Metric 6", value: "xxx" },
    ],
  },
  {
    runNumber: 2,
    driver: "xxx",
    date: "10/15/2024",
    metrics: [
      { label: "Engine", value: "xxx" },
      { label: "Cooling", value: "xxx" },
      { label: "Metric 3", value: "xxx" },
      { label: "Metric 4", value: "xxx" },
      { label: "Metric 5", value: "xxx" },
      { label: "Metric 6", value: "xxx" },
    ],
  },
];


const RunDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const runNumber = location.state?.runNumber;

    const run = runs.find(r => r.runNumber === runNumber)
    return (
      <div className="flex min-h-screen bg-gray-50">

        <Navbar />

        <div className="flex-1 ml-64">
          <div className="p-6 max-w-7xl mx-auto">

          <h1 className="mb-6 text-2xl font-semibold">{`Run ${runNumber} Details`}</h1>

          {run ? (
            <RunBubble
              runNumber={run.runNumber}
              driver={run.driver}
              date={run.date}
              metrics={run.metrics}
              onClick={() => console.log(`Viewing details for Run ${run.runNumber}`)}
            />
          ) : (
            <p className="text-lg text-gray-600">Run details not found.</p>
          )}

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Go Back
          </button>


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
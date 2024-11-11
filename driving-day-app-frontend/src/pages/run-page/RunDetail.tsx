import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar-components/Navbar';
import RunBubble from '../../components/run-components/RunBubble';
import RunCoolantTemperatureChart from '../../components/run-components/RunCoolantTemperatureChart';

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

interface TemperatureDataPoint {
  time: number;          // Time in seconds
  temperature: number;    // Coolant temperature in °C
}

const coolantTemperatureData: TemperatureDataPoint[] = [
  { time: 0, temperature: 60 },
  { time: 1, temperature: 62 },
  { time: 2, temperature: 64 },
  { time: 3, temperature: 65 },
  { time: 4, temperature: 67 },
  { time: 5, temperature: 70 },
  { time: 6, temperature: 73 },
  { time: 7, temperature: 75 },
  { time: 8, temperature: 78 },
  { time: 9, temperature: 80 },
  { time: 10, temperature: 82 },
];

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
  const timeData = coolantTemperatureData.map((dataPoint) => dataPoint.time);
  const temperatureData = coolantTemperatureData.map((dataPoint) => dataPoint.temperature);
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

          <RunCoolantTemperatureChart timeData={timeData} temperatureData={temperatureData} />


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

};

export default RunDetail;
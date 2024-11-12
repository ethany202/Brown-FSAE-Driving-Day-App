import React from "react";
import RunBubble from "../../components/run-components/RunBubble";
import Navbar from "../../components/navbar-components/Navbar";
import { useNavigate } from "react-router-dom";

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

const RunsSummaryPage: React.FC = () => {
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

  const navigate = useNavigate();

  const handleRunClick = (runNumber: number) => {
    navigate(`/runs/${runNumber}`, { state: { runNumber } });
  };


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 ml-64">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="mb-6 text-2xl font-semibold">Summary of Runs</h1>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="10/15/2024">Date: 10/15/2024</option>
            </select>

            <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="all">Driver: All</option>
            </select>

            <select className="px-4 py-2 border border-gray-200 rounded-md bg-white min-w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="engine">Filter by: Engine</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
            {runs.map((run) => (
              <RunBubble
                key={run.runNumber}
                runNumber={run.runNumber}
                driver={run.driver}
                date={run.date}
                metrics={run.metrics}
                onClick={() => handleRunClick(run.runNumber)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunsSummaryPage;

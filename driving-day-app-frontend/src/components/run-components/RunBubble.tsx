import React from "react";

interface Metric {
  label: string;
  value: string;
}

interface RunBubbleProps {
  runNumber: number;
  driver: string;
  date: string;
  metrics: Metric[];
  onClick?: () => void;
}

const RunBubble: React.FC<RunBubbleProps> = ({
  runNumber,
  driver,
  date,
  metrics = [],
  onClick,
}) => {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <span className="text-lg font-medium">Run {runNumber}</span>
        <div className="text-sm text-gray-600">
          <span className="mr-2">Driver: {driver}</span>
          <span>Date: {date}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {metrics.map((metric, index) => (
          <div
            key={`${metric.label}-${index}`}
            className="flex justify-between items-center"
          >
            <span className="text-gray-600">{metric.label}</span>
            <span className="font-medium">{metric.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RunBubble;

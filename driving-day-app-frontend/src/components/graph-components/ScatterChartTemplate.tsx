import React, {useState, useEffect} from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  registerables
} from 'chart.js';
import { ReusableChartProps } from '../../utils/DataTypes';

// Register necessary components from Chart.js
ChartJS.register(...registerables);

// TODO: Make components reusable

const ScatterChartTemplate: React.FC<ReusableChartProps> = ({
    frequency,
    verticalLabel,
    horizontalLabel,
    chartPoints,
}) => {

  // Create array of first 20 points (similar to pagination)
  const [reducedPoints, setReducedPoints] = useState<number[]>()
  const [timePoints, setTimePoints] = useState<number[]>()

  const [sectionNum, setSectionNum] = useState<number>(0)

  const pointsPerSect = 20

  useEffect(() => {
    const startInd = sectionNum * pointsPerSect;

    // Generates array of size "pointsPerSect"
    setTimePoints(Array.from({length: pointsPerSect }, (v, i) => 1 * (i + (startInd + 1))))
    
    // Similar to python [n: m] syntax for array
    setReducedPoints(chartPoints.map(kvPair => kvPair[verticalLabel]))
  }, [verticalLabel])


  // Configuration for the chart data
  // TODO: Change styling
  const data = {
    labels: timePoints,
    datasets: [
      {
        // 'Coolant Temperature (°C)'
        label: verticalLabel,
        data: reducedPoints,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.3, // Line smoothness,
      },
    ],
  };

  // Configuration for the chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: horizontalLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: verticalLabel,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="py-6">
      {/* <Line data={data} options={options} /> */}
      <Scatter data={data} options={options}/>
    </div>
  )
};

export default ScatterChartTemplate;

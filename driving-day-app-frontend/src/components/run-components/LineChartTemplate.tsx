// RunCoolantTemperatureChart.tsx
import React, {useState, useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartDataProps } from '../../utils/DataTypes';
// import './ChartElements.css';

// Register necessary components from Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// interface LineChartProps {
//   timeData: number[]; // Array of time values (e.g., [1, 2, 3, 4, 5])
//   temperatureData: number[]; // Array of corresponding coolant temperatures


// }

const LineChartTemplate: React.FC<ChartDataProps> = ({
    frequency,
    categoryName,
    verticalLabel,
    horizontalLabel,
    chartPoints,
}) => {

  // Create array of first 20 points (similar to pagination), mulitplied by frequency
  const [reducedPoints, setReducedPoints] = useState<number[]>()
  const [timePoints, setTimePoints] = useState<number[]>()

  const [sectionNum, setSectionNum] = useState<number>(0)

  const pointsPerSect = 20

  useEffect(() => {
    const startInd = sectionNum * pointsPerSect;
    const endInd = (sectionNum + 1) * pointsPerSect + 1;

    // Generates array of size "pointsPerSect"
    setTimePoints(Array.from({length: pointsPerSect }, (v, i) => frequency * (i + (startInd + 1))))
    
    // Similar to python [n: m] syntax for array
    setReducedPoints(chartPoints.slice(startInd, endInd).map(kvPair => kvPair[categoryName]))
  }, [sectionNum])


  // Configuration for the chart data
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
      // title: {
      //   display: true,
      //   text: `${verticalLabel} Over ${horizontalLabel}`,
      // },
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

  return <Line data={data} options={options} />;
};

export default LineChartTemplate;

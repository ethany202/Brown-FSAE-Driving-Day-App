// RunCoolantTemperatureChart.tsx
import React from 'react';
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

// Register necessary components from Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

interface RunCoolantTemperatureChartProps {
  timeData: number[]; // Array of time values (e.g., [1, 2, 3, 4, 5])
  temperatureData: number[]; // Array of corresponding coolant temperatures
}

const RunCoolantTemperatureChart: React.FC<RunCoolantTemperatureChartProps> = ({
  timeData,
  temperatureData,
}) => {
  // Configuration for the chart data
  const data = {
    labels: timeData,
    datasets: [
      {
        label: 'Coolant Temperature (°C)',
        data: temperatureData,
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
      title: {
        display: true,
        text: 'Coolant Temperature Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (s)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default RunCoolantTemperatureChart;

import React, {useState, useEffect, useContext} from 'react';
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
  Filler
} from 'chart.js';
import { ReusableChartProps } from '../../utils/DataTypes';
import ChartContext from '../../components/contexts/ChartContext';

// Register necessary components from Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler);


const LineChartTemplate: React.FC<ReusableChartProps> = ({
    frequency,
    verticalLabel,
    horizontalLabel,
    chartPoints,
}) => {

  const { globalPageSize } = useContext(ChartContext)

  // Create array of first 20 points (similar to pagination)
  const [reducedPoints, setReducedPoints] = useState<number[]>()
  const [timePoints, setTimePoints] = useState<number[]>()

  const [sectionNum, setSectionNum] = useState<number>(0)


  useEffect(() => {

    const startInd = sectionNum * globalPageSize;

    // Generates array of size "pointsPerSect"
    setTimePoints(Array.from({length: globalPageSize }, (v, i) => frequency * (i + (startInd + 1))))
    
    setReducedPoints(chartPoints.map(kvPair => kvPair[verticalLabel]))
  }, [verticalLabel])



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
      <Line data={data} options={options} />
    </div>
  )
};

export default LineChartTemplate;

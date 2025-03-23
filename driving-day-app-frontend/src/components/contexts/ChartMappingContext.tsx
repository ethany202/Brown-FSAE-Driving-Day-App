import { ReusableChartProps } from '../../utils/DataTypes';
import { createContext } from 'react';

interface ChartMappingContextType {
    chartMapping: { [key: number]: React.FC<ReusableChartProps> }
}

const ChartMappingContext = createContext<ChartMappingContextType>(
    { chartMapping: {} }
)

export default ChartMappingContext;
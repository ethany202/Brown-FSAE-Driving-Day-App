import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar-components/Navbar";
import './Layout.css';
import { useState, useEffect } from "react";
import { Driver } from "../../utils/DriverType";
import { getAllDrivers } from "../../api/api";
import AppDataContext from "../../components/contexts/AppDataContext";
import ChartMappingContext from "../../components/contexts/ChartMappingContext";
import LineChartTemplate from '../../components/graph-components/LineChartTemplate';
import ScatterChartTemplate from '../../components/graph-components/ScatterChartTemplate';
import { ReusableChartProps } from "../../utils/DataTypes";

const chartMapping : { [key: number]: React.FC<ReusableChartProps> } = {
    0 : LineChartTemplate,
    1 : ScatterChartTemplate
}

export default function Layout() {

    const [drivers, setDrivers] = useState<Driver[]>([])
    const [isLoading, setLoading] = useState<boolean>(true)

    const fetchDrivers = async () => {
        const response = await getAllDrivers()
        if (response.status === 200) {
            setDrivers(response.data.drivers)
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchDrivers();
    }, [])

    return (
        <div className="wrapper">
            <ChartMappingContext.Provider value={{
                chartMapping: chartMapping
            }}>
                <AppDataContext.Provider value={{
                    drivers: drivers,
                    isLoading: isLoading
                }}>
                    <Navbar />
                    <Outlet />
                </AppDataContext.Provider>
            </ChartMappingContext.Provider>
            
        </div>

    )
}
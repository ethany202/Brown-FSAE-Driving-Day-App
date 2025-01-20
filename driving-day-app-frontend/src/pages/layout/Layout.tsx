import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar-components/Navbar";
import './Layout.css';
import { createContext, useState, useEffect } from "react";
import { Driver } from "../../utils/Driver";
import { getAllDrivers } from "../../api/api";
import AppDataContext from "../../components/contexts/AppDataContext";

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
            <AppDataContext.Provider value={{
                drivers: drivers,
                isLoading: isLoading
            }}>
                <Navbar />
                <Outlet />
            </AppDataContext.Provider>
        </div>

    )
}
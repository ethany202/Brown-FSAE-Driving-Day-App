import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar-components/Navbar";
import './Layout.css';

export default function Layout() {
    return (
        <div className="wrapper">
            <Navbar />
            <Outlet />
        </div>

    )
}
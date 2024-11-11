import { Outlet } from "react-router-dom";
import Navbar from "../../components/navbar-components/Navbar";

export default function Layout() {
    return (
        <div className="wrapper">
            <Navbar />
            <Outlet />
        </div>

    )
}
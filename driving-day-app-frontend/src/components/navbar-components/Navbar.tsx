import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/image.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div className="navbar-wrapper" style={{ backgroundColor: "#786C6C" }}>
      <div className="">
        <Link to="/">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </Link>
      </div>
      <ul className="navbar-buttons">
        <li>
          <Link to="/home" className="navbar-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/upload-files" className="navbar-link">
            Upload Files
          </Link>
        </li>
        <li>
          <Link to="/run-data" className="navbar-link">
            Run Data
          </Link>
        </li>
        <li>
          <Link to="/drivers" className="navbar-link">
            Drivers
          </Link>
        </li>
        <li>
          <Link to="/my-account" className="navbar-link">
            My Account
          </Link>
        </li>
        <li>
          <Link to="/issues" className="navbar-link">
            Issues
          </Link>
        </li>
      </ul>
      {/* <div className="">
        <Link to="/logout" className="logout">Logout</Link>
      </div> */}
    </div>
  );
};

export default Navbar;

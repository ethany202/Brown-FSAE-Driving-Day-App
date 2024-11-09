import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/image.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar-wrapper flex flex-col h-full text-white w-64 fixed" style={{ backgroundColor: "#786C6C" }}>
      <div className="flex items-center space-x-4 mb-10">
        <Link to="/"><img src={logo} alt="Logo" className="navbar-logo" /></Link>
      </div>
      <ul className="navbar-buttons">
        <li>
          <Link to="/run-summary" className="navbar-link">
            Home
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
      </ul>
      <div className="mt-auto">
        <Link to="/logout" className="logout">Logout</Link>
      </div>
    </div>
  );
};

export default Navbar;

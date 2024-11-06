import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/image.png';

const Navbar = () => {
  return (
    <nav className="flex flex-col h-full text-white p-4 w-64 fixed bg-[#786C6C]">
      <div className="flex items-center space-x-4 mb-10">
        <Link to="/" aria-label="Home">
          <img src={logo} alt="Logo" className="h-15" />
        </Link>
      </div>
      <ul className="flex flex-col space-y-4">
        <li>
          <Link 
            to="/run-summary" 
            className="block p-2 rounded hover:bg-[#9D2062] transition duration-200"
            aria-label="Run Summary"
          >
            Summary
          </Link>
        </li>
        <li>
          <Link 
            to="/run-data" 
            className="block p-2 rounded hover:bg-[#9D2062] transition duration-200"
            aria-label="Run Data"
          >
            Run Data
          </Link>
        </li>
        <li>
          <Link 
            to="/drivers" 
            className="block p-2 rounded hover:bg-[#9D2062] transition duration-200"
            aria-label="Drivers"
          >
            Drivers
          </Link>
        </li>
        <li>
          <Link 
            to="/my-account" 
            className="block p-2 rounded hover:bg-[#9D2062] transition duration-200"
            aria-label="My Account"
          >
            My Account
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        <Link 
          to="/logout" 
          className="text-red-500 hover:text-red-300 transition duration-200"
          aria-label="Logout"
        >
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

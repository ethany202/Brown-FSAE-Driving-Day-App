import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/image.png';

const Navbar = () => {
  return (
    <div className="flex flex-col h-full text-white p-4 w-64 fixed" style={{ backgroundColor: "#786C6C" }}>
      <div className="flex items-center space-x-4 mb-10">
        <Link to="/"><img src={logo} alt="Logo" className="h-15" /></Link>
      </div>
      <ul className="flex flex-col space-y-4">
        <li>
          <Link to="/run-summary" className="block p-2 hover:bg-[#9D2062]" style={{ transition: 'background-color 0.2s' }}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/run-data" className="block p-2 hover:bg-[#9D2062]" style={{ transition: 'background-color 0.2s' }}>
            Run Data
          </Link>
        </li>
        <li>
          <Link to="/drivers" className="block p-2 hover:bg-[#9D2062]" style={{ transition: 'background-color 0.2s' }}>
            Drivers
          </Link>
        </li>
        <li>
          <Link to="/my-account" className="block p-2 hover:bg-[#9D2062]" style={{ transition: 'background-color 0.2s' }}>
            My Account
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        <Link to="/logout" className="text-red-500 hover:text-red-300">Logout</Link>
      </div>
    </div>
  );
};

export default Navbar;

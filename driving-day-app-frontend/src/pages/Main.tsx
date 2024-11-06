// Main.tsx
import React from 'react';
import Navbar from '../components/navbar-components/Navbar';
import { Routes, Route } from 'react-router-dom';
import DriversList from '../components/driver-components/DriversList';
// import SpecificDriverProfile from '../components/driver-components/SpecificDriverProfile';

const Main = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="ml-64 p-4"> {/* Adds left margin for Navbar */}
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/drivers" element={<DriversList />} /> {/* Route for DriversList */}
          {/* <Route path="/drivers/:index" element={<SpecificDriverProfile />} /> */} {/* Route for SpecificDriverProfile */}
        </Routes>
      </div>
    </div>
  );
};

export default Main;

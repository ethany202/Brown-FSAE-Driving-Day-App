import React from 'react';
import Navbar from '../components/navbar-components/Navbar';
import { postUserRegistration, postDriverProfile } from '../apis/api'

const Main = () => {
  return (
    <div>
      <div>
        {/* <h1>Main Page</h1> */}
      </div>
      <div>
        <Navbar />
      </div>
    </div>
  );
};

export default Main;

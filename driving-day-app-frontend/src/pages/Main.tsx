import React from 'react';
import Navbar from '../components/navbar-components/Navbar';
import { postUserRegistration, postDriverProfile } from '../apis/api'

const Main = () => {
  postUserRegistration({"paylod" : "test"})
  const profileData = {
    firstName: 'John',
    lastName: 'Doe',
    height: 180,
    weight: 75,
    pedalBoxPos: 'Forward',
  };
  postDriverProfile(profileData)
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

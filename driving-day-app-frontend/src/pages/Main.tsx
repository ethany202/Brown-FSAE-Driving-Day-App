import React from 'react';
import Navbar from '../components/navbar-components/Navbar';
import { postUserRegistration, postDriverProfile } from '../api/api'

const Main = () => {

  const registerUser = async () => {
    var res = await postUserRegistration({ payload: "ME" })
    console.log(res)
  }

  registerUser()

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

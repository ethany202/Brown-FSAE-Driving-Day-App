import React, { useState, useEffect } from 'react';
import {  GoogleAuthProvider, User, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../api/firebaseConfig';
import PageBase from '../../components/base-components/PageBase';
import { SpecificDriverProfile } from '../../components/driver-components/SpecificDriverProfile';
import { Driver } from '../../utils/DriverType';
import './MyAccountPage.css';

const MyAccountPage : React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const tempDriver : Driver = {
    driverId:"undefined",
    firstName:"undefined",
    lastName: 'undefined',
    height: 5,
    weight: 10,
    pedalBoxPos: 3
  }

  // useEffect(() => {
    

  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       console.log("CURRENT USER: ", user.email)
  //       setIsLoggedIn(true);
  //       setUser(user); 
  //     } else {
  //       setIsLoggedIn(false);
  //       setUser(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     console.log(user)
  //   })
  // }, [user])

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // console.log('Login successful', result.user.email);
      if(result.user){
        setUser(result.user);
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        console.error('Login failed:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <PageBase style={{
      height: '100vh',
      overflow: 'hidden'
    }}>
      <h1>My Account</h1>
      {isLoggedIn 
        ? (
          <>     
            {/** If signed in, should be able to edit profile data */}     
            <SpecificDriverProfile driver={tempDriver}/>
            {/* <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button> */}
          </>
        )
        : (
            <div className="flex flex-col items-center justify-center h-full">
              <button
                onClick={handleGoogleLogin}
                className="flex px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow hover:bg-gray-50 flex items-center justify-center gap-2 mx-auto"
              >
                <img 
                  src="https://www.google.com/favicon.ico" 
                  alt="Google" 
                  className="w-5 h-5" 
                />
                Sign in with Google
              </button>
          </div>
        )
      }

      <div className='flex flex-col items-center justify-center w-full py-8'>
        <div className='grid grid-cols-2 w-full'>
          {/** Section for issues linked to drive */}

          <div className="flex items-center justify-center w-full">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full font-face table-fixed">
                <colgroup>
                  {/** Issue # */}
                  <col style={{ width: "10%" }} />
                  {/** Driver */}
                  {/* <col style={{ width: "10%" }} />  */}
                  {/** Date */}
                  <col style={{ width: "10%" }} /> 
                  {/** Synopsis */}
                  <col style={{ width: "15%" }} /> 
                  {/** Subsystem */}
                  <col style={{ width: "10%" }} /> 
                  {/** Priority */}
                  {/* <col style={{ width: "8%" }} />  */}
                  {/** Status */}
                  {/* <col style={{ width: "15%" }} />  */}
                </colgroup>
              </table>
              <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left font-medium text-lg">
                  Issue #
                </th>
                <th className="px-6 py-4 text-left font-medium">Date</th>
                <th className="px-6 py-4 text-left font-medium">Synop.</th>
                <th className="px-6 py-4 text-left font-medium">Subsys.</th>
              </tr>
            </thead>
            </div>
          </div>

          {/** Section for linked runs */}

          <div className="flex items-center justify-center w-full">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full font-face table-fixed">
                  <colgroup>
                    {/** Issue # */}
                    <col style={{ width: "50%" }} />
                    {/** Driver */}
                    {/* <col style={{ width: "10%" }} />  */}
                    {/** Date */}
                    <col style={{ width: "50%" }} /> 
                    {/** Synopsis */}
                    {/* <col style={{ width: "15%" }} />  */}
                    {/** Subsystem */}
                    {/* <col style={{ width: "10%" }} />  */}
                    {/** Priority */}
                    {/* <col style={{ width: "8%" }} />  */}
                    {/** Status */}
                    {/* <col style={{ width: "15%" }} />  */}
                  </colgroup>
                </table>
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left font-medium text-lg">
                      Run Title
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Date</th>
                  </tr>
                </thead>
            </div>
          </div>
        </div>
      </div>
    </PageBase>
  );
}

export default MyAccountPage;



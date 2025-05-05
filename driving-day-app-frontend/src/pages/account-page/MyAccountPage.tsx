import React, { useState, useEffect } from 'react';
import {  GoogleAuthProvider, User, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
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

  useEffect(() => {
    

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user); 
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user)
    })
  }, [user])

  const handleGoogleLogin = async () => {
    try {
      console.log(user)
      const provider = new GoogleAuthProvider();
      // const result = await signInWithEmailAndPassword(auth, "random_email@gmail.com", "TemporaryPass");
      const result = await signInWithPopup(auth, provider);
      console.log('Login successful', result.user.email);
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
            <button
              onClick={handleLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
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

      <div className='flex flex-col items-center justify-center w-full'>
        <div className='grid grid-cols-2'>
          {/** Section for issues linked to drive */}

          <div>
            My Issues
          </div>

          {/** Section for linked runs */}

          <div>
            My Runs
          </div>
        </div>
      </div>
    </PageBase>
  );
}

export default MyAccountPage;



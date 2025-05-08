import { useState } from "react";
import { Driver } from "../utils/DriverType";
import {  GoogleAuthProvider, User, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';

export default function useAuthController(){

    const [currUserId, setCurrUserId] = useState<string | null>(null)
    const [currProfile, setCurrProfile] = useState<Driver | null>(null)

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            // console.log('Login successful', result.user.email);
            if(result.user){
            setCurrUserId(result.user.email);
            }
            else{
            setCurrUserId(null);
            }
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
            console.error('Login failed:', error);
            }
        }
    };

    const handleGoogleLogout = async () => {
        try {
            await auth.signOut();
            setCurrUserId(null);
            setCurrProfile(null);
        } catch (error : any) {
            console.error('Logout failed:', error);
        }
    };

    return {currUserId, currProfile, handleGoogleLogin, handleGoogleLogout}
    

}
import axios from 'axios';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}:${process.env.REACT_APP_BACKEND_PORT}/api/`,
    timeout: 10000,
});

export const postUserRegistration = async (userData: { payload: string; }) => {
    try {
        console.log("Testing User Registration (POST Request)")
        const response = await api.post('user-registration/', userData,);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const postDriverProfile = async (profileData: {
    firstName: string;
    lastName: string;
    height: number;
    weight: number;
    pedalBoxPos: string;
}) => {
    try {
        const docRef = await addDoc(collection(db, 'driver-profiles'), profileData);
        console.log('New Driver Profile added with ID:', docRef.id);
        return { id: docRef.id, ...profileData };
    } catch (error) {
        console.error('Error adding driver profile:', error);
        throw error;
    }
};
import axios from 'axios';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 10000,
});

export const postUserRegistration = async (userData: { paylod: string; }) => {
    try {
        const response = await api.post('/user-registration/', userData, { headers: { 'Content-Type': 'application/json' } });
        console.log("Testing User Registration (POST Request)")
        return response.data;
    } catch (error) {
        console.error(error);
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

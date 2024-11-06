import axios from 'axios';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/`,
    timeout: 10000,
});

// TODO: Configure POST request to use API token to obtain content/register
/**
 * 
 * @param content: JSON data, consisting of the JSON content that should be sent to the backend upon making a POST request
 * @param path: string, corresponding to the path for the POST request
 * @returns: JSON content, representing the result of the POST request
 */
export const postRequest = async (content: any, path: string) => {
    try {
        const response = await api.post(path, content);
        return response
    }
    catch (err) {
        console.error(err);
        return {}
    }
}

export const postUserRegistration = async (userData: { payload: string; }) => {
    const path = 'user-registration/';
    return (await postRequest(userData, path))
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
        return { id: docRef.id, ...profileData };
    } catch (error) {
        console.error('Error adding driver profile:', error);
        return {}
    }
};

/**
 * 
 * @param content: JSON data, consisting of the JSON content that should be sent to the backend upon making a GET request
 * @param path: string, corresponding to the path for the GET request
 * @returns: JSON content, representing the result of the GET request
 */
export const getRequest = async (content: any, path: string) => {
    try {
        const response = await api.get(path, content);
        return response;
    }
    catch (err) {
        console.error(err);
        return {}
    }
}

export const getDriverData = async (driverFilter: {
    height: number,
    weight: number
}) => {
    const path = 'driver-data'
    return (await getRequest(driverFilter, path))
}

// TODO: Implement pagination/filtering
export const getRunData = async (runFilter: {
    date: Date,
    driverID: number
}) => {
    const path = 'run-data'
    return (await getRequest(runFilter, path))
}

// Pull data specifically for a given RUN
export const getRunByID = async (runFilter: {
    runFilter: number
}) => {
    const path = 'specific-run'
    return (await getRequest(runFilter, path))
}
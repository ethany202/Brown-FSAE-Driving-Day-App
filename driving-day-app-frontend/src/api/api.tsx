import axios from 'axios';

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

export const postDriverProfile = async (userData: {
    firstName: string;
    lastName: string;
    height: number;
    weight: number;
    pedalBoxPos: number;
}) => {
    const path = 'driver-profiles/';
    return (await postRequest(userData, path))
};

/**
 * 
 * @param content: JSON data, consisting of the JSON content that should be sent to the backend upon making a GET request
 * @param path: string, corresponding to the path for the GET request
 * @returns: JSON content, representing the result of the GET request
 */

export interface ApiResponse {
    data: Array<Record<string, any>>; // Generic array for flexible data
    message: string; // Message from the backend
}


export const getRequest = async (content: any, path: string) => {
    try {
        const response = await api.get(path, { params: content }); 
        return response.data;
    } catch (err) {
        console.error(err);
        return {}; 
    }
};


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


export const getAllData = async () => {
    const path = 'get-all-data/';
    try {
        const response = await getRequest({}, path);
        console.log('API Response:', response); // Log the response
        return response;
    } catch (error) {
        console.error("Error fetching all data:", error);
        throw error;
    }
};

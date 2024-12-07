import axios from "axios";

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
        return response;
    } catch (err) {
        console.error(err);
        return {};
    }
};

export const postDriverProfile = async (userData: {
    firstName: string;
    lastName: string;
    height: number;
    weight: number;
    pedalBoxPos: number;
}) => {
    const path = "driver-profiles/";
    return await postRequest(userData, path);
};

//fileData: {
//     runId?: string,
//     dataFile: File,
//     mediaFiles: File[]
// }

export const postFiles = async (formData: FormData) => {
    const path = 'upload-files/';
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/${path}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('File uploaded successfully:', response.data);
        return response;
    } catch (error) {
        console.error('Error uploading file:', error);
        return {}
    }
}

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
    } catch (err) {
        console.error(err);
        return {};
    }
};

export const getAllDrivers = async (filters?: {
    height?: number;
    weight?: number;
}) => {
    const path = "driver-data/";
    const params = new URLSearchParams();

    if (filters?.height) {
        params.append("height", filters.height.toString());
    }
    if (filters?.weight) {
        params.append("weight", filters.weight.toString());
    }

    try {
        const response = (await getRequest({ params }, path)) as {
            data: { drivers: any[] };
        };
        return response.data?.drivers || [];
    } catch (err) {
        console.error("Error fetching drivers:", err);
        return [];
    }
};

// TODO: Implement pagination/filtering
export const getRunData = async (runFilter: {
    date: Date;
    driverID: number;
}) => {
    const path = "run-data";
    return await getRequest(runFilter, path);
};

// Pull data specifically for a given RUN
export const getRunByID = async (runFilter: { runFilter: number }) => {
    const path = "specific-run";
    return await getRequest(runFilter, path);
};

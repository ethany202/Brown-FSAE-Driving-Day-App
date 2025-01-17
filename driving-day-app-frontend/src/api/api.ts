import axios from "axios";
import { AxiosError } from "axios";

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
export const postRequest = async (path: string, content: any) => {
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
  return await postRequest(path, userData);
};


export const postFiles = async (formData: FormData) => {
  const path = 'upload-files/';
  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/${path}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    const axiosError = error as AxiosError;
    return { status: axiosError.status }
  }
}

/**
 * 
 * @param path 
 * @param content 
 * @returns 
 */
export const getRequest = async (path: string, searchParams: URLSearchParams) => {
  try {
    const response = await api.get(path, { searchParams });
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
    const response = (await getRequest(path, params)) as {
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
  driverId: number;
}) => {
  const path = "run-data";
  const params = new URLSearchParams({
    date: runFilter.date.toString(),
    driverId: runFilter.driverId.toString()
  });

  return await getRequest(path, params);

};

export const getAllData = async () => {
  const path = 'get-all-data/';
  return await getRequest(path, new URLSearchParams());
};

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 10000,
});

export const postUserRegistration = async (userData) => {
    try {
        const response = await api.post('/user-registration/', userData);
        console.log("Testing User Registration (POST Request)")
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

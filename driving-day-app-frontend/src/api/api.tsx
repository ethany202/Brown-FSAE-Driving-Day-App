import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/${process.env.REACT_APP_BACKEND_PORT}`,
    timeout: 10000,
});

export const postUserRegistration = async (userData: { payload: string; }) => {
    try {
        console.log("Testing User Registration (POST Request)")
        const response = await api.post('/user-registration/',
            userData,
            {
                headers:
                {
                    'Content-Type': 'application/json'
                }
            });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

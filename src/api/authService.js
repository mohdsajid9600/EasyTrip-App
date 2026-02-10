import api from './axiosConfig';

export const loginUser = async (credentials) => {
    // credentials: { email, password, role? }
    // Assuming backend endpoint is /login
    const response = await api.post('/login', credentials);
    return response.data;
};

export const registerCustomer = async (data) => {
    const response = await api.post('/signup/customer', data); // Hypothetical endpoint
    return response.data;
};

export const registerDriver = async (data) => {
    const response = await api.post('/signup/driver', data); // Hypothetical endpoint
    return response.data;
};

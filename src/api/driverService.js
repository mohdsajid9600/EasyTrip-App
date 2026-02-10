import api from './axios';

export const getDriverProfile = async () => {
    const response = await api.get('/driver/me');
    return response.data;
};

export const createDriverProfile = async (data) => {
    const response = await api.post('/driver/register', data);
    return response.data;
};

export const updateDriverProfile = async (data) => {
    const response = await api.put('/driver/me/update', data);
    return response.data;
};

export const deleteDriverProfile = async () => {
    const response = await api.delete('/driver/me');
    return response.data;
};

export const getDriverBookings = async () => {
    const response = await api.get('/booking/driver');
    return response.data;
};

export const getDriverActiveBooking = async () => {
    const response = await api.get('/booking/driver/active');
    return response.data;
};

export const getDriverCompletedBookings = async () => {
    const response = await api.get('/booking/driver/completed');
    return response.data;
};

export const getDriverCancelledBookings = async () => {
    const response = await api.get('/booking/driver/cancelled');
    return response.data;
};

export const completeBooking = async () => {
    const response = await api.put('/booking/driver/complete');
    return response.data;
};

export const registerCab = async (cabData) => {
    const response = await api.post('/cab/driver/register', cabData);
    return response.data;
};

export const updateCab = async (cabData) => {
    const response = await api.put('/cab/driver/update', cabData);
    return response.data;
};

export const getDriverCab = async () => {
    const response = await api.get('/cab/driver');
    return response.data;
};

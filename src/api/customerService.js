import api from './axios';

export const getCustomerProfile = async () => {
    const response = await api.get('/customer/me');
    return response.data;
};

export const updateCustomerProfile = async (data) => {
    const response = await api.put('/customer/me/update', data);
    return response.data;
};

export const deleteCustomerProfile = async () => {
    const response = await api.delete('/customer/me');
    return response.data;
};

export const bookCab = async (bookingData) => {
    const response = await api.post('/booking/customer/booked', bookingData);
    return response.data;
};

export const getCustomerBookings = async () => {
    const response = await api.get('/booking/customer');
    return response.data; // List of bookings
};

export const getActiveBooking = async () => {
    const response = await api.get('/booking/customer/active');
    return response.data;
};

export const getCompletedBookings = async () => {
    const response = await api.get('/booking/customer/completed');
    return response.data;
};

export const getCancelledBookings = async () => {
    const response = await api.get('/booking/customer/cancelled');
    return response.data;
};

export const getAvailableCabs = async () => {
    const response = await api.get('/cab/available');
    return response.data;
};

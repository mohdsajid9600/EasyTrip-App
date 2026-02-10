import api from './axios';

// --- DASHBOARD STATS ---

export const getActiveCustomersCount = async () => {
    const response = await api.get('/admin/customers/active?size=1');
    return response.data;
};

export const getInactiveCustomersCount = async () => {
    const response = await api.get('/admin/customers/inactive?size=1');
    return response.data;
};

export const getTotalCustomersCount = async () => {
    const response = await api.get('/admin/customers?size=1');
    return response.data;
};


export const getActiveDriversCount = async () => {
    const response = await api.get('/admin/drivers/active?size=1');
    return response.data;
};

export const getActiveBookingsCount = async () => {
    const response = await api.get('/admin/bookings/active?size=1');
    return response.data;
};

export const getAvailableCabsCount = async () => {
    const response = await api.get('/admin/cabs/available?size=1');
    return response.data;
};

export const getCompletedBookingsForEarnings = async (size = 100) => {
    const response = await api.get(`/admin/bookings/complete?size=${size}`);
    return response.data;
};

// --- CUSTOMER MANAGEMENT ---

export const getAllCustomers = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/customers?page=${page}&size=${size}`);
    return response.data;
};

export const getActiveCustomers = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/customers/active?page=${page}&size=${size}`);
    return response.data;
};

export const getInactiveCustomers = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/customers/inactive?page=${page}&size=${size}`);
    return response.data;
};

export const getCustomerById = async (id) => {
    const response = await api.get(`/admin/customer/search?id=${id}`);
    return response.data;
};

export const searchCustomersByGenderAndAge = async (gender, age, page = 0, size = 10) => {
    const response = await api.get(`/admin/customers/search?gender=${gender}&age=${age}&page=${page}&size=${size}`);
    return response.data;
};

export const searchCustomersByAgeGreater = async (age, page = 0, size = 10) => {
    const response = await api.get(`/admin/customers/search/greater?age=${age}&page=${page}&size=${size}`);
    return response.data;
};

export const activateCustomer = async (id) => {
    const response = await api.put(`/admin/customer/${id}/active`);
    return response.data;
};

export const deactivateCustomer = async (id) => { // Renamed from inactivate for consistency
    const response = await api.put(`/admin/customer/${id}/inactive`);
    return response.data;
};
// Keep alias for backward compatibility if needed
export const inactivateCustomer = deactivateCustomer;


// --- DRIVER MANAGEMENT ---

export const getAllDrivers = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/drivers?page=${page}&size=${size}`);
    return response.data;
};

export const getActiveDrivers = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/drivers/active?page=${page}&size=${size}`);
    return response.data;
};

export const getDriverById = async (id) => {
    const response = await api.get(`/admin/driver/search?id=${id}`);
    return response.data;
};

export const verifyDriver = async (id) => { // activeDriver
    const response = await api.put(`/admin/driver/${id}/active`);
    return response.data;
};

export const deactivateDriver = async (id) => {
    const response = await api.put(`/admin/driver/${id}/inactive`);
    return response.data;
};
export const inactivateDriver = deactivateDriver;

export const getInactiveDrivers = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/drivers/inactive?page=${page}&size=${size}`);
    return response.data;
};

export const getInactiveDriversCount = async () => {
    const response = await api.get('/admin/drivers/inactive?size=1');
    return response.data;
};

export const getTotalDriversCount = async () => {
    const response = await api.get('/admin/drivers?size=1');
    return response.data;
};


// --- CAB MANAGEMENT ---

export const getAllCabs = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/cabs?page=${page}&size=${size}`);
    return response.data;
};

export const getAvailableCabs = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/cabs/available?page=${page}&size=${size}`);
    return response.data;
};

export const getCabById = async (id) => {
    const response = await api.get(`/admin/cab/search?id=${id}`);
    return response.data;
};

// --- BOOKING MANAGEMENT ---

export const getAllBookings = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/bookings?page=${page}&size=${size}`);
    return response.data;
};

export const getActiveBookings = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/bookings/active?page=${page}&size=${size}`);
    return response.data;
};

export const getBookingById = async (id) => {
    const response = await api.get(`/admin/booking/search?id=${id}`);
    return response.data;
};

export const getCompletedBookings = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/bookings/complete?page=${page}&size=${size}`);
    return response.data;
};

export const getCancelledBookings = async (page = 0, size = 10) => {
    const response = await api.get(`/admin/bookings/cancel?page=${page}&size=${size}`);
    return response.data;
};

export const getBookingsByCustomer = async (customerId, page = 0, size = 10) => {
    const response = await api.get(`/admin/bookings/customer?id=${customerId}&page=${page}&size=${size}`);
    return response.data;
};

export const getBookingsByDriver = async (driverId, page = 0, size = 10) => {
    const response = await api.get(`/admin/bookings/driver?id=${driverId}&page=${page}&size=${size}`);
    return response.data;
};

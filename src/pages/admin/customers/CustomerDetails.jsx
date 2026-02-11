import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, activateCustomer, deactivateCustomer, getBookingsByCustomer } from '../../../api/adminService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Shield,
    ShieldCheck,
    Ban,
    AlertCircle,

    Calendar,
    MapPin,
    Clock
} from 'lucide-react';
import { useModal } from '../../../context/ModalContext';

const CustomerDetails = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const { showConfirm, showSuccess, showError } = useModal();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Booking state
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    const fetchCustomer = async () => {
        try {
            setLoading(true);
            const response = await getCustomerById(customerId);
            // User requested: setCustomer(response.data || response)
            // Remove success checks.
            const data = response?.data || response;

            if (data) {
                setCustomer(data);
            } else {
                setError("Customer not found.");
            }
        } catch (err) {
            console.error("Error fetching customer:", err);
            setError("Failed to load customer details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchCustomer();
            fetchBookings();
        }
    }, [customerId]);

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            // Fetch first 5 bookings for preview
            const response = await getBookingsByCustomer(customerId, 0, 5);
            if (response?.data?.content) {
                setBookings(response.data.content);
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.error("Failed to fetch customer bookings", err);
        } finally {
            setBookingsLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!customer) return;

        const isCurrentlyActive = (customer.status === 'ACTIVE') || (customer.active === true);
        const action = isCurrentlyActive ? 'deactivate' : 'activate';
        const title = isCurrentlyActive ? 'Deactivate Customer' : 'Activate Customer';
        const message = isCurrentlyActive
            ? `Are you sure you want to deactivate ${customer.name}? They will not be able to login or book rides.`
            : `Are you sure you want to activate ${customer.name}?`;

        showConfirm({
            title,
            message,
            confirmText: isCurrentlyActive ? 'Deactivate' : 'Activate',
            variant: isCurrentlyActive ? 'danger' : 'primary',
            onConfirm: async () => {
                try {
                    // User instruction: Ensure activate/deactivate uses: customer.customerId || customer.id
                    const id = customer.customerId || customer.id;

                    if (isCurrentlyActive) {
                        await deactivateCustomer(id);
                        showSuccess({ title: "Success", message: "Customer account deactivated successfully." });
                    } else {
                        await activateCustomer(id);
                        showSuccess({ title: "Success", message: "Customer account activated successfully." });
                    }
                    await fetchCustomer();
                    await fetchCustomer();
                } catch (err) {
                    console.error("Status update failed", err);
                    showError({ title: "Error", message: err.response?.data?.message || "Failed to update status" });
                }
            }
        });
    };

    const getStatusParams = (customerData) => {
        const status = customerData.status || (customerData.active ? 'ACTIVE' : 'INACTIVE');
        const isStatusActive = status === 'ACTIVE';

        if (isStatusActive) {
            return {
                label: 'ACTIVE',
                badgeClass: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
                headerIcon: <ShieldCheck size={16} />,
                actionButtonText: 'Deactivate Account',
                actionButtonClass: 'bg-red-600 hover:bg-red-700 text-white',
                actionIcon: <Ban size={16} className="mr-2" />,
                helperText: "Deactivating this customer will prevent them from logging in and booking new rides."
            };
        } else {
            return {
                label: status,
                badgeClass: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
                headerIcon: <Ban size={16} />,
                actionButtonText: 'Activate Account',
                actionButtonClass: 'bg-green-600 hover:bg-green-700 text-white',
                actionIcon: <ShieldCheck size={16} className="mr-2" />,
                helperText: "Activating this customer will allow them to access their account and services again."
            };
        }
    };

    const statusParams = customer ? getStatusParams(customer) : {};

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-10 h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading customer details...</p>
        </div>
    );

    if (error || !customer) return (
        <div className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Error Loading Customer</h3>
            <p className="text-gray-500">{error || "Customer not found."}</p>
            <Button onClick={() => navigate('/admin/customers')} variant="outline">
                Back to Customers
            </Button>
        </div>
    );

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up max-w-5xl mx-auto w-full pb-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 transition flex-shrink-0"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Profile</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">ID: CDE{customer.customerId}</p>
                    </div>
                </div>
                <div>
                    <span className={`px-3 py-1.5 flex items-center justify-center gap-2 rounded-full text-sm font-semibold border w-full sm:w-auto ${statusParams.badgeClass}`}>
                        {statusParams.headerIcon}
                        {statusParams.label}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
                            <User className="text-indigo-600 dark:text-indigo-400" size={20} /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">Full Name</span>
                                <p className="font-medium text-gray-900 dark:text-white text-lg">{customer.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">Email Address</span>
                                <p className="font-medium text-gray-900 dark:text-white break-all">{customer.email}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">Age</span>
                                <p className="font-medium text-gray-900 dark:text-white">{customer.age || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">Mobile</span>
                                <p className="font-medium text-gray-900 dark:text-white">{customer.mobileNo || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">Gender</span>
                                <p className="font-medium text-gray-900 dark:text-white capitalize">{customer.gender ? customer.gender.toLowerCase() : "N/A"}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Action Zone */}
                    <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-slate-800 dark:border-yellow-600 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
                            <Shield className="text-yellow-600 dark:text-yellow-400" size={20} /> Account Actions
                        </h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <p className="text-sm text-gray-600 dark:text-slate-300 max-w-md leading-relaxed">
                                {statusParams.helperText}
                            </p>
                            <Button
                                onClick={handleToggleStatus}
                                className={`${statusParams.actionButtonClass} w-full sm:w-auto flex justify-center items-center shadow-md transition-transform active:scale-95`}
                            >
                                {statusParams.actionIcon} {statusParams.actionButtonText}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Account Meta */}
                    <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2">
                            <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} /> Account Meta
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">Registered On</span>
                                <p className="font-medium text-sm text-gray-800 dark:text-white bg-gray-50 dark:bg-slate-700/50 p-2 rounded">
                                    {customer.createProfileAt ? new Date(customer.createProfileAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 uppercase tracking-wide">Last Updated</span>
                                <p className="font-medium text-sm text-gray-800 dark:text-white bg-gray-50 dark:bg-slate-700/50 p-2 rounded">
                                    {customer.lastUpdateAt ? new Date(customer.lastUpdateAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Customer Bookings Card */}
                    <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                                <Clock className="text-indigo-600 dark:text-indigo-400" size={20} /> Recent Bookings
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                onClick={() => navigate(`/admin/customers/${customerId}/bookings`)}
                            >
                                View All
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {bookingsLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-20 bg-gray-100 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                                    ))}
                                </div>
                            ) : bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <div key={booking.bookingId} onClick={() => navigate(`/admin/bookings/${booking.bookingId}`)} className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${booking.tripStatus === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                                booking.tripStatus === 'CANCELLED' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                }`}>
                                                {booking.tripStatus}
                                            </span>
                                            <span className="text-xs text-gray-900 dark:text-white font-bold">₹{booking.billAmount}</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></div>
                                                <p className="text-xs font-medium text-gray-600 dark:text-slate-300 truncate" title={booking.pickup}>{booking.pickup}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                                                <p className="text-xs font-medium text-gray-600 dark:text-slate-300 truncate" title={booking.destination}>{booking.destination}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-slate-500">
                                    <MapPin size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm">No bookings found</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;

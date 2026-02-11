import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDriverById, verifyDriver, deactivateDriver, getBookingsByDriver } from '../../../api/adminService'; // verifyDriver maps to activate
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
    Car,
    Clock,
    MapPin
} from 'lucide-react';
import { useModal } from '../../../context/ModalContext';

const DriverDetails = () => {
    const { driverId } = useParams();
    const navigate = useNavigate();
    const { showConfirm, showSuccess, showError } = useModal();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);

    const fetchDriver = async () => {
        try {
            setLoading(true);
            const response = await getDriverById(driverId);
            if (response && response.data) {
                setDriver(response.data);
            } else if (response && response.driverId) {
                setDriver(response);
            } else {
                setError("Driver not found.");
            }
        } catch (err) {
            console.error("Error fetching driver:", err);
            setError("Failed to load driver details.");
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
            const response = await getBookingsByDriver(driverId, 0, 5);
            if (response?.data?.content) {
                setBookings(response.data.content);
            } else {
                setBookings([]);
            }
        } catch (err) {
            console.error("Failed to fetch driver bookings", err);
        } finally {
            setBookingsLoading(false);
        }
    };

    useEffect(() => {
        if (driverId) {
            fetchDriver();
            fetchBookings();
        }
    }, [driverId]);

    const handleToggleStatus = async () => {
        if (!driver) return;

        // STRICT LOGIC: Rely on current backend status
        const isCurrentlyActive = (driver.status === 'ACTIVE') || (driver.active === true);
        const action = isCurrentlyActive ? 'deactivate' : 'activate';
        const title = isCurrentlyActive ? 'Deactivate Driver' : 'Verify & Activate Driver';
        const message = isCurrentlyActive
            ? `Are you sure you want to deactivate ${driver.name}? They will be suspended from accepting rides.`
            : `Are you sure you want to verify and activate ${driver.name}?`;

        showConfirm({
            title,
            message,
            confirmText: isCurrentlyActive ? 'Deactivate' : 'Verify & Activate',
            variant: isCurrentlyActive ? 'danger' : 'success',
            onConfirm: async () => {
                try {
                    if (isCurrentlyActive) {
                        // If currently active -> Deactivate
                        await deactivateDriver(driver.driverId);
                        showSuccess({ title: "Deactivated", message: "Driver account has been deactivated." });
                    } else {
                        // If currently inactive -> Activate
                        await verifyDriver(driver.driverId);
                        showSuccess({ title: "Activated", message: "Driver account has been verified and activated." });
                    }
                    // CRITICAL: Re-fetch from backend to get the single source of truth
                    await fetchDriver();
                } catch (err) {
                    console.error("Status update failed", err);
                    showError({ title: "Operation Failed", message: err.response?.data?.message || "Failed to update status" });
                }
            }
        });
    };

    const getStatusParams = (driverData) => {
        // STRICT: Status based primarily on 'status' field, fallback to active boolean only if null
        const status = driverData.status || (driverData.active ? 'ACTIVE' : 'INACTIVE');
        const isStatusActive = status === 'ACTIVE'; // Helper for quick boolean checks

        if (isStatusActive) {
            return {
                label: 'ACTIVE',
                badgeClass: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
                headerIcon: <ShieldCheck size={16} />,
                actionButtonText: 'Deactivate Account',
                actionButtonClass: 'bg-red-600 hover:bg-red-700 text-white',
                actionIcon: <Ban size={16} className="mr-2" />,
                helperText: "Deactivating the driver will prevent them from accepting new rides. Existing rides may be affected."
            };
        } else {
            return {
                label: status, // Display exact backend status (INACTIVE, SUSPENDED, etc)
                badgeClass: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
                headerIcon: <Ban size={16} />,
                actionButtonText: 'Activate Account',
                actionButtonClass: 'bg-green-600 hover:bg-green-700 text-white',
                actionIcon: <ShieldCheck size={16} className="mr-2" />,
                helperText: "Activating the driver will allow them to login and accept new rides."
            };
        }
    };

    const statusParams = driver ? getStatusParams(driver) : {};

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-10 h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading driver details...</p>
        </div>
    );

    if (error || !driver) return (
        <div className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Error Loading Driver</h3>
            <p className="text-gray-500">{error || "Driver not found."}</p>
            <Button onClick={() => navigate('/admin/drivers')} variant="outline">
                Back to Drivers
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
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Driver Profile</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">ID: DDE{driver.driverId}</p>
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
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-slate-100 border-b border-gray-100 dark:border-slate-700 pb-2">
                            <User className="text-indigo-600 dark:text-indigo-400" size={20} /> Personal Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Full Name</span>
                                <p className="font-medium text-gray-900 dark:text-slate-100 text-lg">{driver.name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Email Address</span>
                                <p className="font-medium text-gray-900 dark:text-slate-100 break-all">{driver.email}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Age</span>
                                <p className="font-medium text-gray-900 dark:text-slate-100">{driver.age || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Mobile</span>
                                <p className="font-medium text-gray-900 dark:text-slate-100">{driver.mobileNo || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Gender</span>
                                <p className="font-medium text-gray-900 dark:text-slate-100 capitalize">{driver.gender ? driver.gender.toLowerCase() : "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Driving License</span>
                                <p className="font-medium text-gray-900 dark:text-slate-100 font-mono text-sm sm:text-base">{driver.license || "N/A"}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Experience</span>
                                <p className="font-medium text-gray-900 dark:text-slate-100">{driver.experience ? `${driver.experience} years` : "N/A"}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Action Zone */}
                    <Card className="p-6 border-l-4 border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-600 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-slate-100">
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
                    {/* Stats / Meta */}
                    <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800 dark:text-slate-100 border-b border-gray-100 dark:border-slate-700 pb-2">
                            <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} /> Account Meta
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Registered On</span>
                                <p className="font-medium text-sm text-gray-800 dark:text-slate-200 bg-gray-50 dark:bg-slate-700/50 p-2 rounded">
                                    {driver.createProfileAt ? new Date(driver.createProfileAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-slate-500 block mb-1 uppercase tracking-wide">Last Updated</span>
                                <p className="font-medium text-sm text-gray-800 dark:text-slate-200 bg-gray-50 dark:bg-slate-700/50 p-2 rounded">
                                    {driver.lastUpdateAt ? new Date(driver.lastUpdateAt).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Driver Bookings Card */}
                    <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
                                <Clock className="text-indigo-600 dark:text-indigo-400" size={20} /> Recent Bookings
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                                onClick={() => navigate(`/admin/drivers/${driverId}/bookings`)}
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
                                            <span className="text-xs text-gray-900 dark:text-slate-100 font-bold">₹{booking.billAmount}</span>
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

export default DriverDetails;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById } from '../../api/adminService';
import { Card } from '../../components/ui/Card';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    User,
    Car,
    Navigation,
    CreditCard,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

const BookingDetails = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                console.log(`Fetching booking details for ID: ${bookingId}`);
                const response = await getBookingById(bookingId);
                console.log("Booking Details API Response:", response);

                if (response) {
                    // Backend sometime wraps data, or returns directly.
                    // Based on getAllBookings analysis, it might be direct or in data property.
                    const bookingData = response.data || response;
                    setBooking(bookingData);
                } else {
                    setError("Booking not found.");
                }
            } catch (err) {
                console.error("Error fetching booking details:", err);
                setError("Failed to load booking details.");
            } finally {
                setLoading(false);
            }
        };

        if (bookingId) {
            fetchBooking();
        }
    }, [bookingId]);

    const getStatusBadge = (status) => {
        const styles = {
            COMPLETED: 'bg-green-100 text-green-800 border-green-200',
            CANCELLED: 'bg-red-100 text-red-800 border-red-200',
            ACTIVE: 'bg-blue-100 text-blue-800 border-blue-200',
            SCHEDULED: 'bg-indigo-100 text-indigo-800 border-indigo-200',
            IN_PROGRESS: 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse'
        };

        const icons = {
            COMPLETED: <CheckCircle size={16} />,
            CANCELLED: <XCircle size={16} />,
            ACTIVE: <Clock size={16} />,
            SCHEDULED: <Calendar size={16} />,
            IN_PROGRESS: <Car size={16} />
        };

        const statusKey = status ? status.toUpperCase() : 'UNKNOWN';

        return (
            <span className={`px-3 py-1.5 flex items-center gap-2 rounded-full text-sm font-semibold border ${styles[statusKey] || 'bg-gray-100 text-gray-800'}`}>
                {icons[statusKey] || <AlertCircle size={16} />}
                {statusKey}
            </span>
        );
    };

    const getPaymentStatus = (tripStatus) => {
        if (tripStatus === 'COMPLETED') {
            return { label: 'PAID', type: 'success', icon: <CheckCircle size={12} /> };
        } else if (tripStatus === 'CANCELLED') {
            return { label: 'REFUNDED', type: 'error', icon: <XCircle size={12} /> };
        } else {
            return { label: 'PENDING', type: 'warning', icon: <Clock size={12} /> };
        }
    };

    const getPaymentBadge = (status) => {
        const { label, type, icon } = getPaymentStatus(status);
        const colors = {
            success: 'text-green-600',
            error: 'text-red-500',
            warning: 'text-yellow-600'
        };

        return (
            <span className={`font-medium flex items-center gap-1 ${colors[type]}`}>
                {icon} {label}
            </span>
        );
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-10 h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-500">Loading booking details...</p>
        </div>
    );

    if (error || !booking) return (
        <div className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Error Loading Booking</h3>
            <p className="text-gray-500">{error || "Booking not found."}</p>
            <button
                onClick={() => navigate('/admin/bookings')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
                Back to Bookings
            </button>
        </div>
    );

    return (
        <div className="h-[calc(100vh-80px)] overflow-y-auto pr-2 animate-fade-in-up max-w-7xl mx-auto flex flex-col gap-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/bookings')}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Booking #{booking.bookingId}</h1>
                        <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar size={12} /> Created on {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : "N/A"}
                        </p>
                    </div>
                </div>
                <div>
                    {getStatusBadge(booking.tripStatus)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5 items-start">

                {/* Left Column: Trip & Driver Info */}
                <div className="flex flex-col gap-5 h-fit">

                    {/* Trip Details Card */}
                    <Card className="p-4 shrink-0">
                        <h3 className="text-base font-semibold mb-3 flex items-center gap-2 dark:text-slate-100">
                            <MapPin className="text-indigo-600 dark:text-indigo-400" size={18} /> Trip Details
                        </h3>

                        <div className="relative pl-4 border-l-2 border-gray-100 dark:border-slate-700 space-y-6 ml-2">
                            {/* Pickup */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Pickup Location</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate" title={booking.pickup}>{booking.pickup}</p>
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full bg-red-500 border-4 border-white shadow-sm"></div>
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Destination</span>
                                    <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate" title={booking.destination}>{booking.destination}</p>
                                </div>
                            </div>
                        </div>

                        {/* Trip Stats */}
                        <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                <span className="text-[10px] text-gray-500 dark:text-slate-400 block mb-0.5">Total Distance</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm">
                                    {booking.tripDistanceInKm ? `${booking.tripDistanceInKm} km` : "N/A"}
                                </span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                <span className="text-[10px] text-gray-500 dark:text-slate-400 block mb-0.5">Total Fare</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm">₹{booking.billAmount || 0}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                <span className="text-[10px] text-gray-500 dark:text-slate-400 block mb-0.5">Status</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm capitalize">{booking.tripStatus}</span>
                            </div>
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-2 rounded-lg">
                                <span className="text-[10px] text-gray-500 dark:text-slate-400 block mb-0.5">Cab Rate</span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100 text-sm">₹{booking.cabRateAtBooking || 0}/km</span>
                            </div>
                        </div>
                    </Card>

                    {/* Driver Details Card */}
                    {booking.cabResponse ? (
                        <Card className="p-4 h-fit">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-base font-semibold flex items-center gap-2 dark:text-slate-100">
                                    <Car className="text-indigo-600 dark:text-indigo-400" size={18} /> Driver & Cab Details
                                </h3>
                                <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${booking.cabResponse.driverResponse?.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                    }`}>
                                    {booking.cabResponse.driverResponse?.status || "UNKNOWN"}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* Left Column: Driver Details */}
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Driver Name</span>
                                        <p className="font-semibold text-sm truncate dark:text-slate-100">
                                            {booking.cabResponse.driverResponse?.name || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Email</span>
                                        <p className="font-semibold text-gray-700 dark:text-slate-200 text-sm truncate">
                                            {booking.cabResponse.driverResponse?.email || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Mobile</span>
                                        <p className="font-semibold text-gray-700 dark:text-slate-200 text-sm truncate">
                                            {booking.cabResponse.driverResponse?.mobileNo || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">License</span>
                                        <p className="font-semibold text-gray-700 dark:text-slate-200 text-sm truncate">
                                            {booking.cabResponse.driverResponse?.license || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Column: Cab Details */}
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Cab Model</span>
                                        <p className="font-semibold text-sm truncate dark:text-slate-100">
                                            {booking.cabResponse.cabModel || "Not Provided"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Cab Number</span>
                                        <p className="font-semibold bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded inline-block text-gray-700 dark:text-slate-200 text-xs">
                                            {booking.cabResponse.cabNumber || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] text-gray-500 dark:text-slate-400">Per Km Rate (Live)</span>
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                                            </span>
                                        </div>
                                        <p className="font-semibold text-sm dark:text-slate-100">
                                            ₹{booking.cabResponse.perKmRate || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-4 bg-gray-50 dark:bg-slate-700/30 border-dashed flex-1 flex items-center justify-center flex-col">
                            <h3 className="text-base font-semibold mb-1 flex items-center gap-2 text-gray-500 dark:text-slate-400">
                                <Car className="text-gray-400 dark:text-slate-500" size={18} /> Driver Not Assigned
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-slate-400 text-center">This booking has not been assigned a driver yet.</p>
                        </Card>
                    )}
                </div>

                {/* Right Column: Customer & Payment */}
                <div className="flex flex-col gap-5 h-fit self-start">
                    {/* Customer Info */}
                    <Card className="p-4 shrink-0">
                        <h3 className="text-base font-semibold mb-3 flex items-center gap-2 dark:text-slate-100">
                            <User className="text-indigo-600 dark:text-indigo-400" size={18} /> Customer
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                    {booking.customerResponse?.name?.charAt(0) || "U"}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate">{booking.customerResponse?.name || "Unknown Customer"}</p>
                                    <p className="text-[10px] text-gray-500 dark:text-slate-400">Passenger</p>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Email Address</span>
                                        <a href={`mailto:${booking.customerResponse?.email || ""}`} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline truncate block">
                                            {booking.customerResponse?.email || "N/A"}
                                        </a>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Mobile</span>
                                        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
                                            {booking.customerResponse?.mobileNo || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Age</span>
                                        <p className="text-sm font-medium text-gray-700 dark:text-slate-200">{booking.customerResponse?.age || "N/A"}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block">Gender</span>
                                        <p className="text-sm font-medium text-gray-700 dark:text-slate-200 capitalize">{booking.customerResponse?.gender || "N/A"}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-[10px] text-gray-500 dark:text-slate-400 block mb-0.5">Account Status</span>
                                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold ${booking.customerResponse?.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                            }`}>
                                            {booking.customerResponse?.status || "UNKNOWN"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline */}
                    <Card className="p-4 h-fit">
                        <h3 className="text-base font-semibold mb-3 flex items-center gap-2 dark:text-slate-100">
                            <Clock className="text-indigo-600 dark:text-indigo-400" size={18} /> Timeline
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 dark:text-slate-400">Booking ID</span>
                                <span className="font-mono font-medium dark:text-slate-200">#{booking.bookingId}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 dark:text-slate-400">Booked On</span>
                                <span className="font-medium dark:text-slate-200">
                                    {booking.bookedAt ? new Date(booking.bookedAt).toLocaleString() : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 dark:text-slate-400">Last Updated</span>
                                <span className="font-medium dark:text-slate-200">
                                    {booking.lastUpdateAt ? new Date(booking.lastUpdateAt).toLocaleString() : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-500 dark:text-slate-400">Payment Status</span>
                                {getPaymentBadge(booking.tripStatus)}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BookingDetails;

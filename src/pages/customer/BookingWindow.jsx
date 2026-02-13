import { useState, useEffect } from 'react';
import AppSelect from '../../components/ui/AppSelect';
import BackButton from '../../components/ui/BackButton';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { MapPin, Navigation, Clock, AlertTriangle, CheckCircle, XCircle, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import Pagination from '../../components/ui/Pagination';
import AppLoader from '../../components/ui/AppLoader';

const BookingWindow = () => {
    const navigate = useNavigate();
    const { showConfirm, showSuccess, showError } = useModal();

    const historyFilterOptions = [
        { value: 'ALL', label: 'All Bookings' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
        { value: 'ACTIVE', label: 'Active' }
    ];

    // State for Booking Form
    const [bookingForm, setBookingForm] = useState({
        pickup: '',
        destination: '',
        tripDistanceInKm: ''
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState(null);
    const [showBookingForm, setShowBookingForm] = useState(false);

    // State for Active Booking
    const [activeBooking, setActiveBooking] = useState(null);
    const [loadingActive, setLoadingActive] = useState(true);
    const [editMode, setEditMode] = useState(false);

    // State for History
    const [history, setHistory] = useState([]);
    const [historyFilter, setHistoryFilter] = useState('ALL'); // ALL, COMPLETED, CANCELLED, ACTIVE
    const [historyLoading, setHistoryLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(5); // Smaller size for dashboard-like view
    const [totalPages, setTotalPages] = useState(0);

    // Initial Fetch
    useEffect(() => {
        fetchActiveBooking();
        fetchHistory(page);
    }, [page]);

    // Effect to re-fetch history when filter changes
    useEffect(() => {
        setPage(0); // Reset to first page on filter change
        if (page === 0) fetchHistory(0);
    }, [historyFilter]);

    // --- API Calls ---

    const fetchActiveBooking = async () => {
        setLoadingActive(true);
        try {
            const response = await api.get('/booking/customer/active');
            if (response.data?.success && response.data?.data) {
                setActiveBooking(response.data.data);
            } else {
                setActiveBooking(null);
            }
        } catch (error) {
            // It's normal to have no active booking
            setActiveBooking(null);
        } finally {
            setLoadingActive(false);
        }
    };

    const fetchHistory = async (pageNum = 0) => {
        setHistoryLoading(true);
        try {
            let endpoint = '/booking/customer';
            if (historyFilter === 'COMPLETED') endpoint = '/booking/customer/completed';
            else if (historyFilter === 'CANCELLED') endpoint = '/booking/customer/cancelled';

            if (historyFilter === 'ACTIVE') {
                const response = await api.get('/booking/customer/active');
                if (response.data?.success && response.data?.data) {
                    setHistory([response.data.data]);
                    setTotalPages(1);
                } else {
                    setHistory([]);
                    setTotalPages(0);
                }
            } else {
                const response = await api.get(`${endpoint}?page=${pageNum}&size=${pageSize}`);
                const data = response.data?.data || response.data;
                if (data && data.content) {
                    setHistory(data.content);
                    setTotalPages(data.totalPages || 0);
                } else {
                    setHistory([]);
                    setTotalPages(0);
                }
            }
        } catch (error) {
            console.error("History fetch error", error);
            setHistory([]);
            setTotalPages(0);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleBookRide = (e) => {
        e.preventDefault();

        // Validation
        const { pickup, destination, tripDistanceInKm } = bookingForm;
        const regex = /^[A-Za-z0-9,\- ]+$/;

        // Pickup Validation
        if (!pickup || !pickup.trim()) {
            showError({ title: "Validation Error", message: "Pickup location is required" });
            return;
        }
        if (pickup.length < 3 || pickup.length > 50) {
            showError({ title: "Validation Error", message: "Pickup location must be between 3 and 50 characters" });
            return;
        }
        if (!regex.test(pickup)) {
            showError({ title: "Validation Error", message: "Pickup location contains invalid characters" });
            return;
        }

        // Destination Validation
        if (!destination || !destination.trim()) {
            showError({ title: "Validation Error", message: "Destination location is required" });
            return;
        }
        if (destination.length < 3 || destination.length > 50) {
            showError({ title: "Validation Error", message: "Destination location must be between 3 and 50 characters" });
            return;
        }
        if (!regex.test(destination)) {
            showError({ title: "Validation Error", message: "Destination location contains invalid characters" });
            return;
        }

        // Distance Validation
        if (!tripDistanceInKm) {
            showError({ title: "Validation Error", message: "Trip distance is required" });
            return;
        }
        const dist = parseFloat(tripDistanceInKm);
        if (isNaN(dist) || dist <= 0) {
            showError({ title: "Validation Error", message: "Trip distance must be greater than zero" });
            return;
        }
        if (dist > 1000) {
            showError({ title: "Validation Error", message: "Trip distance cannot exceed 1000 km" });
            return;
        }

        showConfirm({
            title: "Confirm Booking",
            message: "Are you sure you want to book this cab?",
            confirmText: "Confirm",
            onConfirm: async () => {
                setBookingLoading(true);
                setBookingError(null);
                try {
                    const response = await api.post('/booking/customer/booked', bookingForm);
                    if (response.data?.success) {
                        // Success
                        setShowBookingForm(false);
                        setBookingForm({ pickup: '', destination: '', tripDistanceInKm: '' });
                        fetchActiveBooking(); // Refresh active card
                        fetchHistory(); // Refresh history
                        showSuccess({ title: "Booking Successful", message: response.data.message || "Your ride has been booked successfully!" });
                    }
                } catch (error) {
                    showError({ title: "Booking Failed", message: error.response?.data?.message || "Booking failed." });
                } finally {
                    setBookingLoading(false);
                }
            }
        });
    };

    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        if (Number(activeBooking.tripDistanceInKm) <= 0) {
            showError({ title: "Validation Error", message: "Distance must be greater than 0" });
            return;
        }
        try {
            const response = await api.put('/booking/customer/update', {
                pickup: activeBooking.pickup,
                destination: activeBooking.destination,
                tripDistanceInKm: activeBooking.tripDistanceInKm
            });
            if (response.data?.success) {
                setActiveBooking(response.data.data);
                setEditMode(false);
                showSuccess({ title: "Success", message: "Booking updated successfully!" });
            }
        } catch (error) {
            showError({ title: "Update Failed", message: "Update failed: " + (error.response?.data?.message || "Unknown error") });
        }
    };

    const handleCancelBooking = () => {
        showConfirm({
            title: "Cancel Ride",
            message: "Are you sure you want to cancel your active ride?",
            confirmText: "Yes, Cancel",
            variant: "danger",
            onConfirm: performCancellation
        });
    };

    const performCancellation = async () => {
        try {
            const response = await api.put('/booking/customer/cancel');
            if (response.data?.success) {
                setActiveBooking(null);
                fetchHistory(); // Update history to show cancelled
                showSuccess({ title: "Ride Cancelled", message: "Your ride has been cancelled successfully." });
            }
        } catch (error) {
            showError({ title: "Cancellation Failed", message: "Cancellation failed: " + (error.response?.data?.message || "Unknown error") });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
            case 'CANCELLED': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
            case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const getDisplayStatus = (status) => {
        if (status === 'IN_PROGRESS') return 'ACTIVE';
        return status;
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            <div className="flex items-center gap-2">
                <BackButton />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Booking Window</h1>
            </div>

            {bookingLoading && <AppLoader text="Processing booking..." />}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Book Cab Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-t-4 border-indigo-500 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                            <Navigation className="text-indigo-600 dark:text-indigo-400" /> Book a Cab
                        </h2>
                        {!showBookingForm && (
                            <button
                                onClick={() => setShowBookingForm(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                            >
                                Open Form
                            </button>
                        )}
                    </div>

                    {showBookingForm ? (
                        <form onSubmit={handleBookRide} className="space-y-4 animate-fade-in-up">

                            {/* Inputs */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Pickup Location</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                                    placeholder="e.g. MG Road, Sector-18"
                                    value={bookingForm.pickup}
                                    onChange={(e) => setBookingForm({ ...bookingForm, pickup: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Destination</label>
                                <input
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                                    placeholder="e.g. Airport Terminal 3"
                                    value={bookingForm.destination}
                                    onChange={(e) => setBookingForm({ ...bookingForm, destination: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Estimated Distance (km)</label>
                                <input
                                    type="number"
                                    required
                                    min="0.1"
                                    step="0.1"
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-slate-600 shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                                    placeholder="e.g. 12.5"
                                    value={bookingForm.tripDistanceInKm}
                                    onChange={(e) => setBookingForm({ ...bookingForm, tripDistanceInKm: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                                >
                                    {bookingLoading ? 'Processing...' : 'Confirm Book'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowBookingForm(false)}
                                    className="py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-gray-500 dark:text-slate-400">Ready to travel? Click above to start a new journey.</p>
                    )}
                </div>

                {/* 2. My Active Booking Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border-t-4 border-green-500 relative transition-colors">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                        <CheckCircle className="text-green-600 dark:text-green-400" /> My Active Booking
                    </h2>

                    {loadingActive ? (
                        <AppLoader text="Loading active ride..." />
                    ) : activeBooking ? (
                        <div className="animate-fade-in-up">
                            {editMode ? (
                                <form onSubmit={handleUpdateBooking} className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-600 dark:text-slate-400">Pickup</label>
                                        <input
                                            value={activeBooking.pickup}
                                            onChange={(e) => setActiveBooking({ ...activeBooking, pickup: e.target.value })}
                                            className="w-full text-sm border-b border-gray-300 dark:border-slate-600 focus:outline-none focus:border-green-500 py-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 dark:text-slate-400">Destination</label>
                                        <input
                                            value={activeBooking.destination}
                                            onChange={(e) => setActiveBooking({ ...activeBooking, destination: e.target.value })}
                                            className="w-full text-sm border-b border-gray-300 dark:border-slate-600 focus:outline-none focus:border-green-500 py-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-600 dark:text-slate-400">Distance (km)</label>
                                        <input
                                            type="number"
                                            min="0.1"
                                            step="0.1"
                                            required
                                            value={activeBooking.tripDistanceInKm}
                                            onChange={(e) => setActiveBooking({ ...activeBooking, tripDistanceInKm: e.target.value })}
                                            className="w-full text-sm border-b border-gray-300 dark:border-slate-600 focus:outline-none focus:border-green-500 py-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button type="button" onClick={() => setEditMode(false)} className="text-xs text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">Cancel</button>
                                        <button type="submit" className="text-xs bg-green-500 text-white px-3 py-1 rounded">Save</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400 dark:text-slate-500">Pickup</p>
                                            <p className="font-semibold text-gray-800 dark:text-slate-100">{activeBooking.pickup}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 dark:text-slate-500">Destination</p>
                                            <p className="font-semibold text-gray-800 dark:text-slate-100">{activeBooking.destination}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-transparent dark:border-slate-600">
                                        <div>
                                            <p className="text-xs text-gray-400 dark:text-slate-500">Fare</p>
                                            <p className="font-bold text-lg text-gray-800 dark:text-slate-100">₹{activeBooking.billAmount}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(activeBooking.tripStatus)}`}>
                                            {activeBooking.tripStatus}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setEditMode(true)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button
                                            onClick={handleCancelBooking}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                                        >
                                            <Trash2 size={16} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-slate-600">
                            <Calendar size={48} className="mb-2 opacity-20" />
                            <p>No active booking.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. History Section */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 transition-colors">
                <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                    <h2
                        onClick={() => navigate('/customer/bookings')}
                        className="text-xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="View Full History"
                    >
                        <Clock className="text-orange-500" /> Booking History
                    </h2>

                    {/* Filter Dropdown */}
                    <div className="w-48">
                        <AppSelect
                            options={historyFilterOptions}
                            value={historyFilter}
                            onChange={(val) => setHistoryFilter(val)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {historyLoading ? (
                        <AppLoader text="Loading history..." />
                    ) : history.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Journey Details</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Fare</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cab Model</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cab Rate</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                        {history.map((booking, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-700 dark:text-slate-300">
                                                            {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : 'N/A'}
                                                        </span>
                                                        <span className="text-xs text-gray-400 dark:text-slate-500">
                                                            {booking.bookedAt ? new Date(booking.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-slate-200">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                            <span className="text-xs text-gray-500 dark:text-slate-400">From:</span>
                                                            <span className="font-semibold text-gray-800 dark:text-slate-200">{booking.pickup}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                            <span className="text-xs text-gray-500 dark:text-slate-400">To:</span>
                                                            <span className="font-semibold text-gray-800 dark:text-slate-200">{booking.destination}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-slate-100">
                                                    ₹{booking.billAmount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                    {booking.cabResponse?.cabModel || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                    {booking.cabRateAtBooking ? `₹${booking.cabRateAtBooking}/km` : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.tripStatus)}`}>
                                                        {getDisplayStatus(booking.tripStatus)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                loading={historyLoading}
                            />
                        </>
                    ) : (
                        <div className="text-center py-10 bg-gray-50 dark:bg-slate-700/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-slate-700">
                            <p className="text-gray-500 dark:text-slate-400">No bookings found for this filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingWindow;

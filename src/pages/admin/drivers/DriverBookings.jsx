import { useState, useEffect } from 'react';
import AppSelect from '../../../components/ui/AppSelect';
import BackButton from '../../../components/ui/BackButton';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingsByDriver, getDriverById } from '../../../api/adminService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
    MapPin,
    Navigation,
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const DriverBookings = () => {
    const { driverId } = useParams();
    const navigate = useNavigate();

    const statusOptions = [
        { value: 'ALL', label: 'All Status' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' }
    ];

    const [bookings, setBookings] = useState([]);
    const [driverName, setDriverName] = useState('');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateSort, setDateSort] = useState('newest');

    const statusMap = {
        ACTIVE: "IN_PROGRESS",
        COMPLETED: "COMPLETED",
        CANCELLED: "CANCELLED"
    };

    const getDisplayStatus = (status) => {
        if (status === 'IN_PROGRESS') return 'ACTIVE';
        return status;
    };

    useEffect(() => {
        loadData();
    }, [driverId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const driverRes = await getDriverById(driverId);
            if (driverRes?.data) setDriverName(driverRes.data.name);
            else if (driverRes?.name) setDriverName(driverRes.name);

            const response = await getBookingsByDriver(driverId, 0, 100);
            if (response?.data) {
                setBookings(response.data.content || []);
            } else if (response?.content) {
                setBookings(response.content || []);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error("Error loading driver bookings:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredBookings = () => {
        let filtered = [...bookings];

        if (statusFilter !== 'ALL') {
            const backendStatus = statusMap[statusFilter];
            filtered = filtered.filter(b => b.tripStatus === backendStatus);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(b =>
                (b.pickup && b.pickup.toLowerCase().includes(query)) ||
                (b.destination && b.destination.toLowerCase().includes(query))
            );
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.bookedAt).getTime();
            const dateB = new Date(b.bookedAt).getTime();
            return dateSort === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered;
    };

    const displayedBookingsList = getFilteredBookings();

    useEffect(() => {
        setTotalPages(Math.ceil(displayedBookingsList.length / pageSize));
        setPage(0);
    }, [displayedBookingsList.length, pageSize, searchQuery, statusFilter, dateSort]);

    const getStatusColor = (status) => {
        const s = status ? status.toUpperCase() : '';
        switch (s) {
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
            case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up h-full pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Driver Bookings</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Bookings for {driverName || `ID: ${driverId}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative z-20">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search pickup or destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-[180px]">
                        <AppSelect
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val)}
                        />
                    </div>
                    <div className="w-full sm:w-[180px]">
                        <AppSelect
                            options={sortOptions}
                            value={dateSort}
                            onChange={(val) => setDateSort(val)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-500">Loading bookings...</p>
                </div>
            ) : displayedBookingsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                    <Search className="h-12 w-12 text-gray-300 dark:text-slate-600 mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Bookings Found</h3>
                    <p className="text-gray-500 dark:text-slate-400">
                        {bookings.length === 0 ? "This driver hasn't completed any bookings yet." : "No bookings match your filters."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View (Hidden on mobile/tablet) */}
                    <Card className="hidden lg:block overflow-hidden border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-lg bg-white dark:bg-slate-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Route</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Distance</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Fare</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {displayedBookingsList.slice(page * pageSize, (page + 1) * pageSize).map((booking) => (
                                        <tr
                                            key={booking.bookingId}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition cursor-pointer"
                                            onClick={() => navigate(`/admin/bookings/${booking.bookingId}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : "-"}
                                                <div className="text-xs text-gray-400">
                                                    {booking.bookedAt ? new Date(booking.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                                <div className="flex flex-col gap-1 max-w-[200px]">
                                                    <span className="flex items-center gap-1 truncate" title={booking.pickup}>
                                                        <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                                        <span className="truncate">{booking.pickup}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1 truncate" title={booking.destination}>
                                                        <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                                        <span className="truncate">{booking.destination}</span>
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                {booking.customerResponse?.name || "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                {booking.tripDistanceInKm} km
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                ₹{booking.billAmount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(booking.tripStatus)}`}>
                                                    {getDisplayStatus(booking.tripStatus)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 flex items-center justify-end gap-1">
                                                    View <ChevronRight size={16} />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Mobile/Tablet Card View (Visible on small screens) */}
                    <div className="lg:hidden space-y-4">
                        {displayedBookingsList.slice(page * pageSize, (page + 1) * pageSize).map((booking) => (
                            <div
                                key={booking.bookingId}
                                onClick={() => navigate(`/admin/bookings/${booking.bookingId}`)}
                                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-slate-400 mb-1">
                                            {booking.bookedAt ? new Date(booking.bookedAt).toLocaleDateString() : "-"} • {booking.bookedAt ? new Date(booking.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {booking.customerResponse?.name || "Unknown Customer"}
                                        </p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded text-xs font-bold border ${getStatusColor(booking.tripStatus)}`}>
                                        {getDisplayStatus(booking.tripStatus)}
                                    </span>
                                </div>

                                <div className="space-y-3 relative pl-4 border-l-2 border-gray-100 dark:border-slate-700 ml-1 my-4">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-green-100 dark:ring-green-900"></div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">Pickup</p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-slate-200 line-clamp-1">{booking.pickup}</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 ring-1 ring-red-100 dark:ring-red-900"></div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">Destination</p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-slate-200 line-clamp-1">{booking.destination}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-slate-700">
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                                        <span>{booking.tripDistanceInKm} km</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">₹{booking.billAmount}</span>
                                        <ChevronRight size={18} className="text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination - Common for both views */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-6">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
                            >
                                <ChevronLeft size={20} />
                            </Button>
                            <span className="text-sm font-medium text-gray-600 dark:text-slate-300">
                                {page + 1} / {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                className="w-10 h-10 p-0 flex items-center justify-center rounded-full"
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DriverBookings;

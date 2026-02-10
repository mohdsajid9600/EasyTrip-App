import { useState, useEffect } from 'react';
import AppSelect from '../../components/ui/AppSelect';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Clock, MapPin, Calendar, Filter, Search } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Filter & Sort States
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortOption, setSortOption] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

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
        fetchAllBookings();
    }, [page, pageSize, statusFilter]);

    const fetchAllBookings = async () => {
        setLoading(true);
        try {
            let endpoint = '/booking/customer';
            if (statusFilter === 'COMPLETED') endpoint = '/booking/customer/completed';
            else if (statusFilter === 'CANCELLED') endpoint = '/booking/customer/cancelled';

            if (statusFilter === 'ACTIVE') {
                try {
                    const response = await api.get('/booking/customer/active');
                    if (response.data?.success && response.data?.data) {
                        setBookings([response.data.data]);
                        setTotalPages(1);
                    } else {
                        setBookings([]);
                        setTotalPages(0);
                    }
                } catch (error) {
                    // Active endpoint might 404 or return error if no active booking
                    setBookings([]);
                    setTotalPages(0);
                }
            } else {
                const response = await api.get(`${endpoint}?page=${page}&size=${pageSize}`);
                const data = response.data?.data || response.data;
                if (data && data.content) {
                    setBookings(data.content);
                    setTotalPages(data.totalPages || 0);
                } else {
                    setBookings([]);
                    setTotalPages(0);
                }
            }
        } catch (error) {
            console.error("Failed to fetch bookings", error);
            setBookings([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
            case 'CANCELLED': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
            case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
            case 'ACTIVE': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300';
            case 'SCHEDULED': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const statusOptions = [
        { value: 'ALL', label: 'All Bookings' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'fare_low', label: 'Fare: Low to High' },
        { value: 'fare_high', label: 'Fare: High to Low' },
        { value: 'dist_low', label: 'Dist: Low to High' },
        { value: 'dist_high', label: 'Dist: High to Low' }
    ];

    // Local search on the current page's results
    const filteredBookings = searchQuery
        ? bookings.filter(b =>
            (b.pickup && b.pickup.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (b.destination && b.destination.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        : bookings;

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                    <Clock className="text-indigo-600 dark:text-indigo-400" /> Booking History
                </h2>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative z-20">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search current page..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="min-w-[160px]">
                            <AppSelect
                                options={statusOptions}
                                value={statusFilter}
                                onChange={(val) => {
                                    setStatusFilter(val);
                                    setPage(0);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* List Content */}
            <div className="space-y-4">
                <Card className="overflow-hidden border-t-4 border-indigo-500 p-0 bg-white dark:bg-slate-800 dark:border-slate-700 top-border-indigo shadow-sm">
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading your history...</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="p-16 text-center text-gray-500 dark:text-slate-400 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                                <Clock size={32} className="opacity-40" />
                            </div>
                            <p className="text-lg font-medium text-gray-700 dark:text-slate-300">No bookings found</p>
                            <p className="text-sm mt-2 max-w-xs mx-auto">
                                {searchQuery || statusFilter !== 'ALL'
                                    ? "Try adjusting your filters to find what you're looking for."
                                    : "You haven't made any bookings yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                                <thead className="bg-gray-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Journey Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Fare</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cab Model</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cab Rate</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                                    {filteredBookings.map((booking, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
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
                                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-slate-200">
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-slate-100">
                                                ₹{booking.billAmount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                {booking.cabResponse?.cabModel || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                {booking.cabRateAtBooking ? `₹${booking.cabRateAtBooking}/km` : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.tripStatus)}`}>
                                                    {getDisplayStatus(booking.tripStatus)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default MyBookings;


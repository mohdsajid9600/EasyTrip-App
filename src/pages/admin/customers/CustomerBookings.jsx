import { useState, useEffect } from 'react';
import AppSelect from '../../../components/ui/AppSelect';
import BackButton from '../../../components/ui/BackButton';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingsByCustomer, getCustomerById } from '../../../api/adminService';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import {
    MapPin,
    Navigation,
    Search,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const CustomerBookings = () => {
    const { customerId } = useParams();
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
    const [customerName, setCustomerName] = useState('');
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
    }, [customerId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const customerRes = await getCustomerById(customerId);
            if (customerRes?.data) setCustomerName(customerRes.data.name);
            else if (customerRes?.name) setCustomerName(customerRes.name);

            const response = await getBookingsByCustomer(customerId, 0, 100);
            if (response?.data) {
                setBookings(response.data.content || []);
            } else if (response?.content) {
                setBookings(response.content || []);
            } else {
                setBookings([]);
            }
        } catch (error) {
            console.error("Error loading customer bookings:", error);
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
        <div className="space-y-6 animate-fade-in-up h-[calc(100vh-6rem)] overflow-y-auto pr-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Bookings</h1>
                        <p className="text-sm text-gray-500 dark:text-slate-400">
                            Bookings for {customerName || `ID: ${customerId}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative z-20">
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
                <div className="flex gap-4">
                    <div className="min-w-[150px]">
                        <AppSelect
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(val) => setStatusFilter(val)}
                        />
                    </div>
                    <div className="min-w-[150px]">
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
                        {bookings.length === 0 ? "This customer hasn't made any bookings yet." : "No bookings match your filters."}
                    </p>
                </div>
            ) : (
                <Card className="overflow-hidden border-gray-200 dark:border-slate-700 shadow-sm dark:shadow-lg bg-white dark:bg-slate-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                            <thead className="bg-gray-50 dark:bg-slate-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Route</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Driver</th>
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
                                                    <MapPin size={12} className="text-green-500 flex-shrink-0" />
                                                    <span className="truncate">{booking.pickup}</span>
                                                </span>
                                                <span className="flex items-center gap-1 truncate" title={booking.destination}>
                                                    <Navigation size={12} className="text-red-500 flex-shrink-0" />
                                                    <span className="truncate">{booking.destination}</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                            {booking.cabResponse?.driverResponse?.name || "-"}
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
                                            <span className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900">View</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50 dark:bg-slate-700/50 px-6 py-3 border-t border-gray-200 dark:border-slate-700 flex items-center justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 0}
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                            >
                                <ChevronLeft size={16} className="mr-1" /> Previous
                            </Button>
                            <span className="text-sm text-gray-500 dark:text-slate-400">
                                Page {page + 1} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            >
                                Next <ChevronRight size={16} className="ml-1" />
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};

export default CustomerBookings;

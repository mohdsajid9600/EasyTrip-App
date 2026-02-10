import { useState, useEffect } from 'react';
import AppSelect from '../../components/ui/AppSelect';
import BackButton from '../../components/ui/BackButton';
import { useNavigate } from 'react-router-dom';
import {
    getAllBookings,
    getActiveBookings,
    getCompletedBookings,
    getCancelledBookings
} from '../../api/adminService';
import { Card } from '../../components/ui/Card';
import {
    Calendar,
    MapPin,
    User,
    Navigation,
    Filter,
    ChevronRight,
    Search
} from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

const AllBookings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, COMPLETED, CANCELLED
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [searchQuery, setSearchQuery] = useState(''); // Local search on current page

    useEffect(() => {
        loadBookings();
    }, [filter, page, pageSize]);

    const loadBookings = async () => {
        setLoading(true);
        try {
            let response;
            switch (filter) {
                case 'ACTIVE':
                    response = await getActiveBookings(page, pageSize);
                    break;
                case 'COMPLETED':
                    response = await getCompletedBookings(page, pageSize);
                    break;
                case 'CANCELLED':
                    response = await getCancelledBookings(page, pageSize);
                    break;
                case 'ALL':
                default:
                    response = await getAllBookings(page, pageSize);
                    break;
            }

            const data = response.data || response;
            if (data && data.content) {
                setBookings(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setBookings([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Error loading bookings:", error);
            setBookings([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const s = status ? status.toUpperCase() : '';
        switch (s) {
            case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
            case 'SCHEDULED': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200 animate-pulse dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
            case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
            default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
        }
    };

    const getDisplayStatus = (status) => {
        if (status === 'IN_PROGRESS') return 'ACTIVE';
        return status;
    };

    const handleRowClick = (bookingId) => {
        navigate(`/admin/bookings/${bookingId}`);
    };

    const tabs = [
        { id: 'ALL', label: 'All Bookings' },
        { id: 'ACTIVE', label: 'Active' },
        { id: 'COMPLETED', label: 'Completed' },
        { id: 'CANCELLED', label: 'Cancelled' }
    ];

    const filteredBookings = searchQuery
        ? bookings.filter(b =>
            b.bookingId.toString().includes(searchQuery) ||
            b.customerResponse?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.cabResponse?.driverResponse?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : bookings;

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                    <BackButton />
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-slate-100">
                        <Calendar className="text-indigo-600" /> Bookings Management
                    </h2>
                </div>

                {/* Filter Tabs */}
                <div className="bg-gray-100 dark:bg-slate-800 p-1 rounded-lg inline-flex overflow-x-auto max-w-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setFilter(tab.id);
                                setPage(0);
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${filter === tab.id
                                ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-800 dark:text-indigo-400'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Search */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search current page results..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                    />
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-slate-400">Loading bookings...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-slate-700 mb-4">
                                <Search className="text-gray-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-slate-100">No bookings found</h3>
                            <p className="text-gray-500 dark:text-slate-400">There are no {filter.toLowerCase() !== 'all' ? filter.toLowerCase() : ''} bookings to display.</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-900">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
                                    <thead className="bg-gray-50 dark:bg-slate-800">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Route</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Driver</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Distance</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Fare</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-800">
                                        {filteredBookings.map(b => (
                                            <tr
                                                key={b.bookingId}
                                                onClick={() => handleRowClick(b.bookingId)}
                                                className="hover:bg-gray-50 dark:hover:bg-slate-800 transition cursor-pointer group"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">BK-{b.bookingId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-400">
                                                    {b.bookedAt ? new Date(b.bookedAt).toLocaleDateString() : "-"}
                                                    <br />
                                                    <span className="text-xs text-gray-400">
                                                        {b.bookedAt ? new Date(b.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                                                    {b.customerResponse?.name || "Unknown"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                                                    <div className="flex flex-col gap-1 max-w-[200px]">
                                                        <span className="flex items-center gap-1 truncate" title={b.pickup}>
                                                            <MapPin size={12} className="text-green-500 flex-shrink-0" />
                                                            <span className="truncate">{b.pickup}</span>
                                                        </span>
                                                        <span className="flex items-center gap-1 truncate" title={b.destination}>
                                                            <Navigation size={12} className="text-red-500 flex-shrink-0" />
                                                            <span className="truncate">{b.destination}</span>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                                                    {b.cabResponse?.driverResponse?.name || "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-slate-300">
                                                    {b.tripDistanceInKm ? `${b.tripDistanceInKm} km` : "-"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-slate-100">
                                                    ₹{b.billAmount || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(b.tripStatus)}`}>
                                                        {getDisplayStatus(b.tripStatus)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <span className="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 flex items-center justify-end gap-1">
                                                        Details <ChevronRight size={16} />
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-4">
                                {filteredBookings.map(b => (
                                    <Card
                                        key={b.bookingId}
                                        className="p-4 space-y-3 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700"
                                        onClick={() => handleRowClick(b.bookingId)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-gray-800 dark:text-slate-100">Booking BK-{b.bookingId}</span>
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(b.tripStatus)}`}>
                                                {getDisplayStatus(b.tripStatus)}
                                            </span>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-green-600" />
                                                <span className="truncate">{b.pickup}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Navigation size={14} className="text-red-600" />
                                                <span className="truncate">{b.destination}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                                                <User size={14} />
                                                <span>{b.customerResponse?.name || "Customer"}</span>
                                            </div>
                                        </div>
                                        <div className="pt-2 flex justify-between items-center text-sm font-medium">
                                            <span className="text-gray-500 dark:text-slate-400">Total Amount:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg text-gray-900 dark:text-slate-100">₹{b.billAmount || 0}</span>
                                                <ChevronRight size={16} className="text-gray-400" />
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                loading={loading}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AllBookings;


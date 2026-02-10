import { useState, useEffect } from 'react';
import {
    getDriverActiveBooking,
    completeBooking
} from '../../api/driverService';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import AppSelect from '../../components/ui/AppSelect';
import { MapPin, Navigation, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import Pagination from '../../components/ui/Pagination';

const MyTrips = () => {
    // Data States
    const [trips, setTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Filter & Sort States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortOption, setSortOption] = useState('newest');

    const statusMap = {
        ACTIVE: "IN_PROGRESS",
        COMPLETED: "COMPLETED",
        CANCELLED: "CANCELLED"
    };

    const getDisplayStatus = (status) => {
        if (status === 'IN_PROGRESS') return 'ACTIVE';
        return status;
    };

    const { showConfirm, showSuccess, showError } = useModal();

    useEffect(() => {
        fetchAllTrips();
    }, [page, pageSize, statusFilter]);

    const fetchAllTrips = async () => {
        setLoading(true);
        try {
            // Active Trip Logic
            let activePromise = (page === 0 && (statusFilter === 'ALL' || statusFilter === 'ACTIVE'))
                ? getDriverActiveBooking().catch(() => ({ success: false, data: null }))
                : Promise.resolve({ success: false, data: null });

            // History Logic
            let endpoint = '/booking/driver';
            if (statusFilter === 'COMPLETED') endpoint = '/booking/driver/completed';
            else if (statusFilter === 'CANCELLED') endpoint = '/booking/driver/cancelled';
            else if (statusFilter === 'ACTIVE') {
                // Active is handled separately via getDriverActiveBooking
                // We don't fetch history for "ACTIVE" filter typically, or maybe /active endpoint?
                // But let's assume we just show the active card.
                // However, user might want to see history of active trips? Unlikely.
                // Let's mimic Customer side:
                // Customer side uses /booking/customer/active for list.
                // Driver side might not have a list of active trips (only one at a time).
                // So if ACTIVE is selected, we rely on activePromise and clear history list.
                endpoint = null;
            }

            const historyRes = endpoint
                ? await api.get(`${endpoint}?page=${page}&size=${pageSize}`)
                : { data: { content: [], totalPages: 0 } };

            const activeRes = await activePromise;

            const data = historyRes.data?.data || historyRes.data;
            if (data && data.content) {
                setTrips(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setTrips([]);
                setTotalPages(0);
            }

            if (activeRes?.success && activeRes?.data) {
                setActiveTrip(activeRes.data);
                // If filter is ACTIVE, we might want to ensure it shows up. 
                // Currently Active Trip is shown in a separate card above the list.
                // The user request implies filtering the LIST. 
                // If "Active" is selected, maybe we shouldn't show the history list at all?
                // Or maybe the user means "IN_PROGRESS" trips in the history?
                // Let's stick to showing Active Trip in the big card, and filtering history list.
            } else {
                setActiveTrip(null);
            }

        } catch (error) {
            console.error("Fetch trips error", error);
            setTrips([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTrip = () => {
        showConfirm({
            title: "Complete Trip",
            message: "Are you sure you want to complete this trip?",
            confirmText: "Yes, Complete",
            variant: "success",
            onConfirm: performCompletion
        });
    };

    const performCompletion = async () => {
        setCompleting(true);
        try {
            const response = await completeBooking();
            if (response?.success) {
                showSuccess({ title: "Trip Completed", message: "Trip completed successfully!" });
                setPage(0);
                fetchAllTrips(); // Refresh everything
            } else {
                showError({ title: "Completion Failed", message: response.message || "Failed to complete trip" });
            }
        } catch (error) {
            console.error("Complete trip error", error);
            showError({ title: "Error", message: "Error completing trip" });
        } finally {
            setCompleting(false);
        }
    };

    // Filter & Sort
    const filteredTrips = trips
        .filter(t => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return (
                (t.pickup && t.pickup.toLowerCase().includes(q)) ||
                (t.destination && t.destination.toLowerCase().includes(q)) ||
                (t.customerResponse?.name && t.customerResponse.name.toLowerCase().includes(q)) ||
                (t.cabResponse?.cabModel && t.cabResponse.cabModel.toLowerCase().includes(q))
            );
        })
        .sort((a, b) => {
            if (sortOption === 'newest') {
                return new Date(b.bookedAt) - new Date(a.bookedAt);
            } else if (sortOption === 'oldest') {
                return new Date(a.bookedAt) - new Date(b.bookedAt);
            }
            return 0;
        });

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
            case 'CANCELLED': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
            case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
            case 'BOOKED': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
            default: return 'text-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-slate-300';
        }
    };

    const statusOptions = [
        { value: 'ALL', label: 'All Trips' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' }
    ];

    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-10">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">My Trips</h1>

            {/* 1. Active Trip Card */}
            {activeTrip && statusFilter !== 'COMPLETED' && statusFilter !== 'CANCELLED' ? (
                <Card className="border-l-4 border-blue-600 bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 shadow-lg relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Navigation size={120} className="dark:text-blue-400" />
                    </div>
                    <div className="relative z-10 p-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                                    <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                                    Active Trip
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Current ongoing journey
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-slate-400">Fare</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">₹{activeTrip.billAmount}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup</label>
                                    <div className="flex items-start gap-2 mt-1">
                                        <MapPin size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-lg font-medium text-gray-800 dark:text-slate-100">{activeTrip.pickup}</p>
                                    </div>
                                </div>
                                <div className="pl-2 border-l-2 border-dashed border-gray-300 dark:border-slate-600 ml-2 h-4"></div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Destination</label>
                                    <div className="flex items-start gap-2 mt-1">
                                        <MapPin size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-lg font-medium text-gray-800 dark:text-slate-100">{activeTrip.destination}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/80 dark:bg-slate-800/80 p-4 rounded-xl border border-blue-100 dark:border-slate-700 flex flex-col justify-between">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</label>
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-gray-500 dark:text-slate-300">
                                            <span className="font-bold">{activeTrip.customerResponse?.name?.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-slate-100">{activeTrip.customerResponse?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400">{activeTrip.customerResponse?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white shadow-md border-none cursor-pointer"
                                    onClick={handleCompleteTrip}
                                    disabled={completing}
                                >
                                    {completing ? "Completing..." : "Complete Trip"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : !loading && page === 0 && (statusFilter === 'ALL' || statusFilter === 'ACTIVE') && (
                <Card className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-center py-8">
                    <p className="text-gray-500 dark:text-slate-400 font-medium">No active trip at the moment.</p>
                </Card>
            )}

            {/* 2. Trip History Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Trip History</h2>

                {/* Filter Bar */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm relative z-20">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by customer, location, or cab..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 transition-colors"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="min-w-[160px]">
                                <AppSelect
                                    options={sortOptions}
                                    value={sortOption}
                                    onChange={(val) => setSortOption(val)}
                                />
                            </div>
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

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 dark:bg-slate-800 animate-pulse rounded-lg border border-gray-200 dark:border-slate-700"></div>)}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTrips.length > 0 ? (
                            <div className="space-y-4">
                                {filteredTrips.map((trip, idx) => (
                                    <Card key={idx} className="hover:shadow-md transition-shadow bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                        <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 p-4">

                                            {/* 1. Date */}
                                            <div className="w-full xl:w-24 flex-shrink-0">
                                                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Date</p>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                                        {trip.bookedAt ? new Date(trip.bookedAt).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-slate-500">
                                                        {trip.bookedAt ? new Date(trip.bookedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* 2. Journey */}
                                            <div className="w-full xl:w-64 space-y-1">
                                                <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                                    <span className="text-sm font-medium truncate">From: {trip.pickup}</span>
                                                </div>
                                                <div className="pl-1 border-l border-gray-300 dark:border-slate-600 h-3 ml-1"></div>
                                                <div className="flex items-center gap-2 text-gray-800 dark:text-slate-200">
                                                    <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                                    <span className="text-sm font-medium truncate">To: {trip.destination}</span>
                                                </div>
                                            </div>

                                            {/* 3. Cab Rate */}
                                            <div className="w-full xl:w-24">
                                                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Rate</p>
                                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                                    {trip.cabRateAtBooking ? `₹${trip.cabRateAtBooking}/km` : 'N/A'}
                                                </p>
                                            </div>

                                            {/* 4. Cab Details */}
                                            <div className="w-full xl:w-40">
                                                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Cab Details</p>
                                                <div className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                                    <p className="truncate" title={trip.cabResponse?.cabModel}>{trip.cabResponse?.cabModel || 'N/A'}</p>
                                                    <p className="text-xs text-gray-400 uppercase">{trip.cabResponse?.cabNumber || 'N/A'}</p>
                                                </div>
                                            </div>

                                            {/* 5. Customer */}
                                            <div className="w-full xl:w-32">
                                                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Customer</p>
                                                <p className="text-sm font-medium text-gray-700 dark:text-slate-300 truncate" title={trip.customerResponse?.name}>
                                                    {trip.customerResponse?.name || 'N/A'}
                                                </p>
                                            </div>

                                            {/* 6. Amount */}
                                            <div className="w-full xl:w-24 text-left xl:text-right">
                                                <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider">Amount</p>
                                                <p className="text-lg font-bold text-gray-800 dark:text-slate-100">₹{trip.billAmount}</p>
                                            </div>

                                            {/* 7. Status */}
                                            <div className="w-full xl:w-auto flex justify-start xl:justify-end flex-grow">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(trip.tripStatus)}`}>
                                                    {getDisplayStatus(trip.tripStatus)}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                    loading={loading}
                                />
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/30 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock size={32} className="opacity-40 text-gray-500 dark:text-slate-400" />
                                </div>
                                <p className="text-gray-500 dark:text-slate-400 font-medium">No trips found matching your filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyTrips;


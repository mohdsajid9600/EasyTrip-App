import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    getDriverActiveBooking,
    getDriverCab,
    getDriverCompletedBookings
} from '../../api/driverService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Car, IndianRupee, MapPin, Navigation, Clock, AlertCircle } from 'lucide-react';

const DriverDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State
    const [activeTrip, setActiveTrip] = useState(null);
    const [cab, setCab] = useState(null);
    const [earnings, setEarnings] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Parallel fetch
            const [tripRes, cabRes, earningsRes] = await Promise.all([
                getDriverActiveBooking().catch(e => ({ success: false })),
                getDriverCab().catch(e => ({ success: false })),
                getDriverCompletedBookings().catch(e => ({ success: false }))
            ]);

            // 1. Active Trip
            if (tripRes.success && tripRes.data) {
                setActiveTrip(tripRes.data);
            } else {
                setActiveTrip(null);
            }

            // 2. Cab
            if (cabRes.success && cabRes.data) {
                setCab(cabRes.data);
            } else {
                setCab(null);
            }

            // 3. Earnings
            if (earningsRes.success && earningsRes.data && earningsRes.data.content) {
                const total = earningsRes.data.content.reduce((sum, trip) => sum + (trip.billAmount || 0), 0);
                setEarnings(total);
            }

        } catch (error) {
            console.error("Dashboard data load error", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    // Cab is available ONLY if driver is not busy with a trip
    const isDriverBusy = !!activeTrip;

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Hello, {user?.name}</h1>
                    <p className="text-gray-500 dark:text-slate-400 font-medium flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-bold uppercase">Driver</span>
                        Welcome back to your dashboard
                    </p>
                </div>
                <Button onClick={() => navigate('/driver/trips')} variant="outline">
                    View All Trips
                </Button>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 1. Trip Status Card (Span 2 cols) */}
                <div className="lg:col-span-2">
                    {activeTrip ? (
                        <Card className="h-full border-l-4 border-green-500 bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-800 relative overflow-hidden p-6">
                            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10">
                                <Navigation size={150} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
                                            <span className="relative flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </span>
                                            Current Active Trip
                                        </h2>
                                        <p className="text-sm text-green-600 dark:text-green-300 mt-1">You are currently on a trip.</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold text-gray-800 dark:text-slate-100">₹{activeTrip.billAmount}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Est. Fare</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/60 dark:bg-slate-900/30 p-4 rounded-xl backdrop-blur-sm border border-green-100 dark:border-green-900/30">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Pickup</label>
                                        <div className="flex items-start gap-2 mt-1">
                                            <MapPin size={18} className="text-green-600 dark:text-green-400 mt-0.5" />
                                            <p className="font-semibold text-gray-800 dark:text-slate-200">{activeTrip.pickup}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Destination</label>
                                        <div className="flex items-start gap-2 mt-1">
                                            <MapPin size={18} className="text-red-600 dark:text-red-400 mt-0.5" />
                                            <p className="font-semibold text-gray-800 dark:text-slate-200">{activeTrip.destination}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <Button onClick={() => navigate('/driver/trips')} className="w-full bg-green-600 hover:bg-green-700 text-white">
                                        Manage Trip
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="h-full border-l-4 border-blue-500 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-800 flex flex-col justify-center items-center text-center p-8">
                            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                                <Clock size={40} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Waiting for New Requests</h2>
                            <p className="text-gray-500 dark:text-slate-400 mt-2 max-w-sm">
                                You have no active trips. Stay online to receive new trip requests from customers nearby.
                            </p>
                            <div className="mt-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold animate-pulse">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    Online & Available
                                </span>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column Stack */}
                <div className="space-y-8">

                    {/* 2. My Cab Card */}
                    <Card className="border-t-4 border-yellow-500 p-6 hover:shadow-lg transition-shadow cursor-pointer relative group" onClick={() => navigate('/driver/cab')}>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-700 dark:text-slate-200 text-lg flex items-center gap-2">
                                <Car size={20} className="text-yellow-600" /> My Cab
                            </h3>
                        </div>

                        {cab ? (
                            <div className="space-y-3">
                                <div>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{cab.cabNumber}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-400">{cab.cabModel}</p>
                                </div>
                                {!isDriverBusy ? (
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                        <span className="text-sm font-bold text-green-700">Available</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-400"></span>
                                        <span className="text-sm font-medium text-red-700">Busy / Unavailable</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">No cab registered.</p>
                                <Button size="sm" variant="link" className="text-blue-600 p-0 mt-1">Register Now</Button>
                            </div>
                        )}
                    </Card>

                    {/* 3. Earnings Card */}
                    <Card className="border-t-4 border-purple-500 p-6">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-700 dark:text-slate-200 text-lg flex items-center gap-2">
                                <IndianRupee size={20} className="text-purple-600" /> Earnings
                            </h3>
                            <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded">Total</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-4xl font-bold text-gray-800 dark:text-slate-100">₹{earnings.toLocaleString()}</p>
                            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Total revenue earned</p>
                        </div>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;

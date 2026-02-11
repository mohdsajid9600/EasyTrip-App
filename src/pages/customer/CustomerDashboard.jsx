import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Calendar, MapPin, Clock, CreditCard } from 'lucide-react';

const CustomerDashboard = () => {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const [activeRide, setActiveRide] = useState(null);
    const [loadingRide, setLoadingRide] = useState(true);

    useEffect(() => {
        fetchActiveRide();
    }, []);

    const fetchActiveRide = async () => {
        try {
            const response = await api.get('/booking/customer/active');
            if (response.data?.success && response.data?.data) {
                setActiveRide(response.data.data);
            } else {
                setActiveRide(null);
            }
        } catch (error) {
            console.log("No active ride or error:", error);
            setActiveRide(null);
        } finally {
            setLoadingRide(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Top Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Hello, {user?.name || 'Traveler'}!</h1>
                <p className="opacity-90">Role: <span className="font-semibold">{role}</span></p>
                <p className="mt-4 text-lg">Ready for your next journey?</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* 1. Booking Window Card */}
                <div
                    onClick={() => navigate('/customer/booking-window')}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-indigo-500 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Booking Window</h3>
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400">Book a new cab, manage current bookings, and view history.</p>
                </div>

                {/* 2. Active Ride Card */}
                <div
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 border-green-500 relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">Active Ride</h3>
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400">
                            <MapPin size={24} />
                        </div>
                    </div>

                    {loadingRide ? (
                        <p className="text-gray-400">Loading ride details...</p>
                    ) : activeRide ? (
                        <div className="space-y-4">
                            {/* Trip Info */}
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPin className="text-red-500 mt-1 flex-shrink-0" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">Destination</p>
                                        <p className="font-medium text-gray-700 dark:text-slate-200 leading-tight">{activeRide.destination}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="text-green-500 mt-1 flex-shrink-0" size={16} />
                                    <div>
                                        <p className="text-xs text-gray-400 dark:text-slate-500">Pickup</p>
                                        <p className="font-medium text-gray-700 dark:text-slate-200 leading-tight">{activeRide.pickup}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Driver & Cab Info Section */}
                            {activeRide.cabResponse ? (
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg space-y-2">
                                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-600 pb-2">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Driver</p>
                                            {activeRide.cabResponse.driverResponse ? (
                                                <>
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{activeRide.cabResponse.driverResponse.name}</p>
                                                    <p className="text-[10px] text-gray-400">{activeRide.cabResponse.driverResponse.email}</p>
                                                </>
                                            ) : <p className="text-xs text-gray-400 italic">Not Assigned</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 dark:text-slate-400 uppercase font-bold">Cab</p>
                                            <p className="text-sm font-semibold text-gray-800 dark:text-slate-100">{activeRide.cabResponse.cabModel}</p>
                                            <p className="text-[10px] text-gray-500 dark:text-slate-400 font-mono bg-gray-200 dark:bg-slate-600 px-1 rounded inline-block">{activeRide.cabResponse.cabNumber}</p>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[10px] font-medium text-gray-600 dark:text-slate-300 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-800">
                                            Cab Rate: {activeRide.cabResponse.perKmRate ? `₹${activeRide.cabResponse.perKmRate}/km` : 'Not Available'}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-700 text-center">
                                    Searching for a driver...
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-1">
                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${activeRide.tripStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                    activeRide.tripStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                        activeRide.tripStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {activeRide.tripStatus}
                                </span>
                                <span className="font-bold text-gray-800 text-lg">₹{activeRide.billAmount}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No active ride at the moment.</p>
                    )}
                </div>

                {/* 3. History of Bookings Card */}
                <div
                    onClick={() => navigate('/customer/bookings')}
                    className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-orange-500 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">History</h3>
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Clock size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-slate-400">View your past trips and transaction details.</p>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;

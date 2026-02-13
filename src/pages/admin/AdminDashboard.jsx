import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getActiveCustomersCount,
    getActiveDriversCount,
    getActiveBookingsCount,
    getAvailableCabsCount,
    getCompletedBookingsForEarnings
} from '../../api/adminService';
import { Card } from '../../components/ui/Card';
import AppLoader from '../../components/ui/AppLoader';
import { Users, Car, Calendar, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activeCustomers: 0,
        activeDrivers: 0,
        activeRides: 0,
        availableCabs: 0,
        earnings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [
                customersRes,
                driversRes,
                bookingsRes,
                cabsRes,
                earningsRes
            ] = await Promise.all([
                getActiveCustomersCount(),
                getActiveDriversCount(),
                getActiveBookingsCount(),
                getAvailableCabsCount(),
                getCompletedBookingsForEarnings(100) // Best effort size
            ]);

            // Calculate earnings
            let totalEarnings = 0;
            if (earningsRes.success && earningsRes.data?.content) {
                totalEarnings = earningsRes.data.content.reduce((sum, booking) => {
                    return sum + (booking.billAmount || 0);
                }, 0);
            }

            setStats({
                activeCustomers: customersRes?.success ? customersRes.data.totalElements : 0,
                activeDrivers: driversRes?.success ? driversRes.data.totalElements : 0,
                activeRides: bookingsRes?.success ? bookingsRes.data.totalElements : 0,
                availableCabs: cabsRes?.success ? cabsRes.data.totalElements : 0,
                earnings: totalEarnings
            });
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    const dashboardCards = [
        {
            title: "Active Customers",
            value: stats.activeCustomers,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
            onClick: () => navigate('/admin/dashboard/active-customers'),
            desc: "Currently active users"
        },
        {
            title: "Active Drivers",
            value: stats.activeDrivers,
            icon: Car,
            color: "text-green-600",
            bg: "bg-green-100",
            onClick: () => navigate('/admin/drivers/active'),
            desc: "Drivers online & working"
        },
        {
            title: "Active Rides",
            value: stats.activeRides,
            icon: Activity,
            color: "text-orange-600",
            bg: "bg-orange-100",
            onClick: () => navigate('/admin/dashboard/active-rides'),
            desc: "Trips in progress"
        },
        {
            title: "Available Cabs",
            value: stats.availableCabs,
            icon: Car,
            color: "text-indigo-600",
            bg: "bg-indigo-100",
            onClick: () => navigate('/admin/cabs', { state: { filter: 'AVAILABLE' } }),
            desc: "Cabs ready for booking"
        },
        {
            title: "Total Earnings",
            value: `₹${stats.earnings.toLocaleString()}`,
            icon: DollarSign,
            color: "text-yellow-600",
            bg: "bg-yellow-100",
            desc: "Revenue from recent rides"
        }
    ];

    if (loading) {
        return <AppLoader text="Loading dashboard..." />;
    }

    return (
        <div className="space-y-8 animate-fade-in-up pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Hello, {user?.name || "Admin"}!</h1>
                <p className="text-blue-200">System overview & control panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {dashboardCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card
                            key={index}
                            className={`p-6 hover:shadow-lg transition-all duration-300 border-l-4 dark:border-l-[4px] ${card.onClick ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                            style={{ borderLeftColor: card.color.split('-')[1] }} // Fallback approach for dynamic border color if needed
                            onClick={card.onClick}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.bg} dark:bg-opacity-20`}>
                                    <Icon size={24} className={card.color} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
                                <p className="text-2xl font-bold text-gray-800 dark:text-slate-100">{card.value}</p>
                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">{card.desc}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Add quick action cards here if needed later */}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

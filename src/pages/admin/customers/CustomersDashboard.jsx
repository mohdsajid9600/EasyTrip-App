import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { User, UserCheck, UserX, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getActiveCustomersCount, getInactiveCustomersCount, getTotalCustomersCount } from '../../../api/adminService';

const CustomersDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        active: 0,
        inactive: 0,
        total: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [activeRes, inactiveRes, totalRes] = await Promise.all([
                    getActiveCustomersCount(),
                    getInactiveCustomersCount(),
                    getTotalCustomersCount()
                ]);

                setStats({
                    active: activeRes?.success ? activeRes.data.totalElements : 0,
                    inactive: inactiveRes?.success ? inactiveRes.data.totalElements : 0,
                    total: totalRes?.success ? totalRes.data.totalElements : 0
                });
            } catch (error) {
                console.error("Failed to fetch customer stats", error);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: "Active Customers",
            value: stats.active,
            icon: UserCheck,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-100 dark:bg-slate-700",
            path: "/admin/customers/active",
            desc: "Currently active users"
        },
        {
            title: "Inactive Customers",
            value: stats.inactive,
            icon: UserX,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-100 dark:bg-slate-700",
            path: "/admin/customers/inactive",
            desc: "Deactivated or banned accounts"
        },
        {
            title: "Total Customers",
            value: stats.total,
            icon: User,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-100 dark:bg-slate-700",
            path: "/admin/customers/all",
            desc: "All registered users"
        },
        {
            title: "Search Customers",
            value: "Search",
            icon: Search,
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-100 dark:bg-slate-700",
            path: "/admin/customers/search",
            desc: "Find by Filter"
        }
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customers Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card
                            key={index}
                            className="p-6 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1 border-l-4 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 dark:shadow-lg"
                            style={{ borderLeftColor: card.color.split('-')[1] }} // Keep the border color logic or generic? User said "border border-slate-700", but didn't explicitly ban the left border highlight. I'll keep it as it adds nice color coding unless it conflicts. The user said "border border-slate-700", so I will ensure proper specific border.
                            onClick={() => navigate(card.path)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <Icon size={24} className={card.color} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-gray-500 dark:text-slate-300 text-sm font-medium mb-1">{card.title}</h3>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                                <p className="text-xs text-gray-400 dark:text-slate-400 mt-2">{card.desc}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default CustomersDashboard;

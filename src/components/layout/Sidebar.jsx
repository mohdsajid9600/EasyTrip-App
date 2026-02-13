import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { ROLES } from '../../utils/constants';
import { LayoutDashboard, User, Car, Calendar, LogOut, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onToggle }) => {
    const { role, logout } = useAuth();
    const { showConfirm } = useModal();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = {
        [ROLES.CUSTOMER]: [
            { label: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
            { label: 'Profile', path: '/customer/profile', icon: User },
            { label: 'Booking Window', path: '/customer/booking-window', icon: Calendar },
            { label: 'Cab Availability', path: '/customer/cab-availability', icon: Car },
        ],
        [ROLES.DRIVER]: [
            { label: 'Dashboard', path: '/driver/dashboard', icon: LayoutDashboard },
            { label: 'My Trips', path: '/driver/trips', icon: Car },
            { label: 'My Cab', path: '/driver/cab', icon: Car },
            { label: 'Profile', path: '/driver/profile', icon: User },
        ],
        [ROLES.ADMIN]: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { label: 'Customers', path: '/admin/customers', icon: User },
            { label: 'Drivers', path: '/admin/drivers', icon: User },
            { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
            { label: 'Cab Queries', path: '/admin/cabs', icon: Car },
        ]
    };

    const items = menuItems[role] || [];

    return (
        <div
            className={clsx(
                "bg-gray-900 dark:bg-slate-950 text-white flex flex-col transition-all duration-300 ease-in-out relative group h-full flex-shrink-0 overflow-hidden",
                isOpen ? "w-64" : "w-0"
            )}
        >
            <div className="w-64 flex flex-col h-full"> {/* Inner wrapper to maintain content width */}
                <div className="p-6 border-b border-gray-800 dark:border-slate-800 flex justify-between items-center bg-gray-900 dark:bg-slate-950">
                    <h1 className="text-2xl font-bold text-blue-500 whitespace-nowrap">EasyTrip</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    if (window.innerWidth < 768) {
                                        onToggle();
                                    }
                                }}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors whitespace-nowrap",
                                    isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 dark:hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon size={20} className="min-w-[20px]" />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 dark:border-slate-800">
                    <button
                        onClick={() => {
                            showConfirm({
                                title: "Logout",
                                message: "Are you sure you want to logout?",
                                confirmText: "Logout",
                                variant: "danger",
                                onConfirm: logout
                            });
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
                    >
                        <LogOut size={20} className="min-w-[20px]" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Hover Fold Button */}
                {isOpen && (
                    <button
                        onClick={onToggle}
                        className="hidden md:flex absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-50 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700"
                        title="Fold Sidebar"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Sidebar;

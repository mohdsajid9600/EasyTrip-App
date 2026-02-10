import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, User, LogOut } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const DashboardLayout = () => {
    const { user, logout, role, profile } = useAuth();
    const navigate = useNavigate();
    // Default closed on mobile, open on desktop
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    // Handle window resize to auto-adjust
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Wrapper */}
            <div className="fixed inset-y-0 left-0 z-40 md:static md:inset-auto h-full flex-shrink-0 shadow-xl md:shadow-none">
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setSidebarOpen(!isSidebarOpen)}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">

                {/* Top Bar (Visible when sidebar is closed) */}
                {(!isSidebarOpen) && (
                    <header className="bg-white dark:bg-slate-800 shadow-sm h-16 flex items-center justify-between px-6 shrink-0 transition-all animate-fade-in-down z-20 border-b border-transparent dark:border-slate-700">
                        {/* LEFT: Hamburger (Unfold) */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition"
                            title="Open Sidebar"
                        >
                            <Menu size={24} />
                        </button>

                        {/* RIGHT: Profile & Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition focus:outline-none text-gray-700 dark:text-slate-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                                    <User size={18} />
                                </div>
                                <span className="font-medium hidden sm:block">My Profile</span>
                            </button>

                            {/* Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden z-50 animate-fade-in-up">
                                    <div
                                        onClick={() => {
                                            const targetRole = role ? role.toLowerCase() : 'customer';
                                            navigate(`/${targetRole}/profile`);
                                            setShowProfileMenu(false);
                                        }}
                                        className="p-4 border-b border-gray-50 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                        title="Go to Profile"
                                    >
                                        <p className="font-bold text-gray-800 dark:text-slate-100 truncate">{user?.name || profile?.name || 'User'}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{user?.email}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setShowProfileMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 p-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth relative">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            <ThemeToggle />
        </div>
    );
};

export default DashboardLayout;

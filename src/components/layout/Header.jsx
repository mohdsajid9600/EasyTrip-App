import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Menu, X, Car, Sun, Moon, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
    const { user, role } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent background scrolling and freeze position when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.overflowY = "hidden";
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.overflowY = "";
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || "0") * -1);
            }
        }

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.overflowY = "";
        };
    }, [isMenuOpen]);

    const getDashboardLink = () => {
        if (role === 'ADMIN') return '/admin/dashboard';
        if (role === 'DRIVER') return '/driver/dashboard';
        return '/customer/dashboard';
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Become a Driver', path: '/signup', state: { role: 'DRIVER' } },
        { name: 'Support', path: '/support' },
    ];

    const isLoginPage = location.pathname === '/login';

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b h-16 ${scrolled || isLoginPage
                ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border-gray-200 dark:border-slate-700'
                : 'bg-transparent border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">

                    {/* Left Section: Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Car size={24} strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                            Easy<span className="text-indigo-600">Trip</span>
                        </span>
                    </Link>

                    {/* Center Section: Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                state={link.state}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive(link.path)
                                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                                    : 'text-gray-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Section: Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {user ? (
                            <Link to={getDashboardLink()}>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold shadow-indigo-500/25 shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="outline" className="px-6 py-2.5 rounded-full border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-bold hover:bg-gray-50 dark:hover:bg-slate-800">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full font-bold shadow-indigo-500/25 shadow-xl hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-600 dark:text-slate-300"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-800 rounded-xl transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer Overlay */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible pointer-events-none'}`}>
                {/* Backdrop Overlay */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Panel */}
                <div className={`absolute right-0 top-0 bottom-0 w-full max-w-[320px] bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Header inside menu */}
                    <div className="flex justify-between items-center p-6 border-b dark:border-slate-800">
                        <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                            Easy<span className="text-indigo-600">Trip</span>
                        </span>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl text-gray-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-grow overflow-y-auto p-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                state={link.state}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center justify-between py-4 border-b border-gray-50 dark:border-slate-800/50 text-lg font-bold transition-colors ${isActive(link.path)
                                    ? 'text-indigo-600'
                                    : 'text-gray-600 dark:text-slate-300 hover:text-indigo-600'
                                    }`}
                            >
                                <span>{link.name}</span>
                                <ChevronRight size={20} className={isActive(link.path) ? 'opacity-100' : 'opacity-30'} />
                            </Link>
                        ))}

                        <div className="pt-6 space-y-4">
                            {!user ? (
                                <>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full">
                                        <Button variant="outline" className="w-full py-4 text-lg rounded-2xl font-bold border-2">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block w-full">
                                        <Button className="w-full py-4 text-lg rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/20">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            ) : (
                                <Link to={getDashboardLink()} onClick={() => setIsMenuOpen(false)} className="block w-full">
                                    <Button className="w-full py-4 text-lg rounded-2xl bg-indigo-600 text-white font-bold">
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Footer inside menu */}
                    <div className="p-6 border-t dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30">
                        <p className="text-xs text-center text-gray-400 font-medium tracking-widest">
                            &copy; 2026 EASYTRIP PLATFORM
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;


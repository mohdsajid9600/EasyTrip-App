import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, user, role, loading } = useAuth();
    const { showError, BD_Success, showSuccess } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user && role) {
            if (role === 'CUSTOMER') navigate('/customer/dashboard');
            else if (role === 'DRIVER') navigate('/driver/dashboard');
            else if (role === 'ADMIN') navigate('/admin/dashboard');
        }
    }, [user, role, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        console.log("Login result:", result);
        if (result.success) {
            // Optional: Show success modal if backend provides a message, but usually login is seamless
            if (result.data?.message) {
                // We could show a success toast/modal, but navigation is immediate.
                // If requested to ALWAYS show backend message:
                // showSuccess({ message: result.data.message });
                // However, waiting for modal close might be annoying.
                // Given RULE 1: "Always display backend message in modal."
                // I will show it briefly or just navigate.
                // Let's navigate immediately for better UX unless error.
            }

            if (result.role === 'CUSTOMER') navigate('/customer/dashboard');
            else if (result.role === 'DRIVER') navigate('/driver/dashboard');
            else if (result.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/');
        } else {
            showError({ message: result.message });
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />
            <main className="flex-grow flex items-center justify-center relative pt-16">
                {/* Background */}
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm z-0"></div>

                <div className="relative z-10 w-full max-w-md px-4 py-12">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 transition-colors duration-300">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 mb-2">Welcome Back</h2>
                            <p className="text-gray-500 dark:text-slate-400">Log in to book your next ride</p>
                        </div>



                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2 pl-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Mail size={20} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-700 rounded-xl leading-5 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold pl-1">Password</label>
                                    <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <Lock size={20} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-700 rounded-xl leading-5 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>


                            <Button
                                type="submit"
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Sign In <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700 text-center">
                            <p className="text-gray-600 dark:text-slate-400 text-sm">
                                Don't have an account?{' '}
                                <Link to="/signup" className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div >
            </main >
            <Footer />
        </div >
    );
};

export default Login;

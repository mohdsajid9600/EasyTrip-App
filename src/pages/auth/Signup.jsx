import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Lock, Mail, User, ArrowRight, Car, Users, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'CUSTOMER'
    });
    const [showPassword, setShowPassword] = useState(false);
    const { showSuccess, showError, showConfirm } = useModal();
    const { register, user, role, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.role) {
            setFormData(prev => ({ ...prev, role: location.state.role }));
        }
    }, [location.state]);

    useEffect(() => {
        if (!loading && user && role) {
            if (role === 'CUSTOMER') navigate('/customer/dashboard');
            else if (role === 'DRIVER') navigate('/driver/dashboard');
            else if (role === 'ADMIN') navigate('/admin/dashboard');
        }
    }, [user, role, loading, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleSelect = (selectedRole) => {
        setFormData({ ...formData, role: selectedRole });
    };

    const performRegistration = async () => {
        try {
            const response = await register(formData);
            showSuccess({
                title: "Registration Successful",
                message: response?.message || "Your account has been created successfully! Redirecting to login...",
                onConfirm: () => navigate('/login')
            });
        } catch (err) {
            showError({ title: "Registration Failed", message: err.toString() });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.role === 'DRIVER') {
            showConfirm({
                title: "License Confirmation",
                message: "Do you have a valid driving license?",
                confirmText: "Yes, I have",
                cancelText: "No",
                onConfirm: performRegistration
            });
        } else {
            performRegistration();
        }
    };

    const roles = [
        {
            id: 'CUSTOMER',
            title: 'Passenger',
            description: 'Book rides easily and travel comfortably.',
            icon: <Users className="w-8 h-8" />,
            color: 'indigo'
        },
        {
            id: 'DRIVER',
            title: 'Driver',
            description: 'Drive and earn by accepting trip requests.',
            icon: <Car className="w-8 h-8" />,
            color: 'green'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-white dark:bg-slate-900 transition-colors duration-300 overflow-x-hidden">
            <Header />
            <main className="flex-grow flex pt-16 animate-fade-in min-h-[calc(100vh-64px)]">

                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20">
                    <div className="w-full max-w-lg">
                        <div className="mb-10 animate-fade-in-up">
                            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Join EasyTrip</h2>
                            <p className="text-lg text-gray-500 dark:text-slate-400">Create your account and start your journey today.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Role Selection Blocks */}
                            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold pl-1 uppercase tracking-wider">I want to join as a...</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {roles.map((r) => (
                                        <div
                                            key={r.id}
                                            onClick={() => handleRoleSelect(r.id)}
                                            className={`
                                                relative cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02]
                                                ${formData.role === r.id
                                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/40 dark:border-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500/50 animate-scale-in'
                                                    : 'border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 shadow-sm'}
                                            `}
                                        >
                                            <div className={`
                                                mb-4 p-3 rounded-xl inline-block transition-transform duration-300
                                                ${formData.role === r.id ? 'bg-indigo-600 text-white scale-110 shadow-md' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'}
                                            `}>
                                                {r.icon}
                                            </div>
                                            <h3 className={`text-lg font-bold mb-1 ${formData.role === r.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-gray-900 dark:text-white'}`}>
                                                {r.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                                                {r.description}
                                            </p>

                                            {formData.role === r.id && (
                                                <div className="absolute top-4 right-4 text-indigo-600 dark:text-indigo-400 animate-scale-in">
                                                    <CheckCircle2 size={24} fill="currentColor" className="text-white dark:text-slate-900" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <div>
                                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2 pl-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-4 py-4 border-2 border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition duration-200"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 dark:text-slate-300 text-sm font-bold mb-2 pl-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Lock size={20} />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="block w-full pl-12 pr-12 py-4 border-2 border-gray-100 dark:border-slate-800 rounded-2xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 transition duration-200"
                                            placeholder="Minimum 8 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                <Button
                                    type="submit"
                                    className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-indigo-500/25"
                                >
                                    Get Started <ArrowRight size={20} className="ml-2" />
                                </Button>
                            </div>
                        </form>

                        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800 text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
                            <p className="text-gray-600 dark:text-slate-400 font-medium">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-all">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Illustration */}
                <div className="hidden lg:block w-1/2 relative bg-indigo-900 overflow-hidden min-h-[calc(100vh-64px)]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-black/60 backdrop-blur-[2px]"></div>

                    <div className="relative h-full flex flex-col items-center justify-center text-white p-12 text-center">
                        <div className="max-w-md animate-fade-in">
                            <div className="mb-8 flex justify-center">
                                <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                                    <Car size={64} strokeWidth={1} className="text-indigo-300" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold mb-6">Experience Seamless Travel with EasyTrip</h2>
                            <p className="text-xl text-indigo-100 opacity-90 leading-relaxed font-light">
                                "The journey of a thousand miles begins with a single step. Let EasyTrip take care of the rest."
                            </p>

                            <div className="mt-12 grid grid-cols-3 gap-6 opacity-80">
                                <div className="text-center">
                                    <p className="text-3xl font-bold">10k+</p>
                                    <p className="text-sm font-medium uppercase tracking-widest text-indigo-300">Riders</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold">5k+</p>
                                    <p className="text-sm font-medium uppercase tracking-widest text-indigo-300">Drivers</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold">4.9</p>
                                    <p className="text-sm font-medium uppercase tracking-widest text-indigo-300">Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Signup;


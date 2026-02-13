import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import AppSelect from '../../components/ui/AppSelect';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

const CreateProfile = () => {
    const { user, refreshProfile, logout } = useAuth();
    const { showError } = useModal();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        age: '',
        gender: 'MALE',
        mobileNo: ''
    });
    const [loading, setLoading] = useState(false);

    const handleBack = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/customer/create-profile', formData);
            if (response.data?.success) {
                await refreshProfile();
                navigate('/customer/dashboard');
            }
        } catch (err) {
            console.error("Profile creation failed", err);

            // Extract error message
            let errorMessage = "Failed to create profile. Please try again.";

            if (err.response?.data) {
                const { message, errors } = err.response.data;

                if (errors && typeof errors === 'object') {
                    // Handle validation errors (Map<String, String>)
                    // Format: "Name: name required, Age: age must be 18+"
                    const validationMessages = Object.entries(errors)
                        .map(([field, msg]) => `${field}: ${msg}`)
                        .join('\n');
                    errorMessage = validationMessages || message || errorMessage;
                } else {
                    errorMessage = message || errorMessage;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            showError({
                title: "Profile Creation Failed",
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
            <Header />
            <main className="flex-grow flex items-center justify-center relative pt-16">
                {/* Background */}
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')" }}></div>
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm z-0"></div>

                <div className="relative z-10 w-full max-w-lg px-4 py-12">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Back</span>
                        </button>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/50 dark:border-slate-700/50">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-slate-100">
                                Complete Your Profile
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
                                You must create a profile to continue.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Full Name
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        minLength={2}
                                        maxLength={50}
                                        pattern="^[A-Za-z ]+$"
                                        title="Name must contain only letters and spaces"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Email Address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="mobileNo" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Mobile Number
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="mobileNo"
                                        name="mobileNo"
                                        type="tel"
                                        required
                                        pattern="^[6-9]\d{9}$"
                                        title="Enter a valid 10-digit mobile number starting with 6-9"
                                        placeholder="e.g. 9876543210"
                                        value={formData.mobileNo}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Age
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="age"
                                        name="age"
                                        type="number"
                                        required
                                        min="15"
                                        max="90"
                                        placeholder="18-90"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                                    Gender
                                </label>
                                <div className="mt-1">
                                    <AppSelect
                                        name="gender"
                                        value={formData.gender}
                                        onChange={(val) => setFormData({ ...formData, gender: val })}
                                        options={[
                                            { value: 'MALE', label: 'Male' },
                                            { value: 'FEMALE', label: 'Female' },
                                            { value: 'OTHER', label: 'Other' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateProfile;

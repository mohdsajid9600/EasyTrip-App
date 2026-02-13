import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDriverProfile } from '../../api/driverService';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { User, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import AppSelect from '../../components/ui/AppSelect';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { ArrowLeft } from 'lucide-react';
import AppLoader from '../../components/ui/AppLoader';

const CreateDriverProfile = () => {
    const { user, refreshProfile, logout } = useAuth();
    const { showError } = useModal();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: '',
        mobileNo: '',
        license: '',
        experience: '',
        gender: 'MALE'
    });
    const [loading, setLoading] = useState(false);

    const handleBack = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await createDriverProfile(formData);
            if (response.success) {
                await refreshProfile();
                navigate('/driver/dashboard');
            } else {
                if (response.message) {
                    throw new Error(response.message);
                }
                navigate('/driver/dashboard');
            }
        } catch (err) {
            console.error("Profile creation failed", err);

            let errorMessage = "Failed to create profile. Please try again.";

            if (err.response?.data) {
                const { message, errors } = err.response.data;
                // Check if errors is an object (map of field errors)
                if (errors && typeof errors === 'object' && !Array.isArray(errors)) {
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
                title: "Creation Failed",
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
            {loading && <AppLoader text="Creating profile..." />}
            <Header />
            <main className="flex-grow flex items-center justify-center relative pt-16">
                {/* Background */}
                <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')" }}></div>
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

                    <Card className="py-8 px-6 shadow-2xl sm:rounded-2xl sm:px-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-white/50 dark:border-slate-700/50">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
                            <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-slate-100">
                                Driver Profile Setup
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600 dark:text-slate-400">
                                Complete your profile to start driving with EasyTrip.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>

                            <div className="relative">
                                <Input
                                    label="Full Name"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    minLength={2}
                                    maxLength={50}
                                    pattern="^[A-Za-z ]+$"
                                    title="Name must contain only letters and spaces"
                                    placeholder="Enter your full name"
                                    icon={User}
                                />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Mobile Number"
                                    id="mobileNo"
                                    value={formData.mobileNo}
                                    onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                                    required
                                    type="tel"
                                    pattern="^[6-9]\d{9}$"
                                    title="Enter a valid 10-digit mobile number starting with 6-9"
                                    placeholder="e.g. 9876543210"
                                />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Age"
                                    id="age"
                                    type="number"
                                    required
                                    min="18"
                                    max="60"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                    placeholder="18-60"
                                    icon={Calendar}
                                />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Driving License"
                                    id="license"
                                    value={formData.license}
                                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                                    required
                                    minLength={5}
                                    maxLength={20}
                                    pattern="^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$"
                                    title="Enter a valid driving license number"
                                    placeholder="e.g. MH1220110012345"
                                />
                            </div>

                            <div className="relative">
                                <Input
                                    label="Experience (Years)"
                                    id="experience"
                                    type="number"
                                    required
                                    min="0"
                                    max="40"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    placeholder="e.g. 5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                    Gender
                                </label>
                                <AppSelect
                                    name="gender"
                                    value={formData.gender}
                                    onChange={(val) => setFormData({ ...formData, gender: val })}
                                    options={[
                                        { value: 'MALE', label: 'Male' },
                                        { value: 'FEMALE', label: 'Female' },
                                        { value: 'OTHER', label: 'Other' }
                                    ]}
                                    placeholder="Select Gender"
                                />
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 shadow-md text-sm font-medium rounded-xl hover:translate-y-[-2px] transition-transform"
                                >
                                    {loading ? 'Creating Profile...' : 'Complete Profile'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateDriverProfile;

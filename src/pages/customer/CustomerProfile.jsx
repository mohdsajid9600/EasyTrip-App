import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerProfile, updateCustomerProfile, deleteCustomerProfile } from '../../api/customerService';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import AppSelect from '../../components/ui/AppSelect';
import { User, Mail, LogOut, Lock, Save, X } from 'lucide-react';
import AppLoader from '../../components/ui/AppLoader';

const CustomerProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { showConfirm, showSuccess, showError } = useModal();

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'MALE',
        mobileNo: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const response = await getCustomerProfile();
            if (response?.success) {
                setProfile(response.data);
                setFormData({
                    name: response.data.name || '',
                    age: response.data.age || '',
                    gender: response.data.gender || 'MALE',
                    mobileNo: response.data.mobileNo || ''
                });
            } else {
                showError({ title: "Load Failed", message: response.message || 'Failed to load profile' });
            }
        } catch (error) {
            console.error("Load profile error", error);
            showError({ title: "Load Failed", message: 'Failed to load profile' });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name Validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (!/^[A-Za-z ]+$/.test(formData.name)) {
            newErrors.name = "Name must contain only letters and spaces";
        }

        // Age Validation
        if (!formData.age) {
            newErrors.age = "Age is required";
        } else if (formData.age < 18 || formData.age > 90) { // Customer age typically 18+
            newErrors.age = "Age must be between 18 and 90";
        }

        // Mobile Validation
        if (!formData.mobileNo) {
            newErrors.mobileNo = "Mobile number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = "Invalid mobile number (starts with 6-9, 10 digits)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // if (!validateForm()) return;

        setSubmitting(true);
        try {
            const response = await updateCustomerProfile(formData);
            if (response?.success) {
                setEditing(false);
                loadProfile(); // Refresh
                showSuccess({ title: "Success", message: 'Profile updated successfully' });
            } else {
                if (response.errors && typeof response.errors === 'object') {
                    setErrors(response.errors);
                } else {
                    showError({ title: "Update Failed", message: response.message || 'Failed to update profile' });
                }
            }
        } catch (error) {
            console.error("Update profile error", error);
            if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
                setErrors(error.response.data.errors);
            } else {
                showError({ title: "Update Failed", message: error.response?.data?.message || 'Failed to update profile' });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeactivate = () => {
        showConfirm({
            title: "Deactivate Account",
            message: "Are you sure you want to deactivate your profile? You will be logged out immediately.",
            confirmText: "Yes, Deactivate",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: performDeactivation
        });
    };

    const performDeactivation = async () => {
        try {
            const response = await deleteCustomerProfile();
            if (response?.success) {
                showSuccess({
                    title: "Account Deactivated",
                    message: "Your profile has been deactivated successfully.",
                    onConfirm: async () => {
                        await logout();
                        navigate('/');
                    }
                });
            } else {
                showError({ title: "Deactivation Failed", message: response.message || "Failed to deactivate" });
            }
        } catch (error) {
            console.error("Deactivation failed", error);
            showError({ title: "Deactivation Failed", message: error.message || "Failed to deactivate profile." });
        }
    };

    if (loading) return <AppLoader text="Loading profile..." />;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-fade-in-up pb-24 px-4 md:px-0">
            {submitting && <AppLoader text="Updating profile..." />}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-slate-100 pl-1">My Profile</h1>

            <Card className="border-t-4 border-blue-500 p-5 lg:p-8 shadow-lg">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                    {/* Avatar / Logo Section */}
                    <div className="flex-shrink-0">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 border-4 border-white dark:border-slate-700 shadow-md">
                            <User size={56} className="lg:w-16 lg:h-16" />
                        </div>
                    </div>

                    <div className="flex-grow w-full">
                        <div className="flex flex-col xl:flex-row justify-between items-center xl:items-start mb-6 gap-4 xl:gap-0">
                            <div className="text-center xl:text-left">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{profile.name}</h2>
                                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3 mt-2 xl:mt-1">
                                    <p className="text-gray-500 dark:text-slate-400 flex items-center gap-2 text-sm lg:text-base">
                                        <Mail size={16} /> {profile.email}
                                    </p>
                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${profile.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {profile.status || 'UNKNOWN'}
                                    </span>
                                </div>
                            </div>

                            {!editing && (
                                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                                    <Button onClick={() => navigate('/customer/change-password')} variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto h-11 sm:h-auto">
                                        <Lock size={16} /> <span className="whitespace-nowrap">Change Password</span>
                                    </Button>
                                    <Button onClick={() => setEditing(true)} variant="secondary" className="w-full sm:w-auto h-11 sm:h-auto">Edit Profile</Button>
                                </div>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleUpdate} className="space-y-4 bg-gray-50 dark:bg-slate-700/50 p-4 lg:p-6 rounded-xl border border-gray-200 dark:border-slate-600">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Enter full name"
                                        error={errors.name}
                                        className="bg-white dark:bg-slate-800"
                                    />

                                    <Input
                                        label="Age"
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        required
                                        min="18"
                                        max="90"
                                        placeholder="Enter age (18-90)"
                                        error={errors.age}
                                        className="bg-white dark:bg-slate-800"
                                    />

                                    <Input
                                        label="Mobile Number"
                                        value={formData.mobileNo}
                                        onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                                        required
                                        placeholder="Enter 10 digit mobile number"
                                        maxLength={10}
                                        error={errors.mobileNo}
                                        className="bg-white dark:bg-slate-800"
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Gender</label>
                                        <div className="bg-white dark:bg-slate-800 rounded-lg">
                                            <AppSelect
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
                                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                    </div>
                                </div>
                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-600 mt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                name: profile.name,
                                                age: profile.age,
                                                gender: profile.gender,
                                                mobileNo: profile.mobileNo
                                            });
                                            setErrors({});
                                        }}
                                        className="h-11 md:h-10 px-5 flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <X size={16} /> Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="h-11 md:h-10 px-5 flex items-center justify-center gap-2 w-full sm:w-auto"
                                    >
                                        <Save size={16} /> {submitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-slate-600 hover:shadow-sm transition-shadow">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Age</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg mt-1">{profile.age || 'N/A'} <span className="text-sm font-normal text-gray-500">Years</span></p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-slate-600 hover:shadow-sm transition-shadow">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Gender</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg mt-1 capitalize">{profile.gender ? profile.gender.toLowerCase() : 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-slate-600 hover:shadow-sm transition-shadow">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Mobile Number</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg mt-1">{profile.mobileNo || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-slate-600 hover:shadow-sm transition-shadow">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Account Status</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-1 ${profile.status === 'ACTIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {profile.status || 'UNKNOWN'}
                                    </span>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </Card>

            {/* Deactivate Profile Card */}
            <Card className="border-t-4 border-red-500 p-5 lg:p-8 bg-red-50 dark:bg-red-900/10 shadow-lg">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6 text-center lg:text-left">
                    <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400 flex-shrink-0">
                        <LogOut size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Deactivate Profile</h3>
                        <p className="text-gray-600 dark:text-slate-400 mt-2 max-w-xl text-sm lg:text-base">
                            Deactivating your profile will disable your account and log you out immediately.
                            You cannot perform this action if you have an active ride.
                        </p>
                        <Button
                            onClick={handleDeactivate}
                            className="mt-6 bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2 w-full sm:w-auto mx-auto lg:mx-0 h-11 md:h-10"
                        >
                            <LogOut size={18} /> Deactivate Account
                        </Button>
                    </div>
                </div>
            </Card>

        </div>
    );
};

export default CustomerProfile;

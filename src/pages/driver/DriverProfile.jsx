import { useState, useEffect } from 'react';
import { getDriverProfile, updateDriverProfile, deleteDriverProfile } from '../../api/driverService';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import AppSelect from '../../components/ui/AppSelect';
import { User, Mail, LogOut, Lock, Save, X } from 'lucide-react';

const DriverProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const { showConfirm, showSuccess, showError } = useModal();

    // Initial state matches partial DriverResponse
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        mobileNo: '',
        gender: 'MALE',
        license: '',
        experience: ''
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
            const response = await getDriverProfile();
            if (response?.success) {
                setProfile(response.data);
                setFormData({
                    name: response.data.name || '',
                    age: response.data.age || '',
                    mobileNo: response.data.mobileNo || '',
                    gender: response.data.gender || 'MALE',
                    license: response.data.license || '',
                    experience: response.data.experience !== null ? response.data.experience : ''
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
        } else if (formData.age < 18 || formData.age > 60) {
            newErrors.age = "Age must be between 18 and 60";
        }

        // Mobile Validation
        if (!formData.mobileNo) {
            newErrors.mobileNo = "Mobile number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
            newErrors.mobileNo = "Invalid mobile number (starts with 6-9, 10 digits)";
        }

        // License Validation
        if (!formData.license) {
            newErrors.license = "Driving License is required";
        } else if (!/^[A-Z0-9]{10,20}$/.test(formData.license)) {
            newErrors.license = "License must be 10-20 uppercase alphanumeric characters";
        }

        // Experience Validation
        if (formData.experience === '' || formData.experience < 0) {
            newErrors.experience = "Valid experience is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // if (!validateForm()) return;

        setSubmitting(true);
        try {
            const response = await updateDriverProfile(formData);
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
            const response = await deleteDriverProfile();
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up pb-10">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">My Profile</h1>

            <Card className="border-t-4 border-blue-500 p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    {/* Avatar / Logo Section */}
                    <div className="flex-shrink-0">
                        <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 border-4 border-white dark:border-slate-700 shadow-lg">
                            <User size={64} />
                        </div>
                    </div>

                    <div className="flex-grow w-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{profile.name}</h2>
                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                    <p className="text-gray-500 dark:text-slate-400 flex items-center gap-2">
                                        <Mail size={16} /> {profile.email}
                                    </p>
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${profile.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {profile.status || 'UNKNOWN'}
                                    </span>
                                </div>
                            </div>

                            {!editing && (
                                <div className="flex gap-2">
                                    <Button onClick={() => navigate('/driver/change-password')} variant="outline" className="flex items-center gap-2">
                                        <Lock size={16} /> Change Password
                                    </Button>
                                    <Button onClick={() => setEditing(true)} variant="secondary">Edit Profile</Button>
                                </div>
                            )}
                        </div>

                        {editing ? (
                            <form onSubmit={handleUpdate} className="space-y-4 bg-gray-50 dark:bg-slate-700/50 p-6 rounded-xl border border-gray-200 dark:border-slate-600">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Enter full name"
                                        error={errors.name}
                                    />

                                    <Input
                                        label="Age"
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        required
                                        min="18"
                                        max="60"
                                        placeholder="Enter age (18-60)"
                                        error={errors.age}
                                    />

                                    <Input
                                        label="Mobile Number"
                                        value={formData.mobileNo}
                                        onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                                        required
                                        placeholder="Enter 10 digit mobile number"
                                        maxLength={10}
                                        error={errors.mobileNo}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Gender</label>
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
                                        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                                    </div>

                                    <Input
                                        label="Driving License"
                                        value={formData.license}
                                        onChange={(e) => setFormData({ ...formData, license: e.target.value.toUpperCase() })}
                                        required
                                        placeholder="DL0120120001234"
                                        error={errors.license}
                                    />

                                    <Input
                                        label="Experience (Years)"
                                        type="number"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        required
                                        min="0"
                                        placeholder="Years of experience"
                                        error={errors.experience}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                name: profile.name,
                                                age: profile.age,
                                                mobileNo: profile.mobileNo,
                                                gender: profile.gender,
                                                license: profile.license,
                                                experience: profile.experience
                                            });
                                            setErrors({});
                                        }}
                                        className="h-10 px-5 flex items-center justify-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="h-10 px-5 flex items-center justify-center gap-2"
                                    >
                                        <Save size={16} /> {submitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Age</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg">{profile.age || 'N/A'} Years</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Gender</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg capitalize">{profile.gender ? profile.gender.toLowerCase() : 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Mobile Number</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg">{profile.mobileNo || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Driving License</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg break-all">{profile.license || 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Experience</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg">{profile.experience !== null && profile.experience !== undefined ? `${profile.experience} Years` : 'N/A'}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </Card>

            {/* Deactivate Profile Card */}
            <Card className="border-t-4 border-red-500 p-8 bg-red-50 dark:bg-red-900/10">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                        <LogOut size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">Deactivate Profile</h3>
                        <p className="text-gray-600 dark:text-slate-400 mt-2 max-w-xl">
                            Deactivating your profile will disable your account and log you out.
                            This action is reversible only by contacting support or reactivating via login flow (if supported).
                        </p>
                        <Button
                            onClick={handleDeactivate}
                            className="mt-6 bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center gap-2"
                        >
                            <LogOut size={18} /> Deactivate Account
                        </Button>
                    </div>
                </div>
            </Card>

        </div>
    );
};

export default DriverProfile;

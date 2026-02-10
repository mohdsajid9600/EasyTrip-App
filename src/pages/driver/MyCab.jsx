import { useState, useEffect } from 'react';
import { getDriverCab, registerCab, updateCab, getDriverActiveBooking } from '../../api/driverService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Car, AlertTriangle, Save, X, Edit2 } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

const MyCab = () => {
    const { showSuccess, showError } = useModal();
    const [cab, setCab] = useState(null);
    const [activeTrip, setActiveTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        cabNumber: '',
        cabModel: '',
        perKmRate: ''
    });

    // State for validation errors
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCab();
    }, []);

    const fetchCab = async () => {
        setLoading(true);
        try {
            const [cabResponse, tripResponse] = await Promise.all([
                getDriverCab(),
                getDriverActiveBooking().catch(() => ({ success: false, data: null }))
            ]);

            if (cabResponse?.success && cabResponse?.data) {
                setCab(cabResponse.data);
                setFormData({
                    cabNumber: cabResponse.data.cabNumber,
                    cabModel: cabResponse.data.cabModel,
                    perKmRate: cabResponse.data.perKmRate
                });
                setIsRegistering(false);
            } else {
                setCab(null);
            }

            if (tripResponse?.success && tripResponse?.data) {
                setActiveTrip(tripResponse.data);
            } else {
                setActiveTrip(null);
            }

        } catch (error) {
            console.error("Fetch cab/trip error", error);
            setCab(null);
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const cabNumberRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;

        if (!formData.cabNumber) {
            newErrors.cabNumber = 'Cab Number is required';
        } else if (!cabNumberRegex.test(formData.cabNumber)) {
            newErrors.cabNumber = 'Invalid Cab Number format (e.g. KA01AB1234)';
        }

        if (!formData.cabModel) {
            newErrors.cabModel = 'Cab Model is required';
        } else if (formData.cabModel.length < 2) {
            newErrors.cabModel = 'Cab Model must be at least 2 characters';
        }

        if (!formData.perKmRate) {
            newErrors.perKmRate = 'Per KM Rate is required';
        } else if (Number(formData.perKmRate) <= 0) {
            newErrors.perKmRate = 'Per KM Rate must be positive';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await registerCab(formData);
            if (response?.success) {
                // Success Modal
                showSuccess({
                    title: "Cab Registered Successfully",
                    message: "Your cab has been added to your profile."
                });

                // Update state and view
                setCab(response.data);
                setIsRegistering(false);
                setFormData({ cabNumber: '', cabModel: '', perKmRate: '' }); // Clear form
                setErrors({}); // Clear errors
            } else {
                if (response.errors && typeof response.errors === 'object') {
                    setErrors(response.errors);
                } else {
                    showError({
                        title: "Registration Failed",
                        message: response.message || "Registration failed"
                    });
                }
            }
        } catch (error) {
            console.error("Register cab error", error);

            if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
                setErrors(error.response.data.errors);
            } else {
                showError({
                    title: "Registration Failed",
                    message: error.response?.data?.message || "Something went wrong. Please try again."
                });
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await updateCab(formData);
            if (response?.success) {
                setCab(response.data);
                setIsEditing(false);
                showSuccess({ title: "Success", message: "Cab updated successfully!" });
            } else {
                showError({ title: "Update Failed", message: response.message || "Update failed" });
            }
        } catch (error) {
            console.error("Update cab error", error);

            let errorMessage = "Something went wrong";

            if (!error.response) {
                errorMessage = "Server unreachable";
            } else {
                errorMessage =
                    error.response?.data?.message ||
                    error.response?.data?.errors?.[0] ||
                    error.response?.data?.validationErrors?.[0]?.message ||
                    error.message ||
                    "Failed to update cab";
            }

            showError({ title: "Update Failed", message: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Checking cab status...</div>;

    // --- CASE 1: NO CAB REGISTERED ---
    if (!cab) {
        if (!isRegistering) {
            return (
                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">My Cab</h1>
                    <Card className="p-10 border-2 border-dashed border-gray-300 dark:border-slate-700 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition cursor-pointer" onClick={() => setIsRegistering(true)}>
                        <div className="p-4 bg-gray-100 dark:bg-slate-800 rounded-full mb-4 text-gray-400 dark:text-slate-500">
                            <Car size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-slate-200">Cab Not Registered</h3>
                        <p className="text-gray-500 dark:text-slate-400 mt-2">You haven't registered a cab yet. Register now to start receiving trips.</p>
                        <Button className="mt-6" onClick={(e) => { e.stopPropagation(); setIsRegistering(true); }}>
                            Register Cab
                        </Button>
                    </Card>
                </div>
            )
        } else {
            return (
                <div className="max-w-xl mx-auto space-y-6 animate-fade-in-up">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Register New Cab</h1>
                    <Card className="p-8">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <Input
                                    label="Cab Number / Plate"
                                    value={formData.cabNumber}
                                    onChange={(e) => setFormData({ ...formData, cabNumber: e.target.value })}
                                    required
                                    placeholder="e.g. KA-01-AB-1234"
                                    className={errors.cabNumber ? "border-red-500" : ""}
                                />
                                {errors.cabNumber && <p className="text-red-500 text-xs mt-1">{errors.cabNumber}</p>}
                            </div>

                            <div>
                                <Input
                                    label="Cab Model"
                                    value={formData.cabModel}
                                    onChange={(e) => setFormData({ ...formData, cabModel: e.target.value })}
                                    required
                                    placeholder="e.g. Toyota Innova"
                                    className={errors.cabModel ? "border-red-500" : ""}
                                />
                                {errors.cabModel && <p className="text-red-500 text-xs mt-1">{errors.cabModel}</p>}
                            </div>

                            <div>
                                <Input
                                    label="Per KM Rate (₹)"
                                    type="number"
                                    value={formData.perKmRate}
                                    onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
                                    required
                                    min="1"
                                    placeholder="e.g. 15"
                                    className={errors.perKmRate ? "border-red-500" : ""}
                                />
                                {errors.perKmRate && <p className="text-red-500 text-xs mt-1">{errors.perKmRate}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => { setIsRegistering(false); setErrors({}); }}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Register Cab
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )
        }
    }

    // --- CASE 2: CAB REGISTERED ---
    const isDriverBusy = !!activeTrip;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">My Cab Details</h1>

            <Card className="border-t-4 border-yellow-500 p-8">
                <div className="flex flex-col md:flex-row items-start gap-8">
                    <div className="w-full md:w-auto flex-shrink-0 flex justify-center">
                        <div className="w-40 h-40 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-inner">
                            <Car size={64} />
                        </div>
                    </div>

                    <div className="flex-grow w-full">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{cab.cabModel}</h2>
                                <p className="text-gray-500 dark:text-slate-400 font-mono mt-1 text-lg">{cab.cabNumber}</p>
                            </div>
                            {!isEditing && (
                                <Button onClick={() => setIsEditing(true)} variant="outline" className="flex items-center gap-2">
                                    <Edit2 size={16} /> Edit Cab
                                </Button>
                            )}
                        </div>

                        {isEditing ? (
                            <form onSubmit={handleUpdate} className="space-y-4 bg-gray-50 dark:bg-slate-700/50 p-6 rounded-xl border border-gray-200 dark:border-slate-600">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Cab Number"
                                        value={formData.cabNumber}
                                        onChange={(e) => setFormData({ ...formData, cabNumber: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Cab Model"
                                        value={formData.cabModel}
                                        onChange={(e) => setFormData({ ...formData, cabModel: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Per KM Rate (₹)"
                                        type="number"
                                        value={formData.perKmRate}
                                        onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                cabNumber: cab.cabNumber,
                                                cabModel: cab.cabModel,
                                                perKmRate: cab.perKmRate
                                            });
                                        }}
                                        className="h-10 px-5 flex items-center justify-center gap-2"
                                    >
                                        <X size={16} /> Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`h-10 px-5 flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        <Save size={16} /> {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Rate / KM</p>
                                    <p className="font-semibold text-gray-800 dark:text-slate-100 text-lg">₹{cab.perKmRate}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Status</p>
                                    <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${cab.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                                        {cab.status}
                                    </span>
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-slate-400 uppercase">Availability</p>
                                    {!isDriverBusy ? (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="text-sm font-bold text-green-700">Available</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="h-2 w-2 rounded-full bg-red-400"></span>
                                            <span className="text-sm font-medium text-red-700">Busy / Unavailable</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default MyCab;

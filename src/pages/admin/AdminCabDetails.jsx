import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCabById } from '../../api/adminService';
import { Card } from '../../components/ui/Card';
import { Car, User, ArrowLeft, Loader2, AlertCircle, Clock, Calendar } from 'lucide-react';

const AdminCabDetails = () => {
    const { cabId } = useParams();
    const navigate = useNavigate();
    const [cab, setCab] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCabDetails = async () => {
            try {
                setLoading(true);
                const response = await getCabById(cabId);
                const cabData = response.data || response;
                setCab(cabData);
            } catch (err) {
                console.error("Error fetching cab details:", err);
                setError("Failed to load cab details.");
            } finally {
                setLoading(false);
            }
        };

        if (cabId) {
            fetchCabDetails();
        }
    }, [cabId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-10 h-96">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
            <p className="text-gray-500">Loading cab details...</p>
        </div>
    );

    if (error || !cab) return (
        <div className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Error Loading Cab</h3>
            <p className="text-gray-500">{error || "Cab not found."}</p>
            <button
                onClick={() => navigate('/admin/cabs')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
                Back to Cabs
            </button>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/cabs')}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 transition"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">{cab.cabModel}</h1>
                        <p className="text-sm font-mono text-gray-500 dark:text-slate-400">
                            {cab.cabNumber}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${cab.isAvailable ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'}`}>
                        {cab.isAvailable ? 'AVAILABLE' : 'BUSY'}
                    </span>
                    <span className={`text-xs font-medium ${cab.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
                        {cab.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Section 1: Cab Information */}
                <Card className="p-6 h-fit">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-slate-100">
                        <Car className="text-indigo-600 dark:text-indigo-400" size={20} /> Cab Information
                    </h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        <div>
                            <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Cab Number</span>
                            <span className="font-mono font-medium text-gray-900 dark:text-slate-100 bg-gray-50 dark:bg-slate-700/50 px-2 py-1 rounded inline-block">
                                {cab.cabNumber}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Cab Model</span>
                            <span className="font-semibold text-gray-900 dark:text-slate-100">{cab.cabModel}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Per Km Rate</span>
                            <span className="font-semibold text-gray-900 dark:text-slate-100">₹{cab.perKmRate}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Current Status</span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold border ${cab.isAvailable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${cab.isAvailable ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                {cab.isAvailable ? 'AVAILABLE' : 'BUSY'}
                            </span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Registration Status</span>
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${cab.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30'}`}>
                                {cab.status}
                            </span>
                        </div>
                    </div>
                </Card>

                {/* Section 2: Driver Information */}
                <Card className="p-6 h-fit">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-slate-100">
                        <User className="text-indigo-600 dark:text-indigo-400" size={20} /> Driver Information
                    </h3>
                    {cab.driverResponse ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-slate-700">
                                <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg dark:bg-indigo-900/30 dark:text-indigo-400">
                                    {cab.driverResponse.name?.charAt(0) || "D"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-slate-100">{cab.driverResponse.name}</h4>
                                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${cab.driverResponse.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        {cab.driverResponse.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Mobile</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate block" title={cab.driverResponse.mobileNo}>
                                        {cab.driverResponse.mobileNo || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Email</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100 text-sm truncate block" title={cab.driverResponse.email}>
                                        {cab.driverResponse.email || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">License</span>
                                    <span className="font-mono font-medium text-gray-900 dark:text-slate-100 text-sm truncate block" title={cab.driverResponse.license}>
                                        {cab.driverResponse.license || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Experience</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100 text-sm">
                                        {cab.driverResponse.experience ? `${cab.driverResponse.experience} years` : "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1">Gender</span>
                                    <span className="font-medium text-gray-900 dark:text-slate-100 text-sm capitalize">
                                        {cab.driverResponse.gender || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6 text-gray-500 dark:text-slate-400 italic">
                            No driver assigned to this cab.
                        </div>
                    )}
                </Card>

                {/* Section 3: Account Meta Card (Full Width) */}
                <Card className="p-6 h-fit lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-slate-100">
                        <Clock className="text-indigo-600 dark:text-indigo-400" size={20} /> Meta Information
                    </h3>
                    <div className="flex flex-wrap gap-8">
                        <div>
                            <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
                                <Calendar size={12} /> Profile Created At
                            </span>
                            <span className="font-medium text-gray-900 dark:text-slate-100">
                                {cab.driverResponse?.createProfileAt ? new Date(cab.driverResponse.createProfileAt).toLocaleString() : "N/A"}
                            </span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
                                <Clock size={12} /> Last Updated At
                            </span>
                            <span className="font-medium text-gray-900 dark:text-slate-100">
                                {cab.driverResponse?.lastUpdateAt ? new Date(cab.driverResponse.lastUpdateAt).toLocaleString() : "N/A"}
                            </span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminCabDetails;

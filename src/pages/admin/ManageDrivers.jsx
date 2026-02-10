import { useState, useEffect } from 'react';
import { getAllDrivers, verifyDriver, deactivateDriver } from '../../api/adminService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useModal } from '../../context/ModalContext';
import { User, Mail, BadgeCheck, Ban, ShieldCheck } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

const ManageDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadDrivers();
    }, [page, pageSize]);

    const loadDrivers = async () => {
        setLoading(true);
        try {
            const response = await getAllDrivers(page, pageSize);
            const data = response.data || response;
            if (data && data.content) {
                setDrivers(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setDrivers([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const { showConfirm, showSuccess, showError } = useModal();

    const handleVerify = (id) => {
        showConfirm({
            title: "Activate Driver",
            message: "Are you sure you want to verify and activate this driver?",
            confirmText: "Yes, Activate",
            variant: "primary",
            onConfirm: async () => {
                try {
                    await verifyDriver(id);
                    showSuccess({ title: "Success", message: "Driver verified/activated successfully" });
                    loadDrivers();
                } catch (error) {
                    showError({ title: "Operation Failed", message: "Failed to verify driver" });
                }
            }
        });
    };

    const handleDeactivate = (id) => {
        showConfirm({
            title: "Deactivate Driver",
            message: "Are you sure you want to deactivate this driver?",
            confirmText: "Yes, Deactivate",
            variant: "danger",
            onConfirm: async () => {
                try {
                    await deactivateDriver(id);
                    showSuccess({ title: "Success", message: "Driver deactivated successfully" });
                    loadDrivers();
                } catch (error) {
                    showError({ title: "Operation Failed", message: "Failed to deactivate driver" });
                }
            }
        });
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-slate-100">
                <User className="text-green-600" /> Manage Drivers
            </h2>
            {loading ? (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-slate-400">Loading drivers...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid gap-4">
                        {drivers.map(d => (
                            <Card key={d.id || d.driverId} className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6 hover:shadow-md transition bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${d.active ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100">{d.name}</h3>
                                        <div className="space-y-1 mt-1">
                                            <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                                                <Mail size={14} /> {d.email}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-slate-300 font-mono bg-gray-50 dark:bg-slate-700/50 inline-block px-2 rounded">
                                                License: {d.licenseNumber || "N/A"}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${d.active ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'}`}>
                                                {d.active ? 'ACTIVE' : 'INACTIVE'}
                                            </span>
                                            {d.status && (
                                                <span className="text-xs text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 px-2 py-0.5 rounded">
                                                    {d.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {!d.active ? (
                                        <Button
                                            onClick={() => handleVerify(d.id || d.driverId)}
                                            className="bg-green-600 hover:bg-green-700 text-white border-none cursor-pointer"
                                        >
                                            <ShieldCheck size={16} className="mr-2" /> Verify & Activate
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleDeactivate(d.id || d.driverId)}
                                            className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 cursor-pointer"
                                        >
                                            <Ban size={16} className="mr-2" /> Deactivate
                                        </Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                        {drivers.length === 0 && (
                            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                                <p className="text-gray-500 dark:text-slate-400">No registered drivers found.</p>
                            </div>
                        )}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};

export default ManageDrivers;


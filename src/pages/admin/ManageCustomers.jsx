import { useState, useEffect } from 'react';
import { getAllCustomers, activateCustomer, deactivateCustomer } from '../../api/adminService';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { toast } from 'react-toastify';
import { useModal } from '../../context/ModalContext';
import { User, Mail, Phone, Shield, ShieldOff } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

const ManageCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        loadCustomers();
    }, [page, pageSize]);

    const loadCustomers = async () => {
        setLoading(true);
        try {
            const response = await getAllCustomers(page, pageSize);
            // Handle both {success, data: {content, totalPages}} and {content, totalPages} formats
            const data = response.data || response;
            if (data && data.content) {
                setCustomers(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setCustomers([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('Failed to load customers', error);
            toast.error("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const { showConfirm, showSuccess, showError } = useModal();

    const toggleStatus = (id, isActive) => {
        const action = isActive ? 'Deactivate' : 'Activate';
        showConfirm({
            title: `${action} Customer`,
            message: `Are you sure you want to ${action.toLowerCase()} this customer?`,
            confirmText: `Yes, ${action}`,
            variant: isActive ? 'danger' : 'primary',
            onConfirm: () => performToggle(id, isActive)
        });
    };

    const performToggle = async (id, isActive) => {
        try {
            if (isActive) {
                await deactivateCustomer(id);
            } else {
                await activateCustomer(id);
            }
            showSuccess({ title: "Success", message: `Customer ${isActive ? 'deactivated' : 'activated'} successfully` });
            loadCustomers();
        } catch (error) {
            console.error("Status toggle error", error);
            showError({ title: "Operation Failed", message: "Failed to update customer status" });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-slate-100">
                <User className="text-blue-600" /> Manage Customers
            </h2>
            {loading ? (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-slate-400">Loading customers...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid gap-4">
                        {customers.map(c => (
                            <Card key={c.id || c.customerId} className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6 transition hover:shadow-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${c.active ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100">{c.name}</h3>
                                        <div className="space-y-1 mt-1">
                                            <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                                                <Mail size={14} /> {c.email}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                                                <Phone size={14} /> {c.phone || "No phone"}
                                            </p>
                                        </div>
                                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-bold border ${c.active ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'}`}>
                                            {c.active ? 'ACTIVE' : 'INACTIVE'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant={c.active ? 'outline' : 'primary'}
                                        onClick={() => toggleStatus(c.id || c.customerId, c.active)}
                                        className={c.active ? "text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20" : "bg-green-600 hover:bg-green-700 text-white border-none cursor-pointer"}
                                    >
                                        {c.active ? (
                                            <> <ShieldOff size={16} className="mr-2" /> Deactivate </>
                                        ) : (
                                            <> <Shield size={16} className="mr-2" /> Activate </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        {customers.length === 0 && (
                            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                                <p className="text-gray-500 dark:text-slate-400">No customers found.</p>
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

export default ManageCustomers;


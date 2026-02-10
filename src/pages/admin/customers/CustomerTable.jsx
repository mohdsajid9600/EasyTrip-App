import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { User, Mail, ChevronRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/ui/Pagination';

const FILTER_TYPES = {
    ALL: 'ALL',
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
};

const CustomerTable = ({
    fetchData,
    title,
    emptyMessage = "No customers found."
}) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.ALL);

    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, [fetchData, page, pageSize]);

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await fetchData(page, pageSize);
            const data = response.data || response;
            if (data && data.content) {
                setCustomers(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setCustomers([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error(error);
            setCustomers([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (customer) => {
        const status = customer.status || (customer.active ? "ACTIVE" : "INACTIVE");
        if (status === 'ACTIVE') {
            return {
                badge: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
                dot: 'bg-green-500 animate-pulse',
                iconBg: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                label: status
            };
        } else {
            return {
                badge: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800',
                dot: 'bg-red-500',
                iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                label: status
            };
        }
    };

    const filteredCustomers = activeFilter === FILTER_TYPES.ALL
        ? customers
        : customers.filter(c => {
            const status = c.status || (c.active ? "ACTIVE" : "INACTIVE");
            return status === activeFilter;
        });

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/admin/customers')} className="p-2 border-none">
                        <User size={20} />
                    </Button>
                    <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-slate-100">
                        {title}
                    </h2>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2">
                    {Object.values(FILTER_TYPES).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${activeFilter === filter
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-slate-400">Loading customers...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredCustomers.map(c => {
                            const styles = getStatusStyles(c);
                            return (
                                <Card key={c.customerId} className="p-6 hover:shadow-lg transition group flex flex-col justify-between bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-lg group-hover:bg-opacity-80 transition ${styles.iconBg}`}>
                                                <User size={24} />
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold border flex items-center gap-1.5 ${styles.badge}`}>
                                                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}></span>
                                                {styles.label}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 truncate" title={c.name}>{c.name}</h3>
                                            <p className="text-sm font-mono text-gray-500 bg-gray-50 inline-block px-2 rounded border border-gray-100 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600">
                                                ID: CDE{c.customerId}
                                            </p>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 truncate" title={c.email}>
                                                <Mail size={14} /> {c.email}
                                            </div>
                                            {c.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 truncate">
                                                    <Phone size={14} /> {c.phone}
                                                </div>
                                            )}
                                            <div className="flex gap-3 text-xs text-gray-500 dark:text-slate-500 pt-1">
                                                <span>Age: {c.age || 'N/A'}</span>
                                                <span>•</span>
                                                <span className="capitalize">Gender: {c.gender || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-end">
                                        <button
                                            onClick={() => navigate(`/admin/customers/${c.customerId}`)}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition cursor-pointer bg-transparent border-none"
                                        >
                                            View Details <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </Card>
                            );
                        })}
                        {filteredCustomers.length === 0 && (
                            <div className="col-span-full text-center py-10 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                                <p className="text-gray-500 dark:text-slate-400">{emptyMessage}</p>
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

export default CustomerTable;


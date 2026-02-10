import { useState, useEffect } from 'react';
import { getAllCabs, getAvailableCabs } from '../../api/adminService';
import { Card } from '../../components/ui/Card';
import { Car, User, Filter, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';

const FILTER_TYPES = {
    ALL: 'ALL',
    AVAILABLE: 'AVAILABLE'
};

const ManageCabs = () => {
    const [cabs, setCabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState(FILTER_TYPES.ALL);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Check for incoming filter request from navigation state
        if (location.state?.filter) {
            const incomingFilter = location.state.filter;
            if (Object.values(FILTER_TYPES).includes(incomingFilter)) {
                setActiveFilter(incomingFilter);
            }
        }
    }, [location.state]);

    useEffect(() => {
        loadCabs();
    }, [page, pageSize, activeFilter]);

    const loadCabs = async () => {
        setLoading(true);
        try {
            let response;
            if (activeFilter === FILTER_TYPES.AVAILABLE) {
                response = await getAvailableCabs(page, pageSize);
            } else {
                response = await getAllCabs(page, pageSize);
            }

            const data = response.data || response;
            if (data && data.content) {
                setCabs(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setCabs([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error("Failed to load cabs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-slate-100">
                    <Car className="text-indigo-600" /> Cab Queries / Fleet
                </h2>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2">
                    {Object.values(FILTER_TYPES).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => {
                                setActiveFilter(filter);
                                setPage(0); // Reset to first page on filter change
                            }}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${activeFilter === filter
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                                }`}
                        >
                            {filter.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-slate-400">Loading cabs...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {cabs.map((cab, index) => (
                            <Card key={cab.cabId || index} className="p-6 hover:shadow-lg transition group bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition dark:bg-indigo-900/30 dark:text-indigo-400 dark:group-hover:bg-indigo-900/50">
                                        <Car size={24} />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${cab.isAvailable ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'}`}>
                                            {cab.isAvailable ? 'AVAILABLE' : 'BUSY'}
                                        </span>
                                        <span className={`text-xs font-mono font-medium ${cab.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
                                            {cab.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">{cab.cabModel}</h3>
                                    <p className="text-sm font-mono text-gray-500 bg-gray-50 inline-block px-2 rounded border border-gray-100 dark:text-slate-400 dark:bg-slate-700/50 dark:border-slate-600">
                                        {cab.cabNumber}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-slate-400">Rate / km</span>
                                            <span className="font-semibold text-gray-800 dark:text-slate-100">₹{cab.perKmRate}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500 dark:text-slate-400">Driver</span>
                                            <span className="flex items-center gap-1 text-gray-800 font-medium dark:text-slate-200">
                                                <User size={14} className="text-gray-400 dark:text-slate-500" />
                                                {cab.driverResponse?.name || "Unknown"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => navigate(`/admin/cabs/${cab.cabId}`)}
                                            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 transition"
                                        >
                                            View Details <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {cabs.length === 0 && (
                            <div className="col-span-full text-center py-10 bg-white dark:bg-slate-800 rounded-lg border border-dashed border-gray-300 dark:border-slate-700">
                                <p className="text-gray-500 dark:text-slate-400">No cabs matching filter "{activeFilter}".</p>
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

export default ManageCabs;


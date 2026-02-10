import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { Car, AlertCircle, CheckCircle } from 'lucide-react';
import Pagination from '../../components/ui/Pagination';

const CabAvailability = () => {
    const [availableCabs, setAvailableCabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const [showList, setShowList] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(9);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAvailableCabs();
    }, [page, pageSize]);

    const fetchAvailableCabs = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/cab/available?page=${page}&size=${pageSize}`);
            const data = response.data?.data || response.data;
            if (data && data.content) {
                setAvailableCabs(data.content);
                setTotalElements(data.totalElements || 0);
                setTotalPages(data.totalPages || 0);
            } else {
                setAvailableCabs([]);
                setTotalElements(0);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Failed to fetch cabs", err);
            setError("Unable to check cab availability at the moment.");
            setAvailableCabs([]);
            setTotalElements(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    const isAvailable = totalElements > 0;

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Cab Availability Status</h1>

            {loading && page === 0 && !showList ? (
                <div className="p-8 text-center text-gray-500 dark:text-slate-400">Checking availability...</div>
            ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 dark:bg-red-900/30 dark:text-red-300 p-4 text-red-700">
                    <p>{error}</p>
                </div>
            ) : (
                <>
                    {/* Status Card */}
                    <div
                        onClick={() => isAvailable && setShowList(!showList)}
                        className={`p-8 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] cursor-pointer flex items-center justify-between
                        ${isAvailable
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-200'
                                : 'bg-gradient-to-r from-red-500 to-pink-600 text-white cursor-not-allowed opacity-90'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full ${isAvailable ? 'bg-white/20' : 'bg-white/10'}`}>
                                <Car size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">
                                    {isAvailable ? 'Cabs Available' : 'Not Available'}
                                </h2>
                                <p className="opacity-90 mt-1">
                                    {isAvailable
                                        ? `${totalElements} cabs are currently active nearby.`
                                        : 'Sorry, no cabs are available at the moment.'}
                                </p>
                            </div>
                        </div>
                        <div>
                            {isAvailable ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                        </div>
                    </div>

                    {/* Available Cabs List */}
                    {showList && isAvailable && (
                        <div className="mt-8 space-y-6 animate-fade-in-up">
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-4">Available Cabs List</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {availableCabs.map((cab, index) => (
                                    <Card key={index} className="border-l-4 border-indigo-500 dark:border-indigo-500 bg-white dark:bg-slate-800 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800 dark:text-slate-100">{cab.cabModel}</h4>
                                                <p className="text-sm text-gray-500 dark:text-slate-400 font-mono mt-1">{cab.cabNumber}</p>
                                            </div>
                                            <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold dark:bg-indigo-900/30 dark:text-indigo-300">
                                                ₹{cab.perKmRate}/km
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
                                            <p className="text-sm text-gray-600 dark:text-slate-400 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Driver: <span className="font-semibold text-gray-800 dark:text-slate-200">{cab.driverResponse?.name || 'N/A'}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 pl-4 flex items-center gap-1">
                                                Rating: <span className="text-yellow-500 font-bold">{cab.driverResponse?.rating || 'New'} ⭐</span>
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                loading={loading}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CabAvailability;


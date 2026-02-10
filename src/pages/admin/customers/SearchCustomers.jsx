import { useState } from 'react';
import AppSelect from '../../../components/ui/AppSelect';
import BackButton from '../../../components/ui/BackButton';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { searchCustomersByGenderAndAge, searchCustomersByAgeGreater, activateCustomer, deactivateCustomer } from '../../../api/adminService';
import CustomerTable from './CustomerTable';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../../context/ModalContext';

const SearchCustomers = () => {
    const navigate = useNavigate();
    const { showConfirm, showSuccess, showError } = useModal();

    const genderOptions = [
        { value: 'MALE', label: 'Male' },
        { value: 'FEMALE', label: 'Female' },
        { value: 'OTHER', label: 'Other' }
    ];

    const [searchType, setSearchType] = useState('genderAge'); // 'genderAge' or 'ageGreater'
    const [gender, setGender] = useState('MALE'); // Default to MALE as per backend likely expecting specific Enums
    const [age, setAge] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let response;
            if (searchType === 'genderAge') {
                // Warning: Backend might expect uppercase MALE/FEMALE. 
                // Assuming user input allows selecting standard values.
                response = await searchCustomersByGenderAndAge(gender, age);
            } else {
                response = await searchCustomersByAgeGreater(age);
            }

            if (response?.success && response?.data) {
                // Determine if response.data is array or PageResponse
                // The backend analysis said "Returns all customers" so possibly a list or page
                // Typically backend code inspection showed PageResponse<CustomerResponse> usually.
                // Assuming standard PageResponse pattern from adminService wrapper
                setResults(response.data.content || response.data || []);
            } else {
                setResults([]);
                showError({ title: "No Results", message: response.message || "No customers found matching criteria." });
            }

        } catch (error) {
            console.error(error);
            showError({ title: "Search Failed", message: "An error occurred while searching." });
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Wrapper for re-using CustomerTable logic manually or render custom table
    // Since CustomerTable manages its own fetch, we might just pass `results` if we refactor CustomerTable
    // But CustomerTable expects `fetchData` function.
    // Let's repurpose CustomerTable to accept `data` prop primarily if provided? 

    // Actually, let's just make a simple ad-hoc fetcher wrapper that returns the existing results
    // This maintains CustomerTable's internal state logic.
    const customFetcher = async () => {
        return { success: true, data: { content: results } };
    };

    const handleToggleStatus = async (id, isActive) => {
        const action = isActive ? 'deactivate' : 'activate';

        showConfirm({
            title: isActive ? "Deactivate Customer" : "Activate Customer",
            message: isActive
                ? "Are you sure you want to deactivate this customer?"
                : "Are you sure you want to activate this customer?",
            confirmText: isActive ? "Deactivate" : "Activate",
            variant: isActive ? "danger" : "primary",
            onConfirm: async () => {
                try {
                    if (isActive) {
                        await deactivateCustomer(id);
                        showSuccess({ title: "Success", message: "Customer deactivated successfully" });
                    } else {
                        await activateCustomer(id);
                        showSuccess({ title: "Success", message: "Customer activated successfully" });
                    }
                    // Update local state to reflect change
                    setResults(prev => prev.map(c => c.customerId === id ? { ...c, active: !isActive, status: !isActive ? 'ACTIVE' : 'INACTIVE' } : c));
                } catch (error) {
                    console.error("Status update failed", error);
                    showError({ title: "Operation Failed", message: "Failed to update customer status" });
                }
            }
        });
    };


    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center gap-4">
                <BackButton />
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-slate-100">
                    <Search className="text-purple-600 dark:text-purple-400" /> Search Customers
                </h2>
            </div>

            <Card className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex gap-4 border-b border-gray-100 dark:border-slate-700 pb-4 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="searchType"
                                value="genderAge"
                                checked={searchType === 'genderAge'}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="font-medium text-gray-700 dark:text-slate-300">By Gender & Age</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="searchType"
                                value="ageGreater"
                                checked={searchType === 'ageGreater'}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="font-medium text-gray-700 dark:text-slate-300">By Age Greater Than</span>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {searchType === 'genderAge' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Gender</label>
                                <AppSelect
                                    options={genderOptions}
                                    value={gender}
                                    onChange={(val) => setGender(val)}
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                                {searchType === 'ageGreater' ? 'Minimum Age' : 'Age'}
                            </label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Enter age..."
                                className="w-full rounded-lg border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                                min="1"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                                {loading ? 'Searching...' : 'Find Customers'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>

            {results !== null && (
                // Reuse CustomerTable but inject data. 
                // Since CustomerTable uses fetcher, we pass a dummy fetcher that resolves to our results.
                // This is a bit hacky but keeps UI consistent without duplicating Table JSX.
                <CustomerTable
                    key={JSON.stringify(results)} // Force re-render on new results
                    fetchData={customFetcher}
                    onToggleStatus={handleToggleStatus}
                    title={`Search Results (${results.length})`}
                    showStatusFilter={null}
                />
            )}
        </div>
    );
};

export default SearchCustomers;

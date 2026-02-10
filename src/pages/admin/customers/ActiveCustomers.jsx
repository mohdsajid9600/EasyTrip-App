import CustomerTable from './CustomerTable';
import { getActiveCustomers } from '../../../api/adminService';

const ActiveCustomers = () => {
    return (
        <CustomerTable
            fetchData={getActiveCustomers}
            title="Active Customers"
            showStatusFilter={true}
            emptyMessage="No active customers found."
        />
    );
};

export default ActiveCustomers;

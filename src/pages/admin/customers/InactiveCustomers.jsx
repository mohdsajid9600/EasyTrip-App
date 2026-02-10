import CustomerTable from './CustomerTable';
import { getInactiveCustomers } from '../../../api/adminService';

const InactiveCustomers = () => {
    return (
        <CustomerTable
            fetchData={getInactiveCustomers}
            title="Inactive Customers"
            showStatusFilter={false}
            emptyMessage="No inactive customers found."
        />
    );
};

export default InactiveCustomers;

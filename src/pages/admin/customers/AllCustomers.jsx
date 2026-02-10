import CustomerTable from './CustomerTable';
import { getAllCustomers } from '../../../api/adminService';

const AllCustomers = () => {
    return (
        <CustomerTable
            fetchData={getAllCustomers}
            title="All Customers"
            showStatusFilter={null}
            emptyMessage="No customers found."
        />
    );
};

export default AllCustomers;

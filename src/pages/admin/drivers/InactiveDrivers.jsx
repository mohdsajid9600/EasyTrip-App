import { getInactiveDrivers } from '../../../api/adminService';
import DriverTable from './DriverTable';

const InactiveDrivers = () => {
    return (
        <DriverTable
            title="Inactive Drivers"
            fetchData={getInactiveDrivers}
            emptyMessage="No inactive drivers found."
            showStatusFilter={false}
        />
    );
};

export default InactiveDrivers;

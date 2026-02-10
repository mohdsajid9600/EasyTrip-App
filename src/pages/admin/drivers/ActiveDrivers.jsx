import { getActiveDrivers } from '../../../api/adminService';
import DriverTable from './DriverTable';

const ActiveDrivers = () => {
    return (
        <DriverTable
            title="Active Drivers"
            fetchData={getActiveDrivers}
            emptyMessage="No active drivers found."
            showStatusFilter={true}
        />
    );
};

export default ActiveDrivers;

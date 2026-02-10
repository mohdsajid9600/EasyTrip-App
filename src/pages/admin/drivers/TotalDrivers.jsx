import { getAllDrivers } from '../../../api/adminService';
import DriverTable from './DriverTable';

const TotalDrivers = () => {
    return (
        <DriverTable
            title="All Drivers"
            fetchData={getAllDrivers}
            emptyMessage="No registered drivers found."
            showStatusFilter={null}
        />
    );
};

export default TotalDrivers;

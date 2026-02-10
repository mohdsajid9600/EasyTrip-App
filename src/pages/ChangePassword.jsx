import ChangePasswordCard from '../components/profile/ChangePasswordCard';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const ChangePassword = () => {
    const { role } = useAuth();

    return (
        <div className="max-w-2xl mx-auto py-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100 mb-6">Security Settings</h1>
            <ChangePasswordCard
                backUrl={
                    role === ROLES.CUSTOMER ? '/customer/profile' :
                        role === ROLES.DRIVER ? '/driver/profile' : null
                }
            />
        </div>
    );
};

export default ChangePassword;

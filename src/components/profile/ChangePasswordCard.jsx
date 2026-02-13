import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lock, ArrowLeft } from 'lucide-react';
import AppLoader from '../ui/AppLoader';
import api from '../../api/axios';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';


const ChangePasswordCard = ({ backUrl }) => {
    const { logout } = useAuth();
    const { showSuccess, showError } = useModal();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/auth/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword
            });

            showSuccess({
                title: "Password Changed",
                message: "Password changed successfully! You will be logged out now.",
                onConfirm: async () => {
                    await logout();
                    navigate('/login');
                }
            });

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to change password";
            showError({ title: "Error", message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-t-4 border-yellow-500 p-8 mt-8">
            <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-full text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                    <Lock size={32} />
                </div>
                <div className="flex-grow w-full">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Change Password</h3>
                    {loading && <AppLoader text="Changing password..." />}
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">

                        <Input
                            label="Current Password"
                            type="password"
                            name="oldPassword"
                            value={passwords.oldPassword}
                            onChange={handleChange}
                            placeholder="Enter current password"
                        />

                        <Input
                            label="New Password"
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            placeholder="Min 6 characters"
                        />

                        <Input
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter new password"
                        />

                        <div className="pt-2 flex flex-col sm:flex-row gap-3">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white w-full sm:w-auto"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </Button>

                            {backUrl && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(backUrl)}
                                    className="w-full sm:w-auto flex items-center gap-2"
                                >
                                    <ArrowLeft size={16} /> Back to Profile
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div >
        </Card >
    );
};

export default ChangePasswordCard;

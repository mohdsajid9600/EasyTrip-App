import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Card } from '../../components/ui/Card';
import { User, Mail, Shield } from 'lucide-react';
import ChangePasswordCard from '../../components/profile/ChangePasswordCard';

const AdminProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/me');
                if (response.data.success) {
                    setProfile(response.data.data);
                }
            } catch (error) {
                console.error("Failed to load admin profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-red-500">Failed to load profile.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-100">Admin Profile</h1>

            <Card className="p-8 border-t-4 border-indigo-600">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/40 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <User size={48} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-100">{profile.name}</h2>
                        <div className="mt-2 space-y-1 text-gray-600 dark:text-slate-400">
                            <p className="flex items-center gap-2">
                                <Mail size={16} /> {profile.email}
                            </p>
                            <p className="flex items-center gap-2 uppercase tracking-wide text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                <Shield size={14} /> {profile.role}
                            </p>
                        </div>
                    </div>
                </div>
            </Card>

            <ChangePasswordCard />
        </div>
    );
};

export default AdminProfile;

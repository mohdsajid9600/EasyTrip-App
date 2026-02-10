import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // API call to login
            const data = await loginUser(formData);
            // Assuming data contains: { token, user: { role, ... }, ... }
            // Adjust based on actual API response structure
            // Integrating logical flow:
            console.log("data is :", data);
            if (data.token && data.role) {
                console.log("data role is :", data.role);
                login(data.user || { email: formData.email }, data.token, data.role);
                console.log("data role is :", data.role);
                toast.success('Login successful!');

                // Redirect based on role
                switch (data.role) {
                    case 'ADMIN': navigate('/admin/dashboard'); break;
                    case 'DRIVER': navigate('/driver/dashboard'); break;
                    case 'CUSTOMER': navigate('/customer/dashboard'); break;
                    default: navigate('/admin/dashboard');
                }
            } else {
                toast.error('Invalid response from server');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login to EasyTrip</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                </div>
            </Card>
        </div>
    );
};

export default Login;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerCustomer, registerDriver } from '../api/authService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { toast } from 'react-toastify';
import { ROLES } from '../utils/constants';

const Signup = () => {
    const [role, setRole] = useState(ROLES.CUSTOMER); // Default to Customer
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        licenseNumber: '', // For driver only
        vehicleNumber: ''  // For driver only
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (role === ROLES.DRIVER) {
                await registerDriver(formData);
            } else {
                await registerCustomer({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone
                });
            }
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up for EasyTrip</h2>

                <div className="flex bg-gray-200 p-1 rounded-lg mb-6">
                    <button
                        type="button"
                        className={`flex-1 py-1 rounded-md text-sm font-medium transition-colors ${role === ROLES.CUSTOMER ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        onClick={() => setRole(ROLES.CUSTOMER)}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-1 rounded-md text-sm font-medium transition-colors ${role === ROLES.DRIVER ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        onClick={() => setRole(ROLES.DRIVER)}
                    >
                        Driver
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />
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
                    <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                    />

                    {role === ROLES.DRIVER && (
                        <>
                            <Input
                                label="License Number"
                                name="licenseNumber"
                                required
                                value={formData.licenseNumber}
                                onChange={handleChange}
                            />
                            <Input
                                label="Vehicle Number"
                                name="vehicleNumber"
                                required
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                            />
                        </>
                    )}

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </div>
            </Card>
        </div>
    );
};

export default Signup;

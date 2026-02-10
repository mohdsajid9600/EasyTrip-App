import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check login status on mount
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            console.log("Checking login status via /auth/me...");
            const response = await api.get('/auth/me');
            console.log("Auth check response:", response.data);

            if (response.data?.success) {
                const userData = response.data.data; // User object containing role
                const detectedRole = userData.role;

                console.log("Detected Role:", detectedRole);
                setUser(userData);
                setRole(detectedRole);

                // Check profile if CUSTOMER
                if (detectedRole === 'CUSTOMER') {
                    try {
                        const profileRes = await api.get('/customer/me');
                        if (profileRes.data?.success) {
                            setProfile(profileRes.data.data);
                        } else {
                            setProfile(null);
                        }
                    } catch (err) {
                        console.warn("Profile not found or error fetching profile:", err);
                        setProfile(null);
                    }
                } else if (detectedRole === 'DRIVER') {
                    try {
                        const profileRes = await api.get('/driver/me');
                        if (profileRes.data?.success) {
                            setProfile(profileRes.data.data);
                        } else {
                            setProfile(null);
                        }
                    } catch (err) {
                        console.warn("Driver profile fetch failed:", err);
                        setProfile(null);
                    }
                }

                setLoading(false);
                return detectedRole;
            } else {
                throw new Error("Auth check failed success=false");
            }

        } catch (error) {
            console.log("Not logged in or Session invalid:", error.response?.status);
            setUser(null);
            setRole(null);
            setProfile(null);
            setLoading(false);
            return null;
        }
    };

    const login = async (email, password) => {
        try {
            console.log("Attempting login to:", api.defaults.baseURL + '/auth/login');
            const response = await api.post('/auth/login', { email, password });
            console.log("Login response:", response.status, response.data);
            if (response.data?.success) {
                // Login successful, now probe for role and profile
                const detectedRole = await checkLoginStatus();
                if (detectedRole) {
                    return { success: true, role: detectedRole, data: response.data };
                } else {
                    return { success: false, message: "Login succeeded but role detection failed. Please try again." };
                }
            }
        } catch (error) {
            console.error("Login failed details:", error);
            if (error.response) {
                return { success: false, message: error.response?.data?.message || "Login failed via API" };
            } else if (error.request) {
                return { success: false, message: "Server not responding. Check backend." };
            } else {
                return { success: false, message: "Request setup failed" };
            }
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout'); // Note: Backend implementation of logout might vary, but session invalidate is key.
            setUser(null);
            setRole(null);
            setProfile(null);
        } catch (error) {
            console.error("Logout failed", error);
            // Force client-side logout anyway
            setUser(null);
            setRole(null);
            setProfile(null);
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || "Registration failed";
        }
    }

    // Helper to refresh profile manually (e.g. after profile creation)
    const refreshProfile = async () => {
        if (role === 'CUSTOMER') {
            try {
                const profileRes = await api.get('/customer/me');
                if (profileRes.data?.success) {
                    setProfile(profileRes.data.data);
                }
            } catch (err) {
                console.warn("Profile fetch failed during refresh:", err);
            }
        } else if (role === 'DRIVER') {
            try {
                const profileRes = await api.get('/driver/me');
                if (profileRes.data?.success) {
                    setProfile(profileRes.data.data);
                }
            } catch (err) {
                console.warn("Driver profile fetch failed during refresh:", err);
            }
        }
    }

    return (
        <AuthContext.Provider value={{ user, role, profile, loading, login, logout, register, checkLoginStatus, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

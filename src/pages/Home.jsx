import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import AppLoader from '../components/ui/AppLoader';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { MapPin, Shield, DollarSign, Star, Quote } from 'lucide-react';

const Home = () => {
    const { user, role, loading } = useAuth();
    const navigate = useNavigate();

    // Redirection logic preserved
    useEffect(() => {
        if (!loading && user && role) {
            if (role === 'CUSTOMER') navigate('/customer/dashboard');
            else if (role === 'DRIVER') navigate('/driver/dashboard');
            else if (role === 'ADMIN') navigate('/admin/dashboard');
        }
    }, [user, role, loading, navigate]);

    if (loading) return <AppLoader text="Initializing application..." />;

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors duration-300">
            <Header />

            {/* Hero Section */}
            <main className="flex-grow pt-16">
                <section className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white py-24 lg:py-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                            Book rides easily with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">EasyTrip</span>
                        </h1>
                        <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                            Safe, reliable, and affordable rides anytime. Experience the joy of hassle-free travel with our premium fleet.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/login">
                                <Button className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 hover:from-indigo-600 hover:via-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-indigo-900/40 hover:scale-105 transition-all duration-300">
                                    Book a Ride
                                </Button>
                            </Link>
                            <Link to="/signup" state={{ role: 'DRIVER' }}>
                                <Button variant="outline" className="px-8 py-3 rounded-full font-semibold border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300">
                                    Sign Up as Driver
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 lg:py-28 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Why Choose EasyTrip?</h2>
                            <p className="text-gray-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">We provide more than just a ride. We provide an experience tailored to your needs.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            {[
                                {
                                    icon: <MapPin className="w-8 h-8 text-white" />,
                                    title: "Easy Booking",
                                    desc: "Book a ride in seconds with our intuitive app interface. Choose your destination and go.",
                                    color: "bg-blue-500"
                                },
                                {
                                    icon: <Shield className="w-8 h-8 text-white" />,
                                    title: "Trusted Drivers",
                                    desc: "All our drivers are background-checked and professionally trained for your safety.",
                                    color: "bg-indigo-500"
                                },
                                {
                                    icon: <DollarSign className="w-8 h-8 text-white" />,
                                    title: "Affordable Pricing",
                                    desc: "Transparent pricing with no hidden fees. Get the best value for your comfortable ride.",
                                    color: "bg-cyan-500"
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center group">
                                    <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 text-white`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="py-20 lg:py-28 bg-white dark:bg-slate-950 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Loved by Travelers</h2>
                            <p className="text-gray-600 dark:text-slate-400 text-lg">See what our everyday riders have to say about us.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    name: "Sarah Johnson",
                                    role: "Daily Commuter",
                                    rating: 5,
                                    text: "Very smooth booking experience. The app is super fast and the drivers are always on time. Highly recommended!"
                                },
                                {
                                    name: "Michael Chen",
                                    role: "Business Traveler",
                                    rating: 5,
                                    text: "Drivers are polite and professional. The cars are clean and comfortable. Best cab service UI I have used."
                                },
                                {
                                    name: "Emily Davis",
                                    role: "Tourist",
                                    rating: 4,
                                    text: "Great experience! Needed a ride from the airport and EasyTrip made it seamless. Love the transparent pricing."
                                }
                            ].map((review, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 hover:bg-blue-50 dark:hover:bg-slate-700/50 transition-colors duration-300 relative border border-transparent dark:border-slate-800">
                                    <Quote className="absolute top-6 right-6 text-gray-200 dark:text-slate-700 w-12 h-12" />
                                    <div className="flex gap-1 text-yellow-500 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={18} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300 dark:text-slate-600"} />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 dark:text-slate-300 mb-6 italic relative z-10">"{review.text}"</p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-slate-100">{review.name}</h4>
                                            <p className="text-sm text-gray-500 dark:text-slate-400">{review.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;

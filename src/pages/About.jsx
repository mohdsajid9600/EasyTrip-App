import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
    Shield,
    Users,
    CreditCard,
    CalendarCheck,
    Search,
    CheckCircle,
    MapPin,
    Star,
    Award,
    TrendingUp,
    Globe
} from 'lucide-react';

const About = () => {
    const values = [
        {
            icon: <Shield className="text-indigo-600 dark:text-indigo-400" size={32} />,
            title: "Safe Rides",
            desc: "Your safety is our priority. We implement strict safety protocols and real-time tracking for every journey."
        },
        {
            icon: <Users className="text-indigo-600 dark:text-indigo-400" size={32} />,
            title: "Verified Drivers",
            desc: "Every driver in our network is thoroughly vetted and trained to provide professional and courteous service."
        },
        {
            icon: <CreditCard className="text-indigo-600 dark:text-indigo-400" size={32} />,
            title: "Affordable Pricing",
            desc: "Transparent, upfront pricing with no hidden surprises. We offer competitive rates for all types of commutes."
        },
        {
            icon: <CalendarCheck className="text-indigo-600 dark:text-indigo-400" size={32} />,
            title: "Reliable Booking",
            desc: "Our advanced algorithm ensures the fastest pickup times and highly reliable ride confirmations."
        }
    ];

    const steps = [
        {
            icon: <Search size={24} />,
            title: "Book Ride",
            desc: "Enter your destination and select your preferred ride type."
        },
        {
            icon: <CheckCircle size={24} />,
            title: "Driver Accepts",
            desc: "A nearby verified driver accepts your request instantly."
        },
        {
            icon: <Star size={24} />,
            title: "Enjoy Trip",
            desc: "Sit back and relax as our driver takes you safely to your destination."
        }
    ];

    const stats = [
        { label: "Rides Completed", value: "10K+", icon: <TrendingUp size={24} /> },
        { label: "Verified Drivers", value: "5K+", icon: <Users size={24} /> },
        { label: "Avg. User Rating", value: "4.9", icon: <Star size={24} /> },
        { label: "Cities Covered", value: "25+", icon: <Globe size={24} /> }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />

            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 overflow-hidden bg-white dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight animate-fade-in-up">
                                About <span className="text-indigo-600">EasyTrip</span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                Making travel simple, reliable, and affordable for everyone, everywhere.
                            </p>
                        </div>
                    </div>
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-50 dark:bg-indigo-900/10 -z-0 rounded-l-[10rem] opacity-50"></div>
                </section>

                {/* Introduction Section */}
                <section className="py-20 bg-white dark:bg-slate-900 border-y border-gray-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="animate-fade-in">
                                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest text-indigo-600">Who We Are</h2>
                                <p className="text-lg text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
                                    EasyTrip is a modern tech-driven cab booking platform dedicated to bridging the gap between customers and drivers through a secure, reliable, and user-friendly system.
                                </p>
                                <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
                                    Founded with the vision to revolutionize urban mobility, we leverage cutting-edge technology to ensure that moving from point A to point B is not just a commute, but a seamless experience of comfort and efficiency.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/30 dark:to-slate-800 p-12 rounded-[3rem] text-center border border-indigo-200 dark:border-indigo-800 shadow-inner">
                                <Award className="text-indigo-600 dark:text-indigo-400 w-20 h-20 mx-auto mb-6" />
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Our Mission</h3>
                                <p className="text-xl text-indigo-900 dark:text-indigo-200 font-medium leading-relaxed italic">
                                    "Our mission is to provide safe, affordable, and reliable transportation while empowering drivers with sustainable earning opportunities."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-24 bg-gray-50 dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">Why Choose EasyTrip</h2>
                            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((val, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center group">
                                    <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl w-fit mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                        {val.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{val.title}</h3>
                                    <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed">{val.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 bg-indigo-600 dark:bg-indigo-700 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-20 opacity-10">
                        <MapPin size={200} />
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-black mb-4">How EasyTrip Works</h2>
                            <p className="text-indigo-100">Simple 3-step process to get you on your way.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                            {/* Connection Lines (Desktop) */}
                            <div className="hidden md:absolute top-12 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-indigo-400/50 -z-0"></div>

                            {steps.map((step, idx) => (
                                <div key={idx} className="text-center relative z-10 flex flex-col items-center">
                                    <div className="bg-white text-indigo-600 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-black/20 font-black text-2xl border-4 border-indigo-400/30">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-indigo-100 leading-relaxed max-w-xs">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 bg-white dark:bg-slate-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="p-8 text-center border-r last:border-r-0 border-gray-100 dark:border-slate-800">
                                    <div className="text-indigo-600 dark:text-indigo-400 mb-4 flex justify-center">{stat.icon}</div>
                                    <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
                                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
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

export default About;

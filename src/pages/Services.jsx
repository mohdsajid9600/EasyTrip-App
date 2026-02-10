import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
    Car,
    ShieldCheck,
    Briefcase,
    Plane,
    MapPin,
    TrendingUp,
    ArrowRight,
    Map
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Services = () => {
    const services = [
        {
            id: "ride-booking",
            icon: <Car className="text-indigo-600 dark:text-indigo-400" size={32} />,
            title: "Ride Booking Service",
            desc: "Book rides easily with real-time cab availability and secure booking flow. Our advanced dispatch system ensures you get the nearest cab in minutes."
        },
        {
            id: "driver-network",
            icon: <ShieldCheck className="text-emerald-600 dark:text-emerald-400" size={32} />,
            title: "Driver Network",
            desc: "Verified drivers providing safe and reliable trips. Every driver undergoes a rigorous background check and safety training to ensure your peace of mind."
        },
        {
            id: "business-solutions",
            icon: <Briefcase className="text-blue-600 dark:text-blue-400" size={32} />,
            title: "Business Travel Solutions",
            desc: "Cab services for companies and employee transportation. Corporate billing, expense management, and priority support for your team."
        },
        {
            id: "airport-transfer",
            icon: <Plane className="text-sky-600 dark:text-sky-400" size={32} />,
            title: "Airport Transfers",
            desc: "Reliable pickup and drop services for airports. No more waiting or missing flights. Schedule in advance for a stress-free start to your travel."
        },
        {
            id: "city-transport",
            icon: <Map className="text-amber-600 dark:text-amber-400" size={32} />,
            title: "City Transportation",
            desc: "Daily commuting made easy with affordable rides. Fixed rates for popular routes and multi-stop capabilities for your errands."
        },
        {
            id: "driver-program",
            icon: <TrendingUp className="text-rose-600 dark:text-rose-400" size={32} />,
            title: "Become a Driver",
            desc: "Join EasyTrip and start earning by accepting trip requests. Flexible hours, competitive commissions, and a platform that values your work."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />

            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                            Our <span className="text-indigo-600">Services</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Everything you need for a comfortable and reliable journey. From daily commutes to business travel, we've got you covered.
                        </p>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, idx) => (
                            <div
                                key={idx}
                                id={service.id}
                                className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col items-start hover:-translate-y-2"
                            >
                                <div className="mb-8 p-5 bg-gray-50 dark:bg-slate-700/50 rounded-2xl group-hover:scale-110 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/40 transition-all duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
                                    {service.desc}
                                </p>
                                <div className="mt-auto flex items-center text-indigo-600 dark:text-indigo-400 font-bold gap-2 cursor-pointer group/link hover:gap-3 transition-all">
                                    Learn More <ArrowRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                    <div className="bg-indigo-600 dark:bg-indigo-700 rounded-[3rem] p-8 sm:p-16 text-center text-white shadow-2xl shadow-indigo-500/30 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-black mb-6">Ready to book your ride?</h2>
                            <p className="text-indigo-100 mb-10 text-lg max-w-xl mx-auto font-medium">
                                Join thousands of happy travelers and experience the best cab service in the city.
                            </p>
                            <Link to="/login">
                                <Button className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-105 dark:shadow-indigo-900/40">
                                    Book Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Services;

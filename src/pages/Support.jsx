import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
    Search,
    BookOpen,
    CreditCard,
    User,
    ShieldAlert,
    MessageCircle,
    Phone,
    Mail,
    MapPin,
    ChevronDown,
    ChevronUp,
    LifeBuoy,
    Clock,
    UserCheck,
    AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const Support = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFaq, setActiveFaq] = useState(null);

    const categories = [
        {
            icon: <BookOpen className="text-blue-500" size={32} />,
            title: "Booking Issues",
            desc: "Problems with booking, ride status, or cancellations."
        },
        {
            icon: <CreditCard className="text-green-500" size={32} />,
            title: "Payment & Billing",
            desc: "Refunds, wallet issues, and payment methods."
        },
        {
            icon: <User className="text-purple-500" size={32} />,
            title: "Account & Login",
            desc: "Password reset, profile updates, and account security."
        },
        {
            icon: <UserCheck className="text-orange-500" size={32} />,
            title: "Driver Support",
            desc: "Onboarding, earnings, and driver-specific queries."
        },
        {
            icon: <ShieldAlert className="text-red-500" size={32} />,
            title: "Safety & Emergency",
            desc: "Reporting accidents or safety concerns during rides."
        }
    ];

    const faqs = [
        {
            q: "How do I book a ride?",
            a: "To book a ride, log in to your account, enter your destination in the search bar, select your preferred cab type, and click 'Book Now'."
        },
        {
            q: "How can I cancel a booking?",
            a: "You can cancel a ride from the 'My Bookings' section in your dashboard. Select the active booking and click on 'Cancel Ride'."
        },
        {
            q: "How do I become a driver?",
            a: "Click on 'Become a Driver' in the header, sign up with your details, and provide your driving license and vehicle information for verification."
        },
        {
            q: "How do I update my profile?",
            a: "Navigate to 'Profile' in your dashboard to update your name, contact details, and upload a profile picture."
        },
        {
            q: "How is fare calculated?",
            a: "Fares are calculated based on the distance between pickup and drop-off, estimated travel time, and the selected vehicle category."
        }
    ];

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <Header />

            <main className="flex-grow pt-24 pb-20">
                {/* Hero Support Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Support Center</h1>
                        <p className="text-xl text-gray-600 dark:text-slate-400">How can we help you today?</p>
                    </div>

                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600">
                            <Search size={24} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for help (e.g. 'refund', 'cancel ride')..."
                            className="w-full pl-12 pr-4 py-5 bg-white dark:bg-slate-800 border-2 border-gray-100 dark:border-slate-700 rounded-3xl shadow-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-gray-900 dark:text-white transition-all text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </section>

                {/* Categories Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {categories.map((cat, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700 group cursor-pointer hover:-translate-y-1"
                            >
                                <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{cat.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* FAQ Accordion */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                            <MessageCircle className="text-indigo-600" />
                            Frequently Asked Questions
                        </h2>
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden transition-all shadow-sm"
                            >
                                <button
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
                                    onClick={() => toggleFaq(idx)}
                                >
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{faq.q}</span>
                                    {activeFaq === idx ? <ChevronUp className="text-indigo-600" /> : <ChevronDown className="text-gray-400" />}
                                </button>
                                {activeFaq === idx && (
                                    <div className="px-6 pb-6 animate-fade-in">
                                        <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact & Emergency Sidebar */}
                    <div className="space-y-8">
                        {/* Emergency Section */}
                        <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-8 border-2 border-red-100 dark:border-red-900/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                <ShieldAlert size={80} />
                            </div>
                            <div className="relative z-10 text-center">
                                <div className="bg-red-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                                    <AlertCircle size={24} />
                                </div>
                                <h3 className="text-red-700 dark:text-red-400 font-black text-xl mb-4">Emergency Assistance</h3>
                                <p className="text-red-600 dark:text-red-400/80 text-sm mb-6 leading-relaxed">
                                    In case of an emergency or safety incident during your ride, contact our support team immediately.
                                </p>
                                <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-none py-3 font-bold rounded-2xl shadow-lg shadow-red-600/20 active:scale-95 transition-all">
                                    Call Helpline
                                </Button>
                            </div>
                        </div>

                        {/* Contact Support Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Support</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Email us</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">support@easytrip.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Call us</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">+91 9000000000</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Office</p>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">123 Travel Lane, Tech Hub, Pune</p>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full mt-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                                Write to us
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Support;

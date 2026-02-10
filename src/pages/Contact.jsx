import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    MessageSquare,
    User,
    CheckCircle2,
    Facebook,
    Twitter,
    Instagram,
    Linkedin
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Static UI behavior only
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    const contactInfo = [
        {
            icon: <MapPin className="text-indigo-600 dark:text-indigo-400" size={24} />,
            title: "Address",
            value: "123 Innovation Drive, Tech Valley, Pune, Maharashtra 411001",
            link: "#"
        },
        {
            icon: <Phone className="text-indigo-600 dark:text-indigo-400" size={24} />,
            title: "Phone",
            value: "+91 90000 00000",
            link: "tel:+919000000000"
        },
        {
            icon: <Mail className="text-indigo-600 dark:text-indigo-400" size={24} />,
            title: "Email",
            value: "support@easytrip.com",
            link: "mailto:support@easytrip.com"
        },
        {
            icon: <Clock className="text-indigo-600 dark:text-indigo-400" size={24} />,
            title: "Support Hours",
            value: "24/7 Support Available",
            desc: "Response within 1 hour"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 font-sans">
            <Header />

            <main className="flex-grow pt-24">
                {/* Hero Section */}
                <section className="bg-white dark:bg-slate-900 py-20 border-b border-gray-100 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight animate-fade-in-up">
                            Contact <span className="text-indigo-600">Us</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto font-medium animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            We're here to help you anytime. Reach out to us for any queries, feedback, or assistance.
                        </p>
                    </div>
                </section>

                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Left Side: Contact Info */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Get In Touch</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {contactInfo.map((info, idx) => (
                                    <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
                                        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl w-fit group-hover:scale-110 transition-transform">
                                            {info.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{info.title}</h3>
                                        <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed mb-1">{info.value}</p>
                                        {info.desc && <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">{info.desc}</p>}
                                    </div>
                                ))}
                            </div>

                            {/* Social Media Placeholder */}
                            <div className="bg-indigo-600 dark:bg-indigo-700 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden mt-8">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-4">Connect with us</h3>
                                    <p className="text-indigo-100 mb-6">Stay updated with our latest offers and news by following us on social media.</p>
                                    <div className="flex gap-4">
                                        {[
                                            { icon: <Facebook size={20} />, link: "#" },
                                            { icon: <Twitter size={20} />, link: "#" },
                                            { icon: <Instagram size={20} />, link: "#" },
                                            { icon: <Linkedin size={20} />, link: "#" }
                                        ].map((social, i) => (
                                            <a
                                                key={i}
                                                href={social.link}
                                                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 backdrop-blur-md hover:-translate-y-1 text-white"
                                                aria-label="Social Link"
                                            >
                                                {social.icon}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <MessageSquare className="absolute -bottom-6 -right-6 text-white/5 w-40 h-40" />
                            </div>
                        </div>

                        {/* Right Side: Contact Form */}
                        <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[3.5rem] border border-gray-100 dark:border-slate-800 shadow-2xl transition-all">
                            {submitted ? (
                                <div className="text-center py-12 animate-scale-in">
                                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">Message Sent!</h3>
                                    <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
                                        Thank you for reaching out. Our support team will respond to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="mt-8 text-indigo-600 font-bold hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="How can we help?"
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-slate-300 ml-1">Message</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Your message here..."
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-slate-900 border-2 border-transparent focus:border-indigo-500 rounded-2xl outline-none transition-all dark:text-white resize-none"
                                        ></textarea>
                                    </div>
                                    <Button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                                        Send Message <Send size={20} />
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </section>

                {/* Map Placeholder Section */}
                <section className="mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-200 dark:bg-slate-800 w-full h-96 rounded-[3.5rem] relative overflow-hidden border border-gray-100 dark:border-slate-800 shadow-inner">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Pune&zoom=13&size=1200x400&sensor=false')] bg-cover bg-center grayscale opacity-50">
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/20 to-transparent h-1/2"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                                <MapPin className="text-indigo-600 dark:text-indigo-400 w-16 h-16 drop-shadow-2xl animate-bounce" />
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-sm"></div>
                            </div>
                        </div>
                        <div className="absolute bottom-8 right-8">
                            <Button className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-gray-900 dark:text-white border-none py-3 px-6 rounded-2xl font-bold shadow-xl">
                                Open Google Maps
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;

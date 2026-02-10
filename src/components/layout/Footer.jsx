import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300 pt-16 pb-8 transition-colors duration-300 border-t border-transparent dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-4">Easy<span className="text-indigo-500">Trip</span></h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Your trusted travel partner for safe, reliable, and affordable rides. Experience the future of transportation with us.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-indigo-600">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-indigo-600">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-indigo-600">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full hover:bg-indigo-600">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Company</h4>
                        <ul className="space-y-3">
                            <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link to="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                            <li><Link to="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div>
                        <Link to="/services"><h4 className="text-lg font-semibold text-white mb-6 hover:text-indigo-400 transition-colors">Services</h4></Link>
                        <ul className="space-y-3">
                            <li><Link to="/login" className="hover:text-indigo-400 transition-colors">Book a Ride</Link></li>
                            <li><Link to="/services#business-solutions" className="hover:text-indigo-400 transition-colors">Business Solutions</Link></li>
                            <li><Link to="/signup" state={{ role: 'DRIVER' }} className="hover:text-indigo-400 transition-colors">Become a Driver</Link></li>
                            <li><Link to="/services#city-transport" className="hover:text-indigo-400 transition-colors">Cities</Link></li>
                            <li><Link to="/services#airport-transfer" className="hover:text-indigo-400 transition-colors">Airports</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
                        <ul className="space-y-3">
                            <li><Link to="/support" className="hover:text-indigo-400 transition-colors">Support</Link></li>
                            <li><Link to="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="#" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; 2026 EasyTrip. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-xs uppercase tracking-widest font-bold">
                        <span>Safe</span>
                        <span className="text-indigo-500">•</span>
                        <span>Reliable</span>
                        <span className="text-indigo-500">•</span>
                        <span>Affordable</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

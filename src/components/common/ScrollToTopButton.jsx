import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { pathname } = useLocation();

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set the scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // List of paths where the button should be visible
    const publicPaths = ['/', '/about', '/contact', '/services', '/support', '/login', '/signup'];

    // Only render on specified public pages
    if (!publicPaths.includes(pathname)) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-[1000]">
            <button
                type="button"
                onClick={scrollToTop}
                className={`
                    w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white 
                    shadow-2xl flex items-center justify-center transition-all duration-300
                    hover:-translate-y-1 active:scale-90
                    ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-0 pointer-events-none'}
                `}
                aria-label="Scroll to top"
            >
                <ArrowUp size={24} strokeWidth={2.5} />
            </button>
        </div>
    );
};

export default ScrollToTopButton;

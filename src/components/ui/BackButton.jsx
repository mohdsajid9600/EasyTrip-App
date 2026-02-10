import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const BackButton = ({ className = '', fallback = '/' }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(fallback);
        }
    };

    return (
        <button
            onClick={handleBack}
            className={`
                group flex items-center justify-center p-2 rounded-lg 
                text-gray-500 hover:text-indigo-600 hover:bg-gray-100 
                dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800 
                transition-all duration-200 mr-2
                active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                ${className}
            `}
            title="Go Back"
            aria-label="Go Back"
        >
            <ArrowLeft
                size={20}
                className="transform group-hover:-translate-x-1 transition-transform duration-200"
            />
        </button>
    );
};

export default BackButton;

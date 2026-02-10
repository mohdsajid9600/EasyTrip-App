import { X, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

const ErrorModal = ({
    isOpen,
    onClose,
    title = "Error",
    message = "Something went wrong.",
    buttonText = "Close"
}) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 transform transition-all animate-fade-in-up scale-100 opacity-100 text-center p-6">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                    <AlertCircle size={32} className="text-red-600 dark:text-red-500" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-2">
                    {title}
                </h3>

                {/* Message */}
                <p className="text-gray-600 dark:text-slate-400 mb-8 break-words">
                    {message}
                </p>

                {/* Button */}
                <button
                    onClick={onClose}
                    className="w-full px-5 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default ErrorModal;

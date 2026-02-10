import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = ({ children, className, variant = 'primary', ...props }) => { // variant: primary, secondary, danger, outline
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};

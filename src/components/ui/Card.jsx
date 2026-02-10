import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className, ...props }) => {
    return (
        <div className={twMerge("bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50 rounded-lg p-6 border border-gray-100 dark:border-slate-700 transition-colors duration-200", className)} {...props}>
            {children}
        </div>
    );
};

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className, ...props }, ref) => {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-gray-700 dark:text-slate-300">{label}</label>}
            <input
                ref={ref}
                className={twMerge(
                    "px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 dark:placeholder-slate-500",
                    error ? "border-red-500 focus:ring-red-500" : "border-gray-300 dark:border-slate-700",
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
});

Input.displayName = 'Input';

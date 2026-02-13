import React from 'react';

const AppLoader = ({ text }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            {text && (
                <p className="mt-4 text-lg font-medium text-gray-700 dark:text-slate-300 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
};

export default AppLoader;

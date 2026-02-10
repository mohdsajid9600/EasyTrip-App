import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const AppSelect = ({
    options = [],
    value,
    onChange, // returns value directly: onChange(newValue)
    placeholder = "Select option",
    disabled = false,
    className = "",
    icon: Icon,
    name
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSelect = (optionValue) => {
        if (onChange) {
            onChange(optionValue);
        }
        setIsOpen(false);
    };

    const handleKeyDown = (e) => {
        if (disabled) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else if (options.length > 0) {
                const currentIndex = options.findIndex(opt => opt.value === value);
                const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
                if (onChange) onChange(options[nextIndex].value);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isOpen) {
                setIsOpen(true);
            } else if (options.length > 0) {
                const currentIndex = options.findIndex(opt => opt.value === value);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
                if (onChange) onChange(options[prevIndex].value);
            }
        }
    };

    return (
        <div className={`relative w-full ${className}`} ref={dropdownRef}>
            <div
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between
                    w-full h-[42px] px-4
                    bg-white dark:bg-slate-800
                    border border-gray-200 dark:border-slate-700
                    rounded-xl
                    cursor-pointer
                    transition-all duration-200
                    select-none
                    outline-none
                    ${isOpen ? 'ring-2 ring-indigo-500/20 border-indigo-500' : 'hover:border-gray-300 dark:hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10'}
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-slate-900' : ''}
                `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {Icon && <span className="text-gray-400">{Icon}</span>}
                    <span className={`block truncate text-sm ${!selectedOption ? 'text-gray-400 dark:text-slate-500' : 'text-gray-700 dark:text-gray-200'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl shadow-gray-200/50 dark:shadow-black/20 max-h-60 overflow-auto animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    flex items-center justify-between px-3 py-2.5 my-0.5 rounded-lg cursor-pointer text-sm
                                    transition-colors duration-150
                                    ${value === option.value
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'}
                                `}
                            >
                                <span className="truncate">{option.label}</span>
                                {value === option.value && <Check size={14} />}
                            </div>
                        ))}
                        {options.length === 0 && (
                            <div className="px-3 py-3 text-center text-sm text-gray-400 dark:text-slate-500">
                                No options available
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppSelect;


import React, { ReactNode } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
  wrapperClassName?: string;
}

export const Select: React.FC<SelectProps> = ({ label, id, error, children, className = '', wrapperClassName = '', ...props }) => {
  const baseStyle = "block w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light";
  const errorStyle = "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500";
  
  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>}
      <select
        id={id}
        className={`${baseStyle} ${error ? errorStyle : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

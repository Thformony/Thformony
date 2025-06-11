
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className = '', wrapperClassName = '', ...props }) => {
  const baseStyle = "block w-full px-3 py-2 text-sm bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light placeholder-neutral-400 dark:placeholder-neutral-500";
  const errorStyle = "border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500";

  return (
    <div className={`mb-4 ${wrapperClassName}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{label}</label>}
      <input
        id={id}
        className={`${baseStyle} ${error ? errorStyle : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

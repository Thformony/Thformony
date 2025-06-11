
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '', text }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-primary dark:border-primary-light border-t-transparent dark:border-t-transparent rounded-full animate-spin`}
      ></div>
      {text && <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{text}</p>}
    </div>
  );
};

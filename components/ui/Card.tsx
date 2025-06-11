
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, titleClassName = '' }) => {
  return (
    <div className={`bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6 ${className}`}>
      {title && <h2 className={`text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100 ${titleClassName}`}>{title}</h2>}
      {children}
    </div>
  );
};

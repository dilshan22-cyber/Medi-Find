import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  className?: string;
}
export function Badge({
  children,
  variant = 'default',
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    outline: 'bg-white text-gray-700 border-gray-300 border'
  };
  return <span className={`
      inline-flex items-center rounded-full px-3 py-1 text-base font-medium border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>;
}
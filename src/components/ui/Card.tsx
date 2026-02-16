import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  onClick?: () => void;
}
export function Card({
  children,
  className = '',
  title,
  description,
  footer,
  onClick
}: CardProps) {
  return <div className={`
        bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-blue-500' : ''}
        ${className}
      `} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {(title || description) && <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          {title && <h3 className="text-2xl font-bold text-gray-900">{title}</h3>}
          {description && <p className="mt-2 text-lg text-gray-600">{description}</p>}
        </div>}
      <div className="p-6 md:p-8">{children}</div>
      {footer && <div className="p-6 bg-gray-50 border-t border-gray-100">{footer}</div>}
    </div>;
}
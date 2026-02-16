import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
interface AlertProps {
  title: string;
  children?: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}
export function Alert({
  title,
  children,
  variant = 'info',
  className = ''
}: AlertProps) {
  const variants = {
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: <Info className="h-6 w-6 text-blue-600" />,
      title: 'text-blue-900',
      text: 'text-blue-800'
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      title: 'text-green-900',
      text: 'text-green-800'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: <AlertCircle className="h-6 w-6 text-yellow-600" />,
      title: 'text-yellow-900',
      text: 'text-yellow-800'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: <XCircle className="h-6 w-6 text-red-600" />,
      title: 'text-red-900',
      text: 'text-red-800'
    }
  };
  const currentVariant = variants[variant];
  return <div className={`rounded-lg border p-4 ${currentVariant.container} ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0">{currentVariant.icon}</div>
        <div className="ml-4">
          <h3 className={`text-lg font-medium ${currentVariant.title}`}>
            {title}
          </h3>
          {children && <div className={`mt-2 text-base ${currentVariant.text}`}>
              {children}
            </div>}
        </div>
      </div>
    </div>;
}
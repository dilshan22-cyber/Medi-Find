interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-lg font-medium text-gray-900">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`
          flex h-14 w-full rounded-lg border-2 border-gray-300 bg-white py-3 text-lg ring-offset-white 
          file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50
          ${leftIcon ? 'pl-11 pr-4' : 'px-4'}
          ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
          ${className}
        `}
          {...props}
        />
      </div>
      {helperText && !error && <p className="text-base text-gray-600">{helperText}</p>}
      {error && (
        <p className="text-base font-medium text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
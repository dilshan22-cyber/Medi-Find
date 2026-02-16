import React, { useState } from 'react';
import { Search } from 'lucide-react';
interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void;
  placeholder?: string;
  label?: string;
}
export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  label = 'Search',
  className = '',
  ...props
}: SearchBarProps) {
  const [value, setValue] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };
  return <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <label htmlFor="search-input" className="sr-only">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <Search className="h-6 w-6 text-gray-400" aria-hidden="true" />
        </div>
        <input id="search-input" type="search" className="block w-full rounded-lg border-2 border-gray-300 bg-white py-4 pl-12 pr-4 text-xl text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" placeholder={placeholder} value={value} onChange={e => setValue(e.target.value)} {...props} />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Search
          </button>
        </div>
      </div>
    </form>;
}
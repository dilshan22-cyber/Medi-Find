import { Link } from 'react-router-dom';

export function Footer() {
  return <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <p className="text-lg font-semibold text-gray-900">MediFind</p>
          <p className="text-base text-gray-600 mt-1">
            Accessible Medicine Availability & Price Checker
          </p>
        </div>
        <div className="flex space-x-6">
          <Link to="/admin" className="text-gray-500 hover:text-gray-900 text-base p-2">
            Admin Portal
          </Link>
          <a href="#" className="text-gray-500 hover:text-gray-900 text-base p-2">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900 text-base p-2">
            Terms of Service
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-900 text-base p-2">
            Help Center
          </a>
        </div>
      </div>
      <div className="mt-8 border-t border-gray-200 pt-8 text-center">
        <p className="text-base text-gray-500">
          &copy; {new Date().getFullYear()} MediFind Project. CCS2313/CCS2311
          Academic Requirement.
        </p>
      </div>
    </div>
  </footer>;
}
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, HeartPulse } from 'lucide-react';
import { Button } from '../ui/Button';
type UserRole = 'public' | 'user' | 'pharmacy' | 'admin';
interface HeaderProps {
  role?: UserRole;
}
import { useNavigate } from 'react-router-dom';

export function Header({
  role = 'public'
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to home page
    navigate('/');
    // You might also want to clear any auth state here if it existed
    // For now, simply navigating to home is enough as we are mocking auth
  };

  const isActive = (path: string) => location.pathname === path;
  const getNavLinks = () => {
    switch (role) {
      case 'user':
        return [{
          name: 'Search',
          path: '/user/search'
        }, {
          name: 'Compare',
          path: '/user/compare'
        }, {
          name: 'Saved',
          path: '/user/saved'
        }, {
          name: 'Notifications',
          path: '/user/notifications'
        }, {
          name: 'Profile',
          path: '/user/profile'
        }];
      case 'pharmacy':
        return [{
          name: 'Dashboard',
          path: '/pharmacy/dashboard'
        }, {
          name: 'Stock',
          path: '/pharmacy/stock'
        }, {
          name: 'Prices',
          path: '/pharmacy/prices'
        }, {
          name: 'Profile',
          path: '/pharmacy/profile'
        }];
      case 'admin':
        return [{
          name: 'Dashboard',
          path: '/admin/dashboard'
        }, {
          name: 'Verifications',
          path: '/admin/verifications'
        }, {
          name: 'Profile',
          path: '/admin/profile'
        }];
      default:
        return [{
          name: 'Home',
          path: '/'
        }, {
          name: 'Search',
          path: '/search'
        }, {
          name: 'Compare',
          path: '/compare'
        }];
    }
  };
  const links = getNavLinks();
  return <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-20 justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1">
            <HeartPulse className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">MediFind</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map(link => <Link key={link.path} to={link.path} className={`text-lg font-medium transition-colors px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isActive(link.path) ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
            {link.name}
          </Link>)}

          {role === 'public' ? <div className="flex items-center gap-4 ml-4">
            <Link to="/login">
              <Button variant="outline" size="default">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="default">
                Register
              </Button>
            </Link>
          </div> : <div className="flex items-center gap-4 ml-4">
            <span className="text-sm text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            <Button variant="outline" size="default" leftIcon={<LogOut className="h-5 w-5" />} onClick={handleLogout}>
              Logout
            </Button>
          </div>}
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button type="button" className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-controls="mobile-menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X className="block h-8 w-8" aria-hidden="true" /> : <Menu className="block h-8 w-8" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile menu */}
    {isMenuOpen && <div className="md:hidden bg-white border-t border-gray-200" id="mobile-menu">
      <div className="space-y-1 px-4 pb-3 pt-2">
        {links.map(link => <Link key={link.path} to={link.path} className={`block rounded-lg px-3 py-4 text-lg font-medium ${isActive(link.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`} onClick={() => setIsMenuOpen(false)}>
          {link.name}
        </Link>)}
        {role === 'public' ? <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
          <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
            <Button variant="outline" className="w-full">
              Login
            </Button>
          </Link>
          <Link to="/register" className="block" onClick={() => setIsMenuOpen(false)}>
            <Button variant="primary" className="w-full">
              Register
            </Button>
          </Link>
        </div> : <div className="mt-4 border-t border-gray-200 pt-4">
          <Button variant="outline" className="w-full" leftIcon={<LogOut className="h-5 w-5" />} onClick={handleLogout}>
            Logout
          </Button>
        </div>}
      </div>
    </div>}
  </header>;
}
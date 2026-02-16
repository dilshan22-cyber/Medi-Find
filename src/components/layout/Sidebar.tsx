import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, Bell, Settings, LogOut } from 'lucide-react';
interface SidebarProps {
  role: 'pharmacy' | 'admin';
}
export function Sidebar({
  role
}: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const pharmacyLinks = [{
    name: 'Dashboard',
    path: '/pharmacy/dashboard',
    icon: LayoutDashboard
  }, {
    name: 'Stock Inventory',
    path: '/pharmacy/stock',
    icon: Package
  }, {
    name: 'Price Updates',
    path: '/pharmacy/prices',
    icon: Tag
  }, {
    name: 'Low Stock Alerts',
    path: '/pharmacy/alerts',
    icon: Bell
  }, {
    name: 'Settings',
    path: '/pharmacy/settings',
    icon: Settings
  }];
  const adminLinks = [{
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard
  }, {
    name: 'Verifications',
    path: '/admin/verifications',
    icon: Package
  }, {
    name: 'Settings',
    path: '/admin/settings',
    icon: Settings
  }];
  const links = role === 'pharmacy' ? pharmacyLinks : adminLinks;
  return <aside className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 px-2">
          {role === 'pharmacy' ? 'Pharmacy Portal' : 'Admin Portal'}
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map(link => {
        const Icon = link.icon;
        return <Link key={link.path} to={link.path} className={`flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-colors ${isActive(link.path) ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              <Icon className="h-6 w-6 mr-3" />
              {link.name}
            </Link>;
      })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-4 py-3 text-lg font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
          <LogOut className="h-6 w-6 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>;
}
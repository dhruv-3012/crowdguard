import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Camera,
  AlertTriangle,
  BarChart3,
  Settings,
  Users,
  LogOut,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/venues', icon: Map, label: 'Venues' },
    { path: '/cameras', icon: Camera, label: 'Cameras' },
    { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/users', icon: Users, label: 'Users', roles: ['admin'] },
    { path: '/settings', icon: Settings, label: 'Settings' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-50 ${
      isOpen ? 'w-64' : 'w-20'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CG</span>
          </div>
          {isOpen && (
            <span className="text-xl font-bold">CrowdGuard</span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.roles && !item.roles.includes(user?.role || '')) {
              return null;
            }

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  {isOpen && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.email.charAt(0).toUpperCase()}
            </span>
          </div>
          {isOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-3 py-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

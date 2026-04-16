import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mainNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Symptom Checker', path: '/symptom-checker', icon: '🔍' },
    { label: 'Find Hospitals', path: '/hospitals', icon: '🏥' },
    { label: 'Report Analyzer', path: '/reports', icon: '📋' },
    { label: 'Chat', path: '/chat', icon: '💬' },
  ];

  const footerLinks = [
    { label: 'Learn More', path: '/learn', icon: '📚' },
    { label: 'Documentation', path: '/docs', icon: '📖' },
    { label: 'Support', path: '/support', icon: '🆘' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white shadow-lg border-b-4 border-emerald-500 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group hover:gap-4 transition-all">
              <span className="text-3xl transform group-hover:scale-125 transition-transform duration-300">💊</span>
              <div className="flex flex-col">
                <span className="font-bold text-emerald-600 text-xl">SymptoGenie</span>
                <span className="text-xs text-gray-500">AI Health Assistant</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 transform hover:scale-105 ${
                    isActive(item.path)
                      ? 'bg-emerald-100 text-emerald-700 shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>

            {/* User & Actions */}
            <div className="flex items-center gap-4">
              {/* User Profile Button */}
              <Link
                to="/profile"
                className={`hidden sm:flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isActive('/profile')
                    ? 'bg-indigo-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">👤</span>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-semibold text-sm truncate">{user?.name || 'Profile'}</span>
                  <span className="text-gray-500 text-xs">Account</span>
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
              >
                ☰
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 shadow-md transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu - Animated */}
          {menuOpen && (
            <div className="md:hidden pb-6 space-y-2 border-t pt-4 animate-in fade-in slide-in-from-top-2">
              {mainNavItems.map((item, idx) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:translate-x-1 ${
                    isActive(item.path)
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={{ animation: `slideIn 0.3s ease-out ${idx * 0.05}s` }}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
              <hr className="my-3" />
              {footerLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  {item.icon} {item.label}
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition-all duration-200 border-t pt-2"
              >
                👤 My Profile
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Desktop Footer Menu - Hidden on mobile */}
      <div className="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-8">
          {footerLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                isActive(item.path)
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

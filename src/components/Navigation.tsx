import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/images/logo.jpg" 
              alt="Sovereign Assets Capital" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold text-white">Sovereign Assets</h1>
              <p className="text-xs text-gray-400">Capital</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <a href="#plans" className="text-gray-300 hover:text-white transition-colors">
              Plans
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <a href="#faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                {userProfile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-lg mt-2">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <a
                href="#plans"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Plans
              </a>
              <a
                href="#about"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                About
              </a>
              <a
                href="#faq"
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </a>
              
              <div className="border-t border-gray-700 pt-3">
                {currentUser ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {userProfile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
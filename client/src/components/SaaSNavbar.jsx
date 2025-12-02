import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const Navbar = ({ onAuthClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-[#0D0F12]/90 border-b border-gray-200 dark:border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">WashEase</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="relative group py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
            {['Features', 'How It Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative group py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.8)] group-hover:w-full transition-all duration-300 ease-out"></span>
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-600 dark:text-gray-400"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth Buttons */}
            <button
              onClick={onAuthClick}
              className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Login
            </button>
            <button
              onClick={onAuthClick}
              className="hidden sm:inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full hover:shadow-glow-blue hover:scale-105 transition-all duration-300 border border-transparent dark:border-white/10"
            >
              Get Started
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 bg-white dark:bg-[#0D0F12] border-t border-gray-100 dark:border-white/5">
            <Link
              to="/"
              className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
            >
              Home
            </Link>
            {['Features', 'How It Works', 'Pricing'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
              >
                {item}
              </a>
            ))}
            <div className="px-4 pt-4 space-y-3">
              <button
                onClick={onAuthClick}
                className="w-full px-4 py-3 text-center text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
              >
                Login
              </button>
              <button
                onClick={onAuthClick}
                className="w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

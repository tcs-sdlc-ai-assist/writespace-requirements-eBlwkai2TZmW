import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth';
import Avatar from './Avatar';

/**
 * Navbar component for authenticated users.
 * Shows app name, navigation links, user avatar, and logout button.
 * Role-aware: admins see "Admin", editors see "Posts", viewers see "Browse".
 */
function Navbar({ className }) {
  const user = getCurrentUser();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className={`w-full bg-white dark:bg-gray-900 shadow flex items-center justify-between px-6 py-3 ${className || ''}`}
      data-testid="navbar"
    >
      {/* Left: App name */}
      <div className="flex items-center space-x-3">
        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 select-none">
          writespace
        </span>
        <span className="hidden sm:inline-block text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide">
          {user.role === 'admin'
            ? 'Admin'
            : user.role === 'editor'
            ? 'Editor'
            : 'Viewer'}
        </span>
      </div>
      {/* Center: Navigation */}
      <div className="flex-1 flex justify-center">
        <div className="flex space-x-4">
          {user.role === 'admin' && (
            <>
              <button
                type="button"
                className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                onClick={() => navigate('/admin/users')}
              >
                Users
              </button>
              <button
                type="button"
                className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                onClick={() => navigate('/admin/posts')}
              >
                Posts
              </button>
              <button
                type="button"
                className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                onClick={() => navigate('/admin/dashboard')}
              >
                Dashboard
              </button>
            </>
          )}
          {user.role === 'editor' && (
            <>
              <button
                type="button"
                className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                onClick={() => navigate('/posts')}
              >
                My Posts
              </button>
              <button
                type="button"
                className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                onClick={() => navigate('/posts/new')}
              >
                New Post
              </button>
            </>
          )}
          {user.role === 'viewer' && (
            <button
              type="button"
              className="text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              onClick={() => navigate('/posts')}
            >
              Browse
            </button>
          )}
        </div>
      </div>
      {/* Right: User avatar and logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Avatar
            name={user.name}
            avatarUrl={user.avatarUrl}
            role={user.role}
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
              {user.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
              {user.email}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="ml-2 px-3 py-1.5 rounded-md bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  className: PropTypes.string,
};

export default Navbar;
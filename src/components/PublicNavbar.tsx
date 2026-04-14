import React from 'react';
import PropTypes from 'prop-types';

/**
 * PublicNavbar component for guests (not logged in).
 * @param {object} props
 * @param {string} [props.className] - Optional additional Tailwind classes.
 * @returns {JSX.Element}
 */
function PublicNavbar({ className }) {
  return (
    <nav
      className={`w-full bg-white dark:bg-gray-900 shadow-sm px-4 py-3 flex items-center justify-between ${className || ''}`}
      data-testid="public-navbar"
    >
      <div className="flex items-center space-x-2">
        <svg
          className="w-7 h-7 text-blue-600 dark:text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-2 2 2h4a2 2 0 012 2v12a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          writespace
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <a
          href="/login"
          className="px-4 py-2 rounded-md text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
        >
          Log in
        </a>
        <a
          href="/register"
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Sign up
        </a>
      </div>
    </nav>
  );
}

PublicNavbar.propTypes = {
  className: PropTypes.string,
};

export default PublicNavbar;
import React from 'react';
import PropTypes from 'prop-types';
import { UserRole } from '../utils/types';

/**
 * Avatar component that displays user's avatar image or a role-distinct icon.
 * Admins show a crown, others show a book.
 * @param {string} name - User's name for alt text and initials fallback.
 * @param {string} [avatarUrl] - Optional avatar image URL.
 * @param {UserRole} role - User's role ('admin', 'editor', 'viewer').
 * @param {string} [className] - Optional additional Tailwind classes.
 * @returns {JSX.Element}
 */
function Avatar({ name, avatarUrl, role, className }) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : '';

  const icon =
    role === 'admin' ? (
      // Crown icon (Heroicons style)
      <svg
        className="w-6 h-6 text-yellow-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10l4.5 4.5a2 2 0 002.8 0L12 13l1.7 1.5a2 2 0 002.8 0L21 10M5 19h14a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z"
        />
      </svg>
    ) : (
      // Book icon (Heroicons style)
      <svg
        className="w-6 h-6 text-blue-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 20l-7-5V6a2 2 0 012-2h10a2 2 0 012 2v9l-7 5z"
        />
      </svg>
    );

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 shadow-md w-12 h-12 ${className || ''}`}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || 'User Avatar'}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full">
          {icon}
          {!name && (
            <span className="text-xs text-gray-500 dark:text-gray-300 mt-1">?</span>
          )}
          {name && (
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-1">
              {initials}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

Avatar.propTypes = {
  name: PropTypes.string,
  avatarUrl: PropTypes.string,
  role: PropTypes.oneOf(['admin', 'editor', 'viewer']).isRequired,
  className: PropTypes.string,
};

export default Avatar;
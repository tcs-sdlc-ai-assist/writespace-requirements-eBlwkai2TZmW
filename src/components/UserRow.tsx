import React from 'react';
import PropTypes from 'prop-types';
import { User } from '../utils/types';
import Avatar from './Avatar';

/**
 * UserRow component for displaying a user in a table or card format.
 * @param {object} props
 * @param {User} props.user - The user object.
 * @param {React.ReactNode} [props.actions] - Optional action buttons (edit, delete, etc).
 * @param {string} [props.className] - Optional additional Tailwind classes.
 * @returns {JSX.Element}
 */
function UserRow({ user, actions, className }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow mb-2 ${className || ''}`}
      data-testid={`user-row-${user.id}`}
    >
      <div className="flex items-center space-x-4 min-w-0">
        <Avatar
          name={user.name}
          avatarUrl={user.avatarUrl}
          role={user.role}
        />
        <div className="min-w-0">
          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
          <div className="text-xs mt-1">
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${
                user.role === 'admin'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : user.role === 'editor'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>
      </div>
      {actions && (
        <div className="flex items-center space-x-2">{actions}</div>
      )}
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'editor', 'viewer']).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  actions: PropTypes.node,
  className: PropTypes.string,
};

export default UserRow;
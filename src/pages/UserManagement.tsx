import React, { useEffect, useState } from 'react';
import { User, UserRole } from '../utils/types';
import { loadUsers, saveUsers } from '../utils/storage';
import { getCurrentUser, removePasswordForUser } from '../utils/auth';
import UserRow from '../components/UserRow';
import PropTypes from 'prop-types';

const ROLES: UserRole[] = ['admin', 'editor', 'viewer'];

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * UserManagement - Admin page for managing users.
 */
function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create user form state
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createRole, setCreateRole] = useState<UserRole>('viewer');
  const [createPassword, setCreatePassword] = useState('');
  const [createConfirm, setCreateConfirm] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  // Delete user state
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const currentUser = getCurrentUser();

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const loaded = loadUsers();
      setUsers(loaded);
    } catch (err: any) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create user handler
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    setCreateSuccess(false);

    if (!createName.trim()) {
      setCreateError('Name is required.');
      return;
    }
    if (!createEmail.trim() || !validateEmail(createEmail)) {
      setCreateError('A valid email is required.');
      return;
    }
    if (!createPassword || createPassword.length < 6) {
      setCreateError('Password must be at least 6 characters.');
      return;
    }
    if (createPassword !== createConfirm) {
      setCreateError('Passwords do not match.');
      return;
    }
    if (users.some(u => u.email === createEmail.trim())) {
      setCreateError('Email already registered.');
      return;
    }

    setCreateLoading(true);
    try {
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const newUser: User = {
        id,
        name: createName.trim(),
        email: createEmail.trim(),
        role: createRole,
        createdAt: now,
        updatedAt: now,
      };
      // Save password (demo only)
      localStorage.setItem(
        'writespace_passwords',
        JSON.stringify({
          ...(JSON.parse(localStorage.getItem('writespace_passwords') || '{}')),
          [id]: createPassword,
        })
      );
      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      setCreateSuccess(true);
      setTimeout(() => {
        setShowCreate(false);
        setCreateName('');
        setCreateEmail('');
        setCreateRole('viewer');
        setCreatePassword('');
        setCreateConfirm('');
        setCreateSuccess(false);
      }, 1200);
    } catch (err: any) {
      setCreateError('Failed to create user.');
    } finally {
      setCreateLoading(false);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId: string) => {
    setDeleteLoading(userId);
    setDeleteError(null);
    try {
      if (userId === currentUser?.id) {
        setDeleteError('You cannot delete your own account.');
        setDeleteLoading(null);
        return;
      }
      const updatedUsers = users.filter(u => u.id !== userId);
      saveUsers(updatedUsers);
      setUsers(updatedUsers);
      removePasswordForUser(userId);
    } catch (err: any) {
      setDeleteError('Failed to delete user.');
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        User Management
      </h1>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Manage all users in the platform.
        </span>
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          onClick={() => setShowCreate(v => !v)}
          disabled={createLoading}
        >
          {showCreate ? 'Cancel' : 'Create User'}
        </button>
      </div>
      {showCreate && (
        <form
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 space-y-4"
          onSubmit={handleCreateUser}
          noValidate
        >
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={createName}
                onChange={e => setCreateName(e.target.value)}
                autoComplete="name"
                required
                disabled={createLoading}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={createEmail}
                onChange={e => setCreateEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={createLoading}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex-1 mb-4 sm:mb-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Role
              </label>
              <select
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={createRole}
                onChange={e => setCreateRole(e.target.value as UserRole)}
                required
                disabled={createLoading}
              >
                {ROLES.map(r => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={createPassword}
                onChange={e => setCreatePassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={createLoading}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={createConfirm}
                onChange={e => setCreateConfirm(e.target.value)}
                autoComplete="new-password"
                required
                minLength={6}
                disabled={createLoading}
              />
            </div>
          </div>
          {createError && (
            <div className="text-red-600 dark:text-red-400 text-sm font-medium mt-2 text-center">
              {createError}
            </div>
          )}
          {createSuccess && (
            <div className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 text-center">
              User created successfully!
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            disabled={createLoading}
          >
            {createLoading ? (
              <span className="animate-pulse">Creating...</span>
            ) : (
              'Create User'
            )}
          </button>
        </form>
      )}
      {error && (
        <div className="text-red-600 dark:text-red-400 text-base font-medium mb-4 text-center">
          {error}
        </div>
      )}
      <div>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8 animate-pulse">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            No users found.
          </div>
        ) : (
          <div>
            {users.map(user => (
              <UserRow
                key={user.id}
                user={user}
                actions={
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed`}
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleteLoading === user.id}
                  >
                    {deleteLoading === user.id ? (
                      <span className="animate-pulse">Deleting...</span>
                    ) : (
                      'Delete'
                    )}
                  </button>
                }
              />
            ))}
            {deleteError && (
              <div className="text-red-600 dark:text-red-400 text-sm font-medium mt-2 text-center">
                {deleteError}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

UserManagement.propTypes = {};

export default UserManagement;
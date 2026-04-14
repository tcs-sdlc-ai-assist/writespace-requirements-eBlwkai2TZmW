import { User, Session } from './types';
import {
  loadUsers,
  saveUsers,
  loadSession,
  saveSession,
  clearSession,
  getItem,
  setItem,
  removeItem,
} from './storage';

/**
 * Find a user by email.
 * @param {string} email
 * @returns {User | undefined}
 */
export function findUserByEmail(email: string): User | undefined {
  const users = loadUsers();
  return users.find((u) => u.email === email);
}

/**
 * Register a new user.
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.password
 * @param {import('./types').UserRole} [params.role]
 * @returns {Promise<{user: User, session: Session}>}
 */
export async function register({
  name,
  email,
  password,
  role = 'viewer',
}: {
  name: string;
  email: string;
  password: string;
  role?: import('./types').UserRole;
}): Promise<{ user: User; session: Session }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = loadUsers();
        if (users.some((u) => u.email === email)) {
          reject(new Error('Email already registered.'));
          return;
        }
        const now = new Date().toISOString();
        const id = crypto.randomUUID();
        const user: User = {
          id,
          name,
          email,
          role,
          createdAt: now,
          updatedAt: now,
        };
        // Save password in a separate map (for demo only, never in prod)
        setPasswordForUser(id, password);
        users.push(user);
        saveUsers(users);
        const session: Session = {
          userId: user.id,
          token: generateToken(),
          expiresAt: getExpiryDate(),
        };
        saveSession(session);
        resolve({ user, session });
      } catch (err) {
        reject(err);
      }
    }, 500);
  });
}

/**
 * Login a user.
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{user: User, session: Session}>}
 */
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ user: User; session: Session }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const users = loadUsers();
        const user = users.find((u) => u.email === email);
        if (!user) {
          reject(new Error('User not found.'));
          return;
        }
        const valid = checkPasswordForUser(user.id, password);
        if (!valid) {
          reject(new Error('Invalid password.'));
          return;
        }
        const session: Session = {
          userId: user.id,
          token: generateToken(),
          expiresAt: getExpiryDate(),
        };
        saveSession(session);
        resolve({ user, session });
      } catch (err) {
        reject(err);
      }
    }, 500);
  });
}

/**
 * Logout current session.
 * @returns {void}
 */
export function logout(): void {
  clearSession();
}

/**
 * Get the current logged-in user.
 * @returns {User | null}
 */
export function getCurrentUser(): User | null {
  const session = loadSession();
  if (!session) return null;
  const users = loadUsers();
  const user = users.find((u) => u.id === session.userId);
  return user || null;
}

/**
 * Check if the current session is admin.
 * @returns {boolean}
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return !!user && user.role === 'admin';
}

/**
 * Check if the current user is the owner of a resource.
 * @param {string} ownerId
 * @returns {boolean}
 */
export function isOwner(ownerId: string): boolean {
  const user = getCurrentUser();
  return !!user && user.id === ownerId;
}

/**
 * Generate a random token.
 * @returns {string}
 */
function generateToken(): string {
  return crypto.randomUUID();
}

/**
 * Get expiry date string (1 day from now).
 * @returns {string}
 */
function getExpiryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString();
}

// --- Password storage (for demo only, never in production) ---

const PASSWORDS_KEY = 'writespace_passwords';

/**
 * Save password for user (demo only).
 * @param {string} userId
 * @param {string} password
 * @returns {void}
 */
function setPasswordForUser(userId: string, password: string): void {
  const passwords = getItem<Record<string, string>>(PASSWORDS_KEY) || {};
  passwords[userId] = password;
  setItem(PASSWORDS_KEY, passwords);
}

/**
 * Check password for user (demo only).
 * @param {string} userId
 * @param {string} password
 * @returns {boolean}
 */
function checkPasswordForUser(userId: string, password: string): boolean {
  const passwords = getItem<Record<string, string>>(PASSWORDS_KEY) || {};
  return passwords[userId] === password;
}

/**
 * Remove password for user (demo only).
 * @param {string} userId
 * @returns {void}
 */
export function removePasswordForUser(userId: string): void {
  const passwords = getItem<Record<string, string>>(PASSWORDS_KEY) || {};
  delete passwords[userId];
  setItem(PASSWORDS_KEY, passwords);
}
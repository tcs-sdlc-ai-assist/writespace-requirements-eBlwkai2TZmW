import { User, Session, Post } from './types';

/**
 * Save a value to localStorage as JSON.
 * @param {string} key
 * @param {unknown} value
 * @returns {void}
 */
export function setItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    // Optionally log or handle error
  }
}

/**
 * Get a value from localStorage and parse as JSON.
 * @template T
 * @param {string} key
 * @returns {T | null}
 */
export function getItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (err) {
    return null;
  }
}

/**
 * Remove an item from localStorage.
 * @param {string} key
 * @returns {void}
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    // Optionally log or handle error
  }
}

// Specific helpers for Users

const USERS_KEY = 'writespace_users';

/**
 * Save users array to localStorage.
 * @param {User[]} users
 * @returns {void}
 */
export function saveUsers(users: User[]): void {
  setItem(USERS_KEY, users);
}

/**
 * Get users array from localStorage.
 * @returns {User[]}
 */
export function loadUsers(): User[] {
  const users = getItem<User[]>(USERS_KEY);
  return users || [];
}

// Specific helpers for Posts

const POSTS_KEY = 'writespace_posts';

/**
 * Save posts array to localStorage.
 * @param {Post[]} posts
 * @returns {void}
 */
export function savePosts(posts: Post[]): void {
  setItem(POSTS_KEY, posts);
}

/**
 * Get posts array from localStorage.
 * @returns {Post[]}
 */
export function loadPosts(): Post[] {
  const posts = getItem<Post[]>(POSTS_KEY);
  return posts || [];
}

// Specific helpers for Session

const SESSION_KEY = 'writespace_session';

/**
 * Save session to localStorage.
 * @param {Session} session
 * @returns {void}
 */
export function saveSession(session: Session): void {
  setItem(SESSION_KEY, session);
}

/**
 * Get session from localStorage.
 * @returns {Session | null}
 */
export function loadSession(): Session | null {
  return getItem<Session>(SESSION_KEY);
}

/**
 * Remove session from localStorage.
 * @returns {void}
 */
export function clearSession(): void {
  removeItem(SESSION_KEY);
}
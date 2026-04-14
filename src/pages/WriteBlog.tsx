import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCurrentUser } from '../utils/auth';
import { loadPosts, savePosts } from '../utils/storage';
import { Post, UserRole } from '../utils/types';
import Navbar from '../components/Navbar';
import PublicNavbar from '../components/PublicNavbar';

/**
 * WriteBlog page for creating or editing a blog post.
 * If :id param is present, edit mode; otherwise, create mode.
 * Only owner or admin can edit.
 */
function WriteBlog() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [ownershipError, setOwnershipError] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load post if editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setNotFound(false);
    setOwnershipError(false);
    try {
      const posts = loadPosts();
      const post = posts.find((p) => p.id === id);
      if (!post) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      // Ownership: only admin or owner can edit
      if (user?.role !== 'admin' && user?.id !== post.authorId) {
        setOwnershipError(true);
        setLoading(false);
        return;
      }
      setTitle(post.title);
      setContent(post.content);
      setPublished(post.published);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load post.');
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [id]);

  if (!user) {
    return (
      <>
        <PublicNavbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-lg text-gray-700 dark:text-gray-200 mt-16">
            Please <a href="/login" className="text-blue-600 dark:text-blue-400 underline">log in</a> to write a blog post.
          </div>
        </div>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-16">Post not found</div>
          <button
            className="mt-6 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => navigate('/posts')}
          >
            Back to Posts
          </button>
        </div>
      </>
    );
  }

  if (ownershipError) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-16">Unauthorized</div>
          <div className="text-gray-600 dark:text-gray-300 mt-2">You do not have permission to edit this post.</div>
          <button
            className="mt-6 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={() => navigate('/posts')}
          >
            Back to Posts
          </button>
        </div>
      </>
    );
  }

  const validate = () => {
    if (!title.trim()) return 'Title is required.';
    if (!content.trim()) return 'Content is required.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      const posts = loadPosts();
      const now = new Date().toISOString();
      if (id) {
        // Edit mode
        const idx = posts.findIndex((p) => p.id === id);
        if (idx === -1) {
          setError('Post not found.');
          setLoading(false);
          return;
        }
        // Ownership check again (shouldn't happen)
        if (user.role !== 'admin' && posts[idx].authorId !== user.id) {
          setError('You do not have permission to edit this post.');
          setLoading(false);
          return;
        }
        posts[idx] = {
          ...posts[idx],
          title: title.trim(),
          content: content.trim(),
          published,
          updatedAt: now,
        };
        savePosts(posts);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/posts`);
        }, 1200);
      } else {
        // Create mode
        const newPost: Post = {
          id: crypto.randomUUID(),
          title: title.trim(),
          content: content.trim(),
          authorId: user.id,
          createdAt: now,
          updatedAt: now,
          published,
        };
        savePosts([...posts, newPost]);
        setSuccess(true);
        setTimeout(() => {
          navigate(`/posts`);
        }, 1200);
      }
    } catch (err: any) {
      setError('Failed to save post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {id ? 'Edit Post' : 'Write a New Post'}
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              disabled={loading}
              maxLength={120}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Content
            </label>
            <textarea
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[160px]"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              disabled={loading}
              maxLength={5000}
            />
          </div>
          {(user.role === 'admin' || user.role === 'editor') && (
            <div className="flex items-center space-x-2">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={e => setPublished(e.target.checked)}
                disabled={loading}
                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
              />
              <label htmlFor="published" className="text-sm text-gray-700 dark:text-gray-200">
                Publish now
              </label>
            </div>
          )}
          {error && (
            <div className="text-red-600 dark:text-red-400 text-sm font-medium mt-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-600 dark:text-green-400 text-sm font-medium mt-2">
              {id ? 'Post updated!' : 'Post created!'} Redirecting...
            </div>
          )}
          <div className="flex items-center space-x-3 mt-4">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">{id ? 'Saving...' : 'Publishing...'}</span>
              ) : id ? 'Save Changes' : 'Publish'}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => navigate('/posts')}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

WriteBlog.propTypes = {};

export default WriteBlog;
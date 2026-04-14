import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Post, User } from '../utils/types';
import { loadPosts, savePosts, loadUsers } from '../utils/storage';
import { getCurrentUser, isAdmin, isOwner } from '../utils/auth';
import Avatar from '../components/Avatar';
import PropTypes from 'prop-types';

/**
 * ReadBlog page - displays a full blog post with author info and controls for owner/admin.
 */
function ReadBlog() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const posts = loadPosts();
      const found = posts.find((p) => p.id === id);
      if (!found) {
        setError('Post not found.');
        setLoading(false);
        return;
      }
      setPost(found);
      const users = loadUsers();
      const authorUser = users.find((u) => u.id === found.authorId) || null;
      setAuthor(authorUser);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load post.');
      setLoading(false);
    }
  }, [id]);

  const user = getCurrentUser();
  const canEdit = !!user && (isOwner(post?.authorId || '') || isAdmin());
  const canDelete = canEdit;

  const handleEdit = () => {
    if (post) {
      navigate(`/posts/${post.id}/edit`);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeleting(true);
    try {
      const posts = loadPosts();
      const filtered = posts.filter((p) => p.id !== post.id);
      savePosts(filtered);
      setDeleting(false);
      navigate('/posts');
    } catch (err: any) {
      setError('Failed to delete post.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg font-semibold text-gray-600 dark:text-gray-300 animate-pulse">
          Loading post...
        </span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <span className="text-lg font-semibold text-red-600 dark:text-red-400">
          {error || 'Post not found.'}
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Avatar
              name={author?.name || 'Unknown'}
              avatarUrl={author?.avatarUrl}
              role={author?.role || 'viewer'}
            />
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {author?.name || 'Unknown'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {author?.email || 'No email'} &middot;{' '}
                <span className="capitalize">{author?.role || 'viewer'}</span>
              </div>
            </div>
          </div>
          {(canEdit || canDelete) && (
            <div className="flex items-center space-x-2">
              {canEdit && (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                  onClick={handleEdit}
                  disabled={deleting}
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-md bg-red-600 dark:bg-red-500 text-white text-sm font-medium hover:bg-red-700 dark:hover:bg-red-600 transition"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <span className="animate-pulse">Deleting...</span>
                  ) : (
                    'Delete'
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {post.title}
          </h1>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span>
              Created: {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <span>
              Updated: {new Date(post.updatedAt).toLocaleDateString()}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-medium ${
                post.published
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
              }`}
            >
              {post.published ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>
        <div className="prose prose-blue dark:prose-invert max-w-none text-lg leading-relaxed mb-6">
          {post.content}
        </div>
        <button
          type="button"
          className="mt-6 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
}

ReadBlog.propTypes = {};

export default ReadBlog;
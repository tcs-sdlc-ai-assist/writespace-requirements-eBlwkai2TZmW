import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import Navbar from '../components/Navbar';
import { getCurrentUser, isAdmin, isOwner } from '../utils/auth';
import { loadPosts, loadUsers, savePosts } from '../utils/storage';
import { Post, User } from '../utils/types';

/**
 * Home page - Authenticated blog list with responsive grid and ownership controls.
 */
function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = getCurrentUser();

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const loadedPosts = loadPosts();
      const loadedUsers = loadUsers();
      setPosts(loadedPosts);
      setUsers(loadedUsers);
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load posts.');
      setLoading(false);
    }
  }, []);

  if (!user) {
    // Should not happen, but redirect if not authenticated
    navigate('/login');
    return null;
  }

  const handleEdit = (postId: string) => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleDelete = (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const updated = posts.filter((p) => p.id !== postId);
      setPosts(updated);
      savePosts(updated);
    } catch (err: any) {
      setError('Failed to delete post.');
    }
  };

  const handleTogglePublish = (postId: string) => {
    try {
      const updated = posts.map((p) =>
        p.id === postId
          ? { ...p, published: !p.published, updatedAt: new Date().toISOString() }
          : p
      );
      setPosts(updated);
      savePosts(updated);
    } catch (err: any) {
      setError('Failed to update post.');
    }
  };

  // Admin sees all posts, editor sees own, viewer sees published only
  let visiblePosts: Post[] = [];
  if (user.role === 'admin') {
    visiblePosts = posts;
  } else if (user.role === 'editor') {
    visiblePosts = posts.filter((p) => p.authorId === user.id);
  } else {
    visiblePosts = posts.filter((p) => p.published);
  }

  // Sort by updatedAt desc
  visiblePosts = [...visiblePosts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const getAuthor = (authorId: string) =>
    users.find((u) => u.id === authorId) || {
      id: '',
      name: 'Unknown',
      email: '',
      role: 'viewer',
      createdAt: '',
      updatedAt: '',
    };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {user.role === 'admin'
              ? 'All Posts'
              : user.role === 'editor'
              ? 'My Posts'
              : 'Browse Posts'}
          </h1>
          {(user.role === 'admin' || user.role === 'editor') && (
            <button
              type="button"
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
              onClick={() => navigate('/posts/new')}
            >
              New Post
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-gray-500 dark:text-gray-400 animate-pulse">
              Loading posts...
            </span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-40">
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        ) : visiblePosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
            <span>
              {user.role === 'admin'
                ? 'No posts found.'
                : user.role === 'editor'
                ? 'You have not written any posts yet.'
                : 'No published posts yet.'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post) => {
              const author = getAuthor(post.authorId);
              const owned = isOwner(post.authorId);
              const admin = isAdmin();
              return (
                <BlogCard
                  key={post.id}
                  post={post}
                  authorName={author.name}
                  authorAvatarUrl={author.avatarUrl}
                  authorRole={author.role}
                  owned={owned}
                  isAdmin={admin}
                  actions={
                    (admin || owned) && (
                      <div className="flex space-x-1">
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition"
                          onClick={() => handleEdit(post.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition"
                          onClick={() => handleDelete(post.id)}
                        >
                          Delete
                        </button>
                        {admin && (
                          <button
                            type="button"
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              post.published
                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
                            } transition`}
                            onClick={() => handleTogglePublish(post.id)}
                          >
                            {post.published ? 'Unpublish' : 'Publish'}
                          </button>
                        )}
                      </div>
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
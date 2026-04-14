import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import BlogCard from '../components/BlogCard';
import { loadUsers, loadPosts } from '../utils/storage';
import { User, Post } from '../utils/types';

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingStats(true);
    setStatsError(null);
    setLoadingPosts(true);
    setPostsError(null);

    try {
      // Simulate async fetch
      setTimeout(() => {
        try {
          const usersData = loadUsers();
          const postsData = loadPosts();
          setUsers(usersData);
          setPosts(postsData);
          setLoadingStats(false);
          setLoadingPosts(false);
        } catch (err: any) {
          setStatsError('Failed to load stats.');
          setPostsError('Failed to load posts.');
          setLoadingStats(false);
          setLoadingPosts(false);
        }
      }, 400);
    } catch (err: any) {
      setStatsError('Failed to load stats.');
      setPostsError('Failed to load posts.');
      setLoadingStats(false);
      setLoadingPosts(false);
    }
  }, []);

  // Stats calculations
  const totalUsers = users.length;
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(p => p.published).length;
  const editors = users.filter(u => u.role === 'editor').length;
  const viewers = users.filter(u => u.role === 'viewer').length;
  const admins = users.filter(u => u.role === 'admin').length;

  // Recent posts (latest 5)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  const recentPosts = sortedPosts.slice(0, 5);

  // Quick actions
  const handleGoUsers = () => navigate('/admin/users');
  const handleGoPosts = () => navigate('/admin/posts');
  const handleGoNewPost = () => navigate('/posts/new');

  return (
    <ProtectedRoute allowedRoles="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Admin Dashboard
          </h1>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={
                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6a4 4 0 11-8 0 4 4 0 018 0zm6 10v-2a4 4 0 00-3-3.87M3 20v-2a4 4 0 013-3.87" />
                </svg>
              }
              loading={loadingStats}
              error={statsError || undefined}
            />
            <StatCard
              title="Total Posts"
              value={totalPosts}
              icon={
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l-7-5V6a2 2 0 012-2h10a2 2 0 012 2v9l-7 5z" />
                </svg>
              }
              loading={loadingStats}
              error={statsError || undefined}
            />
            <StatCard
              title="Published Posts"
              value={publishedPosts}
              icon={
                <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              loading={loadingStats}
              error={statsError || undefined}
            />
            <StatCard
              title="Admins"
              value={admins}
              icon={
                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10l4.5 4.5a2 2 0 002.8 0L12 13l1.7 1.5a2 2 0 002.8 0L21 10M5 19h14a2 2 0 002-2v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
              }
              loading={loadingStats}
              error={statsError || undefined}
            />
            <StatCard
              title="Editors"
              value={editors}
              icon={
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20l-7-5V6a2 2 0 012-2h10a2 2 0 012 2v9l-7 5z" />
                </svg>
              }
              loading={loadingStats}
              error={statsError || undefined}
            />
            <StatCard
              title="Viewers"
              value={viewers}
              icon={
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7 0c0 5-7 9-7 9s-7-4-7-9a7 7 0 0114 0z" />
                </svg>
              }
              loading={loadingStats}
              error={statsError || undefined}
            />
          </div>
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              type="button"
              onClick={handleGoUsers}
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow"
            >
              Manage Users
            </button>
            <button
              type="button"
              onClick={handleGoPosts}
              className="px-5 py-2 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow"
            >
              Manage Posts
            </button>
            <button
              type="button"
              onClick={handleGoNewPost}
              className="px-5 py-2 rounded-md bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition-colors shadow"
            >
              Create New Post
            </button>
          </div>
          {/* Recent Posts */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Recent Posts
            </h2>
            {loadingPosts ? (
              <div className="text-gray-500 dark:text-gray-400 animate-pulse">Loading posts...</div>
            ) : postsError ? (
              <div className="text-red-600 dark:text-red-400">{postsError}</div>
            ) : recentPosts.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">No posts found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentPosts.map(post => {
                  const author = users.find(u => u.id === post.authorId);
                  return (
                    <BlogCard
                      key={post.id}
                      post={post}
                      authorName={author?.name || 'Unknown'}
                      authorAvatarUrl={author?.avatarUrl}
                      authorRole={author?.role || 'viewer'}
                      isAdmin={true}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AdminDashboard;
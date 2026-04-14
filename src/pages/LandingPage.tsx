import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import BlogCard from '../components/BlogCard';
import { loadPosts, loadUsers } from '../utils/storage';
import { Post, User } from '../utils/types';

function getAuthorInfo(authorId: string, users: User[]) {
  const user = users.find((u) => u.id === authorId);
  if (!user) {
    return {
      name: 'Unknown',
      avatarUrl: undefined,
      role: 'viewer' as const,
    };
  }
  return {
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
  };
}

const FEATURES = [
  {
    title: 'Collaborative Writing',
    desc: 'Write, edit, and share posts with your team in real time.',
    icon: (
      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.24 12.24A9 9 0 113.76 3.76 9 9 0 0120.24 12.24z" />
      </svg>
    ),
  },
  {
    title: 'Role-based Access',
    desc: 'Admins, editors, and viewers—control who can write, edit, or just read.',
    icon: (
      <svg className="w-8 h-8 text-yellow-500 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    title: 'Responsive & Modern UI',
    desc: 'Enjoy a beautiful, fast, and mobile-friendly interface with dark mode.',
    icon: (
      <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx={12} cy={12} r={10} strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

function LandingPage() {
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const posts = loadPosts().filter((p) => p.published);
      posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLatestPosts(posts.slice(0, 3));
      setUsers(loadUsers());
      setLoading(false);
    } catch (err: any) {
      setError('Failed to load posts.');
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <PublicNavbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gradient-to-b from-blue-50 dark:from-gray-800 to-white dark:to-gray-900">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Welcome to <span className="text-blue-600 dark:text-blue-400">writespace</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-2xl">
          The collaborative writing platform for teams, creators, and storytellers. Write, edit, and share your words with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="px-8 py-3 rounded-md bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition"
            onClick={() => navigate('/register')}
          >
            Get Started
          </button>
          <button
            className="px-8 py-3 rounded-md bg-white dark:bg-gray-800 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold text-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition"
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-10">
          Why writespace?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Latest Posts Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Posts</h2>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            onClick={() => navigate('/posts')}
          >
            Browse All
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-gray-500 dark:text-gray-400 animate-pulse">Loading posts...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-red-500 dark:text-red-400">{error}</span>
          </div>
        ) : latestPosts.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to write!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => {
              const author = getAuthorInfo(post.authorId, users);
              return (
                <BlogCard
                  key={post.id}
                  post={post}
                  authorName={author.name}
                  authorAvatarUrl={author.avatarUrl}
                  authorRole={author.role}
                  owned={false}
                  isAdmin={false}
                />
              );
            })}
          </div>
        )}
      </section>
      {/* Footer */}
      <footer className="mt-auto w-full bg-gray-100 dark:bg-gray-800 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-3 sm:mb-0">
            <svg
              className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
            <span className="font-bold text-gray-900 dark:text-gray-100">writespace</span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} writespace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
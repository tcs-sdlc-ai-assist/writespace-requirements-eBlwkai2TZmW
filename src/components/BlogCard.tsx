import React from 'react';
import PropTypes from 'prop-types';
import { Post, UserRole } from '../utils/types';
import Avatar from './Avatar';

/**
 * BlogCard component for displaying a blog post summary with optional controls.
 * @param {object} props
 * @param {Post} props.post - The post object.
 * @param {string} props.authorName - The author's display name.
 * @param {string} [props.authorAvatarUrl] - The author's avatar URL.
 * @param {UserRole} props.authorRole - The author's role.
 * @param {boolean} [props.owned] - If the current user is the owner.
 * @param {boolean} [props.isAdmin] - If the current user is admin.
 * @param {React.ReactNode} [props.actions] - Optional action buttons (edit, delete, etc).
 * @param {string} [props.className] - Optional additional Tailwind classes.
 * @returns {JSX.Element}
 */
function BlogCard({
  post,
  authorName,
  authorAvatarUrl,
  authorRole,
  owned = false,
  isAdmin = false,
  actions,
  className,
}) {
  const publishedBadge = post.published ? (
    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs font-medium ml-2">
      Published
    </span>
  ) : (
    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-xs font-medium ml-2">
      Draft
    </span>
  );

  return (
    <div
      className={`flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 ${className || ''}`}
      data-testid={`blog-card-${post.id}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Avatar name={authorName} avatarUrl={authorAvatarUrl} role={authorRole} />
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{authorName}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()} &middot;{' '}
              <span className="capitalize">{authorRole}</span>
              {publishedBadge}
            </div>
          </div>
        </div>
        {(owned || isAdmin) && actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
      <div className="mt-2">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-50 mb-2 truncate">{post.title}</h2>
        <p className="text-gray-700 dark:text-gray-200 line-clamp-3 mb-4">
          {post.content}
        </p>
      </div>
      <div className="flex items-center mt-auto">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Last updated: {new Date(post.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
  }).isRequired,
  authorName: PropTypes.string.isRequired,
  authorAvatarUrl: PropTypes.string,
  authorRole: PropTypes.oneOf(['admin', 'editor', 'viewer']).isRequired,
  owned: PropTypes.bool,
  isAdmin: PropTypes.bool,
  actions: PropTypes.node,
  className: PropTypes.string,
};

export default BlogCard;
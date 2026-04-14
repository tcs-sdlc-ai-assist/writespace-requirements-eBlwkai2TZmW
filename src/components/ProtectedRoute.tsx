import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';
import { UserRole } from '../utils/types';

/**
 * ProtectedRoute component for role-based access control.
 * Redirects to /login if not authenticated, or to /unauthorized if role is not allowed.
 * @param {object} props
 * @param {UserRole[]|UserRole} [props.allowedRoles] - Allowed roles for this route.
 * @param {React.ReactNode} props.children - The protected content.
 * @returns {JSX.Element}
 */
function ProtectedRoute({ allowedRoles, children }) {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.oneOfType([
    PropTypes.oneOf(['admin', 'editor', 'viewer']),
    PropTypes.arrayOf(PropTypes.oneOf(['admin', 'editor', 'viewer'])),
  ]),
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
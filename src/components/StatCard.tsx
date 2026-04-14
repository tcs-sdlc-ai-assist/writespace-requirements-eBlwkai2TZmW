import React from 'react';
import PropTypes from 'prop-types';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

/**
 * StatCard component for displaying a dashboard statistic.
 * @param {StatCardProps} props
 * @returns {JSX.Element}
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, loading = false, error }) => {
  return (
    <div className="flex flex-col justify-between bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 min-w-[180px] h-40">
      <div className="flex items-center space-x-3 mb-4">
        {icon && (
          <div className="text-2xl text-gray-500 dark:text-gray-300">
            {icon}
          </div>
        )}
        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">{title}</span>
      </div>
      <div className="flex items-center justify-between">
        {loading ? (
          <span className="animate-pulse text-gray-400 dark:text-gray-500 text-3xl font-bold">...</span>
        ) : error ? (
          <span className="text-red-500 dark:text-red-400 text-base font-medium">{error}</span>
        ) : (
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
        )}
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default StatCard;
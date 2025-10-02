/**
 * Dashboard routing utilities for role-based navigation
 */

export type UserRole = 'admin' | 'archivist' | 'researcher' | 'guest_researcher';

/**
 * Get the appropriate dashboard path for a user role
 */
export const getDashboardPath = (role: UserRole | string | undefined): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'archivist':
      return '/archivist';
    case 'researcher':
    case 'guest_researcher':
      return '/researcher';
    default:
      return '/researcher'; // Default to researcher dashboard
  }
};

/**
 * Get the dashboard name for display purposes
 */
export const getDashboardName = (role: UserRole | string | undefined): string => {
  switch (role) {
    case 'admin':
      return 'Admin Dashboard';
    case 'archivist':
      return 'Archivist Dashboard';
    case 'researcher':
    case 'guest_researcher':
      return 'Researcher Dashboard';
    default:
      return 'Researcher Dashboard';
  }
};
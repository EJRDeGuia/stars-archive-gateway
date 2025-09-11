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
    default:
      return '/library'; // Researchers go to library as their main dashboard
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
    default:
      return 'Library';
  }
};
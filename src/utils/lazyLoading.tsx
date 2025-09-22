import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Route-based code splitting for better performance
export const LazyAdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
export const LazyAnalyticsDashboard = lazy(() => import('@/pages/AnalyticsDashboard'));
export const LazyArchivistDashboard = lazy(() => import('@/pages/ArchivistDashboard'));
export const LazyAdvancedSearch = lazy(() => import('@/pages/AdvancedSearch'));
export const LazyEnhancedSearch = lazy(() => import('@/pages/EnhancedSearch'));
export const LazyBackupManagement = lazy(() => import('@/pages/BackupManagement'));
export const LazySecurityMonitor = lazy(() => import('@/pages/SecurityMonitor'));
export const LazyUserManagement = lazy(() => import('@/pages/UserManagement'));
export const LazyCollegeManagement = lazy(() => import('@/pages/CollegeManagement'));
export const LazySystemSettings = lazy(() => import('@/pages/SystemSettings'));

// Loading fallbacks
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-7xl mx-auto space-y-6">
      <Skeleton className="h-12 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-96" />
        <Skeleton className="h-96" />
      </div>
    </div>
  </div>
);

export const CardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-48" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);

// HOC for lazy loading with error boundary
export const withLazyLoading = (Component: React.ComponentType) => {
  return (props: any) => (
    <Suspense fallback={<PageSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
};
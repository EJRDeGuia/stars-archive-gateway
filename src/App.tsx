
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import TestingModeToggle from "@/components/TestingModeToggle";
import NetworkAccessChecker from "@/components/NetworkAccessChecker";
import { PageSkeleton } from "@/utils/lazyLoading";
import { logger } from "@/services/logger";

// Lazy load all pages for optimal performance
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/Login"));
const ThesisDetail = lazy(() => import("@/pages/ThesisDetail"));
const Upload = lazy(() => import("@/pages/Upload"));
const EnhancedSearch = lazy(() => import("@/pages/EnhancedSearch"));
const AdvancedSearch = lazy(() => import("@/pages/AdvancedSearch"));
const AdvancedSearchPage = lazy(() => import("@/pages/AdvancedSearchPage"));
const ArchivistDashboard = lazy(() => import("@/pages/ArchivistDashboard"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const ResearcherDashboard = lazy(() => import("@/pages/ResearcherDashboard"));
const CollegePage = lazy(() => import("@/pages/CollegePage"));
const Explore = lazy(() => import("@/pages/Explore"));
const Collections = lazy(() => import("@/pages/Collections"));
const CollectionView = lazy(() => import("@/pages/CollectionView"));
const Library = lazy(() => import("@/pages/Library"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const About = lazy(() => import("@/pages/About"));
const Resources = lazy(() => import("@/pages/Resources"));
const ManageRecords = lazy(() => import("@/pages/ManageRecords"));
const ManageCollections = lazy(() => import("@/pages/ManageCollections"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const AuditLogs = lazy(() => import("@/pages/AuditLogs"));
const CollegeManagement = lazy(() => import("@/pages/CollegeManagement"));
const AnalyticsDashboard = lazy(() => import("@/pages/AnalyticsDashboard"));
const SystemSettings = lazy(() => import("@/pages/SystemSettings"));
const SecurityMonitor = lazy(() => import("@/pages/SecurityMonitor"));
const RequestThesisAccess = lazy(() => import("@/pages/RequestThesisAccess"));
const RequestSpecificThesisAccess = lazy(() => import("@/pages/RequestSpecificThesisAccess"));
const ApprovedThesesAccess = lazy(() => import("@/pages/ApprovedThesesAccess"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ContentManagement = lazy(() => import("@/pages/ContentManagement"));
const AboutContentManager = lazy(() => import("@/pages/AboutContentManager"));
const ResourcesContentManager = lazy(() => import("@/pages/ResourcesContentManager"));
const TeamMembersManager = lazy(() => import("@/pages/TeamMembersManager"));
const AnnouncementsManager = lazy(() => import("@/pages/AnnouncementsManager"));
const BackupManagement = lazy(() => import("@/pages/BackupManagement"));
const ThesisEdit = lazy(() => import("@/pages/ThesisEdit"));

import { getDashboardPath } from "@/utils/dashboardUtils";
import DashboardRedirect from "@/components/DashboardRedirect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error) => {
        logger.warn('Query retry', { failureCount, error: error.message });
        return failureCount < 3;
      },
    },
  },
});

function App() {
  logger.info('Application initialized', { timestamp: new Date().toISOString() });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <NetworkAccessChecker>
            <div className="min-h-screen bg-background">
              <Toaster />
              <TestingModeToggle />
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              
              {/* Protected Routes - Core Phase A Features */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
              <Route path="/thesis/:id" element={<ProtectedRoute><ThesisDetail /></ProtectedRoute>} />
              <Route path="/college/:id" element={<ProtectedRoute><CollegePage /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
              <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
              <Route path="/collection/:id" element={<ProtectedRoute><CollectionView /></ProtectedRoute>} />
              <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/request-access" element={<ProtectedRoute><RequestThesisAccess /></ProtectedRoute>} />
              <Route path="/request-access/:id" element={<ProtectedRoute><RequestSpecificThesisAccess /></ProtectedRoute>} />
              <Route path="/approved-access" element={<ProtectedRoute><ApprovedThesesAccess /></ProtectedRoute>} />
              
              {/* Search Routes */}
              <Route path="/search/enhanced" element={<ProtectedRoute><EnhancedSearch /></ProtectedRoute>} />
              <Route path="/search/advanced" element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} />
              <Route path="/search/ai" element={<ProtectedRoute><AdvancedSearchPage /></ProtectedRoute>} />
              
              {/* Archivist Routes - Upload is exclusive to archivists */}
              <Route path="/upload" element={<ProtectedRoute requiredRole="archivist" exactRole={true}><Upload /></ProtectedRoute>} />
              <Route path="/archivist" element={<ProtectedRoute requiredRole="archivist"><ArchivistDashboard /></ProtectedRoute>} />
              <Route path="/manage-records" element={<ProtectedRoute requiredRole="archivist"><ManageRecords /></ProtectedRoute>} />
              <Route path="/manage-collections" element={<ProtectedRoute requiredRole="archivist"><ManageCollections /></ProtectedRoute>} />
              
              {/* Researcher Dashboard */}
              <Route path="/researcher" element={<ProtectedRoute requiredRole="researcher"><ResearcherDashboard /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/user-management" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
              <Route path="/audit-logs" element={<ProtectedRoute requiredRole="admin"><AuditLogs /></ProtectedRoute>} />
              <Route path="/college-management" element={<ProtectedRoute requiredRole="admin"><CollegeManagement /></ProtectedRoute>} />
              <Route path="/analytics-dashboard" element={<ProtectedRoute requiredRole="admin"><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/system-settings" element={<ProtectedRoute requiredRole="admin"><SystemSettings /></ProtectedRoute>} />
              <Route path="/security-monitor" element={<ProtectedRoute requiredRole="admin"><SecurityMonitor /></ProtectedRoute>} />
              <Route path="/backup-management" element={<ProtectedRoute requiredRole="admin"><BackupManagement /></ProtectedRoute>} />
              
              {/* Thesis Edit Route - Available to Archivists and Admins */}
              <Route path="/thesis/:id/edit" element={<ProtectedRoute requiredRole="archivist"><ThesisEdit /></ProtectedRoute>} />
              
              {/* Phase 5: Content Management Routes */}
              <Route path="/admin/content" element={<ProtectedRoute requiredRole="admin"><ContentManagement /></ProtectedRoute>} />
              <Route path="/admin/content/about" element={<ProtectedRoute requiredRole="admin"><AboutContentManager /></ProtectedRoute>} />
              <Route path="/admin/content/resources" element={<ProtectedRoute requiredRole="admin"><ResourcesContentManager /></ProtectedRoute>} />
              <Route path="/admin/content/team" element={<ProtectedRoute requiredRole="admin"><TeamMembersManager /></ProtectedRoute>} />
              <Route path="/admin/announcements" element={<ProtectedRoute requiredRole="admin"><AnnouncementsManager /></ProtectedRoute>} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </NetworkAccessChecker>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

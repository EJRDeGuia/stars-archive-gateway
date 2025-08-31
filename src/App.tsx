
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ThesisDetail from "@/pages/ThesisDetail";
import Upload from "@/pages/Upload";
import EnhancedSearch from "@/pages/EnhancedSearch";
import AdvancedSearch from "@/pages/AdvancedSearch";
import ArchivistDashboard from "@/pages/ArchivistDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import CollegePage from "@/pages/CollegePage";
import Explore from "@/pages/Explore";
import Collections from "@/pages/Collections";
import CollectionView from "@/pages/CollectionView";
import Library from "@/pages/Library";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import Resources from "@/pages/Resources";
import ManageRecords from "@/pages/ManageRecords";
import ManageCollections from "@/pages/ManageCollections";
import UserManagement from "@/pages/UserManagement";
import CollegeManagement from "@/pages/CollegeManagement";
import AnalyticsDashboard from "@/pages/AnalyticsDashboard";
import SystemSettings from "@/pages/SystemSettings";
import SecurityMonitor from "@/pages/SecurityMonitor";
import RequestThesisAccess from "@/pages/RequestThesisAccess";
import NotFound from "@/pages/NotFound";
import ContentManagement from "@/pages/ContentManagement";
import AboutContentManager from "@/pages/AboutContentManager";
import ResourcesContentManager from "@/pages/ResourcesContentManager";
import TeamMembersManager from "@/pages/TeamMembersManager";
import AnnouncementsManager from "@/pages/AnnouncementsManager";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<About />} />
              <Route path="/resources" element={<Resources />} />
              
              {/* Protected Routes - Core Phase A Features */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/thesis/:id" element={<ProtectedRoute><ThesisDetail /></ProtectedRoute>} />
              <Route path="/college/:id" element={<ProtectedRoute><CollegePage /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
              <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
              <Route path="/collection/:id" element={<ProtectedRoute><CollectionView /></ProtectedRoute>} />
              <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/request-access" element={<ProtectedRoute><RequestThesisAccess /></ProtectedRoute>} />
              
              {/* Search Routes */}
              <Route path="/search/enhanced" element={<ProtectedRoute><EnhancedSearch /></ProtectedRoute>} />
              <Route path="/search/advanced" element={<ProtectedRoute><AdvancedSearch /></ProtectedRoute>} />
              
              {/* Archivist Routes - Upload is exclusive to archivists */}
              <Route path="/upload" element={<ProtectedRoute requiredRole="archivist" exactRole={true}><Upload /></ProtectedRoute>} />
              <Route path="/archivist" element={<ProtectedRoute requiredRole="archivist"><ArchivistDashboard /></ProtectedRoute>} />
              <Route path="/manage-records" element={<ProtectedRoute requiredRole="archivist"><ManageRecords /></ProtectedRoute>} />
              <Route path="/manage-collections" element={<ProtectedRoute requiredRole="archivist"><ManageCollections /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
              <Route path="/user-management" element={<ProtectedRoute requiredRole="admin"><UserManagement /></ProtectedRoute>} />
              <Route path="/college-management" element={<ProtectedRoute requiredRole="admin"><CollegeManagement /></ProtectedRoute>} />
              <Route path="/analytics-dashboard" element={<ProtectedRoute requiredRole="admin"><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/system-settings" element={<ProtectedRoute requiredRole="admin"><SystemSettings /></ProtectedRoute>} />
              <Route path="/security-monitor" element={<ProtectedRoute requiredRole="admin"><SecurityMonitor /></ProtectedRoute>} />
              
              {/* Phase 5: Content Management Routes */}
              <Route path="/admin/content" element={<ProtectedRoute requiredRole="admin"><ContentManagement /></ProtectedRoute>} />
              <Route path="/admin/content/about" element={<ProtectedRoute requiredRole="admin"><AboutContentManager /></ProtectedRoute>} />
              <Route path="/admin/content/resources" element={<ProtectedRoute requiredRole="admin"><ResourcesContentManager /></ProtectedRoute>} />
              <Route path="/admin/content/team" element={<ProtectedRoute requiredRole="admin"><TeamMembersManager /></ProtectedRoute>} />
              <Route path="/admin/announcements" element={<ProtectedRoute requiredRole="admin"><AnnouncementsManager /></ProtectedRoute>} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

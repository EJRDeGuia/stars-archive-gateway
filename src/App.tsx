
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import NetworkAccessChecker from "./components/NetworkAccessChecker";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ArchivistDashboard from "./pages/ArchivistDashboard";
import CollegePage from "./pages/CollegePage";
import ThesisDetail from "./pages/ThesisDetail";
import Upload from "./pages/Upload";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import Settings from "./pages/Settings";
import Explore from "./pages/Explore";
import Collections from "./pages/Collections";
import CollectionView from "./pages/CollectionView";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";
import Resources from "./pages/Resources";
import UserManagement from "./pages/UserManagement";
import CollegeManagement from "./pages/CollegeManagement";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import SystemSettings from "./pages/SystemSettings";
import SecurityMonitor from "./pages/SecurityMonitor";
import ManageCollections from '@/pages/ManageCollections';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/user-guide" element={<Resources />} />
            <Route path="/help" element={<Resources />} />
            <Route path="/research-format" element={<Resources />} />
            <Route path="/faq" element={<Resources />} />
            <Route path="/privacy-policy" element={<Resources />} />
            <Route path="/terms-of-service" element={<Resources />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/user-management" element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/college-management" element={
              <ProtectedRoute requiredRole="admin">
                <CollegeManagement />
              </ProtectedRoute>
            } />
            <Route path="/analytics-dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/system-settings" element={
              <ProtectedRoute requiredRole="admin">
                <SystemSettings />
              </ProtectedRoute>
            } />
            <Route path="/security-monitor" element={
              <ProtectedRoute requiredRole="admin">
                <SecurityMonitor />
              </ProtectedRoute>
            } />
            <Route path="/archivist" element={
              <ProtectedRoute requiredRole="archivist">
                <ArchivistDashboard />
              </ProtectedRoute>
            } />
            <Route path="/explore" element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            } />
            <Route path="/collections" element={
              <ProtectedRoute>
                <Collections />
              </ProtectedRoute>
            } />
            <Route path="/collection/:id" element={
              <ProtectedRoute>
                <CollectionView />
              </ProtectedRoute>
            } />
            <Route path="/college/:id" element={
              <ProtectedRoute>
                <CollegePage />
              </ProtectedRoute>
            } />
            <Route path="/thesis/:id" element={
              <ProtectedRoute>
                <NetworkAccessChecker>
                  <ThesisDetail />
                </NetworkAccessChecker>
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute requiredRole="archivist">
                <Upload />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/library" element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/archivist/manage-collections" element={
              <ProtectedRoute requiredRole="archivist">
                <ManageCollections />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

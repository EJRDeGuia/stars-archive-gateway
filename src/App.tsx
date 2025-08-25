import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ThesisDetails from "./pages/ThesisDetails";
import UploadThesis from "./pages/UploadThesis";
import ProtectedRoute from "./components/ProtectedRoute";
import RequestAccess from "./pages/RequestAccess";
import { Toaster } from "@/components/ui/toaster"
import { QueryClient } from "@tanstack/react-query";
import ManageRequests from "./pages/ManageRequests";
import ManageUsers from "./pages/ManageUsers";
import EnhancedSearch from "@/pages/EnhancedSearch";
import AdvancedSearch from "@/pages/AdvancedSearch";

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/thesis/:id" element={<ProtectedRoute><ThesisDetails /></ProtectedRoute>} />
              <Route path="/request-access/:thesisId" element={<ProtectedRoute><RequestAccess /></ProtectedRoute>} />
              
              <Route path="/upload" element={<ProtectedRoute requiredRole="archivist"><UploadThesis /></ProtectedRoute>} />
              <Route path="/manage-requests" element={<ProtectedRoute requiredRole="archivist"><ManageRequests /></ProtectedRoute>} />
              <Route path="/manage-users" element={<ProtectedRoute requiredRole="admin"><ManageUsers /></ProtectedRoute>} />
              
              <Route path="/search/enhanced" element={<EnhancedSearch />} />
              <Route path="/search/advanced" element={<AdvancedSearch />} />
              
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;

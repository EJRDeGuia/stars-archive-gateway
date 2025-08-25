
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ThesisDetail from "./pages/ThesisDetail";
import Upload from "./pages/Upload";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster"
import EnhancedSearch from "@/pages/EnhancedSearch";
import AdvancedSearch from "@/pages/AdvancedSearch";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/thesis/:id" element={<ProtectedRoute><ThesisDetail /></ProtectedRoute>} />
              
              <Route path="/upload" element={<ProtectedRoute requiredRole="archivist"><Upload /></ProtectedRoute>} />
              
              <Route path="/search/enhanced" element={<EnhancedSearch />} />
              <Route path="/search/advanced" element={<AdvancedSearch />} />
              
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SystemProvider } from "./context/SystemContext";
import DashboardLayout from "./layouts/DashboardLayout";

// Import Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SectorSelectionPage from "./pages/SectorSelectionPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

// Route Guard: Ensures user is signed in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030408] flex flex-col items-center justify-center font-mono text-xs gap-3">
        <div className="w-10 h-10 border-4 border-white/5 border-t-neon-cyan rounded-full animate-spin"></div>
        <span className="text-gray-500 uppercase tracking-widest animate-pulse">Syncing core...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Route Guard: Ensures user has selected a sector (Admins bypass sector locks)
const SectorRequiredRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030408] flex flex-col items-center justify-center font-mono text-xs gap-3">
        <div className="w-10 h-10 border-4 border-white/5 border-t-neon-cyan rounded-full animate-spin"></div>
        <span className="text-gray-500 uppercase tracking-widest">Syncing core...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }
  
  if (!user.sector) {
    return <Navigate to="/sector-selection" replace />;
  }
  
  return children;
};

// Route Guard: Ensures user is an Admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030408] flex flex-col items-center justify-center font-mono text-xs gap-3">
        <div className="w-10 h-10 border-4 border-white/5 border-t-neon-cyan rounded-full animate-spin"></div>
        <span className="text-gray-500 uppercase tracking-widest">Syncing core...</span>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SystemProvider>
          <Routes>
            {/* Public Paths */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Sector Selection Path (Requires auth, but bypasses sector checking) */}
            <Route 
              path="/sector-selection" 
              element={
                <ProtectedRoute>
                  <SectorSelectionPage />
                </ProtectedRoute>
              } 
            />

            {/* Operator Dashboard Paths (Requires auth + selected sector) */}
            <Route 
              path="/dashboard" 
              element={
                <SectorRequiredRoute>
                  <DashboardLayout>
                    <UserDashboard />
                  </DashboardLayout>
                </SectorRequiredRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <SectorRequiredRoute>
                  <DashboardLayout>
                    <AnalyticsPage />
                  </DashboardLayout>
                </SectorRequiredRoute>
              } 
            />
            <Route 
              path="/alerts" 
              element={
                <SectorRequiredRoute>
                  <DashboardLayout>
                    <AlertsPage />
                  </DashboardLayout>
                </SectorRequiredRoute>
              } 
            />

            {/* Admin Dashboard Paths (Requires Admin privilege) */}
            <Route 
              path="/admin-dashboard" 
              element={
                <AdminRoute>
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </AdminRoute>
              } 
            />

            {/* Shared Dashboard Paths (Profile & Settings require Auth) */}
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />

            {/* Not Found Path */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </SystemProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

// Lazy loaded pages
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OrganizationDetail = lazy(() => import('./pages/OrganizationDetail'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Settings = lazy(() => import('./pages/Settings'));
const GuestProjectView = lazy(() => import('./pages/GuestProjectView'));
const Landing = lazy(() => import('./pages/Landing'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Team = lazy(() => import('./pages/Team'));
const Analytics = lazy(() => import('./pages/Analytics'));

const LoadingPage = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 animate-pulse">Initializing Ecosystem</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/guest/projects/:token" element={<GuestProjectView />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/orgs/:slug" element={<OrganizationDetail />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/users" element={<Team />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

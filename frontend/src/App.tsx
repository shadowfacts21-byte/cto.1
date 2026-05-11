import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import OrganizationDetail from './pages/OrganizationDetail';
import ProjectDetail from './pages/ProjectDetail';
import Settings from './pages/Settings';
import GuestProjectView from './pages/GuestProjectView';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guest/projects/:token" element={<GuestProjectView />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orgs/:slug" element={<OrganizationDetail />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/users" element={<div>Users Page (Coming Soon)</div>} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

import { Navigate } from 'react-router-dom';

export default App;

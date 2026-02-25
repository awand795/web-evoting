import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import KandidatList from './pages/user/KandidatList';
import HasilVoting from './pages/HasilVoting';
import UserManagement from './pages/admin/UserManagement';
import KandidatManagement from './pages/admin/KandidatManagement';
import SettingsManagement from './pages/admin/SettingsManagement';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kandidat"
          element={
            <ProtectedRoute>
              <KandidatList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hasil"
          element={
            <ProtectedRoute>
              <HasilVoting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/kandidat"
          element={
            <AdminRoute>
              <KandidatManagement />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <SettingsManagement />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

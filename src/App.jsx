import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PageTransition from './components/PageTransition';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import KandidatList from './pages/user/KandidatList';
import HasilVoting from './pages/HasilVoting';
import ProfilePage from './pages/ProfilePage';
import UserManagement from './pages/admin/UserManagement';
import KandidatManagement from './pages/admin/KandidatManagement';
import SettingsManagement from './pages/admin/SettingsManagement';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: { borderRadius: '10px', background: '#333', color: '#fff', fontSize: '14px' },
      }} />
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition><DashboardPage /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kandidat"
            element={
              <ProtectedRoute>
                <PageTransition><KandidatList /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hasil"
            element={
              <ProtectedRoute>
                <PageTransition><HasilVoting /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageTransition><ProfilePage /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <PageTransition><UserManagement /></PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/kandidat"
            element={
              <AdminRoute>
                <PageTransition><KandidatManagement /></PageTransition>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <PageTransition><SettingsManagement /></PageTransition>
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;

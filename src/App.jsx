import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/Login';
import AdminWishesTable from './pages/AdminWishesTable';
import CreateBirthdayWish from './pages/CreateBirthday';
import CreateAnniversaryWish from './pages/CreateAnniversary';
import WishPage from './pages/WishPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/wish/:slug" element={<WishPage />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/wishes"
            element={
              <ProtectedRoute>
                <AdminWishesTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-birthday"
            element={
              <ProtectedRoute>
                <CreateBirthdayWish />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/create-anniversary"
            element={
              <ProtectedRoute>
                <CreateAnniversaryWish />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Navigate to="/admin/wishes" replace />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

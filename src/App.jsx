import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Services from './pages/Services';
import Reviews from './pages/Reviews';
import Enquiries from './pages/Enquiries';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

// Route protector
function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated || user?.role !== 'Admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Authenticated Admin Management Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="services" element={<Services />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="enquiries" element={<Enquiries />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Location from './pages/Location';
import Construction from './pages/Construction';
import Architecture from './pages/Architecture';
import Realizations from './pages/Realizations';
import Contact from './pages/Contact';
import Devis from './pages/Devis';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard, { AdminOverview, AdminProfile, AdminUsersView, AdminPropertiesView, AdminContractsView, AdminFinanceView, AdminSettingsView } from './pages/dashboard/AdminDashboard';
import TenantDashboard, { TenantOverview, TenantProfile, TenantContractView, TenantPaymentsView, TenantMaintenanceView, TenantSettingsView } from './pages/dashboard/TenantDashboard';
import OwnerDashboard, { OwnerOverview, OwnerProfile, OwnerPropertiesView, OwnerContractsView, OwnerTenantsView, OwnerFinanceView, OwnerSettingsView } from './pages/dashboard/OwnerDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function PrivateRoute({ children, role }: { children: React.ReactNode, role?: string }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && profile?.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/location" element={<MainLayout><Location /></MainLayout>} />
          <Route path="/bien/:id" element={<MainLayout><PropertyDetail /></MainLayout>} />
          <Route path="/construction" element={<MainLayout><Construction /></MainLayout>} />
          <Route path="/architecture" element={<MainLayout><Architecture /></MainLayout>} />
          <Route path="/realisations" element={<MainLayout><Realizations /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/devis" element={<MainLayout><Devis /></MainLayout>} />
          <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
          <Route path="/register" element={<MainLayout><Register /></MainLayout>} />

          {/* Dashboards */}
          <Route path="/dashboard/admin" element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="profil" element={<AdminProfile />} />
            <Route path="users" element={<AdminUsersView />} />
            <Route path="properties" element={<AdminPropertiesView />} />
            <Route path="contracts" element={<AdminContractsView />} />
            <Route path="finance" element={<AdminFinanceView />} />
            <Route path="parametres" element={<AdminSettingsView />} />
            <Route path="*" element={<AdminOverview />} />
          </Route>
          <Route path="/dashboard/locataire" element={
            <PrivateRoute role="locataire">
              <TenantDashboard />
            </PrivateRoute>
          }>
            <Route index element={<TenantOverview />} />
            <Route path="profil" element={<TenantProfile />} />
            <Route path="contract" element={<TenantContractView />} />
            <Route path="payments" element={<TenantPaymentsView />} />
            <Route path="maintenance" element={<TenantMaintenanceView />} />
            <Route path="parametres" element={<TenantSettingsView />} />
            <Route path="*" element={<TenantOverview />} />
          </Route>
          <Route path="/dashboard/proprietaire" element={
            <PrivateRoute role="proprietaire">
              <OwnerDashboard />
            </PrivateRoute>
          }>
            <Route index element={<OwnerOverview />} />
            <Route path="profil" element={<OwnerProfile />} />
            <Route path="properties" element={<OwnerPropertiesView />} />
            <Route path="contracts" element={<OwnerContractsView />} />
            <Route path="tenants" element={<OwnerTenantsView />} />
            <Route path="finance" element={<OwnerFinanceView />} />
            <Route path="parametres" element={<OwnerSettingsView />} />
            <Route path="*" element={<OwnerOverview />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

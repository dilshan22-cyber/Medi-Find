import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
// Public Pages
import { MedicineSearch } from './pages/public/MedicineSearch';
import { SearchResults } from './pages/public/SearchResults';
import { PriceComparison } from './pages/public/PriceComparison';
// User Pages
import { UserLogin } from './pages/user/UserLogin';
import { UserRegistration } from './pages/user/UserRegistration';
import { UserProfile } from './pages/user/UserProfile';
import { SavedMedicines } from './pages/user/SavedMedicines';
// Pharmacy Pages
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { StockList } from './pages/pharmacy/StockList';
import { PharmacyRegistration } from './pages/pharmacy/PharmacyRegistration';
import { PharmacyLogin } from './pages/pharmacy/PharmacyLogin';
import { PharmacySettings } from './pages/pharmacy/PharmacySettings';
import { PharmacyProfile } from './pages/pharmacy/PharmacyProfile';
import { AdminDashboard } from './pages/admin/AdminDashboard';
// Layout Wrappers
const PublicLayout = () => <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
  <Header role="public" />
  <main className="flex-grow">
    <Outlet />
  </main>
  <Footer />
</div>;
const UserLayout = () => <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
  <Header role="user" />
  <main className="flex-grow">
    <Outlet />
  </main>
  <Footer />
</div>;
const PharmacyLayout = () => <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
  <Header role="pharmacy" />
  <div className="flex flex-grow">
    <Sidebar role="pharmacy" />
    <main className="flex-grow bg-gray-50">
      <Outlet />
    </main>
  </div>
  <Footer />
</div>;
export function App() {
  return <Router>
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<MedicineSearch />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/compare" element={<PriceComparison />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegistration />} />
        <Route path="/pharmacy/register" element={<PharmacyRegistration />} />
        <Route path="/pharmacy/login" element={<PharmacyLogin />} />
      </Route>

      {/* User Routes */}
      <Route path="/user" element={<UserLayout />}>
        <Route path="profile" element={<UserProfile />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="compare" element={<PriceComparison />} />
        <Route path="find" element={<MedicineSearch />} />
        <Route path="saved" element={<SavedMedicines />} />
        <Route path="notifications" element={<div className="p-8 text-center text-2xl">
          Notifications (Coming Soon)
        </div>} />
      </Route>

      {/* Pharmacy Routes */}
      <Route path="/pharmacy" element={<PharmacyLayout />}>
        <Route path="dashboard" element={<PharmacyDashboard />} />
        <Route path="stock" element={<StockList />} />
        <Route path="alerts" element={<StockList defaultFilter="low" />} />
        <Route path="settings" element={<PharmacySettings />} />
        <Route path="prices" element={<StockList />} />
        <Route path="profile" element={<PharmacyProfile />} />
      </Route>

      {/* Admin Route */}
      <Route path="/admin" element={<AdminDashboard />} />

    </Routes>
  </Router>;
}
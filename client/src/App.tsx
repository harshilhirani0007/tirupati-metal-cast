import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public website
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Stats from './components/Stats';
import Products from './components/Products';
import Services from './components/Services';
import Process from './components/Process';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin
import LoginPage from './admin/LoginPage';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import EnquiriesPage from './admin/EnquiriesPage';
import ProductsPage from './admin/ProductsPage';
import TestimonialsPage from './admin/TestimonialsPage';
import SettingsPage from './admin/SettingsPage';

function PublicSite() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div className={dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Products />
      <Services />
      <Process />
      <WhyUs />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}

function AdminGuard() {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-8 h-8 border-2 border-slate-700 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );
  if (!admin) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public website */}
            <Route path="/" element={<PublicSite />} />

            {/* Admin login */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />

            {/* Protected admin panel */}
            <Route path="/admin" element={<AdminGuard />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="enquiries" element={<EnquiriesPage />} />
              <Route path="enquiries/:id" element={<EnquiriesPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

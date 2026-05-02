import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public website layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import About from './components/About';
import Products from './components/Products';
import Services from './components/Services';
import Process from './components/Process';
import WhyUs from './components/WhyUs';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';

// Admin
import LoginPage from './admin/LoginPage';
import SetupPage from './admin/SetupPage';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import EnquiriesPage from './admin/EnquiriesPage';
import ProductsPage from './admin/ProductsPage';
import TestimonialsPage from './admin/TestimonialsPage';
import SettingsPage from './admin/SettingsPage';

function PublicLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div className={dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}>
      <Navbar />
      {children}
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
            {/* Public website — multi-page SPA */}
            <Route element={<PublicLayout><Hero /></PublicLayout>} path="/" />
            <Route element={<PublicLayout><About /></PublicLayout>} path="/about" />
            <Route element={<PublicLayout><Products /></PublicLayout>} path="/products" />
            <Route element={<PublicLayout><Services /></PublicLayout>} path="/services" />
            <Route element={<PublicLayout><Process /></PublicLayout>} path="/process" />
            <Route element={<PublicLayout><WhyUs /></PublicLayout>} path="/why-us" />
            <Route element={<PublicLayout><Testimonials /></PublicLayout>} path="/testimonials" />
            <Route element={<PublicLayout><Contact /></PublicLayout>} path="/contact" />

            {/* Admin auth */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/setup" element={<SetupPage />} />

            {/* Protected admin panel */}
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<Navigate to="dashboard" replace />} />
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

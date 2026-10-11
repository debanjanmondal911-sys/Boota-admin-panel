import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminDataContext';
import { AdminLoginView } from './components/AdminLoginView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { InventoryView } from './components/InventoryView';
import { OrdersView } from './components/OrdersView';
import { ReturnsView } from './components/ReturnsView';
import { CustomersView } from './components/CustomersView';
import { CategoriesView } from './components/CategoriesView';
import { CouponsView } from './components/CouponsView';
import { ContentView } from './components/ContentView';
import { ReviewsView } from './components/ReviewsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { StorefrontPreviewModal } from './components/StorefrontPreviewModal';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const VALID_MODULES = [
  'dashboard',
  'products',
  'inventory',
  'orders',
  'returns',
  'customers',
  'categories',
  'coupons',
  'cms',
  'reviews',
  'reports',
  'settings'
];

const getModuleFromLocation = (): string => {
  if (typeof window === 'undefined') return 'dashboard';
  const raw = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  return VALID_MODULES.includes(raw) ? raw : 'dashboard';
};

const AdminAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState<string>(() => getModuleFromLocation());
  const [isStorefrontModalOpen, setIsStorefrontModalOpen] = useState(false);
  const { toast } = useAdmin();

  // Listen to browser Back/Forward navigation (popstate & hashchange)
  useEffect(() => {
    const handleNavigationChange = () => {
      // If modal was open and user pressed browser Back, close the modal
      setIsStorefrontModalOpen(false);
      const targetModule = getModuleFromLocation();
      setActiveModule(targetModule);
    };

    window.addEventListener('popstate', handleNavigationChange);
    window.addEventListener('hashchange', handleNavigationChange);

    // Prime the initial URL in browser history so the Back button is active
    if (!window.location.hash || !VALID_MODULES.includes(window.location.hash.replace(/^#\/?/, ''))) {
      window.history.replaceState({ module: 'dashboard' }, '', '#/dashboard');
    }

    return () => {
      window.removeEventListener('popstate', handleNavigationChange);
      window.removeEventListener('hashchange', handleNavigationChange);
    };
  }, []);

  const navigateTo = (module: string) => {
    if (module === activeModule && !isStorefrontModalOpen) return;
    setIsStorefrontModalOpen(false);
    setActiveModule(module);
    window.history.pushState({ module }, '', `/#/${module}`);
  };

  const handleOpenStorefront = () => {
    setIsStorefrontModalOpen(true);
    window.history.pushState({ modal: 'storefront', module: activeModule }, '', window.location.hash);
  };

  const handleCloseStorefront = () => {
    setIsStorefrontModalOpen(false);
  };

  if (!isAuthenticated) {
    return <AdminLoginView />;
  }

  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView onNavigate={navigateTo} />;
      case 'products':
        return <ProductsView />;
      case 'inventory':
        return <InventoryView />;
      case 'orders':
        return <OrdersView />;
      case 'returns':
        return <ReturnsView />;
      case 'customers':
        return <CustomersView />;
      case 'categories':
        return <CategoriesView />;
      case 'coupons':
        return <CouponsView />;
      case 'cms':
        return <ContentView />;
      case 'reviews':
        return <ReviewsView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row text-stone-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        onNavigate={navigateTo}
        onOpenStorefront={handleOpenStorefront}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          activeModule={activeModule}
          onNavigate={navigateTo}
          onOpenStorefront={handleOpenStorefront}
        />

        <main className="flex-1 pb-16">
          {renderModuleView()}
        </main>
      </div>

      {/* Live Storefront Modal */}
      <StorefrontPreviewModal
        isOpen={isStorefrontModalOpen}
        onClose={handleCloseStorefront}
      />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-stone-900 text-stone-100 px-4 py-3 rounded-xl shadow-2xl border border-stone-800 flex items-center gap-3 text-xs">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <AdminAppContent />
      </AdminProvider>
    </AuthProvider>
  );
}

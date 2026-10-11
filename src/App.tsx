import React, { useState } from 'react';
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

const AdminAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isStorefrontModalOpen, setIsStorefrontModalOpen] = useState(false);
  const { toast } = useAdmin();

  if (!isAuthenticated) {
    return <AdminLoginView />;
  }

  const renderModuleView = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardView onNavigate={setActiveModule} />;
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
        return <DashboardView onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row text-stone-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeModule={activeModule}
        onNavigate={setActiveModule}
        onOpenStorefront={() => setIsStorefrontModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          activeModule={activeModule}
          onNavigate={setActiveModule}
          onOpenStorefront={() => setIsStorefrontModalOpen(true)}
        />

        <main className="flex-1 pb-16">
          {renderModuleView()}
        </main>
      </div>

      {/* Live Storefront Modal */}
      <StorefrontPreviewModal
        isOpen={isStorefrontModalOpen}
        onClose={() => setIsStorefrontModalOpen(false)}
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

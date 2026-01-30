import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerView from './components/CustomerView.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { LayoutDashboard, ShoppingBag } from 'lucide-react';

const BACKEND_URL = window.location.hostname.includes('github.dev') 
  ? `https://${window.location.hostname.replace('-5173', '-3000')}`
  : "http://localhost:3000";

function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* View Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <div className="flex gap-2 bg-slate-800/80 backdrop-blur-xl rounded-full p-1 border border-slate-700">
          <button
            onClick={() => setView('customer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              view === 'customer'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag size={18} />
            <span className="text-sm font-medium">Store</span>
          </button>
          <button
            onClick={() => setView('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              view === 'admin'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-medium">Admin</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {view === 'customer' ? (
          <motion.div
            key="customer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CustomerView backendUrl={BACKEND_URL} />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AdminDashboard backendUrl={BACKEND_URL} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
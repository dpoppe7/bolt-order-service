import { useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerView from './components/CustomerView.tsx';
import AdminDashboard from './components/AdminDashboard.tsx'
import { NavBar } from './components/NavBar.tsx';

const BACKEND_URL = window.location.hostname.includes('github.dev') 
  ? `https://${window.location.hostname.replace('-5173', '-3000')}`
  : "http://localhost:3000";

function App() {
  const [view, setView] = useState<'customer' | 'admin'>('customer');

  return (
    <div className="min-h-screen w-full bg-gradient-app">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 blur-[120px] animate-pulse delay-1000" />
      </div>
      
      {/* Navigation Bar */}
      <NavBar view={view} onViewChange={setView} />

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
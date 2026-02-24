import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw, Package, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { OrdersTable } from './OrdersTable';
import { InventoryManager, StatCard } from './InventoryManager';

export interface Order {
  id: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  stock: number;
  price?: number;
  createdAt: string;
  imageUrl?: string;
}

interface AdminDashboardProps {
  backendUrl: string;
}

// Admin Dashboard Component
function AdminDashboard({ backendUrl }: AdminDashboardProps) {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orders, setOrders] = useState<Order[]>([]); // List of orders
  const [stats, setStats] = useState({ // Initial order stats
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });
  const tabs = [
    { id: 'orders', label: 'Orders Management'},
    { id: 'inventory', label: 'Inventory Management'},
  ] as const;

  // Function: Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${backendUrl}/admin/orders`);
      const data = await res.json();
      
      if (data.orders) {
        setOrders(data.orders);
        
        // Calculate stats from fetched orders
        const newStats = {
          total: data.orders.length,
          pending: data.orders.filter((o: Order) => o.status === 'pending').length,
          completed: data.orders.filter((o: Order) => o.status === 'completed').length,
          failed: data.orders.filter((o: Order) => o.status === 'failed').length
        };
        setStats(newStats);
      }
    } catch (e) {
      console.error("Failed to fetch orders:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, [backendUrl]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 size={48} className="animate-spin text-theme-accent-orange mx-auto" />
          <p className="mt-4 text-theme-text-muted">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-theme-text-primary mb-2 uppercase">Admin Dashboard</h1>
            <p className="text-lg text-theme-text-muted">Monitor and manage all orders in real-time.</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-theme-accent-primary hover:bg-theme-accent-primary-muted text-white rounded-3xl transition-colors uppercase"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </motion.div>

        {/* View Controls */}
        <div className="flex gap-2 mb-8">
          {
            tabs.map((tab) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-6 rounded-2xl text-sm font-semibold uppercase transition-all ${
                  activeTab === tab.id
                    ? 'bg-theme-accent-secondary text-white shadow-md shadow-theme-accent-secondary-muted'
                    : 'bg-theme-bg-surface text-theme-text-muted hover:text-white hover:bg-theme-bg-surface-muted border-2 border-theme-border-subtle'
                }`}
              >
                {tab.label}
              </button>
            ))
          }
        </div>

        {/* Stats Grid - Only shows when activeTab is 'orders' */}
        {activeTab === 'orders' ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
              <StatCard
                title="Total Orders"
                value={stats.total}
                icon={<Package size={24} />}
              color="blue"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={<Clock size={24} />}
                color="yellow"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={<CheckCircle2 size={24} />}
                color="green"
              />
              <StatCard
                title="Failed"
                value={stats.failed}
                icon={<XCircle size={24} />}
                color="red"
              />
            </div>

            <OrdersTable orders={orders} />
          </div>
        ) : (
            <InventoryManager backendUrl={backendUrl} />
        )}
      </div>
    </div>
  );
}



export default AdminDashboard;
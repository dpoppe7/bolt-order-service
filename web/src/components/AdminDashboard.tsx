import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Loader2, Clock, CheckCircle2, XCircle, 
  Package, TrendingUp, AlertCircle, RefreshCw
} from 'lucide-react';

interface Order {
  id: string;
  productId: string;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

interface Product {
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
          <Loader2 size={48} className="animate-spin text-purple-500 mx-auto" />
          <p className="mt-4 text-slate-400">Loading dashboard...</p>
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
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-slate-400">Monitor and manage all orders in real-time</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </motion.div>

        {/* View Controls */}
        <div className="flex gap-2 mb-8">
          <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Orders Management
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                activeTab === 'inventory'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Inventory Management
            </button>
        </div>

        {/* Stats Grid - Only shows when activeTab is 'orders' */}
        {activeTab === 'orders' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

// Component: Orders Table
function OrdersTable({orders}: {orders: Order[]}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp size={20} className="text-purple-400" />
          Recent Orders
        </h2>
      </div>

      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={48} className="text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No orders yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 text-left">
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {orders.map((order, index) => (
                <OrderRow key={order.id} order={order} index={index} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

// Component: Inventory Manager 
function InventoryManager({ backendUrl }: { backendUrl: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // 1. Fetch products specifically for this view
  const loadProducts = async () => {
    const res = await fetch(`${backendUrl}/health`); // Or a dedicated /products route
    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => { loadProducts(); }, []);

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct = {
      id: formData.get('id'),
      name: formData.get('name'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      imageUrl: formData.get('imageUrl'),
    };

    const res = await fetch(`${backendUrl}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      setShowForm(false);
      loadProducts(); // Refresh the list
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-xl font-medium text-white">Product Catalog</h2>
        {/* Trigger a Dialog/Modal here */}
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-lg font-semibold transition-all"
        >
          {showForm ? 'Close Form' : '+ New Product'}
        </button>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="group bg-slate-800/40 border border-slate-700 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all">
            {/* Image Section */}
            <div className="h-48 bg-slate-900 flex items-center justify-center relative">
              {product.imageUrl ? (
                <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
              ) : (
                <div className="text-slate-700 flex flex-col items-center">
                  <Package size={40} />
                  <span className="text-xs mt-2 uppercase tracking-widest">No Image</span>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-lg">{product.name}</h3>
                <span className="text-purple-400 font-bold">${product.price}</span>
              </div>
              <p className="text-slate-500 text-xs font-mono mb-4">{product.id}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className={`text-sm ${product.stock < 10 ? 'text-red-400' : 'text-slate-400'}`}>
                  {product.stock} in stock
                </span>
                <button className="text-slate-400 hover:text-white text-sm font-medium">Edit Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  const colors = {
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-600/30 text-blue-400',
    yellow: 'from-yellow-600/20 to-yellow-600/5 border-yellow-600/30 text-yellow-400',
    green: 'from-green-600/20 to-green-600/5 border-green-600/30 text-green-400',
    red: 'from-red-600/20 to-red-600/5 border-red-600/30 text-red-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-6`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors[color].split(' ')[2]}`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </motion.div>
  );
}

interface OrderRowProps {
  order: Order;
  index: number;
}

function OrderRow({ order, index }: OrderRowProps) {
  const statusColors = {
    pending: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    processing: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    completed: 'bg-green-600/20 text-green-400 border-green-600/30',
    failed: 'bg-red-600/20 text-red-400 border-red-600/30'
  };

  const statusIcons = {
    pending: <Clock size={14} />,
    processing: <Loader2 size={14} className="animate-spin" />,
    completed: <CheckCircle2 size={14} />,
    failed: <XCircle size={14} />
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-slate-700/50 transition-colors"
    >
      <td className="px-6 py-4">
        <code className="text-sm text-slate-300 bg-slate-900/50 px-2 py-1 rounded">
          {order.id}
        </code>
      </td>
      <td className="px-6 py-4">
        <span className="text-white font-medium">{order.productId}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-slate-300">{order.quantity}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
          {statusIcons[order.status]}
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-slate-400">
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </td>
    </motion.tr>
  );
}

export default AdminDashboard;
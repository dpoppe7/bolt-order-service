import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { Order } from './AdminDashboard';

// Component: Orders Table
export function OrdersTable({orders}: {orders: Order[]}) {
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
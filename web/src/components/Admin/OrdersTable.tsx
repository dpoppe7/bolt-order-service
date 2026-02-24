import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, Clock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import type { Order } from './AdminDashboard';

// Component: Orders Table
export function OrdersTable({orders}: {orders: Order[]}) {
  const tableStyles = {
    tHead: 'px-6 py-4 text-xs font-semibold text-theme-text-muted uppercase tracking-wider'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-theme-bg-secondary backdrop-blur-xl border-2 border-theme-border-subtle rounded-3xl overflow-hidden"
    >
      <div className="p-6 border-b border-theme-text-secondary">
        <h2 className="text-md font-semibold text-theme-text-primary flex items-center gap-3 uppercase">
          <TrendingUp size={24} className="text-theme-text-secondary" />
          Recent Orders
        </h2>
      </div>

      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={48} className="text-theme-text-secondary mx-auto mb-4" />
            <p className="text-theme-text-muted">No orders yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-theme-bg-surface-muted text-left">
                <th className={tableStyles.tHead}>Order ID</th>
                <th className={tableStyles.tHead}>Product</th>
                <th className={tableStyles.tHead}>Quantity</th>
                <th className={tableStyles.tHead}>Status</th>
                <th className={tableStyles.tHead}>Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-border-subtle">
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
    pending: 'bg-yellow-600/20 text-theme-warning border-yellow-600/30',
    processing: 'bg-blue-600/20 text-theme-info border-blue-600/30',
    completed: 'bg-green-600/20 text-theme-success border-green-600/30',
    failed: 'bg-red-600/20 text-theme-error border-red-600/30'
  };

  const statusIcons = {
    pending: <Clock size={18} />,
    processing: <Loader2 size={18} className="animate-spin" />,
    completed: <CheckCircle2 size={18} />,
    failed: <XCircle size={18} />
  };

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-theme-bg-surface transition-colors"
    >
      {/* Order ID */}
      <td className="px-6 py-4">
        <code className="text-base text-theme-text-primary bg-theme-bg-surface-muted px-2 py-1 rounded-full">
          {order.id}
        </code>
      </td>
      {/* Product ID */}
      <td className="px-6 py-4">
        <span className="text-theme-text-primary font-medium">{order.productId}</span>
      </td>
      {/* Order Quantity */}
      <td className="px-6 py-4">
        <span className="text-theme-text-primary">{order.quantity}</span>
      </td>
      {/* Order Status */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium border ${statusColors[order.status]}`}>
          {statusIcons[order.status]}
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </td>
      {/* Order Created At */}
      <td className="px-6 py-4">
        <span className="text-theme-text-muted">
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </td>
    </motion.tr>
  );
}
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, CheckCircle2, AlertCircle, Package
} from 'lucide-react';
import type { Product } from '../../types/api';

interface ProductCardProps {
  product: Product;
  status: 'idle' | 'loading' | 'success' | 'error';
  onOrder: (productId: string) => void;
  index: number;
}

export function ProductCard({ product, status, onOrder, index }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-accent-primary to-theme-accent-secondary rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
      
      <div className="relative bg-theme-bg-secondary backdrop-blur-xl border border-theme-border-subtle rounded-3xl p-6 hover:border-theme-border-focus transition-all">
        {/* Stock Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${
          isOutOfStock 
            ? 'bg-red-600/20 border border-red-600/30' 
            : isLowStock 
            ? 'bg-yellow-600/20 border border-yellow-600/30'
            : 'bg-green-600/20 border border-green-600/30'
        }`}>
          <div className={`h-2 w-2 rounded-full ${
            isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500 animate-pulse' : 'bg-green-500 animate-pulse'
          }`} />
          <span className="text-xs font-mono text-theme-text-primary uppercase">
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>

        {/* Product Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4">
          <Package size={32} className="text-blue-400" />
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <p className="text-sm text-theme-text-secondary uppercase tracking-wider">{product.id}</p>
          <h3 className="text-base font-semibold text-theme-text-primary mb-1 uppercase">{product.name}</h3>
        </div>

        {/* Order Button */}
        <button
          onClick={() => onOrder(product.id)}
          disabled={status === 'loading' || isOutOfStock}
          className={`w-full h-12 rounded-3xl font-semibold transition-all flex items-center justify-center gap-2 ${
            status === 'success'
              ? 'bg-green-600 text-white'
              : status === 'error'
              ? 'bg-red-600 text-white'
              : isOutOfStock
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-theme-accent-primary to-theme-accent-secondary text-white hover:shadow-lg hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-95 uppercase'
          }`}
        >
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 size={20} className="animate-spin" />
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 size={20} />
                <span>Order Placed!</span>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <AlertCircle size={20} />
                <span>Failed</span>
              </motion.div>
            )}
            {status === 'idle' && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isOutOfStock ? 'Sold Out' : 'Order Now'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.div>
  );
}
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, CheckCircle2, AlertCircle, Package, Sparkles
} from 'lucide-react';
import type { HealthResponse, Product } from '../types/api';

interface CustomerViewProps {
  backendUrl: string;
}

function CustomerView({ backendUrl }: CustomerViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMap, setStatusMap] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${backendUrl}/health`);
        const data: HealthResponse = await res.json();
        
        if (data && data.products) {
          setProducts(data.products);
        }
      } catch (e) {
        console.error("Failed to connect to backend:", e);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
  }, [backendUrl]);

  const handleOrder = async (productId: string) => {
    setStatusMap(prev => ({ ...prev, [productId]: 'loading' }));

    try {
      const response = await fetch(`${backendUrl}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMap(prev => ({ ...prev, [productId]: 'success' }));

        setProducts(prevProducts =>
          prevProducts.map(prod =>
            prod.id === productId ? { ...prod, stock: result.newStock } : prod
          )
        );

        setTimeout(() => setStatusMap(prev => ({ ...prev, [productId]: 'idle' })), 3000);
      } else {
        throw new Error('Order failed');
      }
    } catch (err) {
      console.error("Order failed:", err);
      setStatusMap(prev => ({ ...prev, [productId]: 'error' }));
      setTimeout(() => setStatusMap(prev => ({ ...prev, [productId]: 'idle' })), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 size={48} className="animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-slate-400">Loading products...</p>
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
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-full px-4 py-2 mb-4">
            <Sparkles size={16} className="text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Flash Sale Live</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Bolt Store
          </h1>
          <p className="text-xl text-slate-400">
            Lightning-fast order processing powered by Redis & BullMQ
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                status={statusMap[product.id] || 'idle'}
                onOrder={handleOrder}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: Product;
  status: 'idle' | 'loading' | 'success' | 'error';
  onOrder: (productId: string) => void;
  index: number;
}

function ProductCard({ product, status, onOrder, index }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
      
      <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all">
        {/* Product Icon */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-4">
          <Package size={32} className="text-blue-400" />
        </div>

        {/* Product Info */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
          <p className="text-sm text-slate-500 uppercase tracking-wider">{product.id}</p>
        </div>

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
          <span className="text-xs font-mono text-white">
            {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
          </span>
        </div>

        {/* Order Button */}
        <button
          onClick={() => onOrder(product.id)}
          disabled={status === 'loading' || isOutOfStock}
          className={`w-full h-12 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            status === 'success'
              ? 'bg-green-600 text-white'
              : status === 'error'
              ? 'bg-red-600 text-white'
              : isOutOfStock
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-95'
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

export default CustomerView;
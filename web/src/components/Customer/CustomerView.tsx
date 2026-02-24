import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { HealthResponse, Product } from '../../types/api';
import { useScrollPosition, } from '../../hooks/useScrollPosition';
import { ProductCard } from './ProductCard';

interface CustomerViewProps {
  backendUrl: string;
  navHeight: number;
}

function CustomerView({ backendUrl, navHeight }: CustomerViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMap, setStatusMap] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  const isFixed = useScrollPosition(100);

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
          <Loader2 size={48} className="animate-spin text-theme-accent-primary mx-auto" />
          <p className="mt-4 text-theme-text-muted">Loading products...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-left mb-12"
        >
          <p className="text-xl sm:text-lg font-semibold text-theme-text-primary uppercase">
            <span className='text-theme-accent-secondary'>Fast order processing</span> powered by Redis & BullMQ.
          </p>
        </motion.div>

        {/* Products Sticky Title */}
        <div 
          className={`mb-5 pt-3 pb-3 text-xl text-theme-text-primary font-medium uppercase
            ${isFixed ? 'fixed left-0 right-0 z-40 text-white bg-theme-accent-primary border-b border-theme-border-subtle' : ''}`}
          style={isFixed ? { top: navHeight } : {}}
        >
          {/* If Fixed, add a container inside to keep it from stretching to the screen edges */}
          <div className={isFixed ? 'max-w-7xl mx-auto px-4 sm:px-6' : ''}>
            Products
          </div>
        </div>

        {/* Spacer to prevent content jump when title becomes fixed */}
        {isFixed && <div style={{ height: navHeight }} />}

        {/* Products Grid */}
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
  );
}



export default CustomerView;
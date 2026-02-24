import React, { useState, useEffect } from 'react';
import { Package, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from './AdminDashboard';

// Component: Inventory Manager 
export function InventoryManager({ backendUrl }: { backendUrl: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // Fetch products specifically for this view
  const loadProducts = async () => {
    const res = await fetch(`${backendUrl}/health`);
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
      <div className="flex justify-between items-center pb-6 pt-6">
        <h2 className="text-2xl font-semibold text-theme-text-primary uppercase">Product Catalog</h2>
        {/* Trigger a Dialog/Modal */}
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 flex items-center gap-2 bg-theme-accent-primary hover:bg-theme-accent-primary-muted border-2 border-theme-border-focus  
            text-white text-sm font-semibold rounded-3xl transition-colors uppercase"
        >
          {showForm ? 'Close Form' : '+ New Product'}
        </button>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <InventoryItemCard 
            key={product.id} 
            product={product} 
            index={index} 
          />
        ))}
      </div>
    </div>
  );
}

export function InventoryItemCard({ product, index }: {product: Product, index: number}) {
  const isLowStock = product.stock < 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      {/* Glow Accent */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-accent-primary to-theme-accent-secondary rounded-3xl opacity-0 group-hover:opacity-100 blur transition duration-500" />
      
      <div className="relative bg-theme-bg-secondary backdrop-blur-xl border border-theme-border-subtle rounded-3xl overflow-hidden hover:border-theme-border-focus transition-all">
        {/* Image Section */}
        <div className="h-48 bg-theme-bg-surface flex items-center justify-center relative border-b border-theme-border-subtle">
          {product.imageUrl ? (
            <img src={product.imageUrl} className="w-full h-full object-cover" alt={product.name} />
          ) : (
            <div className="text-theme-text-muted flex flex-col items-center">
              <Package size={40} />
              <span className="text-xs mt-2 uppercase tracking-widest font-semibold">No Image</span>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-theme-text-primary uppercase">{product.name}</h3>
            <span className="text-theme-accent-secondary font-bold text-lg">
              ${product.price?.toFixed(2)}
            </span>
          </div>
          
          <p className="text-theme-text-muted text-xs font-mono mb-4 bg-theme-bg-surface px-2 py-1 rounded inline-block">
            ID: {product.id}
          </p>
          
          <div className="flex items-center justify-between pt-4 border-t border-theme-border-subtle">
            {/* Dynamic Stock Badge */}
            <span className={`text-sm font-semibold flex items-center gap-2 ${
              isOutOfStock ? 'text-theme-error' : isLowStock ? 'text-theme-warning' : 'text-theme-success'
            }`}>
              <div className={`h-2 w-2 rounded-full bg-current ${!isOutOfStock && 'animate-pulse'}`} />
              {product.stock} in stock
            </span>
            
            <button className="flex items-center gap-1 text-theme-text-muted hover:text-theme-text-primary text-base font-medium transition-colors">
              <Edit3 size={14} />
              Edit Details
            </button>
          </div>
        </div>
      </div>

    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'blue' | 'yellow' | 'green' | 'red';
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const colors = {
    blue: 'from-blue-600/30 to-blue-600/5 border-theme-info text-theme-info',
    yellow: 'from-yellow-600/30 to-yellow-600/5 border-theme-warning text-theme-warning',
    green: 'from-green-600/30 to-green-600/5 border-theme-success text-theme-success',
    red: 'from-red-600/30 to-red-600/5 border-theme-error text-theme-error'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br ${colors[color]} border-2 rounded-3xl p-6`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`${colors[color].split(' ')[2]}`}>
          {icon}
        </div>
        <div className="text-3xl font-semibold text-theme-text-primary mb-1">{value}</div>
      </div>
      <div className="text-lg text-theme-text-muted">{title}</div>
    </motion.div>
  );
}
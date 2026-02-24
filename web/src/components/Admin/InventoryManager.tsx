import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from './AdminDashboard';


// Component: Inventory Manager 
export function InventoryManager({ backendUrl }: { backendUrl: string }) {
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

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const colors = {
    blue: 'border-theme-info text-theme-info',
    yellow: 'border-theme-warning text-theme-warning',
    green: 'border-theme-success text-theme-success',
    red: 'border-theme-error text-theme-error'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-theme-bg-surface ${colors[color]} border rounded-3xl p-6`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className={`${colors[color].split(' ')[1]}`}>
          {icon}
        </div>
        <div className="text-3xl font-semibold text-theme-text-primary mb-1">{value}</div>
      </div>
      <div className="text-md text-theme-text-secondary">{title}</div>
    </motion.div>
  );
}
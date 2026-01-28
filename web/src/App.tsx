import React, { useState, useEffect } from 'react';
import LiquidGlass from 'liquid-glass-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smartphone, Loader2, CheckCircle2, 
  AlertCircle, Package, Activity, Settings, User 
} from 'lucide-react';
import type { HealthResponse, Product } from './types/api';

const BACKEND_URL = window.location.hostname.includes('github.dev') 
  ? `https://${window.location.hostname.replace('-5173', '-3000')}`
  : "http://localhost:3000";

function App() {
  const [product, setProducts] = useState<Product[]>([]); // initialize as empty array
  const [isLoading, setIsLoading] = useState(true);

  // Track status for each specific productId (e.g., { "iphone": "loading" })
  const [statusMap, setStatusMap] = useState<Record<string, 'idle' | 'loading' | 'success' | 'error'>>({});

  // Running on mount
  useEffect(() => {
    const checkHealth = async () => {
      // try out the backend health endpoint
      try {
        // reach out to the backend
        const res = await fetch(`${BACKEND_URL}/health`); 

        //convert the response from json to Javascript object of type HealthResponse
        const data: HealthResponse = await res.json();

        // update the memory state (useState)
        if (data && data.products) {
          setProducts(data.products);
        }

        setIsLoading(false);

      } catch (e) {
        // if the baclkend is not reachable, log the error
        console.error("Failed to connect to backend:", e);        
      } finally {
        setIsLoading(false);
      }
    }

    // invoke the async function
    checkHealth();

  }, []); // Running on Mount: React sees the [] at the bottom. It says: "I'll run this logic once right now, and then I'll ignore it until the user refreshes the page. 
  // the variables in [], tell React which variables to "watch." If a variable in that array changes, the useEffect runs again.

  // 2. The Order Handler
  const handleOrder = async (productId: string) => {

    // Set status for specific productId to loading
    setStatusMap(prev => ({ ...prev, [productId]: 'loading' })); 

    try {
      const response = await fetch(`${BACKEND_URL}/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (response.ok) {
        const result = await response.json(); 
        setStatusMap(prev => ({ ...prev, [productId]: 'success' }));

        // Optimistic: Update specific product in the array
        setProducts(prevProducts => 
          prevProducts.map(prod => 
            prod.id === productId ? { ...prod, stock: result.newStock } : prod
          )
        );

        // Reset the status of that productId back to idle after 3 seconds
        setTimeout(() => setStatusMap(prev => ({ ...prev, [productId]: 'idle' })), 3000);
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error("Order failed:", err);
      setStatusMap(prev => ({ ...prev, [productId]: 'error' }));
      setTimeout(() => setStatusMap(prev => ({ ...prev, [productId]: 'idle' })), 3000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500">
          <Loader2 size={48} className="animate-spin" />
          <p className="mt-4 text-center">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-wrap items-center justify-center gap-8 p-10 bg-[#050505]">
      {/* Background Glows stay the same */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
      
      <AnimatePresence>
        {product.map((item) => (
          <motion.div 
            key={item.id} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="z-10"
          >
            <LiquidGlass
              displacementScale={20}
              blurAmount={0.2}
              cornerRadius={28}
              padding="32px"
              className="border border-white/10 bg-white/5 shadow-2xl"
            >
              <div className="flex flex-col items-center gap-6 w-64">
                <Smartphone size={60} className="text-blue-400" />
                
                <div className="text-center">
                  {/* Using item.name from the loop */}
                  <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
                  <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">{item.id}</p>
                </div>

                <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 border border-white/10">
                  <div className={`h-2 w-2 rounded-full ${item.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs font-mono">
                    {item.stock} Units Left
                  </span>
                </div>

                <button
                  onClick={() => handleOrder(item.id)} // Pass the specific ID now
                  disabled={statusMap[item.id] === 'loading' || item.stock <= 0}
                  className="relative w-full h-12 rounded-xl bg-white font-bold text-black transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
                >
                  {/* Your AnimatePresence for the button status goes here */}
                  {statusMap[item.id] === 'idle' ? 'Reserve Now' : statusMap[item.id]}
                </button>
              </div>
            </LiquidGlass>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default App;
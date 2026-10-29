import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, ShoppingBag } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/GlassComponents';
import { createClient } from '@/lib/supabase';
import { getPOSContext } from '@/lib/pos-context';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  serving_size_id?: string;
}

export default function POSPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    async function loadPOS() {
      const { products: allProducts } = await getPOSContext();
      setProducts(allProducts);
      setFilteredProducts(allProducts);

      const cats = ['All', ...new Set(allProducts.map(p => p.categories?.name).filter(Boolean))];
      setCategories(cats);
    }
    loadPOS();
  }, []);

  useEffect(() => {
    let filtered = products;
    if (activeCategory !== 'All') {
      filtered = products.filter(p => p.categories?.name === activeCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
  }, [searchQuery, activeCategory, products]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.selling_price }
            : item
        );
      }
      return [...prev, {
        product_id: product.id,
        name: product.name,
        price: product.selling_price,
        quantity: 1,
        subtotal: product.selling_price,
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product_id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, subtotal: newQty * item.price };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product_id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <div className="flex h-[calc(100vh-64px)] gap-6 overflow-hidden">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Search & Filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search drinks, brands, or SKUs..."
              className="w-full bg-surface border border-white/10 rounded-xl pl-10 pr-4 py-3 text-text-primary focus:outline-none focus:border-gold transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-gold text-gold-foreground'
                    : 'bg-glass text-text-secondary hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pr-2">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="glass-panel p-4 text-left hover:border-gold transition-all group active:scale-95"
            >
              <p className="text-text-secondary text-xs mb-1 truncate">{product.brand}</p>
              <h4 className="text-text-primary font-semibold mb-2 group-hover:text-gold transition-colors line-clamp-2">
                {product.name}
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-gold font-bold">KES {product.selling_price}</span>
                <div className="bg-gold/20 p-1 rounded-md">
                  <Plus className="w-4 h-4 text-gold" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart / Checkout Panel */}
      <div className="w-96 flex flex-col bg-surface border-l border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-gold" />
            Current Order
          </h3>
          <button
            onClick={() => setCart([])}
            className="text-text-secondary hover:text-error transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary opacity-50">
              <ShoppingBag className="w-12 h-12 mb-4" />
              <p>Cart is empty.<br />Add items to start a sale.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product_id} className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex-1 overflow-hidden">
                  <p className="text-text-primary font-medium truncate">{item.name}</p>
                  <p className="text-text-secondary text-xs">KES {item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product_id, -1)}
                    className="p-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product_id, 1)}
                    className="p-1 bg-white/10 rounded hover:bg-white/20 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-right min-w-[80px]">
                  <p className="text-gold font-bold text-sm">KES {item.subtotal}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-white/5 border-t border-white/10 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-text-secondary text-sm">
              <span>Subtotal</span>
              <span>KES {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-text-secondary text-sm">
              <span>Tax (VAT 16%)</span>
              <span>KES {(total * 0.16).toLocaleString(2)}</span>
            </div>
            <div className="flex justify-between text-text-primary text-xl font-bold pt-2 border-t border-white/10">
              <span>Total</span>
              <span className="text-gold">KES {(total * 1.16).toLocaleString(2)}</span>
            </div>
          </div>

          <GlassButton
            variant="gold"
            className="w-full py-4 text-lg"
            disabled={cart.length === 0}
            onClick={() => setIsPaying(true)}
          >
            Complete Sale
          </GlassButton>
        </div>
      </div>

      {/* Payment Modal Overlay */}
      {isPaying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-md p-8 space-y-6">
            <h3 className="text-2xl font-bold text-center">Finalize Payment</h3>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-gold transition-all group">
                <Banknote className="w-8 h-8 text-text-secondary group-hover:text-gold" />
                <span className="font-medium">Cash</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-gold transition-all group">
                <CreditCard className="w-8 h-8 text-text-secondary group-hover:text-gold" />
                <span className="font-medium">M-Pesa</span>
              </button>
            </div>

            <div className="space-y-4">
              <GlassInput label="M-Pesa Transaction Code" placeholder="RXXXXXXX" />
              <div className="flex gap-4">
                <button
                  onClick={() => setIsPaying(false)}
                  className="flex-1 glass-button"
                >
                  Cancel
                </button>
                <button
                  className="flex-1 gold-button"
                  onClick={() => {
                    alert('Sale finalized! Stock updated.');
                    setIsPaying(false);
                    setCart([]);
                  }}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

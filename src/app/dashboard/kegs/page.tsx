import React, { useState, useEffect } from 'react';
import { Beer, Plus, Droplets, Gauge, History, Save } from 'lucide-react';
import { GlassCard, GlassButton, GlassInput } from '@/components/ui/GlassComponents';
import { createClient } from '@/lib/supabase';

export default function KegsPage() {
  const [kegs, setKegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddKeg, setShowAddKeg] = useState(false);
  const [newKeg, setNewKeg] = useState({
    product_id: '',
    total_volume: '',
    cost: '',
    batch_number: ''
  });

  const supabase = createClient();

  useEffect(() => {
    async function loadKegs() {
      const { data } = await supabase
        .from('keg_batches')
        .select(`*, products(name, brand)`)
        .order('created_at', { ascending: false });
      setKegs(data || []);
      setLoading(false);
    }
    loadKegs();
  }, []);

  const handleAddKeg = async () => {
    const { error } = await supabase.from('keg_batches').insert({
      product_id: newKeg.product_id,
      total_volume_litres: parseFloat(newKeg.total_volume),
      current_volume_litres: parseFloat(newKeg.total_volume),
      purchase_cost: parseFloat(newKeg.cost),
      batch_number: newKeg.batch_number
    });

    if (error) return alert(error.message);

    setShowAddKeg(false);
    setNewKeg({ product_id: '', total_volume: '', cost: '', batch_number: '' });
    const { data: updated } = await supabase.from('keg_batches').select(`*, products(name, brand)`);
    setKegs(updated || []);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gold/20 rounded-2xl text-gold">
            <Beer className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Keg Management</h1>
            <p className="text-text-secondary">Manage draught beer volume and yield.</p>
          </div>
        </div>
        <GlassButton variant="gold" onClick={() => setShowAddKeg(true)}>
          <Plus className="w-5 h-5" /> New Keg Batch
        </GlassButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kegs.map(keg => {
          const volumePercent = (keg.current_volume_litres / keg.total_volume_litres) * 100;
          return (
            <GlassCard key={keg.id} className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                    {keg.products?.brand}
                  </p>
                  <h3 className="text-xl font-bold text-text-primary">
                    {keg.products?.name}
                  </h3>
                </div>
                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-text-secondary">
                  {keg.batch_number || 'No Batch'}
                </span>
              </div>

              {/* Volume Visualizer */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">Remaining Volume</span>
                  <span className="text-text-primary font-bold">{keg.current_volume_litres}L / {keg.total_volume_litres}L</span>
                </div>
                <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${volumePercent}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-text-secondary text-xs mb-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Cost per L
                  </p>
                  <p className="text-text-primary font-bold">
                    KES {(keg.purchase_cost / keg.total_volume_litres).toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <p className="text-text-secondary text-xs mb-1 flex items-center gap-1">
                    <Gauge className="w-3 h-3" /> Fill Level
                  </p>
                  <p className="text-text-primary font-bold">{volumePercent.toFixed(1)}%</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {showAddKeg && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <GlassCard className="w-full max-w-md p-8 space-y-6">
            <h3 className="text-2xl font-bold text-center">Register New Keg</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-text-secondary text-sm font-medium">Product</label>
                <select
                  className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold"
                  onChange={(e) => setNewKeg({...newKeg, product_id: e.target.value})}
                >
                  <option value="">-- Select Beer --</option>
                  {/* In a real app, this would filter for only keg-type products */}
                  <option value="Tusker Lager">Tusker Lager</option>
                </select>
              </div>
              <GlassInput
                label="Total Volume (Litres)"
                type="number"
                placeholder="e.g. 30"
                value={newKeg.total_volume}
                onChange={(e) => setNewKeg({...newKeg, total_volume: e.target.value})}
              />
              <GlassInput
                label="Purchase Cost (KES)"
                type="number"
                placeholder="e.g. 5000"
                value={newKeg.cost}
                onChange={(e) => setNewKeg({...newKeg, cost: e.target.value})}
              />
              <GlassInput
                label="Batch / Keg ID"
                type="text"
                placeholder="K-2024-001"
                value={newKeg.batch_number}
                onChange={(e) => setNewKeg({...newKeg, batch_number: e.target.value})}
              />
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddKeg(false)} className="flex-1 glass-button">Cancel</button>
                <button onClick={handleAddKeg} className="flex-1 gold-button">Add Keg</button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { GlassCard, GlassInput, GlassButton } from '@/components/ui/GlassComponents';
import { Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Redirection logic will be handled by middleware based on tenant membership
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Brand Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2 tracking-tight">
            Bar<span className="text-gold">Sync</span>
          </h1>
          <p className="text-text-secondary">Hospitality Management System</p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <GlassInput
                label="Email Address"
                type="email"
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <GlassInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-error/20 border border-error/50 text-error text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <GlassButton variant="gold" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </GlassButton>
          </form>
        </GlassCard>

        {/* Developer Branding */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-text-secondary text-sm">
            Designed & Developed by <span className="text-text-primary font-medium">Digi Experts</span>
          </p>
          <a
            href="https://wa.me/254715273822?text=Hello%20Digi%20Experts,%20I%20need%20assistance%20with%20the%20Bar%20%26%20Pub%20Management%20System."
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold text-sm hover:underline transition-all"
          >
            Need assistance? Contact the developer on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

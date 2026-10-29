import React from 'react';

export const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-panel ${className}`}>
    {children}
  </div>
);

export const GlassInput = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-text-secondary text-sm font-medium">{label}</label>
    <input
      {...props}
      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold transition-all duration-200"
    />
  </div>
);

export const GlassButton = ({ children, variant = 'glass', ...props }: { children: React.ReactNode, variant?: 'glass' | 'gold' } & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const styles = variant === 'gold' ? 'gold-button' : 'glass-button';
  return (
    <button {...props} className={`${styles} w-full flex justify-center items-center gap-2`}>
      {children}
    </button>
  );
};

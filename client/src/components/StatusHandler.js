import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

const StatusHandler = ({ 
  loading, 
  error, 
  empty, 
  emptyMessage = "No items found.", 
  children 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] animate-pulse">
          Loading Data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-10 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Connection Error</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">
            {error || "Something went wrong. Please check your connection."}
          </p>
        </div>
        <button 
           onClick={() => window.location.reload()}
           className="px-6 py-2 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-400 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (empty) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900/50 border border-slate-800 border-dashed rounded-3xl p-16 text-center space-y-4"
      >
        <Inbox className="w-12 h-12 text-slate-700 mx-auto" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">
          {emptyMessage}
        </p>
      </motion.div>
    );
  }

  return <>{children}</>;
};

export default StatusHandler;

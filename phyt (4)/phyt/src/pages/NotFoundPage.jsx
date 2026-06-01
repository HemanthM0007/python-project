import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, ChevronLeft, Cpu } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#030408] text-gray-100 flex flex-col justify-center items-center relative px-6 py-12">
      <div className="cyber-grid"></div>

      {/* Glow Backdrop */}
      <div className="absolute w-[400px] h-[200px] bg-gradient-to-r from-rose-500/10 to-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center space-y-6 relative z-10 glass-panel p-8 rounded-2xl border border-dark-border"
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-extrabold tracking-widest font-mono text-white leading-none">404</h1>
          <h2 className="text-sm font-bold uppercase tracking-widest font-mono text-rose-400">UNRESOLVED NODE ADDRESS</h2>
          <p className="text-xs text-gray-500 leading-relaxed font-light mt-2">
            The telemetry coordinate you requested is invalid or does not exist in the active sector memory.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3 font-mono text-xs">
          <Link
            to="/dashboard"
            className="w-full py-2.5 rounded-lg font-bold bg-gradient-to-r from-neon-blue to-neon-cyan text-black hover:opacity-95 shadow-glow-cyan transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <Cpu className="w-4 h-4" />
            <span>Return to Core Dashboard</span>
          </Link>
          <Link
            to="/"
            className="w-full py-2.5 rounded-lg font-bold bg-white/5 border border-dark-border text-gray-300 hover:bg-white/10 hover:text-white transition-all uppercase tracking-wider flex items-center justify-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Landing Portal</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;

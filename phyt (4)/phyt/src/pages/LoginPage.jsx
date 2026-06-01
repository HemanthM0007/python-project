import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Cpu, LogIn, AlertCircle, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isAdminTab, setIsAdminTab] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  });
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear errors when editing
    if (error) setError(null);
  };

  const handleTabChange = (adminState) => {
    setIsAdminTab(adminState);
    setError(null);
    setFormData(prev => ({
      ...prev,
      email: "",
      password: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Quick validation
    if (!formData.email.trim()) {
      setError("Email address is required.");
      return;
    }
    
    // Check if it's email
    if (!formData.email.includes("@")) {
      setError("Invalid login identity. You must sign in using your registered email address.");
      return;
    }

    if (!formData.password) {
      setError("Password is required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const loggedUser = await login(formData.email, formData.password, isAdminTab);
      
      // Handle navigation redirect based on role and sector
      if (isAdminTab || loggedUser.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        // Regular User checks
        if (loggedUser.sector) {
          navigate("/dashboard");
        } else {
          navigate("/sector-selection");
        }
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030408] text-gray-100 flex items-center justify-center relative px-4 py-12">
      <div className="cyber-grid"></div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 border border-dark-border"
      >
        {/* Top Accent Line */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent ${isAdminTab ? 'via-rose-500' : 'via-neon-cyan'} to-transparent transition-all duration-300`}></div>

        <div className="text-center mb-8">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isAdminTab ? 'from-rose-600 to-rose-400' : 'from-neon-blue to-neon-cyan'} flex items-center justify-center mx-auto mb-4 transition-all duration-300 shadow-glow-cyan`}>
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-bold font-sans">InfraSense AI Portal</h2>
          <p className="text-xs text-gray-500 mt-1.5 font-mono uppercase tracking-wider">Secure Authorization Terminal</p>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-2 p-1.5 rounded-lg bg-white/5 border border-dark-border mb-6 relative">
          <button
            type="button"
            onClick={() => handleTabChange(false)}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-md transition-all relative z-10 ${
              !isAdminTab ? "text-black" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Operator
          </button>
          <button
            type="button"
            onClick={() => handleTabChange(true)}
            className={`flex items-center justify-center gap-2 py-2 text-xs font-bold font-mono tracking-wider uppercase rounded-md transition-all relative z-10 ${
              isAdminTab ? "text-black" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>

          {/* Animated Slider backdrop */}
          <motion.div
            layoutId="login-tab-slider"
            className={`absolute top-1.5 bottom-1.5 rounded-md ${
              isAdminTab ? "left-[50%] bg-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "left-1.5 bg-neon-cyan shadow-glow-cyan"
            }`}
            style={{ width: "calc(50% - 12px)" }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        </div>

        {error && (
          <div className={`mb-5 flex items-center gap-2.5 p-3 rounded-lg border text-xs font-mono ${
            isAdminTab 
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-400"
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identity Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 font-mono block">
              {isAdminTab ? "Admin Email Address" : "Operator Email Address"}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={isAdminTab ? "admin@infrasense.ai" : "user@infrasense.ai"}
                className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-3 pl-10 pr-4 text-sm transition-colors text-gray-200 placeholder:text-gray-600"
              />
            </div>
            <span className="text-[9px] text-gray-600 font-mono block">Note: Phone numbers and usernames are disabled for login.</span>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-gray-400 font-mono">Password</label>
              <a href="#" className="text-[10px] text-gray-600 hover:text-neon-cyan font-mono transition-colors">
                Recover Hash?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={isAdminTab ? "admin123" : "user123"}
                className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-3 pl-10 pr-4 text-sm transition-colors text-gray-200 placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Session remember checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-500 select-none">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-3.5 h-3.5 rounded border-dark-border bg-white/5 text-neon-cyan focus:ring-0 focus:ring-offset-0"
              />
              <span>Remember Session</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 mt-2 disabled:opacity-50 ${
              isAdminTab 
                ? "bg-gradient-to-r from-rose-600 to-rose-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
                : "bg-gradient-to-r from-neon-blue to-neon-cyan text-black shadow-glow-cyan"
            }`}
          >
            {isLoading ? (
              <div className={`w-5 h-5 border-2 ${isAdminTab ? 'border-white' : 'border-black'} border-t-transparent rounded-full animate-spin`}></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Authorize Terminal</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          New operator credentials needed?{" "}
          <Link to="/register" className="text-neon-cyan hover:underline font-semibold font-mono">
            Register Operator
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;

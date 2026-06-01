import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, Cpu, Key, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Validate password strength
  const checkPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: "Enter password", color: "text-gray-500 bg-gray-900" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    switch (score) {
      case 1: return { score, text: "Weak", color: "bg-rose-500 w-1/4" };
      case 2: return { score, text: "Moderate", color: "bg-amber-500 w-2/4" };
      case 3: return { score, text: "Good", color: "bg-blue-500 w-3/4" };
      case 4: return { score, text: "Strong", color: "bg-emerald-500 w-full" };
      default: return { score: 0, text: "Too Short", color: "bg-rose-500 w-1/12" };
    }
  };

  const strength = checkPasswordStrength(formData.password);

  // Validate form details
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic international E.164 phone

    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (formData.phone.replace(/[\s()-]/g, "").length < 7) {
      newErrors.phone = "Invalid phone number length";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors on edit
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await register(formData.username, formData.email, formData.password, formData.phone);
      
      setSuccessToast(true);
      // Wait for toast and then navigate
      setTimeout(() => {
        setSuccessToast(false);
        navigate("/login");
      }, 3500);
    } catch (err) {
      setErrors(prev => ({ ...prev, submit: err.message || "Registration failed" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030408] text-gray-100 flex items-center justify-center relative px-4 py-12">
      <div className="cyber-grid"></div>

      {/* Slide-in Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-4 bg-emerald-950/80 border border-emerald-500 rounded-xl shadow-glow-cyan backdrop-blur-md max-w-md w-full"
          >
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-300">Registration Successful!</h4>
              <p className="text-xs text-emerald-400 font-mono mt-0.5">Please Login with your Email and Password.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl relative z-10 border border-dark-border"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent"></div>

        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center mx-auto mb-4 shadow-glow-cyan">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <h2 className="text-2xl font-bold font-sans">Initialize Terminal Profile</h2>
          <p className="text-xs text-gray-500 mt-1.5 font-mono uppercase tracking-wider">InfraSense AI Core Access</p>
        </div>

        {errors.submit && (
          <div className="mb-4 flex items-center gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 font-mono block">Operator Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="e.g. jdoe_control"
                className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-3 pl-10 pr-4 text-sm transition-colors text-gray-200 placeholder:text-gray-600"
              />
            </div>
            {errors.username && <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 font-mono block">Enterprise Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jdoe@infrasense.ai"
                className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-3 pl-10 pr-4 text-sm transition-colors text-gray-200 placeholder:text-gray-600"
              />
            </div>
            {errors.email && <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 font-mono block">Mobile Terminal (Phone)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+15551234567"
                className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-3 pl-10 pr-4 text-sm transition-colors text-gray-200 placeholder:text-gray-600"
              />
            </div>
            {errors.phone && <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-400 font-mono block">Secure Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-3 pl-10 pr-4 text-sm transition-colors text-gray-200 placeholder:text-gray-600"
              />
            </div>
            {errors.password && <p className="text-[10px] text-rose-400 font-mono mt-0.5">{errors.password}</p>}
            
            {/* Password strength meter */}
            {formData.password && (
              <div className="pt-2 space-y-1">
                <div className="flex justify-between items-center text-[9px] font-mono">
                  <span className="text-gray-500">Security Index:</span>
                  <span className="font-bold text-gray-300">{strength.text}</span>
                </div>
                <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.color}`} />
                </div>
              </div>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold bg-gradient-to-r from-neon-blue to-neon-cyan text-black hover:opacity-90 transition-all duration-300 mt-2 shadow-glow-cyan disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>Initialize Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          Existing credentials found?{" "}
          <Link to="/login" className="text-neon-cyan hover:underline font-semibold font-mono">
            Authorize Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;

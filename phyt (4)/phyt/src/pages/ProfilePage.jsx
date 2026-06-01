import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Briefcase, MapPin, Layers, Save, RefreshCw, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user, updateProfileData } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    phoneNumber: user?.phoneNumber || "",
    companyName: user?.companyName || "",
    address: user?.address || "",
    photoURL: user?.photoURL || ""
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Avatar presets list (DiceBear Bottts/Avataaars seeds)
  const avatars = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Alex`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Jack`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=Cyber`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=Matrix`,
    `https://api.dicebear.com/7.x/bottts/svg?seed=Vector`
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const cycleAvatar = () => {
    const currentIndex = avatars.indexOf(formData.photoURL);
    const nextIndex = (currentIndex + 1) % avatars.length;
    setFormData(prev => ({ ...prev, photoURL: avatars[nextIndex] }));
  };

  const selectAvatar = (url) => {
    setFormData(prev => ({ ...prev, photoURL: url }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updateProfileData(formData);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Banner */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Operator Profile</h2>
        <p className="text-xs text-gray-500 font-mono mt-1 uppercase">
          Identity Credentials & Authentication Settings
        </p>
      </div>

      {/* Main card grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Card: Profile Avatar & Identity */}
        <div className="glass-panel p-6 rounded-xl border border-dark-border flex flex-col items-center text-center">
          <div className="relative group">
            <img 
              src={formData.photoURL || "https://api.dicebear.com/7.x/avataaars/svg"} 
              alt="Profile avatar" 
              className="w-28 h-28 rounded-2xl border-2 border-neon-cyan/30 shadow-glow-cyan object-cover bg-dark-bg/60"
            />
            <button
              type="button"
              onClick={cycleAvatar}
              className="absolute -bottom-2 -right-2 p-2 bg-neon-cyan text-black rounded-lg border border-black hover:opacity-90 transition-all shadow-glow-cyan"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <h3 className="text-base font-bold text-gray-200 mt-4 leading-tight">{user?.displayName}</h3>
          <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mt-1">{user?.role === "admin" ? "Systems Administrator" : "Platform Operator"}</span>

          {/* Sector label */}
          <div className="mt-5 px-3 py-1.5 rounded-lg bg-white/5 border border-dark-border w-full text-xs font-mono text-gray-400">
            <span className="text-[9px] uppercase tracking-wider block text-gray-500 mb-1">Active Sector Ingest</span>
            <span className="text-neon-cyan font-bold">{user?.role === "admin" ? "Global Scope" : user?.sector || "None Configured"}</span>
          </div>

          {/* Avatar Selector Presets */}
          <div className="mt-6 w-full text-left">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wider block mb-2">Cycle Cybernet Avatar presets</span>
            <div className="grid grid-cols-6 gap-2">
              {avatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectAvatar(url)}
                  className={`w-8 h-8 rounded border overflow-hidden transition-all bg-dark-bg/60 hover:scale-105 ${
                    formData.photoURL === url ? "border-neon-cyan shadow-glow-cyan" : "border-dark-border"
                  }`}
                >
                  <img src={url} alt="Preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Profile Form Details */}
        <div className="glass-panel p-6 rounded-xl border border-dark-border lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-200">Terminal Credentials Card</h3>
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Profile updated</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 font-mono block">Operator Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-2 pl-9 pr-4 text-gray-200"
                  />
                </div>
              </div>

              {/* Email (Read Only representation) */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 font-mono block">Primary Email (Locked)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-700 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={user?.email}
                    disabled
                    className="w-full bg-white/[0.02] border border-dark-border outline-none rounded-lg py-2 pl-9 pr-4 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 font-mono block">Mobile Terminal (Phone)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-2 pl-9 pr-4 text-gray-200"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-500 font-mono block">Company Affiliation</label>
                <div className="relative">
                  <Briefcase className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-2 pl-9 pr-4 text-gray-200"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-500 font-mono block">Physical Facility Address</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-2 pl-9 pr-4 text-gray-200"
                />
              </div>
            </div>

            {/* Read-only sector assignment */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-500 font-mono block">Sector Allocation</label>
              <div className="relative">
                <Layers className="w-3.5 h-3.5 text-gray-700 absolute left-3 top-3" />
                <input
                  type="text"
                  value={user?.role === "admin" ? "All Sectors (Global Administrator)" : user?.sector || "No sector selected"}
                  disabled
                  className="w-full bg-white/[0.02] border border-dark-border outline-none rounded-lg py-2 pl-9 pr-4 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Save profile */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-lg font-bold font-mono uppercase bg-neon-cyan text-black hover:opacity-90 transition-all shadow-glow-cyan disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Credentials</span>
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

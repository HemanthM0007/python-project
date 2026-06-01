import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Layers, 
  ShieldAlert, 
  Cpu, 
  Trash2, 
  UserPlus, 
  X, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  Briefcase,
  Smartphone,
  MapPin,
  CheckCircle,
  Plus
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSystem } from "../context/SystemContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { allUsers, alerts, metrics, deleteUser, createUser } = useSystem();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: ""
  });
  const [modalError, setModalError] = useState(null);
  const [modalSuccess, setModalSuccess] = useState(false);

  // Stats calculation
  const totalUsers = allUsers.length;
  const activeAlertsCount = alerts.filter(a => a.status === "active").length;
  
  // Count how many users are assigned to each sector
  const getSectorUserCount = (sectorName) => {
    return allUsers.filter(u => u.sector === sectorName).length;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData(prev => ({ ...prev, [name]: value }));
    setModalError(null);
  };

  const handleDeleteUser = (uid) => {
    if (confirm("Are you sure you want to terminate this operator's login credentials?")) {
      deleteUser(uid);
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!modalData.name.trim() || !modalData.email.trim() || !modalData.password || !modalData.phone.trim() || !modalData.company.trim()) {
      setModalError("All operator details are required.");
      return;
    }

    if (!modalData.email.includes("@")) {
      setModalError("Invalid email address format.");
      return;
    }

    try {
      createUser(
        modalData.name,
        modalData.email,
        modalData.password,
        modalData.phone,
        modalData.company
      );
      setModalSuccess(true);
      setModalData({
        name: "",
        email: "",
        password: "",
        phone: "",
        company: ""
      });
      setTimeout(() => {
        setModalSuccess(false);
        setShowAddModal(false);
      }, 1500);
    } catch (err) {
      setModalError(err.message || "Failed to create user");
    }
  };

  // Sectors information list
  const sectorList = Object.keys(metrics).map(key => ({
    name: key,
    devices: metrics[key].totalDevices,
    health: metrics[key].systemHealth,
    anomalies: metrics[key].detectedAnomalies,
    usersCount: getSectorUserCount(key)
  }));

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enterprise Global Command Dashboard</h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase">
            Privilege Level: <span className="text-rose-400 font-bold">SYSTEM ADMINISTRATOR</span>
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold font-mono tracking-wider uppercase bg-gradient-to-r from-rose-600 to-rose-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.2)] hover:opacity-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Operator</span>
        </button>
      </div>

      {/* Global Stat widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Platform Operators</p>
              <h3 className="text-2xl font-bold mt-2 text-white">{totalUsers}</h3>
              <p className="text-[10px] text-gray-400 mt-1">Authorized terminals registered</p>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/20 text-rose-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Active Domains</p>
              <h3 className="text-2xl font-bold mt-2 text-neon-cyan">4 / 4</h3>
              <p className="text-[10px] text-gray-400 mt-1">Sectors currently monitored</p>
            </div>
            <div className="p-2.5 rounded-lg bg-neon-cyan/15 border border-neon-cyan/20 text-neon-cyan">
              <Layers className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Active Anomalies</p>
              <h3 className={`text-2xl font-bold mt-2 ${activeAlertsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-gray-400'}`}>
                {activeAlertsCount}
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">System-wide critical status logs</p>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">AI Scan Pipeline</p>
              <h3 className="text-2xl font-bold mt-2 text-emerald-400">ONLINE</h3>
              <p className="text-[10px] text-gray-400 mt-1">Cognitive engines synced</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400">
              <Cpu className="w-4 h-4 animate-spin-slow" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User Management Section */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2 overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold text-gray-200 mb-4">Operator Accounts</h3>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-dark-border text-gray-500 font-mono text-[10px] uppercase">
                  <th className="pb-3 pl-2">Operator Name</th>
                  <th className="pb-3">Email Address</th>
                  <th className="pb-3">Affiliation / Company</th>
                  <th className="pb-3">Monitored Sector</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/40">
                {allUsers.map((u) => (
                  <tr key={u.uid} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-3 pl-2 flex items-center gap-3">
                      <img src={u.photoURL} alt="Avatar" className="w-7 h-7 rounded border border-dark-border shrink-0" />
                      <div>
                        <span className="font-semibold text-gray-200 block">{u.displayName}</span>
                        <span className="text-[9px] text-gray-500 font-mono">{u.phoneNumber || "No Phone"}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-300">{u.email}</td>
                    <td className="py-3 text-gray-400 font-light">{u.companyName || "N/A"}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        u.role === "admin" 
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                          : u.sector 
                            ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" 
                            : "bg-gray-800 text-gray-400"
                      }`}>
                        {u.role === "admin" ? "All (Global Admin)" : u.sector || "Unassigned Sector"}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      {u.role !== "admin" ? (
                        <button
                          onClick={() => handleDeleteUser(u.uid)}
                          className="p-1.5 text-gray-600 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-all border border-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[9px] text-gray-600 font-mono uppercase font-bold pr-2">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sectors Diagnostic Grid */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <h3 className="text-sm font-bold text-gray-200 mb-4">Domain Metrics Ingestion</h3>
          
          <div className="space-y-4">
            {sectorList.map((sector) => (
              <div key={sector.name} className="p-3.5 rounded-xl bg-white/[0.02] border border-dark-border/60">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-gray-200">{sector.name}</h4>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    sector.health > 95 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    Health: {sector.health}%
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[9px] text-gray-500 pt-1.5 border-t border-white/5">
                  <div>
                    <span className="block text-gray-300 text-xs font-bold">{sector.devices}</span>
                    Sensors
                  </div>
                  <div>
                    <span className="block text-gray-300 text-xs font-bold">{sector.usersCount}</span>
                    Operators
                  </div>
                  <div>
                    <span className={`block text-xs font-bold ${sector.anomalies > 0 ? 'text-rose-400' : 'text-gray-300'}`}>{sector.anomalies}</span>
                    Anomalies
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operator Creation Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md glass-panel p-6 rounded-2xl relative z-10 border border-dark-border shadow-glass"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-rose-400" />
                  <h3 className="text-sm font-bold text-gray-200">Provision Operator Credentials</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {modalSuccess && (
                <div className="mb-4 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Operator provisioned successfully.</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 font-mono block mb-1">Operator Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={modalData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-white/5 border border-dark-border focus:border-rose-500/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-400 font-mono block mb-1">Login Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={modalData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. sjenkins@infrasense.ai"
                    className="w-full bg-white/5 border border-dark-border focus:border-rose-500/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-400 font-mono block mb-1">Secure Password</label>
                  <input
                    type="password"
                    name="password"
                    value={modalData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-dark-border focus:border-rose-500/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-400 font-mono block mb-1">Mobile Terminal Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={modalData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +1 (555) 012-9900"
                    className="w-full bg-white/5 border border-dark-border focus:border-rose-500/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-gray-400 font-mono block mb-1">Affiliation / Company</label>
                  <input
                    type="text"
                    name="company"
                    value={modalData.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Apex Utilities"
                    className="w-full bg-white/5 border border-dark-border focus:border-rose-500/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-mono font-bold text-white uppercase bg-rose-600 hover:bg-rose-500 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Provision Node Access</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Lock, 
  Bell, 
  Database, 
  LogOut, 
  ChevronRight, 
  ToggleLeft, 
  ToggleRight, 
  Cpu, 
  Key, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSystem } from "../context/SystemContext";

const SettingsPage = () => {
  const { user, logout, saveSector } = useAuth();
  const { metrics } = useSystem();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("sector"); // sector, password, notifications

  // Change Password state
  const [pwdData, setPwdData] = useState({ old: "", new: "", confirm: "" });
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  // Notifications toggles state
  const [notifConfig, setNotifConfig] = useState({
    criticalEmail: true,
    warningSMS: false,
    audioPing: true,
    aiPredictive: true
  });

  const toggleNotif = (key) => {
    setNotifConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdData(prev => ({ ...prev, [name]: value }));
    setPwdError(null);
  };

  const handlePwdSubmit = (e) => {
    e.preventDefault();
    if (!pwdData.old || !pwdData.new || !pwdData.confirm) {
      setPwdError("All password inputs are required.");
      return;
    }
    if (pwdData.new.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }
    if (pwdData.new !== pwdData.confirm) {
      setPwdError("New password does not match confirmation.");
      return;
    }

    setPwdSuccess(true);
    setPwdData({ old: "", new: "", confirm: "" });
    setTimeout(() => setPwdSuccess(false), 2000);
  };

  const handleSwitchSector = () => {
    saveSector(""); // Clear sector selection
    navigate("/sector-selection");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Sections navigation configurations
  const sections = [
    { id: "sector", name: "Sector Information", icon: Database, desc: "Manage domain telemetry mappings" },
    { id: "password", name: "Change Password", icon: Lock, desc: "Update security hash configuration" },
    { id: "notifications", name: "Notification Control", icon: Bell, desc: "Configure email, SMS & sound pings" }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Banner */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
        <p className="text-xs text-gray-500 font-mono mt-1 uppercase">
          Configure telemetry, notifications, and security protocols
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Navigation panels */}
        <div className="space-y-3">
          {sections.map((sec) => {
            const SecIcon = sec.icon;
            const active = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left p-4 rounded-xl glass-panel border transition-all flex items-center gap-4 ${
                  active 
                    ? "border-neon-cyan/20 bg-neon-cyan/[0.03] shadow-glow-cyan text-neon-cyan" 
                    : "border-dark-border text-gray-400 hover:text-gray-200 hover:bg-white/[0.02]"
                }`}
              >
                <div className={`p-2.5 rounded-lg border ${active ? 'bg-neon-cyan/10 border-neon-cyan/20' : 'bg-white/5 border-white/5'}`}>
                  <SecIcon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans">{sec.name}</h4>
                  <p className="text-[10px] text-gray-500 font-light mt-0.5">{sec.desc}</p>
                </div>
              </button>
            );
          })}

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="w-full text-left p-4 rounded-xl glass-panel border border-rose-500/10 text-rose-400 hover:bg-rose-500/5 transition-all flex items-center gap-4 group"
          >
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <LogOut className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold font-sans">Logout</h4>
              <p className="text-[10px] text-gray-500 font-light mt-0.5">Terminate active session credentials</p>
            </div>
          </button>
        </div>

        {/* Right Side: Active Panel Settings */}
        <div className="glass-panel p-6 rounded-xl border border-dark-border md:col-span-2">
          
          {/* 1. Sector Information Panel */}
          {activeSection === "sector" && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-bold text-gray-200 mb-1">Sector Assignment</h3>
                <p className="text-[10px] text-gray-500 font-mono">Current monitoring domain mapping</p>
              </div>

              {user?.role === "admin" ? (
                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-rose-400 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-200 block">Global Admin Scope</span>
                    <span className="text-[10px] text-gray-500">Administrators bypass individual sector constraints. You have write clearance across all networks.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-dark-border space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-gray-500 font-mono uppercase tracking-wider text-[10px]">Active Domain</span>
                      <span className="text-neon-cyan font-bold font-mono">{user?.sector || "No sector Selected"}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono text-gray-400 pt-1">
                      <div>Devices Map: <strong className="text-white">{metrics[user?.sector]?.totalDevices || 0}</strong></div>
                      <div>System Health: <strong className="text-white">{metrics[user?.sector]?.systemHealth || 0}%</strong></div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-500 font-light mb-4">
                      Need to monitor a different sector? Swapping domains resets the live sensor pipelines to compile the target metrics.
                    </p>
                    <button
                      onClick={handleSwitchSector}
                      className="px-5 py-2.5 rounded-lg bg-neon-cyan text-black hover:opacity-95 font-bold uppercase tracking-wider transition-all shadow-glow-cyan flex items-center gap-1.5 font-mono"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Switch Sector Domain</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. Password Panel */}
          {activeSection === "password" && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-bold text-gray-200 mb-1">Change Account Password</h3>
                <p className="text-[10px] text-gray-500 font-mono">Update security token encryption keys</p>
              </div>

              {pwdError && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-400 font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdSuccess && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-mono">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Password hashes synced successfully.</span>
                </div>
              )}

              <form onSubmit={pwdSubmit => handlePwdSubmit(pwdSubmit)} className="space-y-4 max-w-sm">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 font-mono block">Current Password</label>
                  <input
                    type="password"
                    name="old"
                    value={pwdData.old}
                    onChange={handlePwdChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 font-mono block">New Password</label>
                  <input
                    type="password"
                    name="new"
                    value={pwdData.new}
                    onChange={handlePwdChange}
                    placeholder="Min 6 characters"
                    className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-gray-500 font-mono block">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirm"
                    value={pwdData.confirm}
                    onChange={handlePwdChange}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2.5 text-gray-200"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-neon-cyan text-black hover:opacity-95 font-bold uppercase tracking-wider transition-all shadow-glow-cyan flex items-center gap-1.5 font-mono"
                >
                  <Key className="w-4 h-4" />
                  <span>Update Hash</span>
                </button>
              </form>
            </div>
          )}

          {/* 3. Notifications Panel */}
          {activeSection === "notifications" && (
            <div className="space-y-6 text-xs">
              <div>
                <h3 className="text-sm font-bold text-gray-200 mb-1">Notification Configurations</h3>
                <p className="text-[10px] text-gray-500 font-mono">Dispatched warning frequencies</p>
              </div>

              <div className="divide-y divide-dark-border/40">
                
                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-200">Critical Alerts Email Dispatch</h4>
                    <p className="text-[10px] text-gray-500">Route ALT code updates to operator mailboxes</p>
                  </div>
                  <button onClick={() => toggleNotif("criticalEmail")} className="text-neon-cyan">
                    {notifConfig.criticalEmail ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-700" />}
                  </button>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-200">Warning SMS Telemetry</h4>
                    <p className="text-[10px] text-gray-500">Send warnings directly to registered mobile devices</p>
                  </div>
                  <button onClick={() => toggleNotif("warningSMS")} className="text-neon-cyan">
                    {notifConfig.warningSMS ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-700" />}
                  </button>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-200">AI Audio Ingestion Pings</h4>
                    <p className="text-[10px] text-gray-500">Ping local browser console on anomaly logs</p>
                  </div>
                  <button onClick={() => toggleNotif("audioPing")} className="text-neon-cyan">
                    {notifConfig.audioPing ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-700" />}
                  </button>
                </div>

                <div className="py-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-200">AI Predictive Modeling Flags</h4>
                    <p className="text-[10px] text-gray-500">Ingest predictive logs into the Dashboard warnings feed</p>
                  </div>
                  <button onClick={() => toggleNotif("aiPredictive")} className="text-neon-cyan">
                    {notifConfig.aiPredictive ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-gray-700" />}
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;

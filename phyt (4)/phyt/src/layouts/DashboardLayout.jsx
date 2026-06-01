import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Settings as SettingsIcon, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  Cpu, 
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSystem } from "../context/SystemContext";

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { alerts, acknowledgeAlert } = useSystem();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Active navigation helper
  const isActive = (path) => location.pathname === path;

  // Sidebar items
  const menuItems = [
    { name: "Dashboard", path: user?.role === "admin" ? "/admin-dashboard" : "/dashboard", icon: LayoutDashboard },
    { name: "Analytics", path: "/analytics", icon: TrendingUp, userOnly: true },
    { name: "Alerts", path: "/alerts", icon: AlertTriangle, userOnly: true },
    { name: "Profile", path: "/profile", icon: UserIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon }
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Filter alerts to active ones
  const activeAlerts = alerts.filter(a => a.status === "active" && (user?.role === "admin" || a.sector === user?.sector));

  return (
    <div className="min-h-screen bg-[#040509] text-gray-100 flex relative font-sans overflow-hidden">
      {/* Cyber Grid background */}
      <div className="cyber-grid"></div>
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-dark-border z-20 shrink-0">
        {/* Brand header */}
        <div className="h-16 flex items-center px-6 border-b border-dark-border gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center shadow-glow-cyan">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              InfraSense <span className="text-neon-cyan font-mono">AI</span>
            </h1>
            <span className="text-[10px] tracking-wider text-gray-500 uppercase font-mono">
              Intelligence Core
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems
            .filter(item => !item.userOnly || user?.role !== "admin")
            .map((item) => {
              const IconComp = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                    active 
                      ? "bg-gradient-to-r from-neon-blue/20 to-neon-cyan/5 text-neon-cyan border border-neon-cyan/20 shadow-glow-cyan" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className={`w-4 h-4 ${active ? "text-neon-cyan" : "text-gray-400"}`} />
                    <span>{item.name}</span>
                  </div>
                  {active && <ChevronRight className="w-4 h-4 text-neon-cyan" />}
                </Link>
              );
            })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-dark-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5 border border-white/5 mb-4">
            <img 
              src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg"} 
              alt="Profile" 
              className="w-10 h-10 rounded-lg border border-neon-cyan/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate leading-tight text-gray-200">{user?.displayName}</p>
              <p className="text-[10px] text-gray-500 font-mono uppercase truncate">{user?.role === "admin" ? "Systems Admin" : user?.sector?.split(" ")[0] || "No Sector"}</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile Toggle */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-64 glass-panel border-r border-dark-border z-40 flex flex-col lg:hidden"
            >
              <div className="h-16 flex items-center justify-between px-6 border-b border-dark-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-black" />
                  </div>
                  <h1 className="font-bold text-lg leading-none">
                    InfraSense <span className="text-neon-cyan">AI</span>
                  </h1>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-gray-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems
                  .filter(item => !item.userOnly || user?.role !== "admin")
                  .map((item) => {
                    const IconComp = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                          active 
                            ? "bg-gradient-to-r from-neon-blue/20 to-neon-cyan/5 text-neon-cyan border border-neon-cyan/20 shadow-glow-cyan" 
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComp className={`w-4 h-4 ${active ? "text-neon-cyan" : "text-gray-400"}`} />
                          <span>{item.name}</span>
                        </div>
                        {active && <ChevronRight className="w-4 h-4 text-neon-cyan" />}
                      </Link>
                    );
                  })}
              </nav>

              <div className="p-4 border-t border-dark-border">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-white/5 border border-white/5 mb-4">
                  <img src={user?.photoURL} alt="Profile" className="w-10 h-10 rounded-lg border border-neon-cyan/30" />
                  <div>
                    <p className="text-sm font-semibold text-gray-200">{user?.displayName}</p>
                    <p className="text-[10px] text-gray-500 font-mono uppercase">{user?.role === "admin" ? "Systems Admin" : user?.sector?.split(" ")[0] || "No Sector"}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent hover:border-rose-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminate Session</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 border-b border-dark-border bg-dark-bg/60 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-400 hover:text-gray-200 lg:hidden rounded-lg hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Header Sector / Scope badge */}
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
                {user?.role === "admin" ? "ADMINISTRATIVE SCOPE: GLOBAL" : user?.sector || "SYSTEM CORE"}
              </span>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Query telemetry or alerts..."
                className="bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-1.5 pl-9 pr-4 text-xs w-64 text-gray-200 transition-all placeholder:text-gray-600"
              />
            </div>

            {/* AI Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-dark-border font-mono text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>AI CORE: ACTIVE</span>
            </div>

            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-200 rounded-lg hover:bg-white/5 border border-transparent hover:border-dark-border transition-all duration-300 relative"
              >
                <Bell className="w-5 h-5" />
                {activeAlerts.length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-dark-bg animate-pulse"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute right-0 mt-2 w-80 glass-panel border border-dark-border rounded-xl shadow-glass overflow-hidden z-30"
                    >
                      <div className="p-4 border-b border-dark-border bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-neon-cyan" />
                          <span className="text-sm font-semibold">Active AI Anomalies</span>
                        </div>
                        <span className="text-[10px] font-mono bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded">
                          {activeAlerts.length} Active
                        </span>
                      </div>

                      <div className="max-h-64 overflow-y-auto division-y division-dark-border">
                        {activeAlerts.length === 0 ? (
                          <div className="py-8 text-center text-xs text-gray-500 font-mono">
                            No unacknowledged anomalies
                          </div>
                        ) : (
                          activeAlerts.map(alert => (
                            <div key={alert.id} className="p-3.5 hover:bg-white/5 transition-all text-xs">
                              <div className="flex justify-between items-start mb-1">
                                <span className={`font-mono font-bold tracking-wider ${alert.type === "critical" ? "text-rose-400" : "text-amber-400"}`}>
                                  {alert.idCode}
                                </span>
                                <span className="text-[9px] text-gray-600 font-mono">
                                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-gray-300 font-medium mb-2 leading-snug">{alert.message}</p>
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-mono text-neon-cyan uppercase bg-neon-cyan/5 px-1.5 py-0.5 rounded">
                                  {alert.system}
                                </span>
                                <button 
                                  onClick={() => acknowledgeAlert(alert.id)}
                                  className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase transition-colors"
                                >
                                  Acknowledge
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 border-t border-dark-border bg-white/5 text-center">
                        <Link 
                          to="/alerts" 
                          onClick={() => setShowNotifications(false)}
                          className="text-xs text-neon-cyan hover:text-neon-blue font-semibold inline-flex items-center gap-1"
                        >
                          View System Alert Console
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar shortcut */}
            <Link to="/profile" className="flex items-center gap-2 group">
              <img 
                src={user?.photoURL} 
                alt="Avatar" 
                className="w-8 h-8 rounded-lg border border-dark-border group-hover:border-neon-cyan/40 transition-colors"
              />
              <span className="hidden md:inline text-xs font-medium text-gray-400 group-hover:text-gray-200 transition-colors">
                {user?.displayName ? user.displayName.split(" ")[0] : ""}
              </span>
            </Link>
          </div>
        </header>

        {/* Page Inner Content */}
        <main className="flex-1 p-4 lg:p-8 relative">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

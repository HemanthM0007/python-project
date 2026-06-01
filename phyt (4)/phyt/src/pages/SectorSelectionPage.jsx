import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Factory, Building, Hospital, Home, ChevronRight, Cpu, CloudLightning } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SectorSelectionPage = () => {
  const { user, saveSector } = useAuth();
  const navigate = useNavigate();

  // If sector is already selected, redirect immediately to dashboard
  useEffect(() => {
    if (user && user.sector) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const sectors = [
    {
      name: "Industrial Sector",
      description: "Automation, heavy machinery thermal outputs, pneumatic pressures, and rotational vibration analytics.",
      icon: Factory,
      glow: "hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(0,114,255,0.2)]",
      iconGlow: "bg-neon-blue/10 text-neon-blue border-neon-blue/20"
    },
    {
      name: "Institutional Sector",
      description: "HVAC climate control logs, structural lighting energy patterns, and carbon efficiency indicators.",
      icon: Building,
      glow: "hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      iconGlow: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      name: "Hospital Sector",
      description: "HVAC air clean indexes, auxiliary backup generator states, and life-critical department sensory logs.",
      icon: Hospital,
      glow: "hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]",
      iconGlow: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    },
    {
      name: "Residential Sector",
      description: "Smart community power draws, municipal water grid meters, and district energy flow diagnostics.",
      icon: Home,
      glow: "hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
      iconGlow: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20"
    },
    {
      name: "Government Sector",
      description: "Karnataka power grid monitoring, weather-correlated line fault localization, storm risk modeling, and emergency dispatch.",
      icon: CloudLightning,
      glow: "hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]",
      iconGlow: "bg-amber-400/10 text-amber-400 border-amber-400/20"
    }
  ];

  const handleSelectSector = (sectorName) => {
    saveSector(sectorName);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#030408] text-gray-100 flex flex-col justify-center items-center relative px-6 py-12">
      <div className="cyber-grid"></div>

      {/* Glow Backdrop */}
      <div className="absolute w-[500px] h-[300px] bg-gradient-to-r from-neon-blue/10 to-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full text-center mb-10 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center mx-auto mb-4">
          <Cpu className="w-5 h-5 text-black animate-pulse" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Select Operational Domain
        </h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto mt-2 leading-relaxed">
          Logged in as <span className="text-neon-cyan font-semibold">{user?.displayName}</span>. 
          Please select a sector to load the appropriate real-time telemetry sensors and AI monitoring rules.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full relative z-10">
        {sectors.map((sector, index) => {
          const SectorIcon = sector.icon;
          return (
            <motion.button
              key={sector.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => handleSelectSector(sector.name)}
              className={`glass-panel text-left p-6 rounded-xl border border-dark-border group transition-all duration-300 ${sector.glow}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${sector.iconGlow} group-hover:scale-110 transition-transform duration-300`}>
                  <SectorIcon className="w-6 h-6" />
                </div>
                <div className="p-1 rounded-full border border-dark-border text-gray-500 group-hover:text-neon-cyan group-hover:border-neon-cyan/20 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-200 group-hover:text-neon-cyan transition-colors">
                {sector.name}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-light">
                {sector.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/login")}
        className="mt-8 text-xs text-gray-500 hover:text-rose-400 font-mono tracking-wider transition-colors relative z-10"
      >
        Sign in with different credentials
      </button>
    </div>
  );
};

export default SectorSelectionPage;

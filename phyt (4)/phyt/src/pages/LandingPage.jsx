import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, 
  BrainCircuit, 
  AlertOctagon, 
  Zap, 
  LineChart, 
  Factory, 
  Building, 
  Hospital, 
  Home,
  Cpu, 
  ChevronRight, 
  Mail, 
  Phone, 
  Globe 
} from "lucide-react";

const LandingPage = () => {
  // Sectors details
  const sectors = [
    {
      name: "Industrial Sector",
      description: "AI-driven thermal imaging, vibration analysis, and mechanical anomaly forecasts for automation systems.",
      icon: Factory,
      color: "from-blue-500/20 to-neon-blue/40 font-semibold text-neon-blue",
      glow: "glow-border-blue"
    },
    {
      name: "Institutional Sector",
      description: "Smart building automation including HVAC telemetry, carbon footprinting, and high-occupancy safety analytics.",
      icon: Building,
      color: "from-emerald-500/20 to-emerald-400/40 text-emerald-400",
      glow: "border-emerald-500/30 shadow-emerald-500/10 shadow-lg"
    },
    {
      name: "Hospital Sector",
      description: "HVAC air clean indexes, auxiliary backup generator states, and life-critical department sensory logs.",
      icon: Hospital,
      color: "from-amber-500/20 to-amber-400/40 text-amber-400",
      glow: "border-amber-500/30 shadow-amber-500/10 shadow-lg"
    },
    {
      name: "Residential Sector",
      description: "Smart community power draws, municipal water grid meters, and district energy flow diagnostics.",
      icon: Home,
      color: "from-neon-cyan/20 to-neon-cyan/50 text-neon-cyan",
      glow: "glow-border-cyan"
    }
  ];

  // Features list
  const features = [
    {
      title: "Real-Time Monitoring",
      description: "Continuous sub-second ingestion of sensory feeds including temperature, acoustics, current, and vibration levels.",
      icon: Activity
    },
    {
      title: "Predictive Analytics",
      description: "Foresee machinery fatigue and valve failures up to 14 days in advance using deep temporal prediction networks.",
      icon: LineChart
    },
    {
      title: "AI Anomaly Detection",
      description: "Advanced classification algorithms filtering noise to pinpoint exact sensor defects and structural risks.",
      icon: BrainCircuit
    },
    {
      title: "Smart Alerts",
      description: "Role-based alerts dispatched via WebSockets, email, or SMS, prompting engineers with detailed resolution steps.",
      icon: AlertOctagon
    },
    {
      title: "Energy Monitoring",
      description: "Comprehensive grid consumption modeling to detect parasitic loads and optimize overall power factor parameters.",
      icon: Zap
    }
  ];

  // Particle positions for hero animation
  const dots = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    top: Math.random() * 90 + "%",
    left: Math.random() * 95 + "%",
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-[#030408] text-gray-100 relative overflow-hidden font-sans">
      {/* Cyber Grid */}
      <div className="cyber-grid"></div>

      {/* Floating Particle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {dots.map(dot => (
          <motion.div
            key={dot.id}
            initial={{ opacity: 0.1, y: 0 }}
            animate={{ 
              opacity: [0.1, 0.6, 0.1],
              y: [-15, 15, -15],
              x: [-10, 10, -10]
            }}
            transition={{
              duration: 8 + Math.random() * 8,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut"
            }}
            className="absolute bg-neon-cyan/30 rounded-full"
            style={{
              width: dot.size,
              height: dot.size,
              top: dot.top,
              left: dot.left,
              filter: "blur(1px)"
            }}
          />
        ))}
      </div>

      {/* Header / Navbar */}
      <header className="border-b border-dark-border bg-dark-bg/30 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center shadow-glow-cyan">
              <Cpu className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-wider leading-none">
              InfraSense <span className="text-neon-cyan font-mono">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/5 border border-dark-border hover:border-neon-cyan/40 hover:bg-neon-cyan/5 text-gray-200 transition-all duration-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 z-10 flex flex-col items-center text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-gradient-to-r from-neon-blue/10 to-neon-cyan/15 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-dark-border text-[11px] font-mono tracking-wider text-neon-cyan uppercase">
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
            Next-Gen Autonomous Infrastructure Agent
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight">
            AI-Powered Real-Time <br />
            <span className="bg-gradient-to-r from-neon-cyan via-neon-blue to-purple-500 bg-clip-text text-transparent glow-text-cyan">
              Infrastructure Intelligence
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base lg:text-lg font-light leading-relaxed">
            Diagnose mechanical strain, predict transformer overloads, and identify grid energy leaks. 
            InfraSense AI runs continuous anomaly checks, empowering engineering controllers to respond before failures occur.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-sm font-bold bg-gradient-to-r from-neon-blue to-neon-cyan text-black hover:opacity-90 shadow-glow-cyan transition-all duration-300"
            >
              Explore Dashboard
            </Link>
            <div className="flex w-full sm:w-auto gap-3">
              <Link
                to="/login"
                className="w-1/2 sm:w-auto px-6 py-3.5 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 border border-dark-border text-center transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-1/2 sm:w-auto px-6 py-3.5 rounded-lg text-sm font-semibold bg-white/5 hover:bg-white/10 border border-dark-border text-center transition-all"
              >
                Register
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Sector Cards Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 z-10 relative">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Enterprise Sectors Configured</h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-lg mx-auto">
            Ready-to-deploy telemetry metrics tailored to the unique operational risks of major sectors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-panel p-6 rounded-xl hover:bg-white/5 border border-dark-border hover:border-white/10 group transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${sector.color} flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold mb-2 text-gray-200 group-hover:text-neon-cyan transition-colors">
                  {sector.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {sector.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 z-10 relative border-t border-dark-border/40">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Core Platform Capabilities</h2>
          <p className="text-gray-500 text-xs md:text-sm max-w-lg mx-auto">
            Full-spectrum telemetry ingestion and automation tools designed to minimize operational downtime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => {
            const FeatIcon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-6 rounded-xl bg-gradient-to-b from-white/[0.03] to-transparent border border-dark-border flex gap-4"
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                  <FeatIcon className="w-5 h-5 shadow-glow-cyan" />
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1.5 text-gray-200">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed font-light">{feat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 z-10 relative border-t border-dark-border/40 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">About InfraSense AI</h2>
        <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light max-w-2xl mx-auto mb-6">
          Developed as a high-fidelity diagnostic platform, InfraSense AI couples hardware sensory metrics with deep machine learning models. 
          By cross-correlating historical thermal cycles, harmonic voltage profiles, and flow stress spikes, 
          the system provides facility managers with comprehensive, unified visibility over critical enterprise operations.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neon-cyan hover:underline hover:text-neon-blue transition-colors"
        >
          Request system demonstration access
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border bg-black/60 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center">
                <Cpu className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-sm tracking-wider">InfraSense AI</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs font-light">
              Continuous neural telemetry scanning across smart grids, manufacturing networks, and public utilities.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">Platform Contact</h4>
            <ul className="text-xs text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neon-cyan" />
                <span>support@infrasense.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-neon-cyan" />
                <span>+1 (800) 555-SENSE</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-neon-cyan" />
                <span>ops.infrasense.ai</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">System Integrity</h4>
            <div className="flex flex-wrap gap-2.5">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                SSL Secured
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                AES-256 Logs
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Firebase Guard
              </span>
            </div>
            <p className="text-[10px] text-gray-600 pt-1">
              &copy; {new Date().getFullYear()} InfraSense AI. All rights reserved. Codebases comply with ISO 27001 diagnostics.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

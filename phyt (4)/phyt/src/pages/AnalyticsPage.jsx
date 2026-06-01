import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts";
import { 
  TrendingUp, 
  Activity, 
  Zap, 
  BrainCircuit, 
  Filter,
  CheckCircle,
  Thermometer,
  Gauge
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSystem } from "../context/SystemContext";

const AnalyticsPage = () => {
    const [lang, setLang] = useState(() => localStorage.getItem("resLanguage") || "en");

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem("resLanguage") || "en");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  const t = (en, hi, kn) => {
    if (lang === "hi") return hi;
    if (lang === "kn") return kn;
    return en;
  };

  const { user } = useAuth();
  const { metrics } = useSystem();
  
  const activeSector = user?.sector || "Industrial Sector";
  const sectorData = metrics[activeSector];

  // Safe checks for page mounts (prevents blank screen race condition before metrics are loaded)
  if (!metrics || Object.keys(metrics).length === 0 || !sectorData || !sectorData.chartData) {
    return (
      <div className="min-h-[65vh] flex flex-col justify-center items-center gap-4 font-mono text-xs text-gray-500">
        <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-neon-cyan animate-spin"></div>
        <span className="tracking-widest uppercase">{t("Initializing Analytics Engine...", "विश्लेषण इंजन प्रारंभ किया जा रहा है...", "ಅನಾಲಿಟಿಕ್ಸ್ ಎಂಜಿನ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗುತ್ತಿದೆ...")}</span>
      </div>
    );
  }

  const COLORS = ["#00f0ff", "#0072ff", "#10b981", "#ef4444"];

  // Custom glassmorphic tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-panel p-3 border border-dark-border rounded-lg text-xs font-mono">
          <p className="font-bold text-gray-300 mb-1">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} style={{ color: item.color }} className="flex justify-between gap-4 py-0.5">
              <span>{item.name}:</span>
              <span className="font-bold">{item.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie chart data: mechanical fatigue level calculations
  const fatigueData = [
    { name: t("Optimal Core", "इष्टतम कोर", "ಅತ್ಯುತ್ತಮ ಕೋರ್"), value: 72 },
    { name: t("Calibration Target", "अंशांकन लक्ष्य", "ಮಾಪನಾಂಕ ಗುರಿ"), value: 18 },
    { name: t("Fatigue Flagged", "थकान चिह्नित", "ದೋಷ ಗುರುತಿಸಲಾಗಿದೆ"), value: sectorData.detectedAnomalies * 3 + 2 },
    { name: t("Critical Stress", "गंभीर तनाव", "ತೀವ್ರ ಒತ್ತಡ"), value: sectorData.aiRiskScore > 40 ? 5 : 2 }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("Advanced Analytics & Diagnostic Logs", "उन्नत विश्लेषण और नैदानिक लॉग", "ಸುಧಾರಿತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಡಯಾಗ್ನಾಸ್ಟಿಕ್ ಲಾಗ್‌ಗಳು")}</h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase">
            <span>{t("Sensor Feed Scope: ", "सेंसर फीड दायरा: ", "ಸೆನ್ಸರ್ ಫೀಡ್ ವ್ಯಾಪ್ತಿ: ")}</span><span className="text-neon-cyan font-bold">{t(activeSector, activeSector === "Hospital Sector" ? "अस्पताल क्षेत्र" : activeSector === "Residential Sector" ? "आवासीय क्षेत्र" : activeSector, activeSector === "Hospital Sector" ? "ಆಸ್ಪತ್ರೆ ವಲಯ" : activeSector === "Residential Sector" ? "ವಸತಿ ವಲಯ" : activeSector)}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-dark-border text-xs text-gray-400 font-mono">
          <Filter className="w-3.5 h-3.5 text-neon-cyan" />
          <span>{t("Interval: Last 7 Operating Days", "अंतराल: पिछले 7 कार्य दिवस", "ಸಮಯಾವಧಿ: ಕಳೆದ 7 ಕೆಲಸದ ದಿನಗಳು")}</span>
        </div>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-dark-border flex items-center gap-4">
          <div className="p-3 rounded-lg bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">{t("Telemetry Health", "टेलीमेट्री स्वास्थ्य", "ಟೆಲಿಮೆಟ್ರಿ ಆರೋಗ್ಯ")}</span>
            <span className="text-lg font-bold text-gray-200">{sectorData.systemHealth}% {t("Stable", "स्थिर", "ಸ್ಥಿರ")}</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-dark-border flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/20">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">{t("Average Operating Temp", "औसत ऑपरेटिंग तापमान", "ಸರಾಸರಿ ಕಾರ್ಯಾಚರಣಾ ತಾಪಮಾನ")}</span>
            <span className="text-lg font-bold text-gray-200">{sectorData.temperature} °C</span>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-dark-border flex items-center gap-4">
          <div className="p-3 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider block">{t("AI Diagnosis Status", "एआई निदान स्थिति", "ಎಐ ತೀರ್ಮಾನ ಯಂತ್ರದ ಸ್ಥಿತಿ")}</span>
            <span className="text-lg font-bold text-gray-200">{t("Continuous Sync", "सतत समन्वय", "ನಿರಂತರ ಸಿಂಕ್ ಸಕ್ರಿಯ")}</span>
          </div>
        </div>
      </div>

      {/* Charts board layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Anomaly Ingest Trend Chart (Bar Chart) */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <h3 className="text-sm font-bold text-gray-200 mb-4">{t("Anomaly Flag Ingestion Trends", "विसंगति फ्लैग इनजेशन रुझान", "ಅಸಂಗತತೆ ಫ್ಲ್ಯಾಗ್ ಇಂಜೆಷನ್ ಏರಿಳಿತ")}</h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase mb-6">{t("Historical Anomaly count indices", "ऐतिहासिक विसंगति गणना सूचकांक", "ಐತಿಹಾಸಿಕ ಅಸಂಗತತೆಯ ಪ್ರಮಾಣ")}</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="anomalies" name="Anomalies detected" fill="#ef4444" radius={[4, 4, 0, 0]}>
                  {sectorData.chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.anomalies > 3 ? "#ef4444" : entry.anomalies > 1 ? "#f59e0b" : "#00f0ff"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Temperature & Core Thermal Trends (Line Chart) */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <h3 className="text-sm font-bold text-gray-200 mb-4">{t("Sensory Telemetry Log (Temp vs Voltage)", "संवेदी टेलीमेट्री लॉग (तापमान बनाम वोल्टेज)", "ಸೆನ್ಸರಿ ಟೆಲಿಮೆಟ್ರಿ ಲಾಗ್ (ತಾಪಮಾನ ಮತ್ತು ವೋಲ್ಟೇಜ್)")}</h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase mb-6">{t("Historical temperature averages and line voltage fluctuations", "ऐतिहासिक तापमान औसत और वोल्टेज में उतार-चढ़ाव", "ಐತಿಹಾಸಿಕ ಸರಾಸರಿ ತಾಪಮಾನ ಮತ್ತು ವೋಲ್ಟೇಜ್ ಏರಿಳಿತಗಳು")}</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace", paddingTop: 10 }} />
                <Line type="monotone" dataKey="temperature" name={t("Temp (°C)", "तापमान (°C)", "ತಾಪಮಾನ (°C)")} stroke="#00f0ff" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="voltage" name={t("Voltage (V)", "वोल्टेज (V)", "ವೋಲ್ಟೇಜ್ (V)")} stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Predictive Maintenance and Fatigue Model */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <h3 className="text-sm font-bold text-gray-200 mb-4">{t("Acoustic & Vibration Fatigue Breakdown", "ध्वनिक और कंपन थकान विश्लेषण", "ತಾಪನ ಮತ್ತು ಕಂಪನ ಹಾನಿ ವಿವರಗಳು")}</h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase mb-6">{t("Device calibration indexes based on sensory noise profiling", "संवेदी शोर प्रोफाइलिंग के आधार पर उपकरण अंशांकन सूचकांक", "ಶಬ್ದ ಸಂವೇದನೆ ಆಧಾರಿತ ಸಾಧನ ಮಾಪನಾಂಕ ನಿರ್ಣಯ ಸೂಚ್ಯಂಕಗಳು")}</p>
          
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fatigueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {fatigueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xl font-bold font-mono text-emerald-400">90%</span>
              <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">{t("Calibrated", "अंशशोधित", "ಮಾಪನಾಂಕಗೊಳಿಸಲಾಗಿದೆ")}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
            {fatigueData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 px-2 py-1 rounded bg-white/[0.02]">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-gray-400 truncate">{item.name}:</span>
                <span className="font-bold text-gray-200 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Trend Overlay (Area Chart) */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <h3 className="text-sm font-bold text-gray-200 mb-4">{t("Energy Demand Forecasting Model", "ऊर्जा मांग पूर्वानुमान मॉडल", "ವಿದ್ಯುತ್ ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ ಮಾದರಿ")}</h3>
          <p className="text-[10px] text-gray-500 font-mono uppercase mb-6">{t("AI load forecasting vs current energy draws (kW)", "एआई लोड पूर्वानुमान बनाम वर्तमान ऊर्जा खपत (kW)", "ಎಐ ಲೋಡ್ ಮುನ್ಸೂಚನೆ ಮತ್ತು ಪ್ರಸ್ತುತ ವಿದ್ಯುತ್ ಬಳಕೆ (kW)")}</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForcast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="energy" name={t("Demand Load (kW)", "मांग लोड (kW)", "ಬೇಡಿಕೆ ಲೋಡ್ (kW)")} stroke="#10b981" fillOpacity={1} fill="url(#colorForcast)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;

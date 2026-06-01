import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  Cell, 
  Legend 
} from "recharts";
import { 
  Zap, 
  CloudRain, 
  Wind, 
  AlertTriangle, 
  Activity, 
  ShieldAlert, 
  CheckCircle, 
  Cpu, 
  Map, 
  AlertCircle, 
  Send, 
  Compass, 
  TrendingUp, 
  Smartphone, 
  RefreshCw,
  Gauge,
  Flame,
  FileText,
  Info,
  Server,
  Radio
} from "lucide-react";

// Weather and Grid configuration for Karnataka districts
const DISTRICTS_CONFIG = {
  Bengaluru: {
    board: "BESCOM",
    feeders: 248,
    transformers: 1240,
    lineAge: 12,
    treeDensity: "High (5.2 trees/100m)",
    windFactor: 1.1,
    baseLoad: 4500, // kW
    lineLength: "450 km"
  },
  Mysuru: {
    board: "CESC",
    feeders: 142,
    transformers: 850,
    lineAge: 16,
    treeDensity: "Medium (3.1 trees/100m)",
    windFactor: 0.9,
    baseLoad: 2800,
    lineLength: "320 km"
  },
  Hubballi: {
    board: "HESCOM",
    feeders: 180,
    transformers: 980,
    lineAge: 18,
    treeDensity: "Low (1.4 trees/100m)",
    windFactor: 1.3,
    baseLoad: 3200,
    lineLength: "380 km"
  },
  Mangaluru: {
    board: "MESCOM",
    feeders: 120,
    transformers: 640,
    lineAge: 9,
    treeDensity: "Very High (8.6 trees/100m)",
    windFactor: 1.5,
    baseLoad: 2200,
    lineLength: "260 km"
  }
};

const GovernmentDashboard = ({ 
  user, 
  metrics, 
  alerts, 
  acknowledgeAlert, 
  devices, 
  addDevice, 
  deleteDevice, 
  triggerManualAlert, 
  updateSectorMetrics 
}) => {
  const [lang, setLang] = useState(() => localStorage.getItem("resLanguage") || "en");
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, map, analytics, simulation
  const [selectedDistrict, setSelectedDistrict] = useState("Bengaluru");
  
  // Simulation and weather parameters
  const [simMode, setSimMode] = useState("normal"); // normal, storm, lightning, theft
  const [rainfall, setRainfall] = useState(5.4); // mm/hr
  const [windSpeed, setWindSpeed] = useState(14.8); // km/h
  const [temp, setTemp] = useState(27.4); // °C
  const [lightningFrequency, setLightningFrequency] = useState(0); // strikes/min
  const [isPlaying, setIsPlaying] = useState(true);
  const [ticker, setTicker] = useState(0);

  // Electrical parameter states (extremely detailed grid telemetry)
  const [voltage, setVoltage] = useState(11.02); // kV (nominal 11kV)
  const [currentR, setCurrentR] = useState(145.2); // Amps Phase R
  const [currentY, setCurrentY] = useState(144.8); // Amps Phase Y
  const [currentB, setCurrentB] = useState(146.1); // Amps Phase B
  const [neutralCurrent, setNeutralCurrent] = useState(1.2); // Amps
  
  // Power Metrics
  const [activePower, setActivePower] = useState(2.76); // MW
  const [reactivePower, setReactivePower] = useState(0.81); // MVAR
  const [apparentPower, setApparentPower] = useState(2.88); // MVA
  const [freq, setFreq] = useState(49.98); // Hz (nominal 50Hz)
  const [pf, setPf] = useState(0.96); // Power Factor
  const [transformerTemp, setTransformerTemp] = useState(52.4); // °C
  const [oilTemp, setOilTemp] = useState(48.2); // °C
  const [loadPct, setLoadPct] = useState(62); // Transformer Load %

  // Harmonics and phase displacement
  const [vThd, setVThd] = useState(1.4); // Voltage THD %
  const [iThd, setIThd] = useState(2.1); // Current THD %
  const [angleR, setAngleR] = useState(0); // degrees
  const [angleY, setAngleY] = useState(-120); // degrees
  const [angleB, setAngleB] = useState(120); // degrees

  // Map interactive selection details
  const [selectedMapNode, setSelectedMapNode] = useState(null);

  // Alert simulation logger state
  const [dispatchLogs, setDispatchLogs] = useState([]);

  // Localisation dictionary
  const t = (en, hi, kn) => {
    if (lang === "hi") return hi;
    if (lang === "kn") return kn;
    return en;
  };

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem("resLanguage") || "en");
    };
    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  // Update simulator values based on active simulation mode
  useEffect(() => {
    if (simMode === "normal") {
      setRainfall(4.2 + Math.random() * 2);
      setWindSpeed(12 + Math.random() * 4);
      setTemp(28 - Math.random() * 2);
      setLightningFrequency(0);
    } else if (simMode === "storm") {
      setRainfall(52 + Math.random() * 12);
      setWindSpeed(74 + Math.random() * 15);
      setTemp(20 + Math.random() * 2);
      setLightningFrequency(3 + Math.random() * 3);
    } else if (simMode === "lightning") {
      setRainfall(22 + Math.random() * 8);
      setWindSpeed(28 + Math.random() * 8);
      setTemp(22 + Math.random() * 2);
      setLightningFrequency(14 + Math.random() * 4);
    } else if (simMode === "theft") {
      setRainfall(1.5 + Math.random() * 2);
      setWindSpeed(7.0 + Math.random() * 3);
      setTemp(30 + Math.random() * 2);
      setLightningFrequency(0);
    }
  }, [simMode, selectedDistrict]);

  // Telemetry real-time scrolling fluctuations
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTicker(prev => prev + 1);

      // Fluctuate standard parameters slightly
      setFreq(parseFloat((49.92 + Math.random() * 0.14).toFixed(2)));
      
      let nextV, nextR, nextY, nextB, nextPf, nextXfmrTemp, nextOilTemp, nextLoadPct;
      let nextVThd = parseFloat((1.2 + Math.random() * 0.5).toFixed(2));
      let nextIThd = parseFloat((1.8 + Math.random() * 0.7).toFixed(2));

      let nextAngleR = 0;
      let nextAngleY = -120;
      let nextAngleB = 120;

      // Simulate based on active mode
      if (simMode === "normal") {
        nextV = parseFloat((11.02 + (Math.random() - 0.5) * 0.08).toFixed(2));
        const baseCurrent = 142 + Math.random() * 8;
        nextR = parseFloat((baseCurrent + (Math.random() - 0.5) * 2).toFixed(1));
        nextY = parseFloat((baseCurrent + (Math.random() - 0.5) * 2).toFixed(1));
        nextB = parseFloat((baseCurrent + (Math.random() - 0.5) * 2).toFixed(1));
        nextPf = parseFloat((0.95 + Math.random() * 0.03).toFixed(2));
        nextXfmrTemp = parseFloat((51 + Math.random() * 3).toFixed(1));
        nextOilTemp = parseFloat((nextXfmrTemp - 4 - Math.random() * 2).toFixed(1));
        nextLoadPct = Math.round(58 + Math.random() * 8);
      } else if (simMode === "storm") {
        // Severe voltage drop due to load/ground path, heavy current imbalance, high THD
        nextV = parseFloat((8.85 + Math.random() * 0.5).toFixed(2)); // severe voltage sag
        nextR = parseFloat((252.4 + (Math.random() - 0.5) * 6).toFixed(1)); // phase overload
        nextY = parseFloat((82.1 + (Math.random() - 0.5) * 12).toFixed(1)); // major drop (tree grounding phase Y)
        nextB = parseFloat((215.8 + (Math.random() - 0.5) * 8).toFixed(1));
        nextPf = parseFloat((0.82 + Math.random() * 0.06).toFixed(2)); // inductive power drop
        nextXfmrTemp = parseFloat((81.2 + Math.random() * 5).toFixed(1));
        nextOilTemp = parseFloat((nextXfmrTemp - 5 - Math.random() * 2).toFixed(1));
        nextLoadPct = Math.round(94 + Math.random() * 4);
        nextVThd = parseFloat((4.8 + Math.random() * 1.5).toFixed(2));
        nextIThd = parseFloat((7.4 + Math.random() * 2.2).toFixed(2));
        // Phase angle distortion
        nextAngleY = -105; 
        nextAngleB = 135;
      } else if (simMode === "lightning") {
        // Huge voltage spike, blown fuse on phase Y (current falls to near zero)
        nextV = parseFloat((13.15 + (Math.random() - 0.5) * 0.8).toFixed(2)); // overvoltage spike
        const baseCurrent = 195 + Math.random() * 10;
        nextR = parseFloat((baseCurrent + (Math.random() - 0.5) * 4).toFixed(1));
        nextY = parseFloat((3.4 + Math.random() * 1.2).toFixed(1)); // phase fuse blown!
        nextB = parseFloat((198.2 + (Math.random() - 0.5) * 4).toFixed(1));
        nextPf = parseFloat((0.88 + Math.random() * 0.04).toFixed(2));
        nextXfmrTemp = parseFloat((66.8 + Math.random() * 4).toFixed(1));
        nextOilTemp = parseFloat((nextXfmrTemp - 4 - Math.random() * 2).toFixed(1));
        nextLoadPct = Math.round(76 + Math.random() * 6);
        nextVThd = parseFloat((5.2 + Math.random() * 1.8).toFixed(2));
        nextIThd = parseFloat((12.5 + Math.random() * 3.4).toFixed(2)); // massive current THD
      } else if (simMode === "theft") {
        // High load on Phase R exclusively (theft tap), normal weather
        nextV = parseFloat((10.74 + Math.random() * 0.06).toFixed(2));
        nextR = parseFloat((225.8 + Math.random() * 6).toFixed(1)); // theft loading R phase
        nextY = parseFloat((138.5 + Math.random() * 4).toFixed(1));
        nextB = parseFloat((139.1 + Math.random() * 4).toFixed(1));
        nextPf = parseFloat((0.92 + Math.random() * 0.02).toFixed(2));
        nextXfmrTemp = parseFloat((58.4 + Math.random() * 2).toFixed(1));
        nextOilTemp = parseFloat((nextXfmrTemp - 4 - Math.random() * 1).toFixed(1));
        nextLoadPct = Math.round(74 + Math.random() * 3);
      }

      // Calculate Neutral Current based on phase imbalance formula
      const r = nextR;
      const y = nextY;
      const b = nextB;
      const inVal = Math.sqrt(r*r + y*y + b*b - (r*y + y*b + b*r));
      setNeutralCurrent(parseFloat(inVal.toFixed(1)));

      // Calculate Power Parameters: Active (MW), Reactive (MVAR), Apparent (MVA)
      // apparentPower = sqrt(3) * V * I_avg
      const avgI = (nextR + nextY + nextB) / 3;
      const mva = (Math.sqrt(3) * nextV * avgI) / 1000;
      const mw = mva * nextPf;
      const mvar = Math.sqrt(Math.max(0, mva*mva - mw*mw));

      setVoltage(nextV);
      setCurrentR(nextR);
      setCurrentY(nextY);
      setCurrentB(nextB);
      setPf(nextPf);
      setTransformerTemp(nextXfmrTemp);
      setOilTemp(nextOilTemp);
      setLoadPct(nextLoadPct);
      setVThd(nextVThd);
      setIThd(nextIThd);
      setApparentPower(parseFloat(mva.toFixed(2)));
      setActivePower(parseFloat(mw.toFixed(2)));
      setReactivePower(parseFloat(mvar.toFixed(2)));
      setAngleR(nextAngleR);
      setAngleY(nextAngleY);
      setAngleB(nextAngleB);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, simMode]);

  // Risk Score calculation formula
  const getRiskDetails = () => {
    const config = DISTRICTS_CONFIG[selectedDistrict];
    let score = 8;

    score += rainfall * 0.65;
    score += windSpeed * 0.75;
    score += lightningFrequency * 2.8;
    score += config.lineAge * 0.85;

    if (config.treeDensity.includes("High")) score += 15;
    else if (config.treeDensity.includes("Very High")) score += 25;
    else if (config.treeDensity.includes("Medium")) score += 8;

    score = Math.min(99, Math.round(score));

    let label = t("SAFE", "सुरक्षित", "ಸುರಕ್ಷಿತ");
    let color = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
    let bgGlow = "shadow-[0_0_15px_rgba(16,185,129,0.15)] border-emerald-500/30";

    if (score > 70) {
      label = t("CRITICAL RISK", "गंभीर जोखिम", "ತೀವ್ರ ಅಪಾಯ");
      color = "text-rose-400 border-rose-500/20 bg-rose-500/10";
      bgGlow = "shadow-[0_0_15px_rgba(239,68,68,0.25)] border-rose-500/40";
    } else if (score > 40) {
      label = t("MEDIUM RISK", "मध्यम जोखिम", "ಮಧ್ಯಮ ಅಪಾಯ");
      color = "text-amber-400 border-amber-500/20 bg-amber-500/10";
      bgGlow = "shadow-[0_0_15px_rgba(245,158,11,0.18)] border-amber-500/30";
    }

    return { score, label, color, bgGlow };
  };

  const riskInfo = getRiskDetails();

  // Damaged Line Isolation details (strictly Karnataka boards)
  const getDamagedLineDetails = () => {
    if (simMode === "normal") {
      return {
        damaged: false,
        line: "None",
        location: "None",
        cause: "None",
        confidence: 0,
        span: "None"
      };
    }
    
    const board = DISTRICTS_CONFIG[selectedDistrict].board;
    if (simMode === "storm") {
      return {
        damaged: true,
        line: `${board} 11kV ${selectedDistrict} North Feeder L-34`,
        span: "Pole A-122 to Pole A-123",
        cause: t("Heavy Gale Winds causing tree branch fall & Conductor Line Breakage", "तेज हवा से पेड़ की शाखा गिरने से तार टूटना", "ಬಿರುಗಾಳಿ ಮಳೆಗೆ ಮರ ಬಿದ್ದು ವಿದ್ಯುತ್ ತಂತಿ ತುಂಡಾಗಿದೆ"),
        confidence: 91,
        location: `${selectedDistrict} Bypass Ring Road Corridor`
      };
    }

    if (simMode === "lightning") {
      return {
        damaged: true,
        line: `${board} 33kV ${selectedDistrict} Industrial Feeder S-12`,
        span: "Substation Gantry B-1 to Pole B-02",
        cause: t("Direct Lightning Surge causing Insulator Shattering & Flashover", "बिजली गिरने से इंसुलेटर की विफलता", "ಮಿಂಚು ಬಡಿದು ಇನ್ಸುಲೇಟರ್ ಒಡೆದು ಹೋಗಿದೆ"),
        confidence: 96,
        location: `${selectedDistrict} Industrial Layout Zone`
      };
    }

    if (simMode === "theft") {
      return {
        damaged: true,
        line: `${board} 11kV ${selectedDistrict} Commercial Feed T-10`,
        span: "Pole C-48 to Commercial Complex Busbar",
        cause: t("Direct Underground Cable Tap / Power Theft diverter detected", "अनाधिकृत लोड टैपिंग / बिजली चोरी", "ಅನಧಿಕೃತ ಲೋಡ್ ಟ್ಯಾಪಿಂಗ್ / ವಿದ್ಯುತ್ ಕಳ್ಳತನ"),
        confidence: 83,
        location: `${selectedDistrict} Market Complex Sector 4`
      };
    }
  };

  const damageDetails = getDamagedLineDetails();

  // Automatic alert dispatcher side effect
  useEffect(() => {
    if (!damageDetails.damaged) return;

    const targetMsg = `ALERT: High probability of ${damageDetails.cause} on ${damageDetails.line} between ${damageDetails.span}. Risk Score: ${riskInfo.score}%.`;
    const isAlreadyPresent = alerts.some(a => a.message.includes(damageDetails.line));

    if (!isAlreadyPresent) {
      triggerManualAlert(
        "Government Sector",
        selectedDistrict + " Grid",
        targetMsg,
        simMode === "storm" || simMode === "lightning" ? "critical" : "warning"
      );

      // Trigger dispatcher visual log
      const newLog = {
        id: "dispatch_" + Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        line: damageDetails.line,
        span: damageDetails.span,
        score: riskInfo.score,
        district: selectedDistrict,
        channels: ["SMS", "WhatsApp", "Telegram", "Email", "Utility HUD"]
      };
      setDispatchLogs(prev => [newLog, ...prev]);
    }
  }, [simMode, selectedDistrict, damageDetails.damaged]);

  // Sync telemetry metrics to global context
  useEffect(() => {
    const prevChartData = metrics["Government Sector"]?.chartData || [];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const newPoint = {
      name: timeStr,
      energy: DISTRICTS_CONFIG[selectedDistrict].baseLoad + (simMode === "storm" ? 800 : (simMode === "theft" ? 450 : (Math.random() - 0.5) * 200)),
      voltage: voltage,
      risk: riskInfo.score,
      temperature: transformerTemp,
      anomalies: damageDetails.damaged ? 1 : 0
    };

    const updatedChart = [...prevChartData, newPoint];
    if (updatedChart.length > 10) {
      updatedChart.shift();
    }

    updateSectorMetrics("Government Sector", {
      isStreaming: true,
      totalDevices: DISTRICTS_CONFIG[selectedDistrict].transformers,
      activeSystems: damageDetails.damaged 
        ? DISTRICTS_CONFIG[selectedDistrict].transformers - 1
        : DISTRICTS_CONFIG[selectedDistrict].transformers,
      aiRiskScore: riskInfo.score,
      energyConsumption: newPoint.energy,
      detectedAnomalies: damageDetails.damaged ? 1 : 0,
      systemHealth: damageDetails.damaged ? 84 : 98,
      temperature: temp,
      voltage: voltage,
      chartData: updatedChart
    });

  }, [ticker, selectedDistrict, simMode]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      updateSectorMetrics("Government Sector", { isStreaming: false });
    };
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Control Panel */}
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
            <Zap className="w-6 h-6 text-amber-400 animate-pulse" />
          </span>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-100 flex items-center gap-2">
              KPTCL Grid Command Console
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest animate-pulse">Karnataka</span>
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500 font-mono mt-0.5 uppercase">
              {t("Utility Board: ", "उपयोगिता बोर्ड: ", "ವಿದ್ಯುತ್ ನಿಯಂತ್ರಣ ಮಂಡಳಿ: ")}
              <span className="text-amber-400 font-bold">
                {DISTRICTS_CONFIG[selectedDistrict].board} – {selectedDistrict} Division ({DISTRICTS_CONFIG[selectedDistrict].lineLength} line coverage)
              </span>
            </p>
          </div>
        </div>

        {/* Action controls & Nav */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select District Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase">{t("District:", "ज़िला:", "ಜಿಲ್ಲೆ:")}</label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedMapNode(null);
              }}
              className="bg-[#0f111a] border border-dark-border text-xs text-gray-200 rounded-lg py-1.5 px-3 focus:border-amber-400/40 outline-none font-mono cursor-pointer transition-colors"
            >
              <option value="Bengaluru">Bengaluru Division (BESCOM)</option>
              <option value="Mysuru">Mysuru Division (CESC)</option>
              <option value="Hubballi">Hubballi Division (HESCOM)</option>
              <option value="Mangaluru">Mangaluru Division (MESCOM)</option>
            </select>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-black/40 border border-white/5 p-1 rounded-xl">
            {[
              { id: "dashboard", label: t("Grid Core", "ग्रिड कोर", "ಗ್ರಿಡ್ ಕೋರ್"), icon: Zap },
              { id: "map", label: t("GIS Smart Map", "जीआईएस स्मार्ट मैप", "GIS ಸ್ಮಾರ್ಟ್ ನಕ್ಷೆ"), icon: Map },
              { id: "analytics", label: t("Diagnostics", "डायग्नोस्टिक्स", "ಡಯಾಗ್ನಾಸ್ಟಿಕ್ಸ್"), icon: TrendingUp },
              { id: "simulation", label: t("Simulator", "सिम्युलेटर", "ಸಿಮ್ಯುಲೇಟರ್"), icon: RefreshCw }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all ${
                    activeTab === tab.id
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "text-gray-400 border border-transparent hover:text-gray-200"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Renderings */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          
          {/* Top Info HUD cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Grid Health Status */}
            <div className="glass-panel p-4 rounded-xl border border-dark-border">
              <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider block">{t("GRID STABILITY", "ग्रिड स्थिरता", "ಗ್ರಿಡ್ ಸ್ಥಿರತೆ")}</span>
              <h3 className={`text-2xl font-bold font-mono tracking-tight mt-1 ${damageDetails.damaged ? "text-rose-400" : "text-emerald-400"}`}>
                {damageDetails.damaged ? "84.2%" : "98.8%"}
              </h3>
              <p className="text-[9px] text-gray-400 mt-1 font-light truncate">
                {damageDetails.damaged ? t("Automatic trip lock active", "ऑटो लॉक सक्रिय", "ಆಟೋಮ್ಯಾಟಿಕ್ ಟ್ರಿಪ್ ಸಕ್ರಿಯ") : t("Frequency phase-locked", "आवृत्ति चरण-बंद", "ಫ್ರಿಕ್ವೆನ್ಸಿ ಲಾಕ್ ಆಗಿದೆ")}
              </p>
            </div>

            {/* Total Feeders */}
            <div className="glass-panel p-4 rounded-xl border border-dark-border">
              <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider block">{t("ACTIVE FEEDERS", "सक्रिय फीडर", "ಸಕ್ರಿಯ ಫೀಡರ್")}</span>
              <h3 className="text-2xl font-bold font-mono tracking-tight mt-1 text-gray-200">
                {DISTRICTS_CONFIG[selectedDistrict].feeders}
              </h3>
              <p className="text-[9px] text-gray-400 mt-1 font-light">
                {t("11kV / 33kV line nodes", "11kV / 33kV लाइन नोड्स", "11kV / 33kV ಲೈನ್ಸ್")}
              </p>
            </div>

            {/* Total Transformers */}
            <div className="glass-panel p-4 rounded-xl border border-dark-border">
              <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider block">{t("MONITORED XFMR", "निगरानी ट्रांसफार्मर", "ಮೇಲ್ವಿಚಾರಣೆ ಪರಿವರ್ತಕ")}</span>
              <h3 className="text-2xl font-bold font-mono tracking-tight mt-1 text-gray-200">
                {DISTRICTS_CONFIG[selectedDistrict].transformers}
              </h3>
              <p className="text-[9px] text-gray-400 mt-1 font-light">
                {t("Distribution DTC units", "वितरण डीटीसी इकाइयाँ", "ಡಿಟಿಸಿ ಯುನಿಟ್‌ಗಳು")}
              </p>
            </div>

            {/* Active Faults count */}
            <div className="glass-panel p-4 rounded-xl border border-dark-border relative overflow-hidden">
              <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider block">{t("ACTIVE LINE FAULTS", "सक्रिय लाइन दोष", "ಸಕ್ರಿಯ ಲೈನ್ ದೋಷಗಳು")}</span>
              <h3 className={`text-2xl font-bold font-mono tracking-tight mt-1 ${damageDetails.damaged ? "text-rose-400 animate-pulse font-extrabold" : "text-emerald-400"}`}>
                {damageDetails.damaged ? "1 Fault" : "0 Faults"}
              </h3>
              {damageDetails.damaged && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
              <p className="text-[9px] text-gray-400 mt-1 font-light truncate">
                {damageDetails.damaged ? damageDetails.line.split(" ").slice(-3).join(" ") : t("All lines operational", "सभी लाइनें चालू", "ಎಲ್ಲಾ ಲೈನ್‌ಗಳು ಚಾಲನೆಯಲ್ಲಿವೆ")}
              </p>
            </div>

            {/* Weather Risk Score */}
            <div className={`glass-panel p-4 rounded-xl border transition-all duration-500 ${riskInfo.bgGlow}`}>
              <span className="text-[9px] font-mono uppercase text-gray-500 tracking-wider block">{t("GRID WEATHER RISK", "ग्रिड मौसम जोखिम", "ಗ್ರಿಡ್ ಹವಾಮಾನ ಅಪಾಯ")}</span>
              <h3 className="text-2xl font-bold font-mono tracking-tight mt-1 text-gray-100">
                {riskInfo.score}%
              </h3>
              <span className={`inline-block text-[8px] font-mono font-bold mt-1 px-1.5 py-0.5 rounded border ${riskInfo.color}`}>
                {riskInfo.label}
              </span>
            </div>

          </div>

          {/* Fault Localization and Isolation Alert banner */}
          <AnimatePresence>
            {damageDetails.damaged && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_15px_rgba(239,68,68,0.25)] font-mono"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                      {t("AI GRID FAULT LOCATED & SEGREGATED", "एआई ग्रिड फॉल्ट पृथक", "AI ಗ್ರಿಡ್ ದೋಷ ಪತ್ತೆಹಚ್ಚಿ ಪ್ರತ್ಯೇಕಿಸಿದೆ")}
                    </h4>
                    <p className="text-[11px] leading-relaxed text-gray-300">
                      {t("Damaged Line: ", "क्षतिग्रस्त लाइन: ", "ಹಾನಿಗೊಳಗಾದ ವಿದ್ಯುತ್ ತಂತಿ: ")} <strong className="text-white font-bold">{damageDetails.line}</strong>. 
                      {t(" Fault localized specifically between ", " फॉल्ट के बीच स्थित: ", " ದೋಷ ಪತ್ತೆಯಾದ ಕಂಬಗಳು: ")} <strong className="text-amber-400 font-bold">{damageDetails.span}</strong> ({damageDetails.location}).
                    </p>
                    <p className="text-[10px] text-rose-400/80">
                      {t("Root Cause: ", "मूल कारण: ", "ಮೂಲ ಕಾರಣ: ")} <strong>{damageDetails.cause}</strong> | {t("AI Model Confidence: ", "एआई मॉडल विश्वसनीयता: ", "ಮಾದರಿ ನಿಖರತೆ: ")} <strong>{damageDetails.confidence}%</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alerts.find(a => a.message.includes(damageDetails.line))?.id)}
                  className="px-4 py-2.5 bg-rose-900/40 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 hover:border-transparent rounded-lg text-xs font-bold uppercase transition-all shrink-0 w-full md:w-auto shadow-md"
                >
                  {t("Acknowledge & Dispatch Crew", "स्वीकार करें और चालक दल भेजें", "ಅಲರ್ಟ್ ಸ್ವೀಕರಿಸಿ ಮತ್ತು ಟೀಮ್ ಕಳುಹಿಸಿ")}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map and Weather Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GIS smart map view */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-200">{t("KPTCL GIS Grid Map View", "केपीटीसीएल जीआईएस ग्रिड मैप", "KPTCL GIS ಗ್ರಿಡ್ ನಕ್ಷೆ ವಿವರ")}</h3>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">{t("Click any pole or transformer to inspect live current/voltage readings", "लाइव रीडिंग देखने के लिए किसी भी खंभे या ट्रांसफार्मर पर क्लिक करें", "ಯಾವುದೇ ಕಂಬ ಅಥವಾ ಪರಿವರ್ತಕವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ನೈಜ ಮೌಲ್ಯಗಳನ್ನು ನೋಡಿ")}</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("map")}
                    className="text-[10px] text-amber-400 hover:text-amber-300 font-mono uppercase font-bold"
                  >
                    {t("Fullscreen Map", "पूर्ण स्क्रीन", "ಪೂರ್ಣ ನಕ್ಷೆ")} →
                  </button>
                </div>
                
                {/* SVG Map Container */}
                <div className="h-80 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden">
                  <GridSVGVisualizer 
                    simMode={simMode} 
                    damageDetails={damageDetails} 
                    riskInfo={riskInfo} 
                    district={selectedDistrict}
                    selectedNode={selectedMapNode}
                    setSelectedNode={setSelectedMapNode}
                  />
                </div>
              </div>

              {/* Selected Node Mini Telemetry Panel */}
              <AnimatePresence mode="wait">
                {selectedMapNode ? (
                  <motion.div 
                    initial={{ opacity: 0, h: 0 }}
                    animate={{ opacity: 1, h: "auto" }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-3 bg-white/5 border border-dark-border rounded-lg text-[10px] font-mono text-gray-300 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-gray-500 uppercase">Selected Node:</span>
                        <strong className="text-gray-200 ml-1.5">{selectedMapNode.name}</strong>
                      </div>
                    </div>
                    <div className="flex gap-4 text-right">
                      <div>
                        <span className="text-gray-500">Voltage:</span>
                        <span className="text-emerald-400 ml-1 font-bold">{selectedMapNode.voltage}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <span className={`ml-1 font-bold ${selectedMapNode.status === "Fault" ? "text-rose-400 animate-pulse" : "text-emerald-400"}`}>
                          {selectedMapNode.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="mt-4 text-[9px] font-mono text-gray-600 text-center py-2 border border-dashed border-white/5 rounded-lg">
                    Click on a pole, substation, or transformer icon in the map above to inspect line parameters.
                  </div>
                )}
              </AnimatePresence>

              <div className="mt-4 flex flex-wrap items-center justify-between text-[9px] font-mono text-gray-500 gap-3 border-t border-white/5 pt-3">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-amber-400 rounded"></span>11kV Feeder Line</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-emerald-500 rounded"></span>33kV Utility Transmission</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#0b1020] border border-white/20"></span>Substation Node</span>
                <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-glow-cyan animate-pulse"></span>Grid Pole</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>Active Fault Node</span>
              </div>
            </div>

            {/* Weather Sensor widgets */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-200 border-b border-white/5 pb-3 mb-4">{t("Meteorological Sensor Array", "मौसम सेंसर सरणी", "ಹವಾಮಾನ ಸೆನ್ಸಾರ್ ಮಾಹಿತಿ")}</h3>
                
                <div className="space-y-4">
                  {/* Rainfall */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-blue-500/10 text-blue-400">
                        <CloudRain className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono">{t("Rainfall Intensity", "वर्षा की तीव्रता", "ಮಳೆಯ ತೀವ್ರತೆ")}</span>
                        <h4 className="text-sm font-bold font-mono mt-0.5 text-gray-200">{rainfall.toFixed(1)} mm/hr</h4>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${rainfall > 35 ? "bg-rose-500/20 text-rose-400" : rainfall > 15 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                      {rainfall > 35 ? t("Heavy Storm", "भारी तूफान", "ಭಾರೀ ಬಿರುಗಾಳಿ") : rainfall > 15 ? t("Moderate Rain", "मध्यम बारिश", "ಸಾಧಾರಣ ಮಳೆ") : t("Dry / Drizzle", "हल्की बारिश", "ಶುಷ್ಕ")}
                    </span>
                  </div>

                  {/* Wind Velocity */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-teal-500/10 text-teal-400">
                        <Wind className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono">{t("Wind Velocity", "हवा का वेग", "ಗಾಳಿಯ ವೇಗ")}</span>
                        <h4 className="text-sm font-bold font-mono mt-0.5 text-gray-200">{windSpeed.toFixed(1)} km/h</h4>
                      </div>
                    </div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${windSpeed > 55 ? "bg-rose-500/20 text-rose-400" : windSpeed > 25 ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                      {windSpeed > 55 ? t("Gale Force", "तेज हवा", "ಬಿರುಗಾಳಿ") : windSpeed > 25 ? t("Breezy", "मंद पवन", "ತಂಗಾಳಿ") : t("Calm", "शांत", "ಶಾಂತ")}
                    </span>
                  </div>

                  {/* Temperature */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-orange-500/10 text-orange-400">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono">{t("Ambient Temperature", "परिवेश का तापमान", "ಸುತ್ತಲಿನ ತಾಪಮಾನ")}</span>
                        <h4 className="text-sm font-bold font-mono mt-0.5 text-gray-200">{temp.toFixed(1)} °C</h4>
                      </div>
                    </div>
                  </div>

                  {/* Lightning Strike Counter */}
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-yellow-500/10 text-yellow-400">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-mono">{t("Lightning Strikes", "आकाशीय बिजली", "ಮಿಂಚಿನ ಹೊಡೆತಗಳು")}</span>
                        <h4 className="text-sm font-bold font-mono mt-0.5 text-gray-200">{lightningFrequency.toFixed(0)} strikes/min</h4>
                      </div>
                    </div>
                    {lightningFrequency > 0 && (
                      <span className="animate-pulse text-[9px] font-mono bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-500/20">
                        {t("ACTIVE LIGHTNING", "बिजली सक्रिय", "ಮಿಂಚಿನ ಅಪಾಯ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Weather correlation message */}
              <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[10px] text-gray-400 font-mono leading-relaxed">
                <span className="text-amber-400 font-bold uppercase">{t("AI WEATHER-OUTAGE CORRELATION:", "एआई मौसम सहसंबंध:", "AI ವಾತಾವರಣದ ತಾಳಮೇಳ ವರದಿ:")}</span>
                {simMode === "storm" && ` Gale winds of ${windSpeed.toFixed(1)} km/h in ${selectedDistrict} combined with tree canopy density (${DISTRICTS_CONFIG[selectedDistrict].treeDensity}) increases feeder mechanical stress coefficient to 0.94.`}
                {simMode === "lightning" && ` Ground lightning strike density (${lightningFrequency} strikes/min) creates a high induction risk of insulator shattering on exposed overhead 33kV grids.`}
                {simMode === "normal" && " Weather sensors report stable seasonal baselines. Outage probability is low (< 5%). Continuous telemetry sync active."}
                {simMode === "theft" && " Weather factors are nominal. High active load disparity detected exclusively on Phase R, isolating theft or unbalanced tap loading."}
              </div>
            </div>

          </div>

          {/* Deep Electrical Parameters grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Electrical Telemetry Parameters Table */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <h3 className="text-sm font-bold text-gray-200">{t("Substation & Feeder Electrical Matrix", "सबस्टेशन और फीडर इलेक्ट्रिकल मैट्रिक्स", "ಸಬ್‌ಸ್ಟೇಷನ್ ಮತ್ತು ಫೀಡರ್ ಪವರ್ ಮೌಲ್ಯಗಳು")}</h3>
                <span className="text-[9px] font-mono text-gray-500 uppercase">Class: 3-Phase AC 50Hz</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[10px] text-gray-400">
                  <thead>
                    <tr className="border-b border-white/5 text-gray-500 uppercase tracking-wider">
                      <th className="py-2.5">{t("Parameter Name", "पैरामीटर नाम", "ಲಕ್ಷಣಗಳು")}</th>
                      <th className="py-2.5">{t("Measured Value", "मापा गया मूल्य", "ಪ್ರಸ್ತುತ ಮೌಲ್ಯ")}</th>
                      <th className="py-2.5">{t("Phase / Distribution", "चरण / वितरण", "ಡಿಸ್ಟ್ರಿಬ್ಯೂಷನ್")}</th>
                      <th className="py-2.5">{t("Harmonics / Limit", "सीमा", "ಸುರಕ್ಷಿತ ಮಿತಿ")}</th>
                      <th className="py-2.5">{t("Status", "स्थिति", "ಸ್ಥಿತಿ")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    
                    {/* Voltage */}
                    <tr>
                      <td className="py-3 font-semibold text-gray-200">Line-to-Line Voltage</td>
                      <td className="py-3 font-bold text-gray-100">{voltage.toFixed(2)} kV</td>
                      <td className="py-3">11kV Nominal</td>
                      <td className="py-3">THD-V: <span className="text-amber-400">{vThd}%</span></td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${voltage < 10.0 || voltage > 11.5 ? "bg-rose-500/25 text-rose-400 font-bold animate-pulse" : "bg-emerald-500/25 text-emerald-400"}`}>
                          {voltage < 10.0 || voltage > 11.5 ? "ABNORMAL" : "OPTIMAL"}
                        </span>
                      </td>
                    </tr>

                    {/* Currents */}
                    <tr>
                      <td className="py-3 font-semibold text-gray-200">Phase R Current / Angle</td>
                      <td className="py-3 font-bold text-gray-100">{currentR.toFixed(1)} A</td>
                      <td className="py-3">Phase Angle: {angleR}°</td>
                      <td className="py-3">Limit: 200 A</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${currentR > 200 ? "bg-rose-500/25 text-rose-400 font-bold" : "bg-emerald-500/25 text-emerald-400"}`}>
                          {currentR > 200 ? "OVERLOAD" : "NORMAL"}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-semibold text-gray-200">Phase Y Current / Angle</td>
                      <td className="py-3 font-bold text-gray-100">{currentY.toFixed(1)} A</td>
                      <td className="py-3">Phase Angle: {angleY}°</td>
                      <td className="py-3">Limit: 200 A</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${currentY < 10 && simMode === "lightning" ? "bg-rose-500/25 text-rose-400 font-bold animate-pulse" : (currentY > 200 || Math.abs(currentR - currentY) > 50 ? "bg-rose-500/25 text-rose-400 font-bold" : "bg-emerald-500/25 text-emerald-400")}`}>
                          {currentY < 10 && simMode === "lightning" ? "FUSE BLOWN" : (currentY > 200 || Math.abs(currentR - currentY) > 50 ? "IMBALANCE" : "NORMAL")}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-3 font-semibold text-gray-200">Phase B Current / Angle</td>
                      <td className="py-3 font-bold text-gray-100">{currentB.toFixed(1)} A</td>
                      <td className="py-3">Phase Angle: {angleB}°</td>
                      <td className="py-3">Limit: 200 A</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${currentB > 200 ? "bg-rose-500/25 text-rose-400" : "bg-emerald-500/25 text-emerald-400"}`}>
                          {currentB > 200 ? "OVERLOAD" : "NORMAL"}
                        </span>
                      </td>
                    </tr>

                    {/* Neutral Current */}
                    <tr>
                      <td className="py-3 font-semibold text-gray-200">Neutral Return Current</td>
                      <td className="py-3 font-bold text-gray-100">{neutralCurrent} A</td>
                      <td className="py-3">Imbalance Leakage</td>
                      <td className="py-3">THD-I: <span className="text-amber-400">{iThd}%</span></td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${neutralCurrent > 15 ? "bg-rose-500/25 text-rose-400 font-bold" : "bg-emerald-500/25 text-emerald-400"}`}>
                          {neutralCurrent > 15 ? "HIGH LEAKAGE" : "SAFE"}
                        </span>
                      </td>
                    </tr>

                    {/* Active/Reactive Power */}
                    <tr>
                      <td className="py-3 font-semibold text-gray-200">Active / Reactive Power</td>
                      <td className="py-3 font-bold text-gray-100">{activePower} MW / {reactivePower} MVAR</td>
                      <td className="py-3">Apparent: {apparentPower} MVA</td>
                      <td className="py-3">Power Factor: {pf}</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${pf < 0.90 ? "bg-amber-500/25 text-amber-400" : "bg-emerald-500/25 text-emerald-400"}`}>
                          {pf < 0.90 ? "LOW PF" : "OPTIMAL"}
                        </span>
                      </td>
                    </tr>

                    {/* Transformer temperature */}
                    <tr>
                      <td className="py-3 font-semibold text-gray-200">XFMR Temperature (Winding / Oil)</td>
                      <td className="py-3 font-bold text-gray-100">{transformerTemp}°C / {oilTemp}°C</td>
                      <td className="py-3">Load Capacity: {loadPct}%</td>
                      <td className="py-3">Limits: 75°C / 70°C</td>
                      <td className="py-3">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${transformerTemp > 75 ? "bg-rose-500/25 text-rose-400 font-bold animate-pulse" : "bg-emerald-500/25 text-emerald-400"}`}>
                          {transformerTemp > 75 ? "OVERHEATING" : "NORMAL"}
                        </span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Recommendation panel */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-200 border-b border-white/5 pb-3 mb-4">{t("AI Diagnosis & Dispatch Recommendation", "एआई निदान और प्रेषण अनुशंसा", "AI ರೋಗನಿರ್ಣಯ ಮತ್ತು ಡಿಸ್ಪ್ಯಾಚ್ ಸಲಹೆ")}</h3>
                
                <div className="space-y-4">
                  {simMode === "normal" && (
                    <div className="text-center py-10 text-xs text-gray-500 font-mono space-y-2">
                      <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
                      <p className="font-bold text-gray-200 uppercase">{t("GRID STATE OPTIMAL", "ग्रिड स्थिति इष्टतम", "ಗ್ರಿಡ್ ವ್ಯವಸ್ಥೆ ಸಹಜವಾಗಿದೆ")}</p>
                      <p className="text-[10px] text-gray-600">Continuous AI scanning confirms zero phase imbalances, low harmonics (THD-V &lt; 2%), and thermal values below triggers.</p>
                    </div>
                  )}

                  {simMode !== "normal" && (
                    <div className="space-y-3 font-mono text-xs">
                      <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-1.5">
                        <span className="text-[8px] uppercase text-rose-400 font-bold">{t("Isolated Anomaly Category", "विसंगति श्रेणी", "ಪತ್ತೆಯಾದ ದೋಷ ವರ್ಗ")}</span>
                        <p className="text-gray-200 font-bold leading-snug">{damageDetails.cause}</p>
                      </div>

                      <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                        <span className="text-[8px] uppercase text-amber-400 font-bold">{t("AI Mitigation Protocol", "शमन प्रोटोकॉल", "AI ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮಗಳು")}</span>
                        <ul className="space-y-1.5 text-[10px] text-gray-300 list-disc list-inside">
                          {simMode === "storm" && (
                            <>
                              <li>Locate damaged segment between Pole A-122 and A-123.</li>
                              <li>Dispatch nearest crew to clear tree branches and splice ACSR line.</li>
                              <li>Isolate Whitefield Substation breaker feeder L-34 immediately.</li>
                            </>
                          )}
                          {simMode === "lightning" && (
                            <>
                              <li>Trigger metal-oxide surge arresters at Industrial Zone substation.</li>
                              <li>Verify blown fuse on Phase Y at Pole B-02. Dispatch crew with replacement.</li>
                              <li>Check oil temperature levels on primary 15MVA Transformer.</li>
                            </>
                          )}
                          {simMode === "theft" && (
                            <>
                              <li>Deploy inspection team to Sector 4 Market Area Commercial Hub.</li>
                              <li>Compare master smart meter flow index against physical billing records.</li>
                              <li>Disconnect suspicious lines from Pole C-48 terminal.</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {simMode !== "normal" && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => {
                      setSimMode("normal");
                      const actAlert = alerts.find(a => a.message.includes(damageDetails.line));
                      if (actAlert) acknowledgeAlert(actAlert.id);
                    }}
                    className="flex-1 py-2.5 bg-emerald-500/10 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-400 hover:text-black rounded-lg font-bold text-[10px] uppercase font-mono tracking-wider transition-all shadow-md"
                  >
                    Clear Fault & Reset Telemetry
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {activeTab === "map" && (
        <div className="glass-panel p-5 rounded-xl border border-dark-border">
          <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-5">
            <div>
              <h3 className="text-sm font-bold text-gray-200">{t("KPTCL GIS Grid Geographic schematic", "केपीटीसीएल जीआईएस ग्रिड मैप", "KPTCL GIS ಗ್ರಿಡ್ ನಕ್ಷೆ")}</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Showing active weather storm effects and physical line fault areas in Karnataka", "कर्नाटक में सक्रिय मौसम और लाइन फॉल्ट क्षेत्रों को दिखा रहा है", "ಕರ್ನಾಟಕದ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿ ಮತ್ತು ವಿದ್ಯುತ್ ಮಾರ್ಗದ ತಾಂತ್ರಿಕ ದೋಷಗಳು")}</p>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>GIS Layer Sync Online</span>
            </div>
          </div>

          <div className="bg-black/60 border border-white/10 rounded-xl h-[500px] relative overflow-hidden flex items-center justify-center">
            <GridSVGVisualizer 
              simMode={simMode} 
              damageDetails={damageDetails} 
              riskInfo={riskInfo} 
              district={selectedDistrict} 
              selectedNode={selectedMapNode}
              setSelectedNode={setSelectedMapNode}
              isFullscreen={true} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 font-mono text-[10px] text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">
            <div>
              <h5 className="font-bold text-gray-300 uppercase mb-1">Substation Gateway</h5>
              <p>Primary Transformer: 33/11kV ABB</p>
              <p>Output Feeders: 6 Lines</p>
              <p>Busbar Health: Normal</p>
            </div>
            <div>
              <h5 className="font-bold text-gray-300 uppercase mb-1">Line Properties</h5>
              <p>Ingestion voltage: {voltage.toFixed(2)} kV</p>
              <p>Conductor: ACSR Panther (Aluminum)</p>
              <p>Physical length: {DISTRICTS_CONFIG[selectedDistrict].lineLength}</p>
            </div>
            <div>
              <h5 className="font-bold text-gray-300 uppercase mb-1">Weather Ingestion</h5>
              <p>Wind coefficient: {DISTRICTS_CONFIG[selectedDistrict].windFactor}</p>
              <p>Rain index: {rainfall.toFixed(1)} mm/hr</p>
              <p>Lightning strike: {lightningFrequency} strikes/min</p>
            </div>
            <div>
              <h5 className="font-bold text-gray-300 uppercase mb-1">Grid Automation</h5>
              <p>Telemetry: 100% online</p>
              <p>Fibre backhaul latency: 4.2ms</p>
              <p>Communication protocol: Modbus TCP/IP</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Outage count vs Rainfall */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border">
              <h3 className="text-sm font-bold text-gray-200 mb-4">{t("Monsoon Rainfall vs Grid Outages Correlation", "वर्षा बनाम ग्रिड आउटेज सहसंबंध", "ಮಳೆ ವರ್ಸಸ್ ಗ್ರಿಡ್ ಕಡಿತದ ಸಂಬಂಧ")}</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { rainfall: 5, outages: 1, name: "Mon" },
                      { rainfall: 8, outages: 1, name: "Tue" },
                      { rainfall: 2, outages: 0, name: "Wed" },
                      { rainfall: 35, outages: 4, name: "Thu" },
                      { rainfall: 52, outages: 5, name: "Fri" },
                      { rainfall: 15, outages: 2, name: "Sat" },
                      { rainfall: 5, outages: 1, name: "Sun" }
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                    <ChartTooltip />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: "monospace" }} />
                    <Area type="monotone" dataKey="rainfall" name="Rainfall (mm/hr)" stroke="#0072ff" fill="#0072ff" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="outages" name="Outages count" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Outages trends */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border">
              <h3 className="text-sm font-bold text-gray-200 mb-4">{t("Monthly Outages & Grid Trip Frequency", "मासिक आउटेज और ग्रिड ट्रिप आवृत्ति", "ಮಾಸಿಕ ವಿದ್ಯುತ್ ಸ್ಥಗಿತ ಮತ್ತು ಗ್ರಿಡ್ ಟ್ರಿಪ್ ವರದಿ")}</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: "Jan", outages: 3 },
                      { month: "Feb", outages: 2 },
                      { month: "Mar", outages: 5 },
                      { month: "Apr", outages: 8 },
                      { month: "May", outages: 12 },
                      { month: "Jun", outages: 24 },
                      { month: "Jul", outages: 28 },
                      { month: "Aug", outages: 19 },
                      { month: "Sep", outages: 15 },
                      { month: "Oct", outages: 10 },
                      { month: "Nov", outages: 6 },
                      { month: "Dec", outages: 4 }
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                    <ChartTooltip />
                    <Bar dataKey="outages" name="Outages (Grid Trip count)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Infrastructure parameters list */}
          <div className="glass-panel p-5 rounded-xl border border-dark-border">
            <h3 className="text-sm font-bold text-gray-200 mb-4">{t("Transformer & Line Health Index", "ट्रांसफार्मर और लाइन स्वास्थ्य सूचकांक", "ಪರಿವರ್ತಕ ಮತ್ತು ವೈರ್‌ಗಳ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕ")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase">{t("Avg Transformer Age", "औसत ट्रांसफार्मर आयु", "ಪರಿವರ್ತಕಗಳ ಸರಾಸರಿ ವಯಸ್ಸು")}</span>
                <h4 className="text-lg font-bold text-gray-200 mt-1">{DISTRICTS_CONFIG[selectedDistrict].lineAge + 4} Years</h4>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase">{t("Line Conductor Age", "लाइन की आयु", "ವೈರ್‌ಗಳ ವಯಸ್ಸು")}</span>
                <h4 className="text-lg font-bold text-gray-200 mt-1">{DISTRICTS_CONFIG[selectedDistrict].lineAge} Years</h4>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase">{t("Tree Canopy Density", "पेड़ों का घनत्व", "ಮರಗಳ ಸಾಂದ್ರತೆ")}</span>
                <h4 className="text-sm font-bold text-gray-200 mt-1.5 truncate">{DISTRICTS_CONFIG[selectedDistrict].treeDensity.split(" ")[0]}</h4>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                <span className="text-[10px] text-gray-500 uppercase">{t("Top Outage Feeders", "शीर्ष आउटेज फीडर", "ಹೆಚ್ಚು ಟ್ರಿಪ್ ಆಗುವ ಫೀಡರ್‌ಗಳು")}</span>
                <h4 className="text-sm font-bold text-rose-400 mt-1.5">L-34 Feeder & S-12 Line</h4>
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === "simulation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Simulator Controls */}
          <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2">
            <h3 className="text-sm font-bold text-gray-200 border-b border-white/5 pb-3 mb-5">{t("Weather Storm & Fault Grid Simulator", "मौसम और ग्रिड सिमुलेटर", "ಹವಾಮಾನ ಮತ್ತು ಗ್ರಿಡ್ ಸಿಮ್ಯುಲೇಟರ್")}</h3>
            
            <p className="text-xs text-gray-400 mb-6 font-mono leading-relaxed">
              Manually trigger weather anomalies to test the AI's capability to localize line sags, insulator flashes, and current imbalances. Observe telemetry readings and watch notifications route automatically to field crew gateways.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Normal Operations */}
              <button
                onClick={() => setSimMode("normal")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  simMode === "normal"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                    : "bg-white/5 border-dark-border text-gray-400 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold uppercase">{t("1. Safe Operation baseline", "1. सामान्य संचालन", "1. ಸಹಜ ಕಾರ್ಯಾಚರಣೆ")}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] leading-relaxed opacity-80 font-light">
                  Karnataka summer baseline. No grid faults. Phase voltages centered at 11kV, low THD, zero leakage neutral current.
                </p>
              </button>

              {/* Storm and Tree fall */}
              <button
                onClick={() => setSimMode("storm")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  simMode === "storm"
                    ? "bg-rose-500/10 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                    : "bg-white/5 border-dark-border text-gray-400 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold uppercase">{t("2. Monsoon Storm / Tree Fall", "2. मानसून तूफान / पेड़ गिरना", "2. ಮುಂಗಾರು ಬಿರುಗಾಳಿ / ಮರ ಉರುಳುವುದು")}</span>
                  <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                </div>
                <p className="text-[10px] leading-relaxed opacity-80 font-light">
                  Simulate severe rainfall (52 mm/hr) and storm winds (74 km/h). Triggers a tree limb snap crashing on feeder L-34, dropping Phase Y current and causing high voltage sag.
                </p>
              </button>

              {/* Lightning Strike */}
              <button
                onClick={() => setSimMode("lightning")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  simMode === "lightning"
                    ? "bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "bg-white/5 border-dark-border text-gray-400 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold uppercase">{t("3. Lightning surge & Insulator blast", "3. बिजली गिरना और इंसुलेटर विस्फोट", "3. ಸಿಡಿಲು ಬಡಿತ ಮತ್ತು ಇನ್ಸುಲೇಟರ್ ದೋಷ")}</span>
                  <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
                </div>
                <p className="text-[10px] leading-relaxed opacity-80 font-light">
                  Direct cloud-to-ground strike in the district. Shatters lightning insulator on feeder S-12. Voltage surges to 13.1kV, and Phase Y current drops to zero (fuse blown).
                </p>
              </button>

              {/* Power Theft */}
              <button
                onClick={() => setSimMode("theft")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  simMode === "theft"
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.18)]"
                    : "bg-white/5 border-dark-border text-gray-400 hover:bg-white/10"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs font-bold uppercase">{t("4. Unmapped load tap (Power Theft)", "4. बिजली चोरी", "4. ವಿದ್ಯುತ್ ಕಳ್ಳತನ")}</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-[10px] leading-relaxed opacity-80 font-light">
                  Injects current disparity on Phase R at Sector 4 Commercial Hub. Triggers grid theft warning flag due to localized load mismatch.
                </p>
              </button>

            </div>
          </div>

          {/* Alert logs list */}
          <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-200 border-b border-white/5 pb-3 mb-4">{t("Dispatched Alert Gateways", "प्रेषक गेटवे", "ಗೇಟ್‌ವೇ ಅಲರ್ಟ್ ಕಳುಹಿಸುವ ವ್ಯವಸ್ಥೆ")}</h3>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {dispatchLogs.length === 0 ? (
                  <div className="text-center py-10 text-[10px] text-gray-600 font-mono">
                    No notifications dispatched yet. Change simulation mode to trigger SMS/WA feeds.
                  </div>
                ) : (
                  dispatchLogs.map(log => (
                    <div key={log.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl font-mono text-[9px] space-y-1.5">
                      <div className="flex justify-between text-gray-500">
                        <span>{log.timestamp}</span>
                        <span className="text-amber-400 font-bold">{log.district} Grid</span>
                      </div>
                      <p className="text-gray-300 leading-snug">
                        <strong>DISPATCHED BROADCAST:</strong> "KPTCL Critical Alert: {damageDetails.cause} isolated on {log.line.split(" ").slice(-2).join(" ")} near {log.span}. Emergency crew dispatched."
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {log.channels.map(ch => (
                          <span key={ch} className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[7px] uppercase font-bold">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center justify-between text-[10px] font-mono text-gray-500">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Crew Gateway: Active</span>
              </span>
              <span>100% Dispatched</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

// SVG GIS Grid Map visualizer
const GridSVGVisualizer = ({ 
  simMode, 
  damageDetails, 
  riskInfo, 
  district, 
  selectedNode, 
  setSelectedNode, 
  isFullscreen = false 
}) => {
  
  // Interactive nodes coordinate map
  const nodes = [
    {
      id: "node_sub",
      name: `${district} Substation Alpha`,
      type: "substation",
      cx: 100,
      cy: 150,
      voltage: "33.0 kV",
      status: simMode === "lightning" ? "Fault" : "Optimal"
    },
    // Feeder A (Top)
    { id: "node_a1", name: "Indiranagar Feeder Pole A-120", type: "pole", cx: 220, cy: 70, voltage: "11.0 kV", status: "Optimal" },
    { id: "node_a2", name: "Indiranagar Feeder Pole A-122", type: "pole", cx: 320, cy: 70, voltage: simMode === "storm" ? "8.8 kV" : "11.0 kV", status: simMode === "storm" ? "Fault" : "Optimal" },
    { id: "node_a3", name: "Indiranagar Feeder Pole A-123", type: "pole", cx: 420, cy: 70, voltage: simMode === "storm" ? "8.2 kV" : "11.0 kV", status: simMode === "storm" ? "Fault" : "Optimal" },
    { id: "node_dtc_a", name: "Distribution Transformer DTC-A", type: "transformer", cx: 500, cy: 70, voltage: "11.0 kV", status: "Optimal" },
    
    // Feeder B (Middle)
    { id: "node_b1", name: "Koramangala Feeder Pole B-01", type: "pole", cx: 220, cy: 150, voltage: "11.0 kV", status: "Optimal" },
    { id: "node_b2", name: "Koramangala Feeder Pole B-02", type: "pole", cx: 340, cy: 150, voltage: simMode === "lightning" ? "13.1 kV" : "11.0 kV", status: simMode === "lightning" ? "Fault" : "Optimal" },
    { id: "node_b3", name: "Koramangala Feeder Pole B-03", type: "pole", cx: 440, cy: 150, voltage: "11.0 kV", status: "Optimal" },
    { id: "node_dtc_b", name: "Distribution Transformer DTC-B", type: "transformer", cx: 500, cy: 150, voltage: "11.0 kV", status: "Optimal" },
    
    // Feeder C (Bottom)
    { id: "node_c1", name: "Whitefield Feeder Pole C-48", type: "pole", cx: 220, cy: 230, voltage: simMode === "theft" ? "10.7 kV" : "11.0 kV", status: simMode === "theft" ? "Fault" : "Optimal" },
    { id: "node_c2", name: "Whitefield Feeder Pole C-49", type: "pole", cx: 320, cy: 230, voltage: "11.0 kV", status: "Optimal" },
    { id: "node_c3", name: "Whitefield Feeder Pole C-50", type: "pole", cx: 420, cy: 230, voltage: "11.0 kV", status: "Optimal" },
    { id: "node_dtc_c", name: "Distribution Transformer DTC-C", type: "transformer", cx: 500, cy: 230, voltage: "11.0 kV", status: "Optimal" }
  ];

  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="0 0 600 300" 
      className="text-gray-400 transition-all duration-500"
    >
      <defs>
        {/* Animated Rain Drops pattern */}
        <pattern id="rainPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <line x1="10" y1="5" x2="5" y2="25" stroke="rgba(0,114,255,0.25)" strokeWidth="1.2" className="animate-pulse" />
          <line x1="30" y1="15" x2="25" y2="35" stroke="rgba(0,114,255,0.25)" strokeWidth="1.2" className="animate-pulse" />
        </pattern>

        <linearGradient id="gridGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.25"/>
          <stop offset="50%" stopColor="#d97706" stopOpacity="0.05"/>
          <stop offset="100%" stopColor="#d97706" stopOpacity="0.25"/>
        </linearGradient>
      </defs>

      {/* Grid Pattern overlay */}
      <rect width="600" height="300" fill="url(#gridGlow)" />
      
      {/* Dynamic Rain Overlay during Storms */}
      {(simMode === "storm" || simMode === "lightning") && (
        <rect width="600" height="300" fill="url(#rainPattern)" />
      )}

      {/* Grid Background lines */}
      <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.02)" />
      <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.02)" />
      <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.02)" />
      <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(255,255,255,0.02)" />
      <line x1="0" y1="250" x2="600" y2="250" stroke="rgba(255,255,255,0.02)" />

      {/* 33kV Main Ingestion Line (Green) */}
      <path 
        d="M 0 150 L 100 150" 
        fill="none" 
        stroke={simMode === "lightning" ? "#ef4444" : "#10b981"} 
        strokeWidth="2.5"
        strokeDasharray="5 2"
        className={simMode === "lightning" ? "animate-pulse" : ""}
      />

      {/* Outgoing 11kV Feeder Line A (Top - Storm Fault Area) */}
      <path 
        d="M 100 150 C 120 70, 180 70, 220 70 L 500 70" 
        fill="none" 
        stroke={simMode === "storm" ? "#ef4444" : "#d97706"} 
        strokeWidth={simMode === "storm" ? "2.2" : "1.2"}
        strokeDasharray={simMode === "storm" ? "4 2" : "none"}
        className={simMode === "storm" ? "animate-pulse" : ""}
      />

      {/* Outgoing 11kV Feeder Line B (Middle - Lightning Fault Area) */}
      <path 
        d="M 100 150 L 500 150" 
        fill="none" 
        stroke={simMode === "lightning" ? "#ef4444" : "#d97706"} 
        strokeWidth={simMode === "lightning" ? "2.2" : "1.2"}
        strokeDasharray={simMode === "lightning" ? "4 2" : "none"}
        className={simMode === "lightning" ? "animate-pulse" : ""}
      />

      {/* Outgoing 11kV Feeder Line C (Bottom - Theft Area) */}
      <path 
        d="M 100 150 C 120 230, 180 230, 220 230 L 500 230" 
        fill="none" 
        stroke={simMode === "theft" ? "#ef4444" : "#d97706"} 
        strokeWidth={simMode === "theft" ? "2.2" : "1.2"}
        strokeDasharray={simMode === "theft" ? "4 2" : "none"}
        className={simMode === "theft" ? "animate-pulse" : ""}
      />

      {/* Animated Wind Lines during storms */}
      {simMode === "storm" && (
        <g opacity="0.3">
          <line x1="50" y1="30" x2="150" y2="30" stroke="white" strokeWidth="1.5" strokeDasharray="10 15" className="animate-pulse" />
          <line x1="200" y1="260" x2="300" y2="260" stroke="white" strokeWidth="1.5" strokeDasharray="10 15" className="animate-pulse" />
          <line x1="380" y1="120" x2="480" y2="120" stroke="white" strokeWidth="1.5" strokeDasharray="10 15" className="animate-pulse" />
        </g>
      )}

      {/* GIS Schematic Nodes Rendering */}
      {nodes.map(node => {
        let isSelected = selectedNode && selectedNode.id === node.id;
        let isFault = node.status === "Fault";

        return (
          <g 
            key={node.id} 
            transform={`translate(${node.cx}, ${node.cy})`}
            onClick={() => setSelectedNode(node)}
            className="cursor-pointer group"
          >
            {/* Click Hitbox */}
            <circle r="16" fill="transparent" />

            {/* Selection Highlight */}
            {isSelected && (
              <circle r="12" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
            )}

            {/* Node Shapes based on type */}
            {node.type === "substation" && (
              <g>
                <rect x="-16" y="-12" width="32" height="24" rx="4" fill="#0b1020" stroke={isFault ? "#ef4444" : "rgba(255,255,255,0.3)"} strokeWidth="1.5" />
                <Server className={`w-4 h-4 -translate-x-2 -translate-y-2 ${isFault ? "text-rose-400" : "text-[#00f0ff]"}`} />
              </g>
            )}

            {node.type === "pole" && (
              <g>
                <circle r="3.5" fill="#030408" stroke={isFault ? "#ef4444" : "#10b981"} strokeWidth="1.5" />
                <line x1="0" y1="3.5" x2="0" y2="12" stroke={isFault ? "#ef4444" : "gray"} strokeWidth="1" />
                <line x1="-5" y1="6" x2="5" y2="6" stroke={isFault ? "#ef4444" : "gray"} strokeWidth="1" />
              </g>
            )}

            {node.type === "transformer" && (
              <g>
                <circle r="6" fill="#0b1020" stroke={isFault ? "#ef4444" : "#d97706"} strokeWidth="1.5" />
                <circle cx="-3" cy="0" r="3.5" fill="none" stroke="#d97706" strokeWidth="0.8" />
                <circle cx="3" cy="0" r="3.5" fill="none" stroke="#d97706" strokeWidth="0.8" />
              </g>
            )}

            {/* Hover Tooltip name */}
            <text 
              y="-14" 
              textAnchor="middle" 
              fill={isFault ? "#ef4444" : (isSelected ? "#f59e0b" : "gray")} 
              fontSize="6" 
              fontFamily="monospace"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/80"
            >
              {node.name.split(" ").slice(-2).join(" ")}
            </text>
          </g>
        );
      })}

      {/* GIS Alert Highlight Overlays */}
      {simMode === "storm" && (
        <g>
          {/* Highlight span between Pole 122 and 123 */}
          <line x1="320" y1="70" x2="420" y2="70" stroke="#ef4444" strokeWidth="3" />
          <circle cx="370" cy="70" r="16" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" className="animate-spin" />
          <circle cx="370" cy="70" r="5" fill="#ef4444" opacity="0.8" className="animate-pulse" />
          <path d="M 370 70 L 390 100" stroke="#ef4444" strokeWidth="0.8" />
          <g transform="translate(390, 100)">
            <rect x="0" y="-10" width="90" height="15" rx="3" fill="#0b1020" stroke="#ef4444" strokeWidth="0.8" />
            <text x="5" y="0" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="bold">TREE INTERFERENCE: 91%</text>
          </g>
        </g>
      )}

      {simMode === "lightning" && (
        <g>
          {/* Blown insulator at Pole B-02 */}
          <circle cx="340" cy="150" r="16" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" className="animate-spin" />
          <polygon points="340,140 345,150 340,150 340,160 335,150 340,150" fill="#f59e0b" className="animate-bounce" />
          <path d="M 340 150 L 370 120" stroke="#ef4444" strokeWidth="0.8" />
          <g transform="translate(370, 110)">
            <rect x="0" y="-10" width="90" height="15" rx="3" fill="#0b1020" stroke="#ef4444" strokeWidth="0.8" />
            <text x="5" y="0" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="bold">INSULATOR BLAST: 96%</text>
          </g>
        </g>
      )}

      {simMode === "theft" && (
        <g>
          {/* Direct tap at Pole C-48 */}
          <circle cx="220" cy="230" r="16" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 2" className="animate-spin" />
          <circle cx="220" cy="230" r="5" fill="#f59e0b" opacity="0.8" className="animate-pulse" />
          <path d="M 220 230 L 250 200" stroke="#ef4444" strokeWidth="0.8" />
          <g transform="translate(250, 190)">
            <rect x="0" y="-10" width="90" height="15" rx="3" fill="#0b1020" stroke="#ef4444" strokeWidth="0.8" />
            <text x="5" y="0" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="bold">POWER THEFT: 83%</text>
          </g>
        </g>
      )}

    </svg>
  );
};

export default GovernmentDashboard;

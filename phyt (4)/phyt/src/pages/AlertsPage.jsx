import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  XCircle, 
  BellRing, 
  ShieldAlert, 
  Clock, 
  Filter,
  Check,
  Trash2
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSystem } from "../context/SystemContext";

const AlertsPage = () => {
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

  const translateAlertField = (field) => {
    if (!field) return "";
    const fUpper = field.toUpperCase().trim();
    if (fUpper === "UNEXPECTED SPIKE" || fUpper === "SPIKE") {
      return t("Unexpected Spike", "अप्रत्याशित उछाल", "ಅನಿರೀಕ್ಷಿತ ಏರಿಳಿತ");
    }
    if (fUpper === "CONTINUOUS APPLIANCE LOAD" || fUpper === "CONTINUOUS LOAD" || fUpper === "APPLIANCE LOAD" || fUpper === "APPLIANCE") {
      return t("Continuous Appliance Load", "निरंतर उपकरण भार", "ನಿರಂತರ ವಿದ್ಯುತ್ ಬಳಕೆ");
    }
    if (fUpper === "POWER THEFT") {
      return t("Power Theft", "बिजली चोरी", "ವಿದ್ಯುತ್ ಕಳ್ಳತನ");
    }
    if (fUpper === "APPLIANCE FAULT") {
      return t("Appliance Fault", "उपकरण खराबी", "ಉಪಕರಣ ದೋಷ");
    }
    if (fUpper === "SMART GRID") {
      return t("Smart Grid", "स्मार्ट ग्रिड", "ಸ್ಮಾರ್ಟ್ ಗ್ರಿಡ್");
    }
    if (fUpper === "CRITICAL") {
      return t("Critical", "गंभीर", "ಗಂಭೀರ");
    }
    if (fUpper === "WARNING") {
      return t("Warning", "चेतावनी", "ಎಚ್ಚರಿಕೆ");
    }
    if (fUpper === "SUCCESS" || fUpper === "OPTIMAL") {
      return t("Optimal", "इष्टतम", "ಅತ್ಯುತ್ತಮ");
    }
    if (fUpper === "HOSPITAL RESOURCE OVERLOAD") {
      return t("Hospital Resource Overload", "अस्पताल संसाधन ओवरलोड", "ಆಸ್ಪತ್ರೆ ಸಂಪನ್ಮೂಲಗಳ ಕೊರತೆ");
    }
    if (fUpper === "RECOVERY DEGRADATION PATTERN") {
      return t("Recovery Degradation Pattern", "रिकवरी विफलता", "ಗುಣಮುಖವಾಗುವಿಕೆ ಕುಸಿತ");
    }
    if (fUpper === "SILENT PATIENT DETERIORATION") {
      return t("Silent Patient Deterioration", "मूक रोगी गिरावट", "ರೋಗಿಯ ಆರೋಗ್ಯ ಕ್ರಮೇಣ ಕುಸಿತ");
    }
    if (fUpper === "IMMEDIATE EMERGENCY MONITOR") {
      return t("Immediate Emergency Monitor", "तत्काल आपातकालीन मॉनिटर", "ತುರ್ತು ಪರಿಸ್ಥಿತಿ ಉಸ್ತುವಾರಿ");
    }
    if (fUpper === "HIDDEN DEGRADATION TRACKER") {
      return t("Hidden Degradation Tracker", "छिपा हुआ गिरावट ट्रैकर", "ಹಿಡನ್ ಡಿಗ್ರಿಡೇಷನ್ ಟ್ರ್ಯಾಕರ್");
    }
    if (fUpper === "RESOURCE & ENVIRONMENT OPTIMIZER") {
      return t("Resource & Environment Optimizer", "संसाधन और पर्यावरण अनुकूलक", "ಸಂಪನ್ಮೂಲ ಮತ್ತು ಪರಿಸರ ಆಪ್ಟಿಮೈಜರ್");
    }
    return field;
  };

  const translateAlertMessage = (message) => {
    if (!message) return "";
    const msg = message.trim();
    if (msg.includes("Power Theft") || msg.includes("diversion") || msg.includes("diversion suspected")) {
      return t(
        "CRITICAL ANOMALY: Power Theft / Grid Integrity Threat Flagged.",
        "गंभीर विसंगति: बिजली चोरी / ग्रिड अखंडता खतरा चिह्नित।",
        "ಗಂಭೀರ ಅಸಂಗತತೆ: ವಿದ್ಯುತ್ ಕಳ್ಳತನ / ಗ್ರಿಡ್ ಸುರಕ್ಷತೆಗೆ ಧಕ್ಕೆ ಕಂಡುಬಂದಿದೆ."
      );
    }
    if (msg.includes("Appliance Load") || msg.includes("Mechanical Failure") || msg.includes("Appliance Fault") || msg.includes("Appliance Load & Mechanical Failure Isolated")) {
      return t(
        "WARNING: Continuous Appliance Load & Mechanical Failure Isolated.",
        "चेतावनी: निरंतर उपकरण लोड और यांत्रिक विफलता अलग की गई।",
        "ಎಚ್ಚರಿಕೆ: ನಿರಂತರ ವಿದ್ಯುತ್ ಉಪಕರಣಗಳ ಬಳಕೆ ಮತ್ತು ಯಾಂತ್ರಿಕ ದೋಷ ಪತ್ತೆಯಾಗಿದೆ."
      );
    }
    if (msg.includes("Peak demand mismatch") || msg.includes("evening load cycle")) {
      return t(
        "OPTIMIZATION NOTICE: Peak demand mismatch / High evening load cycle.",
        "अनुकूलन सूचना: चरम मांग बेमेल / उच्च शाम लोड चक्र।",
        "ಆಪ್ಟಿಮೈಸೇಶನ್ ಸೂಚನೆ: ಗರಿಷ್ಠ ಬೇಡಿಕೆಯ ವ್ಯತ್ಯಾಸ / ಸಂಜೆಯ ಹೆಚ್ಚಿನ ವಿದ್ಯುತ್ ಬಳಕೆ ಕಂಡುಬಂದಿದೆ."
      );
    }
    if (msg.includes("Nominal household telemetry") || msg.includes("GRID METRICS")) {
      return t(
        "GRID METRICS: Nominal household telemetry verified by AI Core.",
        "ग्रिड मेट्रिक्स: एआई कोर द्वारा सत्यापित सामान्य घरेलू टेलीमेट्री।",
        "ಗ್ರಿಡ್ ಮೆಟ್ರಿಕ್ಸ್: ಎಐ ಕೋರ್‌ನಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟ ಸಾಮಾನ್ಯ ವಿದ್ಯುತ್ ಬಳಕೆ ವಿವರ."
      );
    }
    if (msg.includes("Doctor workload") || msg.includes("occupancy")) {
      return t(
        "RESOURCE ALERT: Doctor workload and bed occupancy rates approaching saturation.",
        "संसाधन चेतावनी: डॉक्टरों का कार्यभार और बिस्तरों की संख्या संतृप्ति के करीब है।",
        "ಸಂಪನ್ಮೂಲ ಎಚ್ಚರಿಕೆ: ಸಿಬ್ಬಂದಿ ಕೆಲಸದ ಒತ್ತಡ ಮತ್ತು ಬೆಡ್ ಬಳಕೆ ಗರಿಷ್ಠ ಮಿತಿಯಲ್ಲಿದೆ."
      );
    }
    if (msg.includes("post-discharge") || msg.includes("recovery decline")) {
      return t(
        "WARNING: ICU post-discharge recovery decline pattern identified.",
        "चेतावनी: आईसीयू डिस्चार्ज के बाद रिकवरी में गिरावट का पैटर्न पाया गया।",
        "ಎಚ್ಚರಿಕೆ: ಐಸಿಯು ಡಿಸ್ಚಾರ್ಜ್ ನಂತರದ ಚೇತರಿಕೆ ಕುಸಿತ ಕಂಡುಬಂದಿದೆ."
      );
    }
    if (msg.includes("Silent patient deterioration") || msg.includes("CCU")) {
      return t(
        "CRITICAL MEDICAL: Silent patient deterioration detected in CCU.",
        "गंभीर चिकित्सा: सीसीयू में मूक रोगी की स्थिति बिगड़ने का पता चला।",
        "ಗಂಭೀರ ವೈದ್ಯಕೀಯ: ಸಿಸಿಯು ನಲ್ಲಿ ರೋಗಿಯ ಆರೋಗ್ಯ ತೀವ್ರ ಕುಸಿತ ಕಂಡಿದೆ."
      );
    }
    if (msg.includes("Nominal clinical conditions")) {
      return t(
        "SYSTEM HEALTH: Nominal clinical conditions verified.",
        "सिस्टम स्वास्थ्य: सामान्य नैदानिक स्थिति सत्यापित।",
        "ವ್ಯವಸ್ಥೆಯ ಆರೋಗ್ಯ: ಸಾಮಾನ್ಯ ವೈದ್ಯಕೀಯ ಪರಿಸ್ಥಿತಿಗಳು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿವೆ."
      );
    }
    if (msg.includes("Loss of Cooling Infrastructure") || msg.includes("Complete Loss of Cooling")) {
      return t(
        "CRITICAL EMERGENCY: Complete Loss of Cooling Infrastructure Under Peak Server Load.",
        "गंभीर आपातकाल: पीक सर्वर लोड के तहत शीतलन बुनियादी ढांचे का पूर्ण नुकसान।",
        "ಗಂಭೀರ ತುರ್ತು ಪರಿಸ್ಥಿತಿ: ಗರಿಷ್ಠ ಸರ್ವರ್ ಲೋಡ್ ಅಡಿಯಲ್ಲಿ ಕೂಲಿಂಗ್ ಸಿಸ್ಟಮ್ ಸಂಪೂರ್ಣ ಸ್ಥಗಿತಗೊಂಡಿದೆ."
      );
    }
    if (msg.includes("HVAC Mechanical Inefficiency")) {
      return t(
        "WARNING: HVAC Mechanical Inefficiency & Component Degradation Isolated.",
        "चेतावनी: एचवीएसी यांत्रिक अक्षमता और घटक गिरावट अलग की गई।",
        "ಎಚ್ಚರಿಕೆ: ಎಚ್‌ವಿಎಸಿ ಯಾಂತ್ರಿಕ ದಕ್ಷತೆ ಕೊರತೆ ಮತ್ತು ಘಟಕದ ದೋಷ ಪತ್ತೆಯಾಗಿದೆ."
      );
    }
    if (msg.includes("Static Electricity Risk") || msg.includes("Excessive Continuous Power")) {
      return t(
        "OPTIMIZATION NOTICE: Static Electricity Risk / Excessive Continuous Power Runtime.",
        "अनुकूलन सूचना: स्थैतिक बिजली जोखिम / अत्यधिक निरंतर बिजली रनटाइम।",
        "ಆಪ್ಟಿಮೈಸೇಶನ್ ಸೂಚನೆ: ಸ್ಥಿರ ವಿದ್ಯುತ್ ಅಪಾಯ / ನಿರಂತರ ವಿದ್ಯುತ್ ಚಾಲನೆಯ ಸಮಯ ಹೆಚ್ಚಾಗಿದೆ."
      );
    }
    if (msg.includes("Nominal operating conditions")) {
      return t(
        "SYSTEM HEALTH: Nominal operating conditions verified by AI Core.",
        "सिस्टम स्वास्थ्य: एआई कोर द्वारा सत्यापित सामान्य परिचालन स्थितियां।",
        "ವ್ಯವಸ್ಥೆಯ ಆರೋಗ್ಯ: ಎಐ ಕೋರ್‌ನಿಂದ ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟ ಸಾಮಾನ್ಯ ಕಾರ್ಯಾಚರಣೆಯ ಸ್ಥಿತಿ."
      );
    }
    return message;
  };

  const { user } = useAuth();
  const { alerts, acknowledgeAlert, clearAlert } = useSystem();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active"); // active vs acknowledged
  const [filterType, setFilterType] = useState("all"); // all, critical, warning, success

  // Filter alerts by current sector
  const activeSector = user?.sector || "Industrial Sector";
  const sectorAlerts = alerts.filter(a => a.sector === activeSector);

  // Apply search and status tabs
  const filteredAlerts = sectorAlerts.filter(alert => {
    // 1. Status Filter
    if (alert.status !== activeTab) return false;
    
    // 2. Type Filter
    if (filterType !== "all" && alert.type !== filterType) return false;

    // 3. Search Term
    const searchLower = searchTerm.toLowerCase();
    return (
      alert.idCode.toLowerCase().includes(searchLower) ||
      alert.system.toLowerCase().includes(searchLower) ||
      alert.message.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("Active Anomalies Console (HUD)", "सक्रिय विसंगति कंसोल (HUD)", "ಸಕ್ರಿಯ ಅಸಂಗತತೆ ನಿಯಂತ್ರಣ ಫಲಕ (HUD)")}</h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase">
            <span>{t("Monitored Area: ", "निगरानी क्षेत्र: ", "ಪರಿಶೀಲನಾ ವಲಯ: ")}</span><span className="text-neon-cyan font-bold">{t(activeSector, activeSector === "Hospital Sector" ? "अस्पताल क्षेत्र" : activeSector === "Residential Sector" ? "आवासीय क्षेत्र" : activeSector, activeSector === "Hospital Sector" ? "ಆಸ್ಪತ್ರೆ ವಲಯ" : activeSector === "Residential Sector" ? "ವಸತಿ ವಲಯ" : activeSector)}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {t("Agent synced", "एजेंट समन्वित", "ಏಜೆಂಟ್ ಸಿಂಕ್ ಸಕ್ರಿಯ")}
          </span>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-2 relative flex items-center">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("Search by code, system name, or message description...", "कोड, सिस्टम नाम, या संदेश विवरण द्वारा खोजें...", "ಕೋಡ್, ಸಿಸ್ಟಮ್ ಹೆಸರು ಅಥವಾ ಸಂದೇಶದ ಮೂಲಕ ಹುಡುಕಿ...")}
            className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-2 pl-10 pr-4 text-xs text-gray-200 transition-colors"
          />
        </div>

        {/* Severity filter dropdown */}
        <div className="relative flex items-center">
          <Filter className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg py-2 pl-10 pr-4 text-xs text-gray-400 appearance-none"
          >
            <option value="all" className="bg-[#0f111a] text-gray-300">{t("All Severities", "सभी गंभीरता स्तर", "ಎಲ್ಲಾ ತೀವ್ರತೆಯ ಮಟ್ಟಗಳು")}</option>
            <option value="critical" className="bg-[#0f111a] text-gray-300">{t("Critical Only", "केवल गंभीर", "ಕೇವಲ ತೀವ್ರ ತೊಂದರೆಗಳು")}</option>
            <option value="warning" className="bg-[#0f111a] text-gray-300">{t("Warnings Only", "केवल चेतावनियाँ", "ಕೇವಲ ಎಚ್ಚರಿಕೆಗಳು")}</option>
            <option value="success" className="bg-[#0f111a] text-gray-300">{t("Resolved logs", "सुलझाए गए लॉग", "ಪರಿಹರಿಸಲಾದ ಲಾಗ್‌ಗಳು")}</option>
          </select>
        </div>

        {/* Tab triggers */}
        <div className="grid grid-cols-2 p-1.5 rounded-lg bg-white/5 border border-dark-border">
          <button
            onClick={() => setActiveTab("active")}
            className={`py-1 rounded text-xs font-mono font-bold uppercase transition-all ${
              activeTab === "active" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t("Active", "सक्रिय", "ಸಕ್ರಿಯ")} ({sectorAlerts.filter(a => a.status === "active").length})
          </button>
          <button
            onClick={() => setActiveTab("acknowledged")}
            className={`py-1 rounded text-xs font-mono font-bold uppercase transition-all ${
              activeTab === "acknowledged" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {t("Resolved", "सुलझाए गए", "ಪರಿಹರಿಸಲಾಗಿದೆ")} ({sectorAlerts.filter(a => a.status === "acknowledged").length})
          </button>
        </div>
      </div>

      {/* Alerts list display */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-panel p-10 text-center rounded-xl border border-dark-border flex flex-col items-center justify-center space-y-3"
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-400 shadow-glow-cyan" />
              <h3 className="text-sm font-bold text-gray-200">{t("System State Cleared", "सिस्टम स्थिति सामान्य", "ವ್ಯವಸ್ಥೆ ಸಹಜ ಸ್ಥಿತಿಯಲ್ಲಿದೆ")}</h3>
              <p className="text-xs text-gray-500 font-mono">{t("No alarms matching selected filters were located.", "चयनित फिल्टर से मेल खाने वाला कोई अलार्म नहीं मिला।", "ಆಯ್ಕೆ ಮಾಡಿದ ಫಿಲ್ಟರ್‌ಗೆ ಹೊಂದಿಕೆಯಾಗುವ ಯಾವುದೇ ಎಚ್ಚರಿಕೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.")}</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className={`glass-panel p-5 rounded-xl border flex flex-col sm:flex-row items-start justify-between gap-4 transition-all ${
                  alert.type === "critical" 
                    ? "border-rose-500/20 bg-rose-500/[0.01]" 
                    : alert.type === "warning" 
                      ? "border-amber-500/20 bg-amber-500/[0.01]" 
                      : "border-emerald-500/20 bg-emerald-500/[0.01]"
                }`}
              >
                <div className="flex gap-4 items-start">
                  {/* Status Indicator Icon */}
                  <div className={`p-2.5 rounded-lg border shrink-0 ${
                    alert.type === "critical" 
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/25" 
                      : alert.type === "warning" 
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/25" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>

                  <div>
                    {/* Header */}
                    <div className="flex flex-wrap gap-2.5 items-center mb-1.5">
                      <span className={`font-mono text-xs font-bold tracking-wider ${
                        alert.type === "critical" ? "text-rose-400" : alert.type === "warning" ? "text-amber-400" : "text-emerald-400"
                      }`}>
                        {alert.idCode}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono uppercase bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                        {translateAlertField(alert.system)}
                      </span>
                      <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        alert.type === "critical" 
                          ? "bg-rose-500/15 text-rose-400" 
                          : alert.type === "warning" 
                            ? "bg-amber-500/15 text-amber-400" 
                            : "bg-emerald-500/15 text-emerald-400"
                      }`}>
                        {translateAlertField(alert.type)}
                      </span>
                    </div>

                    {/* Alert Message */}
                    <p className="text-gray-300 text-xs leading-relaxed font-light pr-4">{translateAlertMessage(alert.message)}</p>
                    
                    {/* Timestamp */}
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-500 font-mono mt-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t("Log Time: ", "लॉग समय: ", "ನಮೂದಿಸಿದ ಸಮಯ: ")}{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="sm:text-right shrink-0 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-white/5 flex gap-2 sm:flex-col justify-end">
                  {alert.status === "active" ? (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-4 py-2 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/25 hover:border-transparent rounded-lg text-xs font-bold font-mono tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t("Acknowledge", "स्वीकार करें", "ಸ್ವೀಕರಿಸಿ")}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => clearAlert(alert.id)}
                      className="px-4 py-2 bg-white/5 hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 border border-dark-border hover:border-rose-500/25 rounded-lg text-xs font-bold font-mono tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-1.5 w-full sm:w-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t("Purge Log", "लॉग मिटाएं", "ಲಾಗ್ ಅಳಿಸಿ")}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertsPage;

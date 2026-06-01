import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  Legend
} from "recharts";
import { 
  Cpu, 
  Zap, 
  Activity, 
  ShieldAlert, 
  Thermometer, 
  Gauge, 
  Layers,
  Brain,
  Wrench,
  Users,
  ShieldCheck,
  Heart,
  Layout,
  TrendingUp,
  CheckCircle,
  Plus,
  Trash2,
  HelpCircle,
  HardDrive,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Sliders,
  AlertTriangle,
  Send,
  Database,
  Home,
  MessageSquare,
  Map,
  Sparkles,
  DollarSign,
  Clock,
  LayoutDashboard,
  BrainCircuit,
  FileText,
  Settings as SettingsIcon,
  Search,
  AlertCircle,
  Bell,
  User
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSystem } from "../context/SystemContext";
import GovernmentDashboard from "./GovernmentDashboard";

// Fallback Sequences for BOTH sectors to ensure 100% stable offline/fallback mode
const FALLBACK_ML_ROWS = [
  // 1. Stable Operations (Green Mode)
  {
    timestamp: "12-05-2026 12:00",
    anomaly_category: "Normal Operations",
    anomaly_type: "Stable Base Conditions",
    server_load_kw: 124.5,
    chilled_water_kj: 385.2,
    outdoor_temp_c: 22.4,
    humidity_pct: 42.5,
    hvac_runtime_hr: 4.1,
    airflow_velocity_mps: 2.12,
    power_consumption_kw: 105.8,
    ai_risk_score: 11.2,
    status: "Normal",
    cooling_efficiency: 2.85,
    thermal_stress_index: 12.35,
    airflow_efficiency: 1.15,
    severity_score: 12.4
  },
  {
    timestamp: "12-05-2026 13:00",
    anomaly_category: "Normal Operations",
    anomaly_type: "Stable Base Conditions",
    server_load_kw: 128.2,
    chilled_water_kj: 392.1,
    outdoor_temp_c: 22.8,
    humidity_pct: 43.1,
    hvac_runtime_hr: 4.5,
    airflow_velocity_mps: 2.18,
    power_consumption_kw: 108.4,
    ai_risk_score: 12.5,
    status: "Normal",
    cooling_efficiency: 2.81,
    thermal_stress_index: 12.72,
    airflow_efficiency: 1.12,
    severity_score: 13.1
  },
  // 2. IMMEDIATE EMERGENCY MONITOR (Module 1 - Crimson Mode)
  {
    timestamp: "12-05-2026 14:00",
    anomaly_category: "Immediate Emergency Monitor",
    anomaly_type: "Server Room Overheating",
    server_load_kw: 370.3,
    chilled_water_kj: 0.3, 
    outdoor_temp_c: 38.4, 
    humidity_pct: 55.9,
    hvac_runtime_hr: 23.8,
    airflow_velocity_mps: 2.19,
    power_consumption_kw: 307.2,
    ai_risk_score: 74.0,
    status: "Critical",
    cooling_efficiency: 0.0,
    thermal_stress_index: 42.72,
    airflow_efficiency: 0.59,
    severity_score: 93.0
  },
  {
    timestamp: "12-05-2026 15:00",
    anomaly_category: "Immediate Emergency Monitor",
    anomaly_type: "Sudden Thermal Spike",
    server_load_kw: 334.1,
    chilled_water_kj: 0.0,
    outdoor_temp_c: 39.8,
    humidity_pct: 69.2,
    hvac_runtime_hr: 21.3,
    airflow_velocity_mps: 2.06,
    power_consumption_kw: 237.7,
    ai_risk_score: 85.8,
    status: "Critical",
    cooling_efficiency: 0.0,
    thermal_stress_index: 44.88,
    airflow_efficiency: 0.61,
    severity_score: 102.8
  },
  {
    timestamp: "12-05-2026 16:00",
    anomaly_category: "Immediate Emergency Monitor",
    anomaly_type: "Sudden Thermal Spike",
    server_load_kw: 323.1,
    chilled_water_kj: 0.0,
    outdoor_temp_c: 38.6,
    humidity_pct: 49.5,
    hvac_runtime_hr: 23.2,
    airflow_velocity_mps: 2.56,
    power_consumption_kw: 280.7,
    ai_risk_score: 70.4,
    status: "Critical",
    cooling_efficiency: 0.0,
    thermal_stress_index: 39.97,
    airflow_efficiency: 0.79,
    severity_score: 88.9
  },
  // 3. HIDDEN DEGRADATION TRACKER (Module 2 - Amber Mode)
  {
    timestamp: "13-05-2026 09:00",
    anomaly_category: "Hidden Degradation Tracker",
    anomaly_type: "Cooling Inefficiency",
    server_load_kw: 149.0,
    chilled_water_kj: 330.4,
    outdoor_temp_c: 11.6,
    humidity_pct: 58.2,
    hvac_runtime_hr: 20.9,
    airflow_velocity_mps: 2.36,
    power_consumption_kw: 190.3,
    ai_risk_score: 49.0,
    status: "Warning",
    cooling_efficiency: 2.2,
    thermal_stress_index: 22.41,
    airflow_efficiency: 1.58,
    severity_score: 65.7
  },
  {
    timestamp: "13-05-2026 10:00",
    anomaly_category: "Hidden Degradation Tracker",
    anomaly_type: "Compressor Degradation",
    server_load_kw: 244.0,
    chilled_water_kj: 388.2,
    outdoor_temp_c: 4.8,
    humidity_pct: 43.2,
    hvac_runtime_hr: 21.5,
    airflow_velocity_mps: 2.25,
    power_consumption_kw: 324.7,
    ai_risk_score: 44.7,
    status: "Warning",
    cooling_efficiency: 1.58,
    thermal_stress_index: 19.17,
    airflow_efficiency: 0.92,
    severity_score: 61.9
  },
  {
    timestamp: "13-05-2026 11:00",
    anomaly_category: "Hidden Degradation Tracker",
    anomaly_type: "Predictive Failure",
    server_load_kw: 169.1,
    chilled_water_kj: 316.2,
    outdoor_temp_c: 22.8,
    humidity_pct: 52.0,
    hvac_runtime_hr: 24.0,
    airflow_velocity_mps: 2.19,
    power_consumption_kw: 206.0,
    ai_risk_score: 55.8,
    status: "Warning",
    cooling_efficiency: 1.86,
    thermal_stress_index: 27.44,
    airflow_efficiency: 1.29,
    severity_score: 67.2
  },
  // 4. RESOURCE & ENVIRONMENT OPTIMIZER (Module 3 - Teal Mode)
  {
    timestamp: "14-05-2026 09:00",
    anomaly_category: "Resource & Environment Optimizer",
    anomaly_type: "Energy Consumption Anomaly",
    server_load_kw: 133.8,
    chilled_water_kj: 250.5,
    outdoor_temp_c: 30.4,
    humidity_pct: 51.1,
    hvac_runtime_hr: 18.5,
    airflow_velocity_mps: 1.99,
    power_consumption_kw: 295.3,
    ai_risk_score: 71.3,
    status: "Optimization Alert",
    cooling_efficiency: 1.86,
    thermal_stress_index: 29.88,
    airflow_efficiency: 1.48,
    severity_score: 86.1
  },
  {
    timestamp: "14-05-2026 10:00",
    anomaly_category: "Resource & Environment Optimizer",
    anomaly_type: "Airflow Imbalance",
    server_load_kw: 254.1,
    chilled_water_kj: 408.4,
    outdoor_temp_c: 28.8,
    humidity_pct: 48.5,
    hvac_runtime_hr: 17.5,
    airflow_velocity_mps: 0.51,
    power_consumption_kw: 323.3,
    ai_risk_score: 76.1,
    status: "Optimization Alert",
    cooling_efficiency: 1.6,
    thermal_stress_index: 32.57,
    airflow_efficiency: 0.20,
    severity_score: 90.1
  },
  {
    timestamp: "14-05-2026 11:00",
    anomaly_category: "Resource & Environment Optimizer",
    anomaly_type: "Humidity Instability",
    server_load_kw: 296.6,
    chilled_water_kj: 420.0,
    outdoor_temp_c: 23.5,
    humidity_pct: 72.0,
    hvac_runtime_hr: 18.1,
    airflow_velocity_mps: 3.39,
    power_consumption_kw: 357.4,
    ai_risk_score: 78.5,
    status: "Optimization Alert",
    cooling_efficiency: 1.41,
    thermal_stress_index: 36.04,
    airflow_efficiency: 1.14,
    severity_score: 92.9
  }
];

// Fallback sequence for Residence dataset
const FALLBACK_RESIDENCE_ROWS = [
  // Nominal State (Green)
  {
    Timestamp: "01/01/25 18:00",
    Household_ID: "HH_1068",
    Electricity_Usage_kWh: 8.69,
    Temperature: 35.9,
    Humidity: 57,
    Weather_Condition: "Windy",
    Peak_Load: 0,
    Appliance_Usage: 4,
    Midnight_Usage: 3.11,
    Usage_Pattern: "Normal",
    Sudden_Spike_Flag: 0,
    Continuous_Load_Flag: 0,
    Weather_Mismatch_Flag: 0,
    Anomaly_Type: "None",
    Anomaly_Status: "Normal",
    Predicted_Energy_Usage: 9.46,
    AI_Recommendation: "No action required"
  },
  // Power Theft / Spike (Emergency Crimson Mode)
  {
    Timestamp: "01/01/25 06:00",
    Household_ID: "HH_1027",
    Electricity_Usage_kWh: 17.64,
    Temperature: 20.2,
    Humidity: 36,
    Weather_Condition: "Cloudy",
    Peak_Load: 1,
    Appliance_Usage: 2,
    Midnight_Usage: 4.41,
    Usage_Pattern: "Low Consumption",
    Sudden_Spike_Flag: 0,
    Continuous_Load_Flag: 1,
    Weather_Mismatch_Flag: 0,
    Anomaly_Type: "Power Theft",
    Anomaly_Status: "Critical",
    Predicted_Energy_Usage: 9.78,
    AI_Recommendation: "Dispatch Field Meter Integrity Inspection Team"
  },
  // Appliance Fault (Warning Amber Mode)
  {
    Timestamp: "01/01/25 12:00",
    Household_ID: "HH_1019",
    Electricity_Usage_kWh: 13.8,
    Temperature: 32.6,
    Humidity: 40,
    Weather_Condition: "Windy",
    Peak_Load: 0,
    Appliance_Usage: 9,
    Midnight_Usage: 2.34,
    Usage_Pattern: "Low Consumption",
    Sudden_Spike_Flag: 0,
    Continuous_Load_Flag: 1,
    Weather_Mismatch_Flag: 0,
    Anomaly_Type: "Appliance Fault",
    Anomaly_Status: "Warning",
    Predicted_Energy_Usage: 14.25,
    AI_Recommendation: "Issue Automated Homeowner Diagnostic Warning"
  },
  // Energy Consumption Anomaly / Weather Mismatch (Teal Mode)
  {
    Timestamp: "01/01/25 21:00",
    Household_ID: "HH_1109",
    Electricity_Usage_kWh: 11.74,
    Temperature: 32.3,
    Humidity: 54,
    Weather_Condition: "Stormy",
    Peak_Load: 1,
    Appliance_Usage: 10,
    Midnight_Usage: 1.58,
    Usage_Pattern: "Low Consumption",
    Sudden_Spike_Flag: 0,
    Continuous_Load_Flag: 0,
    Weather_Mismatch_Flag: 1,
    Anomaly_Type: "Unexpected Spike",
    Anomaly_Status: "Warning",
    Predicted_Energy_Usage: 10.95,
    AI_Recommendation: "Enable Household Peak-Shaving Battery Discharge"
  }
];

// Fallback sequence for Hospital dataset
const FALLBACK_HOSPITAL_ROWS = [
  {
    patient_id: "P001",
    patient_name: "Melissa Sexton",
    age: "23",
    gender: "Female",
    chronic_disease: "Unknown",
    icu_history: "No",
    previous_admissions: "4",
    hospital_stay_days: "21",
    medications_count: "8",
    emergency_visits: "2",
    treatment_complexity: "Low",
    recovery_status: "Critical",
    doctor_workload: "34",
    bed_occupancy_percent: "70",
    appointment_conflicts: "1",
    billing_amount: "26997",
    readmission_risk: "Low",
    deterioration_score: "94",
    detected_anomaly: "Silent Patient Deterioration",
    record_date: "12/12/25",
    combined_risk_score: "16",
    anomaly_flag: "1"
  },
  {
    patient_id: "P002",
    patient_name: "Joseph Lopez",
    age: "36",
    gender: "Female",
    chronic_disease: "Hypertension",
    icu_history: "Yes",
    previous_admissions: "4",
    hospital_stay_days: "1",
    medications_count: "1",
    emergency_visits: "5",
    treatment_complexity: "Medium",
    recovery_status: "Stable",
    doctor_workload: "28",
    bed_occupancy_percent: "54",
    appointment_conflicts: "5",
    billing_amount: "16643",
    readmission_risk: "High",
    deterioration_score: "60",
    detected_anomaly: "Recovery Degradation Pattern",
    record_date: "21/01/26",
    combined_risk_score: "13.67",
    anomaly_flag: "0"
  },
  {
    patient_id: "P005",
    patient_name: "Megan Strickland",
    age: "40",
    gender: "Male",
    chronic_disease: "Hypertension",
    icu_history: "No",
    previous_admissions: "0",
    hospital_stay_days: "11",
    medications_count: "10",
    emergency_visits: "3",
    treatment_complexity: "Low",
    recovery_status: "Critical",
    doctor_workload: "60",
    bed_occupancy_percent: "49",
    appointment_conflicts: "0",
    billing_amount: "29853",
    readmission_risk: "Medium",
    deterioration_score: "64",
    detected_anomaly: "Hospital Resource Overload",
    record_date: "11/12/25",
    combined_risk_score: "17",
    anomaly_flag: "1"
  },
  {
    patient_id: "P004",
    patient_name: "Paul Oconnor",
    age: "35",
    gender: "Male",
    chronic_disease: "Hypertension",
    icu_history: "No",
    previous_admissions: "5",
    hospital_stay_days: "12",
    medications_count: "4",
    emergency_visits: "4",
    treatment_complexity: "Medium",
    recovery_status: "Critical",
    doctor_workload: "28",
    bed_occupancy_percent: "97",
    appointment_conflicts: "5",
    billing_amount: "18127",
    readmission_risk: "Medium",
    deterioration_score: "77",
    detected_anomaly: "Silent Patient Deterioration",
    record_date: "20/12/25",
    combined_risk_score: "17.33",
    anomaly_flag: "1"
  }
];

// Fallback sequence for Industrial dataset (Worker Safety)
const FALLBACK_INDUSTRIAL_ROWS = [
  // Normal State (Green)
  {
    worker_id: "W001",
    datetime: "2026-01-01 08:15:00",
    shift_hours: "2.5",
    break_gap_min: "15",
    x: "-32", y: "-62", z: "-20",
    eda: "6.65",
    hr: "74.08",
    temp: "36.88",
    fatigue_score: "1.35",
    blink_rate_pm: "18",
    activity_score: "86",
    accel_impact_g: "0.11",
    body_angle_deg: "87",
    motion_detected: "1",
    helmet: "1",
    vest: "1",
    zone_authorized: "1",
    overall_risk_score: "8.4",
    actual_anomaly_label: "Normal"
  },
  // PPE Violation (Crimson)
  {
    worker_id: "W002",
    datetime: "2026-01-01 10:30:00",
    shift_hours: "4.5",
    break_gap_min: "0",
    x: "-69", y: "-40", z: "33",
    eda: "6.52",
    hr: "75.30",
    temp: "36.75",
    fatigue_score: "2.78",
    blink_rate_pm: "17",
    activity_score: "83",
    accel_impact_g: "0.19",
    body_angle_deg: "87",
    motion_detected: "1",
    helmet: "0",
    vest: "1",
    zone_authorized: "1",
    overall_risk_score: "58.0",
    actual_anomaly_label: "PPE_Violation"
  },
  // Heat Stress (Amber)
  {
    worker_id: "W003",
    datetime: "2026-01-01 12:00:00",
    shift_hours: "5.5",
    break_gap_min: "10",
    x: "-61", y: "-44", z: "-29",
    eda: "6.53",
    hr: "122.50",
    temp: "38.92",
    fatigue_score: "3.26",
    blink_rate_pm: "16",
    activity_score: "79",
    accel_impact_g: "0.23",
    body_angle_deg: "86",
    motion_detected: "1",
    helmet: "1",
    vest: "1",
    zone_authorized: "1",
    overall_risk_score: "68.0",
    actual_anomaly_label: "Heat_Stress"
  },
  // Worker Fatigue (Amber)
  {
    worker_id: "W004",
    datetime: "2026-01-01 14:30:00",
    shift_hours: "8.5",
    break_gap_min: "5",
    x: "-34", y: "-45", z: "15",
    eda: "6.63",
    hr: "76.31",
    temp: "36.92",
    fatigue_score: "3.54",
    blink_rate_pm: "15",
    activity_score: "77",
    accel_impact_g: "0.18",
    body_angle_deg: "87",
    motion_detected: "1",
    helmet: "1",
    vest: "1",
    zone_authorized: "1",
    overall_risk_score: "44.4",
    actual_anomaly_label: "Worker_Fatigue"
  },
  // Fall Detected (Crimson)
  {
    worker_id: "W005",
    datetime: "2026-01-01 16:45:00",
    shift_hours: "6.25",
    break_gap_min: "0",
    x: "-2", y: "-78", z: "-47",
    eda: "6.54",
    hr: "72.88",
    temp: "36.89",
    fatigue_score: "3.91",
    blink_rate_pm: "15",
    activity_score: "76",
    accel_impact_g: "3.24",
    body_angle_deg: "88",
    motion_detected: "0",
    helmet: "1",
    vest: "1",
    zone_authorized: "1",
    overall_risk_score: "86.0",
    actual_anomaly_label: "Fall_Detected"
  },
  // Worker Collapse (Crimson)
  {
    worker_id: "W006",
    datetime: "2026-01-01 18:30:00",
    shift_hours: "9.25",
    break_gap_min: "0",
    x: "-41", y: "-71", z: "0",
    eda: "6.55",
    hr: "48.20",
    temp: "36.79",
    fatigue_score: "4.36",
    blink_rate_pm: "14",
    activity_score: "61",
    accel_impact_g: "0.26",
    body_angle_deg: "95",
    motion_detected: "0",
    helmet: "1",
    vest: "1",
    zone_authorized: "1",
    overall_risk_score: "99.0",
    actual_anomaly_label: "Worker_Collapse"
  }
];

const UserDashboard = () => {
  const { user } = useAuth();
  const { metrics, alerts, acknowledgeAlert, devices, addDevice, deleteDevice, triggerManualAlert, updateSectorMetrics } = useSystem();
  
  // Get active sector metrics
  const activeSector = user?.sector || "Industrial Sector";
  const sectorDevices = devices ? devices.filter(d => d.sector === activeSector) : [];
  const activeSectorAlerts = alerts ? alerts.filter(a => a.sector === activeSector) : [];
  const isInstitutional = activeSector === "Institutional Sector";
  const isResidential = activeSector === "Residential Sector";
  const isHospital = activeSector === "Hospital Sector";
  const isGovernment = activeSector === "Government Sector";

  // Industrial Sector Specific States
  const [industrialDomain, setIndustrialDomain] = useState("electrical"); // electrical, safety
  const [industrialRows, setIndustrialRows] = useState([]);
  const [activeWorkerSafetyChartTab, setActiveWorkerSafetyChartTab] = useState("health"); // health, ppe, heat, fatigue
  const [selectedWorkerId, setSelectedWorkerId] = useState("W001");
  const [isLubricationTriggered, setIsLubricationTriggered] = useState(false);
  const [isSealCalibrationTriggered, setIsSealCalibrationTriggered] = useState(false);
  const [isCoolingMaintenanceTriggered, setIsCoolingMaintenanceTriggered] = useState(false);
  const [isSafetyRestScheduled, setIsSafetyRestScheduled] = useState(false);
  const [isHydrationProtocolActive, setIsHydrationProtocolActive] = useState(false);
  const [isRestZoneLocked, setIsRestZoneLocked] = useState(false);
  const [industrialChatMessages, setIndustrialChatMessages] = useState([
    { sender: "ai", text: "System ready. I am your Industrial & Worker Safety AI Assistant. How can I help you today?", text_hi: "सिस्टम तैयार है। मैं आपका औद्योगिक और श्रमिक सुरक्षा एआई सहायक हूं। आज मैं आपकी क्या मदद कर सकता हूं?", text_kn: "ಸಿಸ್ಟಮ್ ಸಿದ್ಧವಾಗಿದೆ. ನಾನು ನಿಮ್ಮ ಕೈಗಾರಿಕಾ ಮತ್ತು ಕಾರ್ಮಿಕ ಸುರಕ್ಷತೆ ಎಐ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" }
  ]);

  const isIndustrialSafety = activeSector === "Industrial Sector" && industrialDomain === "safety";
  const isMLActive = isInstitutional || isResidential || isHospital || isIndustrialSafety;

  // Hospital Sector Specific States
  const [activeHospitalTab, setActiveHospitalTab] = useState("dashboard");
  const [hospitalRows, setHospitalRows] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState("P001");
  const [isMedicalReviewTriggered, setIsMedicalReviewTriggered] = useState(false);
  const [isIcuEscalationTriggered, setIsIcuEscalationTriggered] = useState(false);
  const [isResourceAllocationOptimized, setIsResourceAllocationOptimized] = useState(false);
  const [isFollowUpScheduled, setIsFollowUpScheduled] = useState(false);
  const [hospitalChatMessages, setHospitalChatMessages] = useState([
    { sender: "ai", text: "System ready. I am your Hospital Clinical AI Assistant. How can I help you today?", text_hi: "सिस्टम तैयार है। मैं आपका अस्पताल नैदानिक एआई सहायक हूं। आज मैं आपकी क्या मदद कर सकता हूं?", text_kn: "ಸಿಸ್ಟಮ್ ಸಿದ್ಧವಾಗಿದೆ. ನಾನು ನಿಮ್ಮ ಆಸ್ಪತ್ರೆ ವೈದ್ಯಕೀಯ ಎಐ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" }
  ]);

  // Residential Sector Specific States
  const [activeResTab, setActiveResTab] = useState("dashboard");
  const [resLanguage, setResLanguage] = useState(() => localStorage.getItem("resLanguage") || "en"); // en, hi, kn
  const [activeAnomalySubTab, setActiveAnomalySubTab] = useState("table");

  // Cyberpunk theme configurations based on active sector
  const themeBorderGlow = activeSector === "Industrial Sector" && industrialDomain === "safety"
    ? "border-rose-500/30 shadow-glow-rose"
    : "border-neon-cyan/30 shadow-glow-cyan";
    
  const themeText = activeSector === "Industrial Sector" && industrialDomain === "safety"
    ? "text-rose-400"
    : "text-neon-cyan";
    
  const boardThemeBorder = activeSector === "Industrial Sector" && industrialDomain === "safety"
    ? "border-rose-500/20"
    : "border-neon-cyan/20";

  const themeAccent = activeSector === "Industrial Sector" && industrialDomain === "safety"
    ? "text-rose-400"
    : "text-neon-cyan";

  useEffect(() => {
    localStorage.setItem("resLanguage", resLanguage);
    // Dispatch a custom event to notify other components of the language change in real time
    window.dispatchEvent(new Event("languageChange"));
  }, [resLanguage]);

  const t = (en, hi, kn) => {
    if (resLanguage === "hi") return hi;
    if (resLanguage === "kn") return kn;
    return en;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b1020]/90 border border-white/10 p-2.5 rounded-lg shadow-glass font-mono text-[10px] backdrop-blur-md">
          <p className="text-gray-400 font-bold mb-1 border-b border-white/5 pb-1">{label}</p>
          <div className="space-y-1">
            {payload.map((p, idx) => (
              <p key={idx} style={{ color: p.color || p.stroke }} className="font-semibold">
                {t(p.name, p.name, p.name)}: <span className="text-gray-100 font-bold">{p.value}</span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
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
      return t("Immediate Emergency Monitor", "तत्काल आपातकालीन मॉनिटर", "ತುರ್ತು ಪರಿಸ್ถಿತಿ ಉಸ್ತುವಾರಿ");
    }
    if (fUpper === "HIDDEN DEGRADATION TRACKER") {
      return t("Hidden Degradation Tracker", "छिपा हुआ गिरावट ट्रैकर", "ಹಿಡನ್ ಡಿಗ್ರಿಡೇಷನ್ ಟ್ರ್ಯಾಕರ್");
    }
    if (fUpper === "RESOURCE & ENVIRONMENT OPTIMIZER") {
      return t("Resource & Environment Optimizer", "संसाधन और पर्यावरण अनुकूलक", "ಸಂಪನ್ಮೂಲ ಮತ್ತು ಪರಿಸರ ಆಪ್ಟಿಮೈಜರ್");
    }
    if (fUpper === "PPE_VIOLATION") {
      return t("PPE Violation", "पीपीई उल्लंघन", "ಪಿಪಿಇ ಉಲ್ಲಂಘನೆ");
    }
    if (fUpper === "UNAUTHORIZED_ACCESS") {
      return t("Unauthorized Access", "अनधिकृत प्रवेश", "ಅನಧಿಕೃತ ಪ್ರವೇಶ");
    }
    if (fUpper === "HEAT_STRESS") {
      return t("Heat Stress", "हीट स्ट्रेस", "ಹೀಟ್ ಸ್ಟ್ರೆಸ್");
    }
    if (fUpper === "WORKER_FATIGUE") {
      return t("Worker Fatigue", "कर्मचारी थकान", "ಕಾರ್ಮಿಕರ ದಣಿವು");
    }
    if (fUpper === "FALL_DETECTED") {
      return t("Fall Detected", "गिरावट का पता चला", "ಕಾರ್ಮಿಕ ಬಿದ್ದಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ");
    }
    if (fUpper === "WORKER_COLLAPSE") {
      return t("Worker Collapse", "कर्मचारी पतन", "ಕಾರ್ಮಿಕ ಕುಸಿದಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ");
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
    if (msg.includes("CRITICAL PPE VIOLATION")) {
      return t(
        "CRITICAL PPE VIOLATION: Worker entered hazardous area without required PPE.",
        "गंभीर पीपीई उल्लंघन: कर्मचारी आवश्यक पीपीई के बिना खतरनाक क्षेत्र में प्रवेश कर गया।",
        "ಗಂಭೀರ ಪಿಪಿಇ ಉಲ್ಲಂಘನೆ: ಕಾರ್ಮಿಕ ಅಗತ್ಯ ಪಿಪಿಇ ಧರಿಸದೆ ಅಪಾಯಕಾರಿ ವಲಯ ಪ್ರವೇಶಿಸಿದ್ದಾನೆ."
      );
    }
    if (msg.includes("UNAUTHORIZED ACCESS DETECTED")) {
      return t(
        "UNAUTHORIZED ACCESS DETECTED: Worker entered restricted industrial zone.",
        "अनधिकृत प्रवेश पाया गया: कर्मचारी ने प्रतिबंधित औद्योगिक क्षेत्र में प्रवेश किया।",
        "ಅನಧಿಕೃತ ಪ್ರವೇಶ ಪತ್ತೆಯಾಗಿದೆ: ಕಾರ್ಮಿಕ ನಿರ್ಬಂಧಿತ ಕೈಗಾರಿಕಾ ವಲಯ ಪ್ರವೇಶಿಸಿದ್ದಾನೆ."
      );
    }
    if (msg.includes("HEAT STRESS ALERT")) {
      return t(
        "HEAT STRESS ALERT: Worker exceeded safe physiological thresholds.",
        "हीट स्ट्रेस चेतावनी: कर्मचारी सुरक्षित शारीरिक सीमा से अधिक हो गया।",
        "ಹೀಟ್ ಸ್ಟ್ರೆಸ್ ಎಚ್ಚರಿಕೆ: ಕಾರ್ಮಿಕರ ದೇಹದ ತಾಪಮಾನ ಸುರಕ್ಷಿತ ಮಿತಿ ಮೀರಿದೆ."
      );
    }
    if (msg.includes("FATIGUE WARNING")) {
      return t(
        "FATIGUE WARNING: Worker fatigue entered high-risk zone.",
        "थकान की चेतावनी: कर्मचारी की थकान उच्च जोखिम वाले क्षेत्र में पहुंच गई।",
        "ದಣಿವು ಎಚ್ಚರಿಕೆ: ಕಾರ್ಮಿಕರ ದಣಿವು ಗರಿಷ್ಠ ಅಪಾಯದ ಮಟ್ಟದಲ್ಲಿದೆ."
      );
    }
    if (msg.includes("FALL DETECTED")) {
      return t(
        "FALL DETECTED: Worker collapsed near production area.",
        "गिरावट का पता चला: कर्मचारी उत्पादन क्षेत्र के पास गिर गया।",
        "ಕಾರ್ಮಿಕ ಬಿದ್ದಿರುವುದು ಪತ್ತೆಯಾಗಿದೆ: ಕಾರ್ಮಿಕ ಉತ್ಪಾದನಾ ವಲಯದ ಬಳಿ ಬಿದ್ದಿದ್ದಾನೆ."
      );
    }
    if (msg.includes("CRITICAL COLLAPSE EVENT")) {
      return t(
        "CRITICAL COLLAPSE EVENT: Worker unresponsive for extended duration.",
        "गंभीर पतन घटना: कर्मचारी लंबी अवधि से अनुत्तरदायी है।",
        "ಗಂಭೀರ ಕುಸಿತದ ಘಟನೆ: ಕಾರ್ಮಿಕ ದೀರ್ಘಕಾಲದವರೆಗೆ ಯಾವುದೇ ಪ್ರತಿಕ್ರಿಯೆ ನೀಡುತ್ತಿಲ್ಲ."
      );
    }
    return message;
  };

  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "System ready. I am your Residential Energy AI Assistant. How can I help you today?", text_hi: "सिस्टम तैयार है। मैं आपका आवासीय ऊर्जा एआई सहायक हूं। आज मैं आपकी क्या मदद कर सकता हूं?", text_kn: "ಸಿಸ್ಟಮ್ ಸಿದ್ಧವಾಗಿದೆ. ನಾನು ನಿಮ್ಮ ವಸತಿ ವಿದ್ಯುತ್ ಎಐ ಸಹಾಯಕ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?" }
  ]);
  const [userQuery, setUserQuery] = useState("");
  const [reportProgress, setReportProgress] = useState(-1); // -1: inactive, 0-100: processing
  const [reportType, setReportType] = useState(""); // pdf, excel
  const [selectedApartment, setSelectedApartment] = useState("HH_1027");
  const [isInspectionTriggered, setIsInspectionTriggered] = useState(false);
  const [isLoadBalanced, setIsLoadBalanced] = useState(false);
  const [isLoadReduced, setIsLoadReduced] = useState(false);
  const [isMaintenanceScheduled, setIsMaintenanceScheduled] = useState(false);
  const [isEcoOptimized, setIsEcoOptimized] = useState(false);

  // Sector Predictions Fallbacks for Non-ML Active Sectors (e.g., Industrial/Hospital)
  const getPredictions = () => {
    if (activeSector === "Industrial Sector") {
      return [
        { component: "Cooling Comp 3B", risk: 85, time: "36 hrs", reason: "Sustained temperature variance", action: "Calibrate throttle" },
        { component: "Conveyor Engine #2", risk: 52, time: "5 days", reason: "Vibration frequency spike", action: "Inspect bearings" }
      ];
    } else if (activeSector === "Residential Sector") {
      return [
        { component: "Main Power Sub-Station 4", risk: 78, time: "18 hrs", reason: "Voltage leak detected in grid line", action: "Isolate capacitor banks" },
        { component: "Community Battery Bank C", risk: 41, time: "8 days", reason: "Cell temperature imbalance", action: "Run thermal cooling cycle" }
      ];
    } else if (activeSector === "Hospital Sector") {
      return [
        { component: "Emergency Ward Vent intake", risk: 64, time: "48 hrs", reason: "Air filter particulate density", action: "Perform immediate filter swap" },
        { component: "Critical ICU Generator B", risk: 45, time: "11 days", reason: "Auxiliary battery fluid degradation", action: "Top up coolant reservoir" }
      ];
    } else {
      return [
        { component: "HVAC Zone 4 Intake", risk: 70, time: "48 hrs", reason: "Air compressor load coefficient", action: "Swap filter grid" },
        { component: "Building B Server Node", risk: 38, time: "14 days", reason: "Auxiliary power supply degradation", action: "Check battery cells" }
      ];
    }
  };

  const predictions = getPredictions();

  // Form states for registering a new device
  const [newDevName, setNewDevName] = useState("");
  const [newDevModel, setNewDevModel] = useState("");
  const [newDevSystem, setNewDevSystem] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Recharts color palette
  const COLORS = ["#00f0ff", "#0072ff", "#10b981", "#ef4444"];

  // ==========================================
  // TRAINED ML MODEL TELEMETRY STREAM STATES
  // ==========================================
  const [mlRows, setMlRows] = useState(FALLBACK_ML_ROWS);
  const [resRows, setResRows] = useState(FALLBACK_RESIDENCE_ROWS);
  const [streamIndex, setStreamIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(5000); 
  const [testModule, setTestModule] = useState("auto"); // auto, emergency, degradation, optimizer
  const [mlHistory, setMlHistory] = useState([]);
  const [inferenceLatency, setInferenceLatency] = useState(8.4);
  const [appliedAction, setAppliedAction] = useState(""); 

  // Fetch university.csv and residence.csv from public folder on mount
  useEffect(() => {
    if (!isMLActive) return;

    if (isInstitutional) {
      fetch("/university.csv")
        .then(res => {
          if (!res.ok) throw new Error("File not found");
          return res.text();
        })
        .then(csvText => {
          const lines = csvText.split("\n");
          const headers = lines[0].split(",");
          const rows = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(",");
            const row = {};
            headers.forEach((header, idx) => {
              row[header.trim()] = values[idx] ? values[idx].trim() : "";
            });
            rows.push(row);
          }
          if (rows.length > 0) {
            const parsed = rows.map(r => ({
              timestamp: r.timestamp,
              anomaly_category: r.anomaly_category,
              anomaly_type: r.anomaly_type,
              server_load_kw: parseFloat(r.server_load_kw) || 0,
              chilled_water_kj: parseFloat(r.chilled_water_kj) || 0,
              outdoor_temp_c: parseFloat(r.outdoor_temp_c) || 0,
              humidity_pct: parseFloat(r.humidity_pct) || 0,
              hvac_runtime_hr: parseFloat(r.hvac_runtime_hr) || 0,
              airflow_velocity_mps: parseFloat(r.airflow_velocity_mps) || 0,
              power_consumption_kw: parseFloat(r.power_consumption_kw) || 0,
              ai_risk_score: parseFloat(r.ai_risk_score) || 0,
              status: r.status,
              cooling_efficiency: parseFloat(r.cooling_efficiency) || 0,
              thermal_stress_index: parseFloat(r.thermal_stress_index) || 0,
              airflow_efficiency: parseFloat(r.airflow_efficiency) || 0,
              severity_score: parseFloat(r.severity_score) || 0
            }));
            setMlRows(parsed);
          }
        })
        .catch(err => console.warn("Using fallback ML telemetry sequence."));
    }

    if (isResidential) {
      fetch("/residence.csv")
        .then(res => {
          if (!res.ok) throw new Error("File not found");
          return res.text();
        })
        .then(csvText => {
          const lines = csvText.split("\n");
          const headers = lines[0].split(",");
          const rows = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(",");
            const row = {};
            headers.forEach((header, idx) => {
              row[header.trim()] = values[idx] ? values[idx].trim() : "";
            });
            rows.push(row);
          }
          if (rows.length > 0) {
            setResRows(rows);
          }
        })
        .catch(err => console.warn("Using fallback Residence telemetry sequence."));
    }

    if (isHospital) {
      fetch("/hospital.csv")
        .then(res => {
          if (!res.ok) throw new Error("File not found");
          return res.text();
        })
        .then(csvText => {
          const lines = csvText.split("\n");
          const headers = lines[0].split(",");
          const rows = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(",");
            const row = {};
            headers.forEach((header, idx) => {
              row[header.trim()] = values[idx] ? values[idx].trim() : "";
            });
            rows.push(row);
          }
          if (rows.length > 0) {
            setHospitalRows(rows);
          }
        })
        .catch(err => console.warn("Using fallback Hospital telemetry sequence."));
    }

    if (activeSector === "Industrial Sector" && industrialDomain === "safety") {
      fetch("/industrial.csv")
        .then(res => {
          if (!res.ok) throw new Error("File not found");
          return res.text();
        })
        .then(csvText => {
          const lines = csvText.split("\n");
          const headers = lines[0].split(",");
          const rows = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = lines[i].split(",");
            const row = {};
            headers.forEach((header, idx) => {
              row[header.trim()] = values[idx] ? values[idx].trim() : "";
            });
            rows.push(row);
          }
          if (rows.length > 0) {
            setIndustrialRows(rows);
          }
        })
        .catch(err => console.warn("Using fallback Industrial telemetry sequence."));
    }
  }, [activeSector, industrialDomain]);

  // Construct active rows sequence based on selected Test Module
  const getActiveRowsSequence = () => {
    if (isInstitutional) {
      if (testModule === "emergency") {
        return [FALLBACK_ML_ROWS[0], FALLBACK_ML_ROWS[1], FALLBACK_ML_ROWS[2], FALLBACK_ML_ROWS[3], FALLBACK_ML_ROWS[4]];
      } else if (testModule === "degradation") {
        return [FALLBACK_ML_ROWS[5], FALLBACK_ML_ROWS[6], FALLBACK_ML_ROWS[7]];
      } else if (testModule === "optimizer") {
        return [FALLBACK_ML_ROWS[8], FALLBACK_ML_ROWS[9], FALLBACK_ML_ROWS[10]];
      }
      return mlRows;
    }

    if (isResidential) {
      if (testModule === "emergency") {
        return [FALLBACK_RESIDENCE_ROWS[0], FALLBACK_RESIDENCE_ROWS[1]];
      } else if (testModule === "degradation") {
        return [FALLBACK_RESIDENCE_ROWS[2]];
      } else if (testModule === "optimizer") {
        return [FALLBACK_RESIDENCE_ROWS[3]];
      }
      return resRows;
    }

    if (isHospital) {
      const activeRows = hospitalRows.length > 0 ? hospitalRows : FALLBACK_HOSPITAL_ROWS;
      if (testModule === "emergency") {
        const filtered = activeRows.filter(r => r.detected_anomaly === "Silent Patient Deterioration");
        return filtered.length > 0 ? filtered : [FALLBACK_HOSPITAL_ROWS[0], FALLBACK_HOSPITAL_ROWS[3]];
      } else if (testModule === "degradation") {
        const filtered = activeRows.filter(r => r.detected_anomaly === "Recovery Degradation Pattern");
        return filtered.length > 0 ? filtered : [FALLBACK_HOSPITAL_ROWS[1]];
      } else if (testModule === "optimizer") {
        const filtered = activeRows.filter(r => r.detected_anomaly === "Hospital Resource Overload");
        return filtered.length > 0 ? filtered : [FALLBACK_HOSPITAL_ROWS[2]];
      }
      return activeRows;
    }

    if (activeSector === "Industrial Sector" && industrialDomain === "safety") {
      const activeRows = industrialRows.length > 0 ? industrialRows : FALLBACK_INDUSTRIAL_ROWS;
      if (testModule === "emergency") {
        const filtered = activeRows.filter(r => r.actual_anomaly_label === "Fall_Detected" || r.actual_anomaly_label === "Worker_Collapse" || r.actual_anomaly_label === "PPE_Violation");
        return filtered.length > 0 ? filtered : [FALLBACK_INDUSTRIAL_ROWS[1], FALLBACK_INDUSTRIAL_ROWS[4], FALLBACK_INDUSTRIAL_ROWS[5]];
      } else if (testModule === "degradation") {
        const filtered = activeRows.filter(r => r.actual_anomaly_label === "Worker_Fatigue" || r.actual_anomaly_label === "Heat_Stress");
        return filtered.length > 0 ? filtered : [FALLBACK_INDUSTRIAL_ROWS[2], FALLBACK_INDUSTRIAL_ROWS[3]];
      } else if (testModule === "optimizer") {
        const filtered = activeRows.filter(r => r.actual_anomaly_label === "Normal");
        return filtered.length > 0 ? filtered : [FALLBACK_INDUSTRIAL_ROWS[0]];
      }
      return activeRows;
    }

    return FALLBACK_ML_ROWS;
  };

  const activeSequence = getActiveRowsSequence();
  const currentRawRow = activeSequence[streamIndex % activeSequence.length] || (isResidential ? FALLBACK_RESIDENCE_ROWS[0] : (isHospital ? FALLBACK_HOSPITAL_ROWS[0] : (activeSector === "Industrial Sector" && industrialDomain === "safety" ? FALLBACK_INDUSTRIAL_ROWS[0] : FALLBACK_ML_ROWS[0])));

  // JS Replica model predictions
  const predictTrainedModel = (rawRow) => {
    if (!rawRow) return null;

    // INSTITUTIONAL SECTOR PIPELINE
    if (isInstitutional) {
      const server_load = parseFloat(rawRow.server_load_kw) || 0;
      const chilled_water = parseFloat(rawRow.chilled_water_kj) || 0;
      const outdoor_temp = parseFloat(rawRow.outdoor_temp_c) || 0;
      const humidity = parseFloat(rawRow.humidity_pct) || 0;
      const hvac_runtime = parseFloat(rawRow.hvac_runtime_hr) || 0;
      const airflow_velocity = parseFloat(rawRow.airflow_velocity_mps) || 0;
      const power_consumption = parseFloat(rawRow.power_consumption_kw) || 0;
      const cooling_eff = parseFloat(rawRow.cooling_efficiency) || 0;
      const thermal_stress = parseFloat(rawRow.thermal_stress_index) || 0;
      const airflow_eff = parseFloat(rawRow.airflow_efficiency) || 0;

      const overloadProb = Math.min(100, Math.max(5, Math.round((server_load / 400) * 35 + (power_consumption / 450) * 65)));
      const hvacDegradation = Math.min(100, Math.max(8, Math.round((hvac_runtime / 24) * 45 + (1 - cooling_eff / 3) * 55)));
      const thermalRisk = Math.min(100, Math.max(10, Math.round((outdoor_temp / 45) * 30 + (thermal_stress / 50) * 50 + (chilled_water < 10 ? 20 : 0))));

      let status = rawRow.status || "Normal";
      let category = rawRow.anomaly_category || "Normal Operations";
      let type = rawRow.anomaly_type || "Stable Base Conditions";
      let confidence = 98.4;
      let mode = "green"; 
      let aiPrediction = "All monitored environmental subsystems are running within baseline boundaries.";
      let aiAlert = "SYSTEM HEALTH: Nominal operating conditions verified by AI Core.";
      let recommendations = ["No action required. Continuous monitoring active."];

      if (category === "Immediate Emergency Monitor" || status === "Critical") {
        status = "Critical"; mode = "crimson"; confidence = 99.2;
        aiPrediction = "Predictive thermal models calculate that server room temperature will exceed 35°C within 14 minutes.";
        aiAlert = "CRITICAL EMERGENCY: Complete Loss of Cooling Infrastructure Under Peak Server Load.";
        recommendations = ["Trigger Automated Workload Cloud Migration"];
      } else if (category === "Hidden Degradation Tracker" || status === "Warning") {
        status = "Warning"; mode = "amber"; confidence = 96.5;
        aiPrediction = `Long-term efficiency metrics indicate an ${hvacDegradation}% Compressor Failure Probability within 5 Days.`;
        aiAlert = "WARNING: HVAC Mechanical Inefficiency & Component Degradation Isolated.";
        recommendations = ["Generate Facilities Maintenance Dispatch Ticket"];
      } else if (category === "Resource & Environment Optimizer" || status === "Optimization Alert") {
        status = "Optimization Alert"; mode = "teal"; confidence = 94.8;
        aiPrediction = "Localized hotspot risk detected in Server Rack Row G due to airflow imbalance.";
        aiAlert = "OPTIMIZATION NOTICE: Static Electricity Risk / Excessive Continuous Power Runtime.";
        recommendations = ["Enable Smart Cooling Optimization", "Adjust Airflow Velocity Profiles"];
      }

      return {
        server_load, chilled_water, outdoor_temp, humidity, hvac_runtime, airflow_velocity, power_consumption, cooling_eff, thermal_stress, airflow_eff,
        overloadProb, hvacDegradation, thermalRisk,
        severity: Math.round(parseFloat(rawRow.severity_score) || 12),
        riskScore: Math.round(parseFloat(rawRow.ai_risk_score) || 12),
        status, category, type, confidence, mode, aiPrediction, aiAlert, recommendations
      };
    }

    // RESIDENTIAL SECTOR PIPELINE (residence.csv)
    if (isResidential) {
      const elec_usage = parseFloat(rawRow.Electricity_Usage_kWh) || 0;
      const temp = parseFloat(rawRow.Temperature) || 0;
      const humidity = parseFloat(rawRow.Humidity) || 0;
      const peak_load = parseInt(rawRow.Peak_Load) || 0;
      const appliance_usage = parseInt(rawRow.Appliance_Usage) || 0;
      const midnight_usage = parseFloat(rawRow.Midnight_Usage) || 0;
      const spike_flag = parseInt(rawRow.Sudden_Spike_Flag) || 0;
      const continuous_load = parseInt(rawRow.Continuous_Load_Flag) || 0;
      const weather_mismatch = parseInt(rawRow.Weather_Mismatch_Flag) || 0;
      const pred_energy = parseFloat(rawRow.Predicted_Energy_Usage) || elec_usage;

      const overloadProb = Math.min(100, Math.max(5, Math.round((elec_usage / 18) * 40 + (appliance_usage / 12) * 60)));
      const gridLeakProb = Math.min(100, Math.max(8, Math.round((midnight_usage / 6) * 50 + (weather_mismatch ? 40 : 10))));
      const applianceFailure = Math.min(100, Math.max(10, Math.round((continuous_load ? 40 : 10) + (spike_flag ? 50 : 10))));

      let status = rawRow.Anomaly_Status || "Normal";
      let type = rawRow.Anomaly_Type || "None";
      let mode = "green";
      let aiPrediction = "Household energy signatures are running within expected thresholds.";
      let aiAlert = "GRID METRICS: Nominal household telemetry verified by AI Core.";
      let recommendations = ["No action required. Continuous monitoring active."];
      let confidence = 95.8;

      if (status === "Critical" || type === "Power Theft") {
        status = "Critical"; mode = "crimson"; confidence = 97.4;
        aiPrediction = `Illicit grid power diversion suspected at Household ${rawRow.Household_ID || "HH_1027"} due to mismatched consumption indices.`;
        aiAlert = `CRITICAL ANOMALY: Power Theft / Grid Integrity Threat Flagged.`;
        recommendations = ["Dispatch Field Meter Integrity Inspection Team"];
      } else if (type === "Appliance Fault") {
        status = "Warning"; mode = "amber"; confidence = 94.6;
        aiPrediction = `Mechanical signature match indicates an active fault in high-draw household appliances.`;
        aiAlert = `WARNING: Continuous Appliance Load & Mechanical Failure Isolated.`;
        recommendations = ["Issue Automated Homeowner Diagnostic Warning"];
      } else if (status === "Warning" || type !== "None") {
        status = "Optimization Alert"; mode = "teal"; confidence = 93.5;
        aiPrediction = "Usage profile imbalance detected. Household load shifting opportunities identified.";
        aiAlert = "OPTIMIZATION NOTICE: Peak demand mismatch / High evening load cycle.";
        recommendations = ["Enable Household Peak-Shaving Battery Discharge"];
      }

      return {
        server_load: elec_usage, 
        chilled_water: pred_energy, 
        outdoor_temp: temp,
        humidity,
        hvac_runtime: appliance_usage,
        airflow_velocity: midnight_usage,
        power_consumption: overloadProb,
        cooling_eff: applianceFailure,
        thermal_stress: gridLeakProb,
        airflow_eff: peak_load,
        overloadProb,
        hvacDegradation: gridLeakProb,
        thermalRisk: applianceFailure,
        severity: status === "Critical" ? 92 : status === "Warning" ? 64 : 12,
        riskScore: Math.round(status === "Critical" ? 82 : status === "Warning" ? 54 : 15),
        status,
        category: type,
        type,
        confidence,
        mode,
        aiPrediction,
        aiAlert,
        recommendations
      };
    }

    // HOSPITAL SECTOR PIPELINE (hospital.csv)
    if (isHospital) {
      const age = parseFloat(rawRow.age) || 0;
      const previous_admissions = parseFloat(rawRow.previous_admissions) || 0;
      const hospital_stay_days = parseFloat(rawRow.hospital_stay_days) || 0;
      const medications_count = parseFloat(rawRow.medications_count) || 0;
      const emergency_visits = parseFloat(rawRow.emergency_visits) || 0;
      const doctor_workload = parseFloat(rawRow.doctor_workload) || 0;
      const bed_occupancy_percent = parseFloat(rawRow.bed_occupancy_percent) || 0;
      const appointment_conflicts = parseFloat(rawRow.appointment_conflicts) || 0;
      const billing_amount = parseFloat(rawRow.billing_amount) || 0;
      const combined_risk_score = parseFloat(rawRow.combined_risk_score) || 0;
      const deterioration_score = parseFloat(rawRow.deterioration_score) || 0;
      
      const anomaly_flag = parseInt(rawRow.anomaly_flag) || 0;
      const readmission_risk = rawRow.readmission_risk || "Low";
      const recovery_status = rawRow.recovery_status || "Stable";
      const treatment_complexity = rawRow.treatment_complexity || "Low";
      const detected_anomaly = rawRow.detected_anomaly || "Normal";

      // Calculated secondary values
      const icuEscalationProb = Math.min(100, Math.max(5, Math.round((deterioration_score / 150) * 45 + (combined_risk_score / 40) * 55)));
      const hospitalOverloadProb = Math.min(100, Math.max(8, Math.round((doctor_workload / 80) * 40 + (bed_occupancy_percent / 100) * 60)));
      const recoveryFailureProb = Math.min(100, Math.max(10, Math.round((hospital_stay_days / 30) * 40 + (medications_count / 12) * 60)));

      // Classify visual state and custom anomaly categories
      let status = "Normal";
      let category = "Normal Operations";
      let type = "Stable Patient Vitals";
      let mode = "green";
      let confidence = 97.4;
      let aiPrediction = "All patient biosignals and environmental indicators are stable.";
      let aiAlert = "SYSTEM HEALTH: Nominal clinical conditions verified.";
      let recommendations = ["No action required. Continuous monitoring active."];

      if (detected_anomaly === "Silent Patient Deterioration") {
        status = "Critical";
        category = "Silent Patient Deterioration";
        type = "Silent Patient Deterioration";
        mode = "crimson";
        confidence = 98.6;
        aiPrediction = "AI Core detected gradual clinical decline without acute biosignal surges. Immediate bedside escalation recommended.";
        aiAlert = "CRITICAL MEDICAL: Silent patient deterioration detected in CCU.";
        recommendations = ["Initiate Emergency Medical Review"];
      } else if (detected_anomaly === "Recovery Degradation Pattern") {
        status = "Warning";
        category = "Recovery Degradation Pattern";
        type = "Recovery Degradation Pattern";
        mode = "amber";
        confidence = 96.2;
        aiPrediction = "Declining physical index identified during continuous telemetry assessment window.";
        aiAlert = "WARNING: ICU post-discharge recovery decline pattern identified.";
        recommendations = ["Schedule Immediate Follow-Up"];
      } else if (detected_anomaly === "Hospital Resource Overload") {
        status = "Warning";
        category = "Hospital Resource Overload";
        type = "Hospital Resource Overload";
        mode = "teal";
        confidence = 95.4;
        aiPrediction = "Incoming patient volume exceeding ward staff capacity. Resource stress index exceeds 0.85.";
        aiAlert = "RESOURCE ALERT: Doctor workload and bed occupancy rates approaching saturation.";
        recommendations = ["Optimize Resource Allocation"];
      }

      return {
        server_load: deterioration_score, 
        chilled_water: combined_risk_score, 
        outdoor_temp: doctor_workload, 
        humidity: bed_occupancy_percent, 
        hvac_runtime: medications_count, 
        airflow_velocity: emergency_visits, 
        airflow_eff: previous_admissions, 
        power_consumption: billing_amount, 
        
        age,
        treatment_complexity,
        recovery_status,
        readmission_risk,
        anomaly_flag,
        icuEscalationProb,
        hospitalOverloadProb,
        recoveryFailureProb,
        
        severity: Math.round(deterioration_score),
        riskScore: Math.round(icuEscalationProb),
        status,
        category,
        type,
        confidence,
        mode,
        aiPrediction,
        aiAlert,
        recommendations
      };
    }

    // INDUSTRIAL WORKER SAFETY PIPELINE (industrial.csv)
    if (activeSector === "Industrial Sector" && industrialDomain === "safety") {
      const worker_id = rawRow.worker_id || "W001";
      const hr = parseFloat(rawRow.hr) || 74.08;
      const temp = parseFloat(rawRow.temp) || 36.88;
      const eda = parseFloat(rawRow.eda) || 6.65;
      const fatigue_score = parseFloat(rawRow.fatigue_score) || 1.35;
      const blink_rate_pm = parseFloat(rawRow.blink_rate_pm) || 18;
      const activity_score = parseFloat(rawRow.activity_score) || 86;
      const accel_impact_g = parseFloat(rawRow.accel_impact_g) || 0.11;
      const body_angle_deg = parseFloat(rawRow.body_angle_deg) || 87;
      const motion_detected = parseInt(rawRow.motion_detected) || 1;
      const helmet = parseInt(rawRow.helmet) || 1;
      const vest = parseInt(rawRow.vest) || 1;
      const zone_authorized = parseInt(rawRow.zone_authorized) || 1;
      const overall_risk_score = parseFloat(rawRow.overall_risk_score) || 8.4;
      const actual_anomaly_label = rawRow.actual_anomaly_label || "Normal";

      // Calculated secondary values
      const overloadProb = Math.min(100, Math.max(5, Math.round(overall_risk_score)));
      const hvacDegradation = Math.min(100, Math.max(8, Math.round(fatigue_score * 20))); // Fatigue build-up risk
      const thermalRisk = Math.min(100, Math.max(10, Math.round((temp > 38 ? (temp - 37) * 40 : 10) + (hr > 100 ? (hr - 90) * 1.5 : 10))));

      let status = "Normal";
      let mode = "green";
      let confidence = 97.14;
      let aiPrediction = "Worker vitals are normal. Safety compliance verified.";
      let aiAlert = "SAFETY SYSTEM: Nominal worker operations verified by AI Core.";
      let recommendations = ["No action required. Continuous monitoring active."];

      if (actual_anomaly_label === "PPE_Violation") {
        status = "Critical"; mode = "crimson"; confidence = 98.2;
        aiPrediction = `Worker ${worker_id} entered hazardous area without required protective equipment.`;
        aiAlert = `CRITICAL PPE VIOLATION: Worker entered hazardous area without required PPE.`;
        recommendations = ["Dispatch Safety Supervisor"];
      } else if (actual_anomaly_label === "Unauthorized_Access") {
        status = "Critical"; mode = "crimson"; confidence = 96.5;
        aiPrediction = `Worker ${worker_id} breached unauthorized zone boundary.`;
        aiAlert = `UNAUTHORIZED ACCESS DETECTED: Worker entered restricted industrial zone.`;
        recommendations = ["Lock Restricted Zone Access"];
      } else if (actual_anomaly_label === "Heat_Stress") {
        status = "Warning"; mode = "amber"; confidence = 95.4;
        aiPrediction = `Worker ${worker_id} core temperature (${temp}°C) and heart rate (${hr} BPM) exceed safety limit.`;
        aiAlert = `HEAT STRESS ALERT: Worker exceeded safe physiological thresholds.`;
        recommendations = ["Activate Cooling & Hydration Protocol"];
      } else if (actual_anomaly_label === "Worker_Fatigue") {
        status = "Warning"; mode = "amber"; confidence = 94.6;
        aiPrediction = `Worker ${worker_id} fatigue index (${fatigue_score.toFixed(2)}) is high. Attention decay isolated.`;
        aiAlert = `FATIGUE WARNING: Worker fatigue entered high-risk zone.`;
        recommendations = ["Schedule Mandatory Rest Break"];
      } else if (actual_anomaly_label === "Fall_Detected") {
        status = "Critical"; mode = "crimson"; confidence = 99.0;
        aiPrediction = `Sudden movement change of ${accel_impact_g}G and body angle offset of ${body_angle_deg}° isolated.`;
        aiAlert = `FALL DETECTED: Worker collapsed near production area.`;
        recommendations = ["Dispatch Emergency Medical Team"];
      } else if (actual_anomaly_label === "Worker_Collapse") {
        status = "Critical"; mode = "crimson"; confidence = 99.5;
        aiPrediction = `Worker ${worker_id} reported horizontal position and motionlessness for extended duration.`;
        aiAlert = `CRITICAL COLLAPSE EVENT: Worker unresponsive for extended duration.`;
        recommendations = ["Trigger Emergency Response System"];
      }

      return {
        server_load: hr,
        chilled_water: temp,
        outdoor_temp: 24, // ambient
        humidity: eda,
        hvac_runtime: fatigue_score,
        airflow_velocity: blink_rate_pm,
        power_consumption: overall_risk_score,
        cooling_eff: helmet === 1 && vest === 1 ? 100 : 50,
        thermal_stress: activity_score,
        airflow_eff: accel_impact_g,
        
        worker_id,
        timestamp: rawRow.datetime || rawRow.timestamp || "2026-01-01 08:00:00",
        helmet,
        vest,
        gloves: helmet === 0 ? 0 : 1,
        boots: vest === 0 ? 0 : 1,
        zone_authorized,
        body_temp_C: temp,
        heart_rate_bpm: hr,
        ambient_temp_C: 24,
        shift_hours: parseFloat(rawRow.shift_hours) || 2,
        blink_rate_pm,
        head_tilt_deg: Math.round(body_angle_deg * 0.2),
        activity_score,
        fatigue_score,
        body_angle_deg,
        motion_detected,
        body_horizontal: body_angle_deg > 70 ? 1 : 0,
        accel_impact_g,
        anomaly_label: actual_anomaly_label,
        severity: status === "Critical" ? 92 : status === "Warning" ? 64 : 12,
        riskScore: Math.round(overall_risk_score || 15),
        status,
        category: actual_anomaly_label,
        type: actual_anomaly_label,
        confidence,
        mode,
        aiPrediction,
        aiAlert,
        recommendations
      };
    }

    return null;
  };

  const currentMlRow = isMLActive ? predictTrainedModel(currentRawRow) : null;

  // Telemetry stream interval ticker
  useEffect(() => {
    if (!isMLActive || !isPlaying) return;

    const interval = setInterval(() => {
      setStreamIndex(prev => prev + 1);
      setInferenceLatency(parseFloat((5 + Math.random() * 5).toFixed(1)));
    }, playbackSpeed);

    return () => clearInterval(interval);
  }, [isMLActive, isPlaying, playbackSpeed, testModule, activeSector]);

  // Handle telemetry history array scrolling
  useEffect(() => {
    if (!isMLActive || !currentMlRow) return;

    setMlHistory(prev => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newPoint = {
        name: timeStr,
        energy: currentMlRow.server_load,
        voltage: currentMlRow.chilled_water,
        risk: currentMlRow.riskScore,
        temperature: currentMlRow.outdoor_temp,
        severity: currentMlRow.severity,
        status: currentMlRow.status,
        mode: currentMlRow.mode,
        cooling_eff: currentMlRow.cooling_eff,
        thermal_stress: currentMlRow.thermal_stress,
        hvac_runtime: currentMlRow.hvac_runtime,
        anomalies: currentMlRow.mode === "green" ? 0 : 1
      };

      const updated = [...prev, newPoint];
      if (updated.length > 10) {
        updated.shift();
      }
      return updated;
    });
  }, [streamIndex, activeSector]);

  // Synchronize alerts with parent layout
  useEffect(() => {
    if (!isMLActive || !currentMlRow) return;
    if (currentMlRow.mode === "green") return;

    const isAlreadyPresent = alerts.some(a => a.message === currentMlRow.aiAlert);
    if (!isAlreadyPresent) {
      triggerManualAlert(
        activeSector,
        currentMlRow.category === "None" ? "Smart Grid" : currentMlRow.category,
        currentMlRow.aiAlert,
        currentMlRow.mode === "crimson" ? "critical" : "warning"
      );
    }
  }, [streamIndex, activeSector]);

  // Sync active streaming data to SystemContext for Analytics Page
  useEffect(() => {
    if (!isMLActive || !currentMlRow || mlHistory.length === 0) return;

    updateSectorMetrics(activeSector, {
      isStreaming: true,
      totalDevices: devices.filter(d => d.sector === activeSector).length,
      activeSystems: currentMlRow.mode === "crimson" ? 0 : devices.filter(d => d.sector === activeSector).length,
      aiRiskScore: currentMlRow.riskScore,
      energyConsumption: Math.round(isResidential ? currentMlRow.server_load * 12 : currentMlRow.server_load),
      detectedAnomalies: currentMlRow.mode === "green" ? 0 : 1,
      systemHealth: Math.max(5, 100 - Math.round(currentMlRow.severity / 4.5)),
      temperature: currentMlRow.outdoor_temp,
      voltage: isResidential ? 240 : currentMlRow.chilled_water,
      chartData: mlHistory
    });
  }, [mlHistory, currentMlRow, activeSector, devices, isMLActive, isResidential]);

  // Reset isStreaming flag when leaving ML streaming mode or unmounting
  useEffect(() => {
    if (!isMLActive) {
      updateSectorMetrics(activeSector, { isStreaming: false });
    }
    return () => {
      updateSectorMetrics(activeSector, { isStreaming: false });
    };
  }, [isMLActive, activeSector]);

  // ==========================================
  // SECTOR METRICS RESOLVER (OVERRIDE FOR ML MODES & SAFE FALLBACKS)
  // ==========================================
  const sectorData = (isMLActive && currentMlRow ? {
    totalDevices: devices.filter(d => d.sector === activeSector).length,
    activeSystems: currentMlRow.mode === "crimson" ? 0 : devices.filter(d => d.sector === activeSector).length,
    aiRiskScore: currentMlRow.riskScore,
    energyConsumption: Math.round(isResidential ? currentMlRow.server_load * 12 : currentMlRow.server_load), 
    detectedAnomalies: currentMlRow.mode === "green" ? 0 : 1,
    systemHealth: Math.max(5, 100 - Math.round(currentMlRow.severity / 4.5)),
    temperature: currentMlRow.outdoor_temp,
    voltage: isResidential ? 240 : currentMlRow.chilled_water,
    chartData: mlHistory.length > 0 ? mlHistory : (metrics && metrics[activeSector]?.chartData || [])
  } : (metrics && metrics[activeSector])) || {
    totalDevices: 0,
    activeSystems: 0,
    aiRiskScore: 0,
    energyConsumption: 0,
    detectedAnomalies: 0,
    systemHealth: 100,
    temperature: 22,
    voltage: 220,
    chartData: []
  };

  // Widget Cards configuration
  const widgets = isIndustrialSafety ? [
    {
      title: t("Total Active Workers", "कुल सक्रिय कर्मचारी", "ಒಟ್ಟು ಸಕ್ರಿಯ ಸಿಬ್ಬಂದಿ"),
      value: 24,
      desc: t("Optimal biometric logs", "इष्टतम बायोमेट्रिक लॉग", "ಅತ್ಯುತ್ತಮ ಬಯೋಮೆಟ್ರಿಕ್ ಲಾಗ್‌ಗಳು"),
      icon: Users,
      color: "text-neon-cyan"
    },
    {
      title: t("PPE Compliance %", "पीपीई अनुपालन %", "ಪಿಪಿಇ ಅನುಸರಣೆ %"),
      value: currentMlRow ? `${currentMlRow.helmet === 1 && currentMlRow.vest === 1 ? "100%" : "50%"}` : "95.8%",
      desc: t("Helmet & vest safety compliance", "हेलमेट और वेस्ट सुरक्षा अनुपालन", "ಹೆಲ್ಮೆಟ್ ಮತ್ತು ಜಾಕೆಟ್ ಧರಿಸುವಿಕೆ"),
      icon: ShieldCheck,
      color: currentMlRow && (currentMlRow.helmet === 0 || currentMlRow.vest === 0) ? "text-rose-400 animate-pulse font-bold" : "text-emerald-400"
    },
    {
      title: t("Active Anomalies Detected", "सक्रिय विसंगतियाँ पाई गईं", "ಪತ್ತೆಯಾದ ಸಕ್ರಿಯ ಅಸಂಗತತೆಗಳು"),
      value: currentMlRow && currentMlRow.mode !== "green" ? 1 : 0,
      desc: t("Real-time safety flags", "वास्तविक समय सुरक्षा झंडे", "ನೈಜ ಸಮಯದ ಸುರಕ್ಷತಾ ಅಲರ್ಟ್‌ಗಳು"),
      icon: ShieldAlert,
      color: currentMlRow && currentMlRow.mode !== "green" ? "text-rose-400 animate-pulse" : "text-gray-400"
    },
    {
      title: t("Critical Emergency Alerts", "गंभीर आपातकालीन अलर्ट", "ತುರ್ತು ಪರಿಸ್ಥಿತಿಯ ಅಲರ್ಟ್‌ಗಳು"),
      value: currentMlRow && currentMlRow.mode === "crimson" ? 1 : 0,
      desc: t("Immediate dispatch protocols", "तत्काल प्रेषण प्रोटोकॉल", "ತಕ್ಷಣದ ಕ್ರಮದ ಅವಶ್ಯಕತೆ"),
      icon: AlertTriangle,
      color: currentMlRow && currentMlRow.mode === "crimson" ? "text-rose-500 animate-pulse font-bold" : "text-gray-400"
    },
    {
      title: t("Worker Health Score", "कर्मचारी स्वास्थ्य स्कोर", "ಕಾರ್ಮಿಕರ ಆರೋಗ್ಯ ಸ್ಕೋರ್"),
      value: currentMlRow ? `${100 - Math.round(currentMlRow.riskScore * 0.4)}%` : "96%",
      desc: t("Aggregate bio-vital index", "समग्र जैव-महत्वपूर्ण सूचकांक", "ಒಟ್ಟು ಬಯೋ-ವೈಟಲ್ ಇಂಡೆಕ್ಸ್"),
      icon: Heart,
      color: currentMlRow && currentMlRow.riskScore > 70 ? "text-rose-400" : "text-emerald-400"
    },
    {
      title: t("Predicted Risk Index", "पूर्वानुमानित जोखिम सूचಕಾंक", "ಮುನ್ಸೂಚಿತ ಅಪಾಯದ ಸೂಚ್ಯಂಕ"),
      value: currentMlRow ? `${currentMlRow.riskScore}%` : "12%",
      desc: t("ML preventative fatigue model", "एमएल निवारक थकान मॉडल", "ಎಂಎಲ್ ಮುನ್ಸೂಚನೆ"),
      icon: Brain,
      color: currentMlRow && currentMlRow.riskScore > 70 ? "text-rose-400 animate-pulse font-bold" : "text-neon-cyan"
    },
    {
      title: t("Factory Occupancy", "कारखाना अधिभोग", "ಕಾರ್ಖಾನೆಯ ಒಳಗಿರುವವರ ಸಂಖ್ಯೆ"),
      value: 84,
      desc: t("Active zone presence count", "सक्रिय क्षेत्र उपस्थिति संख्या", "ಸಕ್ರಿಯ ವಲಯದಲ್ಲಿರುವವರ ಸಂಖ್ಯೆ"),
      icon: Layout,
      color: "text-neon-blue"
    },
    {
      title: t("Heat Stress Cases", "हीट स्ट्रेस मामले", "ಹೀಟ್ ಸ್ಟ್ರೆಸ್ ಕೇಸ್‌ಗಳು"),
      value: currentMlRow && currentMlRow.anomaly_label === "Heat_Stress" ? 1 : 0,
      desc: t("Ambient thermal triggers", "परिवेश थर्मल ट्रिगर", "ಹೆಚ್ಚಿನ ತಾಪಮಾನದ ತೊಂದರೆಗಳು"),
      icon: Thermometer,
      color: currentMlRow && currentMlRow.anomaly_label === "Heat_Stress" ? "text-amber-400 animate-pulse" : "text-neon-cyan"
    },
    {
      title: t("Fatigue Risk Count", "थकान जोखिम गणना", "ಸುಸ್ತು ಅಪಾಯದ ಸಂಖ್ಯೆ"),
      value: currentMlRow && currentMlRow.anomaly_label === "Worker_Fatigue" ? 1 : 0,
      desc: t("Sustained runtime exhaustion", "निरंतर चलने की थकावट", "ನಿರಂತರ ಕೆಲಸದ ದಣಿವು"),
      icon: Clock,
      color: currentMlRow && currentMlRow.anomaly_label === "Worker_Fatigue" ? "text-amber-400 animate-pulse" : "text-neon-cyan"
    },
    {
      title: t("AI Detection Accuracy", "एआई पहचान सटीकता", "ಎಐ ಪತ್ತೆಹಚ್ಚುವಿಕೆಯ ನಿಖರತೆ"),
      value: "97.14%",
      desc: t("Trained RF validation fit", "प्रशिक्षित आरएफ सत्यापन फिट", "ತರಬೇತಿ ಪಡೆದ ಮಾದರಿಯ ನಿಖರತೆ"),
      icon: CheckCircle,
      color: "text-emerald-400 font-bold"
    }
  ] : [
    {
      title: t("Total Tracked Devices", "कुल ट्रैक किए गए उपकरण", "ಒಟ್ಟು ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾದ ಸಾಧನಗಳು"),
      value: sectorDevices.length, 
      desc: t("Hardware sensory nodes", "हार्डवेयर संवेदी नोड्स", "ಹಾರ್ಡ್‌ವೇರ್ ಸೆನ್ಸಾರ್ ನೋಡ್‌ಗಳು"),
      icon: Layers,
      color: "text-neon-cyan"
    },
    {
      title: t("Active Systems", "सक्रिय प्रणालियाँ", "ಸಕ್ರಿಯ ವ್ಯವಸ್ಥೆಗಳು"),
      value: isMLActive && currentMlRow?.mode === "crimson" ? 0 : sectorDevices.filter(d => d.status === "optimal").length,
      desc: t("Optimal operating state", "इष्टतम परिचालन स्थिति", "ಅತ್ಯುತ್ತಮ ಕಾರ್ಯಾಚರಣೆಯ ಸ್ಥಿತಿ"),
      icon: Activity,
      color: isMLActive && currentMlRow?.mode === "crimson" ? "text-rose-500 animate-pulse" : "text-emerald-400"
    },
    {
      title: t("AI Risk Level", "एआई जोखिम स्तर", "ಎಐ ಅಪಾಯದ ಮಟ್ಟ"),
      value: `${sectorData.aiRiskScore}%`,
      desc: t("Predictive threat assessment", "पूर्वानुमानित खतरा मूल्यांकन", "ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ"),
      icon: Brain,
      color: sectorData.aiRiskScore > 70 ? "text-rose-400 animate-pulse font-bold" : sectorData.aiRiskScore > 40 ? "text-amber-400 font-bold" : "text-neon-cyan"
    },
    {
      title: isResidential ? t("Total Grid Consumption", "कुल ग्रिड खपत", "ಒಟ್ಟು ಗ್ರಿಡ್ ವಿದ್ಯುತ್ ಬಳಕೆ") : t("Energy Consumption", "ऊर्जा खपत", "ಒಟ್ಟು ವಿದ್ಯುತ್ ಬಳಕೆ"),
      value: isResidential ? `${sectorData.energyConsumption} kWh` : `${sectorData.energyConsumption} kW`,
      desc: t("Current power drawing rate", "वर्तमान बिजली खींचने की दर", "ಪ್ರಸ್ತುತ ವಿದ್ಯುತ್ ಬಳಕೆಯ ಪ್ರಮಾಣ"),
      icon: Zap,
      color: isMLActive && currentMlRow?.mode === "crimson" ? "text-rose-400" : "text-amber-400"
    },
    {
      title: t("Anomalies Flagged", "चिह्नित विसंगतियां", "ಪತ್ತೆಯಾದ ಅಸಂಗತತೆಗಳು"),
      value: isMLActive && currentMlRow ? (currentMlRow.mode === "green" ? 0 : 1) : (sectorDevices.filter(d => d.status === "unstable").length + activeSectorAlerts.length),
      desc: t("Active operational alerts", "सक्रिय परिचालन अलर्ट", "ಸಕ್ರಿಯ ಕಾರ್ಯಾಚರಣಾ ಅಲರ್ಟ್‌ಗಳು"),
      icon: ShieldAlert,
      color: (isMLActive && currentMlRow && currentMlRow.mode !== "green") ? "text-rose-500 animate-pulse font-bold" : "text-gray-400"
    },
    {
      title: t("System Health Core", "सिस्टम स्वास्थ्य कोर", "ಸಿಸ್ಟಮ್ ಆರೋಗ್ಯ ಸ್ಕೋರ್"),
      value: `${Math.round(sectorData.systemHealth)}%`,
      desc: t("Aggregate efficiency coefficient", "समग्र दक्षता गुणांक", "ಒಟ್ಟು ದಕ್ಷತೆಯ ಗುಣಾಂಕ"),
      icon: Gauge,
      color: sectorData.systemHealth < 50 ? "text-rose-400" : sectorData.systemHealth < 80 ? "text-amber-400" : "text-emerald-400"
    },
    {
      title: t("Ambient Temperature", "परिवेश तापमान", "ಸುತ್ತಲಿನ ತಾಪಮಾನ"),
      value: `${sectorData.temperature} °C`,
      desc: t("Core sensor average status", "कोर सेंसर औसत स्थिति", "ಪ್ರಮುಖ ಸೆನ್ಸಾರ್ ಸರಾಸರಿ ಸ್ಥಿತಿ"),
      icon: Thermometer,
      color: sectorData.temperature > 30 ? "text-rose-400 font-bold" : "text-neon-cyan"
    },
    {
      title: isResidential ? t("Standard Grid Line", "मानक ग्रिड लाइन", "ಸಾಮಾನ್ಯ ಗ್ರಿಡ್ ಲೈನ್") : t("Grid Line Voltage", "ग्रिड लाइन वोल्टेज", "ಗ್ರಿಡ್ ಲೈನ್ ವೋಲ್ಟೇಜ್"),
      value: isResidential ? `240 V` : (isInstitutional && currentMlRow ? `${currentMlRow.chilled_water} kJ` : `${sectorData.voltage} V`),
      desc: isInstitutional ? t("Sensory Cooling Flow", "संवेदी शीतलन प्रवाह", "ಕೂಲಿಂಗ್ ಫ್ಲೋ ವಿವರ") : t("Substation load mapping", "सबस्टेशन लोड मैपिंग", "ಸಬ್‌ಸ್ಟೇಷನ್ ಲೋಡ್ ವಿವರ"),
      icon: TrendingUp,
      color: isInstitutional && currentMlRow?.chilled_water < 20 ? "text-rose-400 font-bold" : "text-neon-blue"
    }
  ];


  // Pie chart data: Status breakdown
  const pieData = [
    { name: "Optimal", value: Math.max(0, Math.round(sectorData.activeSystems * 0.8)) || (sectorDevices.length > 0 ? sectorDevices.length : 1) },
    { name: "Throttled", value: Math.max(0, Math.round(sectorData.activeSystems * 0.15)) },
    { name: "Unstable", value: sectorData.detectedAnomalies },
    { name: "Offline", value: Math.max(0, sectorDevices.length - sectorData.activeSystems) }
  ];

  const handleAddDeviceSubmit = (e) => {
    e.preventDefault();
    if (!newDevName.trim() || !newDevModel.trim() || !newDevSystem.trim()) return;

    addDevice(newDevName, newDevModel, newDevSystem);
    setNewDevName("");
    setNewDevModel("");
    setNewDevSystem("");
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 2000);
  };

  const handleTriggerAction = (actionType) => {
    setAppliedAction(actionType);
    setTimeout(() => setAppliedAction(""), 5000);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const userMsg = { sender: "user", text: userQuery };
    const cleanQuery = userQuery.toLowerCase();
    
    let aiResponse = {
      sender: "ai",
      text: "Analyzing electrical telemetry and grid stability logs...",
      text_hi: "विद्युत टेलीमेट्री और ग्रिड स्थिरता लॉग का विश्लेषण कर रहा हूँ...",
      text_kn: "ವಿದ್ಯುತ್ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಗ್ರಿಡ್ ಸ್ಥಿರತೆಯ ಲಾಗ್‌ಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ..."
    };

    if (cleanQuery.includes("theft") || cleanQuery.includes("security") || cleanQuery.includes("चोरी") || cleanQuery.includes("ಕಳ್ಳತನ")) {
      aiResponse = {
        sender: "ai",
        text: "Suspicious unmapped draw flagged at HH_1027. Decision tree classification highlights 82% Power Theft likelihood. Dynamic phase balancing active.",
        text_hi: "HH_1027 पर संदिग्ध बिजली चोरी की पहचान की गई है। एआई विश्लेषण 82% बिजली चोरी की संभावना को दर्शाता है।",
        text_kn: "HH_1027 ನಲ್ಲಿ ವಿದ್ಯುತ್ ಕಳ್ಳತನ ಶಂಕೆ ಇದೆ. 82% ರಷ್ಟು ವಿದ್ಯುತ್ ಕಳ್ಳತನ ಸಂಭವನೀಯತೆ ಕಂಡುಬಂದಿದೆ."
      };
    } else if (cleanQuery.includes("spike") || cleanQuery.includes("surge") || cleanQuery.includes("उछाल") || cleanQuery.includes("ಏರಿಕೆ")) {
      aiResponse = {
        sender: "ai",
        text: "Sudden load surges isolated. AC climate control drawing exceeds 15 kWh. Automated homeowner warning pushed.",
        text_hi: "अचानक लोड उछाल दर्ज। एयर कंडीशनर 15 kWh से अधिक बिजली खींच रहा है। स्वचालित चेतावनी भेजी गई।",
        text_kn: "ಹಠಾತ್ ಏರಿಕೆ ಪತ್ತೆಯಾಗಿದೆ. ಹವಾನಿಯಂತ್ರಣ ವ್ಯವಸ್ಥೆಯು 15 kWh ಗಿಂತ ಹೆಚ್ಚು ವಿದ್ಯುತ್ ಬಳಸುತ್ತಿದೆ."
      };
    } else if (cleanQuery.includes("optimize") || cleanQuery.includes("battery") || cleanQuery.includes("बैटरी") || cleanQuery.includes("ಬ್ಯಾಟರಿ")) {
      aiResponse = {
        sender: "ai",
        text: "Dynamic peak-shaving engaged. Residential battery discharging to offset evening surge peak.",
        text_hi: "डायनामिक पीक-शेविंग सक्रिय। आवासीय बैटरी शाम की मांग को संतुलित करने के लिए डिस्चार्ज हो रही है।",
        text_kn: "ಸ್ಮಾರ್ಟ್ ಎನರ್ಜಿ ಸಕ್ರಿಯ. ಲೋಡ್ ಕಡಿಮೆ ಮಾಡಲು ಬ್ಯಾಟರಿಯಿಂದ ವಿದ್ಯುತ್ ಮರುಹಂಚಿಕೆ ಮಾಡಲಾಗುತ್ತಿದೆ."
      };
    }

    setChatMessages(prev => [...prev, userMsg, aiResponse]);
    setUserQuery("");
  };

  const handleDownloadReport = (type) => {
    setReportType(type);
    setReportProgress(0);
    const interval = setInterval(() => {
      setReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleHospitalChatSubmit = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const userMsg = { sender: "user", text: userQuery };
    const cleanQuery = userQuery.toLowerCase();
    
    let aiResponse = {
      sender: "ai",
      text: "Understood. Analyzing patient biosignal history and executing predictive Random Forest risk models...",
      text_hi: "समझ गया। रोगी के बायोसिग्नल इतिहास का विश्लेषण और भविष्य कहनेवाला रैंडम फॉरेस्ट जोखिम मॉडल चलाना...",
      text_kn: "ಅರ್ಥವಾಯಿತು. ರೋಗಿಯ ಬಯೋಸಿಗ್ನಲ್ ಇತಿಹಾಸವನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ ಮತ್ತು ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ ಮಾದರಿಯನ್ನು ಚಲಾಯಿಸಲಾಗುತ್ತಿದೆ..."
    };

    if (cleanQuery.includes("deterioration") || cleanQuery.includes("silent") || cleanQuery.includes("बदलाव") || cleanQuery.includes("ಕುಸಿತ")) {
      aiResponse = {
        sender: "ai",
        text: "Silent Patient Deterioration is Isolated. Clinical indicators (deterioration score > 90) reflect a downward cardiovascular drift. ICU bedside review is prioritized.",
        text_hi: "मूक रोगी गिरावट का पता चला है। नैदानिक संकेतक (गिरावट स्कोर > 90) हृदय संबंधी गिरावट को दर्शाते हैं। आईसीयू समीक्षा को प्राथमिकता दी गई है।",
        text_kn: "ಸೈಲೆಂಟ್ ಪೇಷಂಟ್ ಡಿಟೆರಿಯೊರೇಶನ್ ಪತ್ತೆಯಾಗಿದೆ. ರೋಗಿಯ ಆರೋಗ್ಯ ಸೂಚ್ಯಂಕಗಳು (ಕುಸಿತದ ಸ್ಕೋರ್ > 90) ಕ್ಷೀಣಿಸುತ್ತಿರುವುದನ್ನು ತೋರಿಸುತ್ತಿವೆ."
      };
    } else if (cleanQuery.includes("icu") || cleanQuery.includes("risk") || cleanQuery.includes("जोखिम") || cleanQuery.includes("ಅಪಾಯ")) {
      aiResponse = {
        sender: "ai",
        text: "ICU Risk Escalation probability is running at 74% based on combined vital vectors. Emergency critical care team has been notified.",
        text_hi: "संयुक्त महत्वपूर्ण वैक्टरों के आधार पर आईसीयू जोखिम बढ़ने की संभावना 74% चल रही है। आपातकालीन टीम को सूचित कर दिया गया है।",
        text_kn: "ರೋಗಿಯ ಪ್ರಸ್ತುತ ಬಯೋಸಿಗ್ನಲ್ ಆಧಾರದ ಮೇಲೆ ಐಸಿಯು ಅಪಾಯದ ಸಂಭವನೀಯತೆ 74% ಆಗಿದೆ. ತುರ್ತು ತಂಡಕ್ಕೆ ಮಾಹಿತಿ ನೀಡಲಾಗಿದೆ."
      };
    } else if (cleanQuery.includes("resource") || cleanQuery.includes("bed") || cleanQuery.includes("occupancy") || cleanQuery.includes("ओवरलोड") || cleanQuery.includes("ಲೋಡ್")) {
      aiResponse = {
        sender: "ai",
        text: "Hospital Resource Load is currently at 63%. Bed occupancy is approaching 97% capacity in critical care wings. Dynamic rescheduling is active.",
        text_hi: "अस्पताल संसाधन लोड वर्तमान में 63% है। बिस्तर अधिभोग 97% के करीब पहुंच रहा है। डायनामिक शेड्यूलिंग सक्रिय है।",
        text_kn: "ಆಸ್ಪತ್ರೆಯ ಒಟ್ಟು ಬೆಡ್ ಬಳಕೆ ಪ್ರಮಾಣ 97% ತಲುಪಿದೆ. ವೈದ್ಯರ ಮೇಲಿನ ಕೆಲಸದ ಒತ್ತಡ 63% ಆಗಿದೆ. ಸಂಪನ್ಮೂಲ ನಿರ್ವಹಣೆ ಸಕ್ರಿಯವಾಗಿದೆ."
      };
    } else if (cleanQuery.includes("discharge") || cleanQuery.includes("readmission") || cleanQuery.includes("डिसचार्ज") || cleanQuery.includes("ಡಿಸ್ಚಾರ್ಜ್")) {
      aiResponse = {
        sender: "ai",
        text: "Emergency Readmission Risk is flagged at 81% for post-operative recovery failure. Automatic clinical follow-up appointment is recommended.",
        text_hi: "ऑपरेशन के बाद रिकवरी विफलता के लिए आपातकालीन पुन प्रवेश जोखिम 81% पर चिह्नित है। नैदानिक अनुवर्ती नियुक्ति की सिफारिश की जाती है।",
        text_kn: "ಡಿಸ್ಚಾರ್ಜ್ ಆದ ರೋಗಿಯು ಮತ್ತೆ ಆಸ್ಪತ್ರೆಗೆ ಸೇರುವ ಅಪಾಯ 81% ಆಗಿದೆ. ತ್ವರಿತ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆಗೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ."
      };
    }

    setHospitalChatMessages(prev => [...prev, userMsg, aiResponse]);
    setUserQuery("");
  };

  const handleHospitalDownloadReport = (type) => {
    setReportType(type);
    setReportProgress(0);
    const interval = setInterval(() => {
      setReportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  // ========================================================================
  // RENDER METHOD FOR AI SMART RESIDENTIAL ELECTRICAL MONITORING SYSTEM
  // ========================================================================
  const renderResidential = () => {
    // Multilingual support translator helper
    const t = (en, hi, kn) => {
      if (resLanguage === "hi") return hi;
      if (resLanguage === "kn") return kn;
      return en;
    };

    const residentialMenuItems = [
      { id: "dashboard", name: t("Dashboard", "डैशबोर्ड", "ಡ್ಯಾಶ್ಬೋರ್ಡ್"), icon: LayoutDashboard },
      { id: "live", name: t("Live Monitoring", "लाइव मॉनिटरिंग", "ಲೈವ್ ಮಾನಿಟರಿಂಗ್"), icon: Activity },
      { id: "anomalies", name: t("Anomaly Detection", "विसंगति का पता लगाना", "ಅಸಂಗತತೆ ಪತ್ತೆ ಹಚ್ಚುವಿಕೆ"), icon: ShieldAlert },
      { id: "theft", name: t("Power Theft Analytics", "बिजली चोरी विश्लेषण", "ವಿದ್ಯುತ್ ಕಳ್ಳತನ ವಿಶ್ಲೇಷಣೆ"), icon: Search },
      { id: "spike", name: t("Spike Detection", "स्पाइक डिटेक्शन", "ವೋಲ್ಟೇಜ್ ಏರಿಳಿತ ಪತ್ತೆ"), icon: TrendingUp },
      { id: "appliance", name: t("Appliance Monitoring", "उपकरण निगरानी", "ಗೃಹೋಪಯೋಗಿ ಉಪಕರಣಗಳ ಮೇಲ್ವಿಚಾರಣೆ"), icon: Cpu },
      { id: "predictions", name: t("AI Predictions & Forecasting", "एआई भविष्यवाणी", "ಎಐ ಮುನ್ಸೂಚನೆ"), icon: BrainCircuit },
      { id: "heatmaps", name: t("Apartment Heatmaps", "अपार्टमेंट हीटमैಪ್", "ಅಪಾರ್ಟ್ಮೆಂಟ್ ಹೀಟ್ ಮ್ಯಾಪ್ಗಳು"), icon: Map },
      { id: "reports", name: t("Analytics & Reports", "विश्लेषण और रिपोर्ट", "ವರದಿ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ"), icon: FileText },
      { id: "chatbot", name: t("AI Agent Assistant", "एआई एजेंट सहायक", "ಎಐ ಸಹಾಯಕ"), icon: MessageSquare },
      { id: "settings", name: t("System Settings", "सिस्टम सेटिंग्स", "ಸಿಸ್ಟಮ್ ಸೆಟ್ಟಿಂಗ್ಗಳು"), icon: SettingsIcon }
    ];

    // Calculate predictions for forecasting charts
    const baseData = sectorData.chartData.slice(-5) || [];
    const forecastChartData = baseData.map(p => ({
      name: p.name,
      actual: p.energy,
      forecast: p.energy,
      lowerBound: Math.max(0, p.energy * 0.95),
      upperBound: p.energy * 1.05
    }));

    // Project 3 future points with dashed line
    const lastPoint = baseData[baseData.length - 1] || { energy: 12 };
    const forecastVal = currentMlRow ? currentMlRow.chilled_water : 14; 
    forecastChartData.push({
      name: "T+1 hr",
      forecast: forecastVal,
      lowerBound: Math.max(0, forecastVal * 0.9),
      upperBound: forecastVal * 1.1
    });
    forecastChartData.push({
      name: "T+2 hr",
      forecast: forecastVal * 1.05,
      lowerBound: Math.max(0, forecastVal * 0.85),
      upperBound: forecastVal * 1.15
    });
    forecastChartData.push({
      name: "T+3 hr",
      forecast: forecastVal * 0.98,
      lowerBound: Math.max(0, forecastVal * 0.8),
      upperBound: forecastVal * 1.2
    });

    // Custom Dot Renderer for glowing surge spikes on charts
    const RenderSpikeDot = (props) => {
      const { cx, cy, payload } = props;
      if (payload.energy > 15 || payload.mode === "crimson" || payload.mode === "amber") {
        return (
          <circle cx={cx} cy={cy} r={6} fill="#f43f5e" stroke="#ffffff" strokeWidth={1.5} className="animate-pulse" />
        );
      }
      return <circle cx={cx} cy={cy} r={3} fill="#00f0ff" />;
    };

    // Dynamic cost accumulator
    const costAccumulator = (sectorData.energyConsumption * 0.15).toFixed(2);

    // Dynamic Health calculation
    let currentHealth = 98;
    if (currentMlRow) {
      if (currentMlRow.mode === "crimson") currentHealth = 44;
      else if (currentMlRow.mode === "amber") currentHealth = 78;
      else if (currentMlRow.mode === "teal") currentHealth = 91;
    }

    return (
      <div className="space-y-6 relative">
        {/* Top Header Banner */}
        <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
          {/* Cyberpunk grid background overlay in header */}
          <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 z-10 w-full">
            {/* Top-Left Branding & Titles */}
            <div className="flex items-start gap-4">
              <div className="flex flex-col text-left shrink-0">
                <span className="text-sm font-black font-mono tracking-widest text-neon-cyan drop-shadow-glow">INFRASENSE AI</span>
                <span className="text-[8px] font-bold font-mono tracking-[0.2em] text-neon-blue mt-0.5">INTELLIGENCE CORE</span>
              </div>
              <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-black bg-neon-cyan px-2 py-0.5 rounded shadow-glow-cyan">
                    ● {t("Residential Sector", "आवासीय क्षेत्र", "ವಸತಿ ವಲಯ")}
                  </span>
                  <h2 className="text-lg font-black tracking-tight text-white font-mono uppercase">
                    {t("AI Smart Residential Electrical Usage Monitoring & Anomaly Detection System", "आवासीय विद्युत उपयोग निगरानी और विसंगति पहचान एआई प्रणाली", "ವಸತಿ ವಿದ್ಯುತ್ ಬಳಕೆ ಉಸ್ತುವಾರಿ ಮತ್ತು ಅಸಂಗತತೆ ಪತ್ತೆ ಎಐ ವ್ಯವಸ್ಥೆ")}
                  </h2>
                </div>
                <p className="text-[9px] text-gray-400 font-mono tracking-wide">
                  {t("TRAINED AI CORE MODEL INTERFACE: Isolation Forest + Random Forest + LSTM Prediction Engine", "प्रशिक्षित एआई कोर मॉडल: आइसोलेशन फॉरेस्ट + रैंडम फॉरेस्ट + एलएसटीएम प्रेडिक्शन इंजन", "ತರಬೇತಿ ಪಡೆದ ಎಐ ಮಾದರಿ: ಐಸೊಲೇಶನ್ ಫಾರೆಸ್ಟ್ + ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ + ಎಲ್‌ಎಸ್‌ಟಿಎಂ ಪ್ರಿಡಿಕ್ಷನ್ ಇಂಜಿನ್")}
                </p>
              </div>
            </div>

            {/* Top-Right HUD Controls & Indicators */}
            <div className="flex flex-wrap items-center gap-4 self-stretch md:self-auto justify-between md:justify-end">
              {/* Telemetry Search Bar */}
              <div className="relative font-mono text-[10px] w-full sm:w-48">
                <input 
                  type="text" 
                  placeholder={t("Telemetry Search...", "टेलीमेट्री खोज...", "ಟೆಲಿಮೆಟ್ರಿ ಹುಡುಕಾಟ...")} 
                  className="w-full bg-black/40 border border-white/10 rounded-lg py-1.5 pl-7 pr-3 text-[10px] text-gray-200 focus:border-neon-cyan/50 focus:outline-none transition-all placeholder:text-gray-600"
                />
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2" />
              </div>

              {/* Notification icon */}
              <button className="p-2 bg-white/5 border border-white/5 hover:border-white/10 rounded-xl relative text-gray-400 hover:text-white transition-all">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              </button>

              {/* User Profile Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-neon-blue to-neon-cyan p-[1px] shadow-glow-blue cursor-pointer">
                <div className="w-full h-full bg-[#0b1020] rounded-xl flex items-center justify-center text-neon-cyan">
                  <User className="w-4 h-4" />
                </div>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-black/40 border border-white/15 p-1 rounded-xl">
                <button 
                  onClick={() => setResLanguage("en")}
                  className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition-all ${resLanguage === "en" ? "bg-neon-cyan text-black shadow-glow-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setResLanguage("hi")}
                  className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition-all ${resLanguage === "hi" ? "bg-neon-cyan text-black shadow-glow-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  हिंदी
                </button>
                <button 
                  onClick={() => setResLanguage("kn")}
                  className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold transition-all ${resLanguage === "kn" ? "bg-neon-cyan text-black shadow-glow-cyan" : "text-gray-400 hover:text-gray-200"}`}
                >
                  ಕನ್ನಡ
                </button>
              </div>

              {/* Indicators */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse"></span>
                  {t("AI CORE ACTIVE", "एआई कोर सक्रिय", "ಎಐ ಕೋರ್ ಸಕ್ರಿಯ")}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t("LIVE FEED ACTIVE", "लाइव फीड सक्रिय", "ಲೈವ್ ಫೀಡ್ ಸಕ್ರಿಯ")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Global Action Alerts Confirmation banner */}
        {isInspectionTriggered && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("INSPECTION REQUEST FILED: Field inspection team dispatched to Household " + selectedApartment + " grid line.", "निरीक्षण अनुरोध दर्ज: फील्ड टीम को घरेलू " + selectedApartment + " ग्रिड लाइन पर भेजा गया।", "ತಪಾಸಣಾ ವಿನಂತಿ ದಾಖಲಾಗಿದೆ: ಕ್ಷೇತ್ರ ತಪಾಸಣಾ ತಂಡವನ್ನು ಅಪಾರ್ಟ್ಮೆಂಟ್ " + selectedApartment + " ಗ್ರಿಡ್ ಲೈನ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsInspectionTriggered(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {isLoadReduced && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald z-20"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("DEMAND OVERLOAD MITIGATION ACTIVE: Non-essential appliance usage throttled at " + selectedApartment + ".", "ओवरलोड शमन सक्रिय: " + selectedApartment + " पर गैर-आवश्यक उपकरणों का उपयोग सीमित किया गया।", "ಲೋಡ್ ನಿಯಂತ್ರಣ ಸಕ್ರಿಯ: ಅಪಾರ್ಟ್ಮೆಂಟ್ " + selectedApartment + " ನಲ್ಲಿ ಅನಗತ್ಯ ಸಾಧನಗಳ ಬಳಕೆ ನಿಯಂತ್ರಿಸಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsLoadReduced(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {isMaintenanceScheduled && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald z-20"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("MAINTENANCE WORK ORDER FILED: Ticket #APP-9982 issued for " + selectedApartment + " appliance dispatch.", "रखरखाव कार्य आदेश दर्ज: " + selectedApartment + " उपकरण प्रेषण के लिए टिकट #APP-9982 जारी।", "ನಿರ್ವಹಣಾ ಆದೇಶ ದಾಖಲಾಗಿದೆ: ಅಪಾರ್ಟ್ಮೆಂಟ್ " + selectedApartment + " ಗಾಗಿ ಟಿಕೆಟ್ #APP-9982 ನೀಡಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsMaintenanceScheduled(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {isLoadBalanced && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald z-20"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("GRID LOAD BALANCING DISPATCHED: Automated phase-shifters engaged to redistribute residential load.", "ग्रिड लोड संतुलन प्रेषित: आवासीय भार को पुनर्वितरित करने के लिए स्वचालित चरण-शिफ्टर सक्रिय।", "ಗ್ರಿಡ್ ಲೋಡ್ ಬ್ಯಾಲೆನ್ಸಿಂಗ್ ಸಕ್ರಿಯ: ಲೋಡ್ ಮರುಹಂಚಿಕೆಗಾಗಿ ಸ್ವಯಂಚಾಲಿತ ಫೇಸ್-ಶಿಫ್ಟರ್‌ಗಳನ್ನು ಬಳಸಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsLoadBalanced(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {isEcoOptimized && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald z-20"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("SMART ENERGY OPTIMIZATION ENABLED: Indoor climate control systems aligned with ambient weather forecasts.", "स्मार्ट ऊर्जा अनुकूलन सक्षम: परिवेश मौसम के अनुकूल घरेलू जलवायु नियंत्रण प्रणाली संरेखित।", "ಸ್ಮಾರ್ಟ್ ಎನರ್ಜಿ ಸಕ್ರಿಯ: ಪ್ರಸ್ತುತ ಹವಾಮಾನಕ್ಕೆ ತಕ್ಕಂತೆ ಒಳಾಂಗಣ ತಾಪಮಾನ ನಿಯಂತ್ರಣ ಹೊಂದಿಸಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsEcoOptimized(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {/* Interactive AI Model stream controller panel */}
        <div className={`p-4 rounded-xl glass-panel border ${themeBorderGlow} transition-all duration-500 relative overflow-hidden`}>
          <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none"></div>
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 z-10 relative">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                </span>
                <span className="text-xs font-black font-mono tracking-wider text-gray-200 uppercase">
                  {t("RESIDENTIAL POWER GRID STREAM TELEMETRY PIPELINE", "आवासीय विद्युत ग्रिड स्ट्रीम टेलीमेट्री पाइपलाइन", "ವಸತಿ ವಿದ್ಯುತ್ ಗ್ರಿಡ್ ಟೆಲಿಮೆಟ್ರಿ ಪೈಪ್‌ಲೈನ್")}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">
                {t("Streaming Household Row", "घरेलू डेटा स्ट्रीमिंग पंक्ति", "ಸ್ಟ್ರೀಮಿಂಗ್ ಅಪಾರ್ಟ್ಮೆಂಟ್ ಸಾಲು")} <strong className="text-neon-cyan">#{streamIndex % resRows.length}</strong> | {t("Model Inference Latency", "मॉडल निष्कर्ष विलंबता", "ಮಾದರಿ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ")}: <strong className="text-neon-cyan">{inferenceLatency}ms</strong>
              </p>
            </div>

            {/* Test Module Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setTestModule("auto"); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "auto" ? "bg-neon-cyan text-black border-neon-cyan shadow-glow-cyan" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Auto-Stream
              </button>
              
              <button
                onClick={() => { setTestModule("emergency"); setStreamIndex(1); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "emergency" ? "bg-rose-600 text-white border-rose-600 shadow-glow-rose" : "bg-rose-950/20 border-rose-500/25 text-rose-400 hover:bg-rose-950/30"
                }`}
              >
                {t("1. Power Theft Alert", "1. बिजली चोरी चेतावनी", "1. ವಿದ್ಯುತ್ ಕಳ್ಳತನ")}
              </button>

              <button
                onClick={() => { setTestModule("degradation"); setStreamIndex(2); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "degradation" ? "bg-amber-600 text-white border-amber-600 shadow-glow-amber" : "bg-amber-500/25 border-amber-500/20 text-amber-400 hover:bg-amber-950/30"
                }`}
              >
                {t("2. Appliance Fault", "2. उपकरण खराबी", "2. ಉಪಕರಣ ದೋಷ")}
              </button>

              <button
                onClick={() => { setTestModule("optimizer"); setStreamIndex(3); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "optimizer" ? "bg-teal-600 text-white border-teal-600 shadow-glow-teal" : "bg-teal-950/20 border-teal-500/25 text-teal-400 hover:bg-teal-950/30"
                }`}
              >
                {t("3. Grid Optimizer", "3. ग्रिड ऑप्टिमाइज़र", "3. ಗ್ರಿಡ್ ಆಪ್ಟಿಮೈಜರ್")}
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-1 rounded-lg">
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 hover:bg-white/5 rounded text-gray-300">
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => setStreamIndex(prev => prev + 1)} className="p-1.5 hover:bg-white/5 rounded text-gray-300">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-[10px] font-mono text-gray-300 outline-none pr-2 cursor-pointer"
              >
                <option value={2000} className="bg-dark-panel">2s interval</option>
                <option value={5000} className="bg-dark-panel">5s interval</option>
                <option value={10000} className="bg-dark-panel">10s interval</option>
              </select>
            </div>
          </div>
        </div>

        {/* Global Flashing Emergency crimson warning banner */}
        {currentMlRow?.mode === "crimson" && (
          <motion.div 
            animate={{ scale: [1, 1.01, 1] }} 
            transition={{ duration: 1.5, repeat: Infinity }}
            className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3 shadow-glow-rose font-mono"
          >
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 animate-pulse mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                !!! {t("CRITICAL GRID SECURITY BREACH FLAG", "महत्वपूर्ण ग्रिड सुरक्षा उल्लंघन ध्वज", "ಗಂಭೀರ ಗ್ರಿಡ್ ಭದ್ರತಾ ಉಲ್ಲಂಘನೆ ಪತ್ತೆ")} !!!
              </h4>
              <p className="text-[11px] leading-relaxed">
                {t("POWER THEFT EXPLOIT IDENTIFIED: Unmapped high usage pattern bypassed the smart-meter loop at Household " + (currentRawRow.Household_ID || "HH_1027") + ".", "बिजली चोरी का पता चला: अनमैप किया गया उच्च उपयोग पैटर्न घरेलू " + (currentRawRow.Household_ID || "HH_1027") + " पर मिला है।", "ವಿದ್ಯುತ್ ಕಳ್ಳತನ ಪತ್ತೆಯಾಗಿದೆ: ಅಪಾರ್ಟ್ಮೆಂಟ್ " + (currentRawRow.Household_ID || "HH_1027") + " ನಲ್ಲಿ ಅಸಂಗತ ವಿದ್ಯುತ್ ಬಳಕೆ ಪತ್ತೆಯಾಗಿದೆ.")}
              </p>
            </div>
          </motion.div>
        )}

        {/* Two-column layout splitting sub-sidebar list and active view panels */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          {/* LEFT SUB-SIDEBAR */}
          <div className="xl:col-span-1 glass-panel border border-dark-border rounded-xl p-4 space-y-2">
            <div className="px-3 py-2 border-b border-white/5 mb-3 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{t("Domain Scope", "डोमेन स्कोप", "ವಿಭಾಗ")}</span>
              <span className="text-[9px] font-mono text-neon-cyan px-2 py-0.5 bg-neon-cyan/5 border border-neon-cyan/20 rounded">
                {t("Residential", "आवासीय", "ವಸತಿ")}
              </span>
            </div>

            {residentialMenuItems.map(item => {
              const MenuItemIcon = item.icon;
              const isSelected = activeResTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveResTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                    isSelected 
                      ? "bg-gradient-to-r from-neon-cyan/25 to-neon-blue/5 text-neon-cyan border-neon-cyan/35 shadow-glow-cyan" 
                      : "text-gray-400 border-transparent hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <MenuItemIcon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* RIGHT VIEW PORTAL */}
          <div className="xl:col-span-3 space-y-6">

            {/* 1. DASHBOARD PORTAL */}
            {activeResTab === "dashboard" && (
              <div className="space-y-6">
                {/* 8 Glowing, Animated KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: t("Residential Consumption", "आवासीय बिजली खपत", "ವಸತಿ ವಿದ್ಯುತ್ ಬಳಕೆ"), value: `${sectorData.energyConsumption} kWh`, desc: t("Rolling total drawing load", "कुल संचयी विद्युत मांग", "ಒಟ್ಟು ಬಳಕೆಯ ಪ್ರಮಾಣ"), icon: Zap, color: "text-amber-400" },
                    { title: t("Active Anomalies", "सक्रिय विसंगतियां", "ಅಸಂಗತತೆಗಳು"), value: sectorData.detectedAnomalies, desc: t("Flagged smart grid bypasses", "सक्रिय विसंगति ग्रिड चेतावनियाँ", "ಸಕ್ರಿಯ ಅಸಂಗತತೆಗಳು"), icon: AlertCircle, color: sectorData.detectedAnomalies > 0 ? "text-rose-400 animate-pulse font-bold" : "text-gray-400" },
                    { title: t("Critical Grid Alerts", "महत्वपूर्ण ग्रिड अलर्ट", "ಗಂಭೀರ ಅಲರ್ಟ್‌ಗಳು"), value: sectorAlerts.filter(a => a.type === "critical" && a.status === "active").length, desc: t("Immediate inspect required", "तत्काल निरीक्षण आवश्यक", "ತ್ವರಿತ ಗಮನ ಅಗತ್ಯ"), icon: ShieldAlert, color: sectorAlerts.filter(a => a.type === "critical" && a.status === "active").length > 0 ? "text-rose-500 animate-pulse" : "text-gray-400" },
                    { title: t("Electrical Health", "विद्युत ग्रिड स्वास्थ्य", "ಗ್ರಿಡ್ ಆರೋಗ್ಯ ಸ್ಕೋರ್"), value: `${currentHealth}%`, desc: t("Aggregate line factor", "समग्र प्रणाली दक्षता गुणांक", "ಒಟ್ಟು ವ್ಯವಸ್ಥೆಯ ದಕ್ಷತೆ"), icon: Gauge, color: currentHealth < 60 ? "text-rose-400" : currentHealth < 90 ? "text-amber-400" : "text-emerald-400" },
                    { title: t("Predicted Risk Level", "पूर्वानुमानित जोखिम स्तर", "ಅಪಾಯದ ಪ್ರಮಾಣ"), value: `${sectorData.aiRiskScore}%`, desc: t("RF classification likelihood", "मशीन लर्निंग पूर्वानुमानित खतरा", "ಎಐ ಮಾದರಿ ಪತ್ತೆ ಹಚ್ಚಿದ ಅಪಾಯ"), icon: Brain, color: sectorData.aiRiskScore > 60 ? "text-rose-400 animate-pulse font-bold" : "text-neon-cyan" },
                    { title: t("Peak Usage Window", "पीक बिजली उपयोग समय", "ಹೆಚ್ಚು ಬಳಕೆಯ ಸಮಯ"), value: "18:00 - 21:00", desc: t("Daily highest load cycle", "दैनिक उच्चतम लोडिंग चक्र", "ದಿನದ ಗರಿಷ್ಠ ಬಳಕೆಯ ಸಮಯ"), icon: Clock, color: "text-neon-blue" },
                    { title: t("Accumulated Energy Cost", "संचयी ऊर्जा लागत", "ವಿದ್ಯುತ್ ವೆಚ್ಚ"), value: `$${costAccumulator}`, desc: t("Simulated billing accumulation", "अनुमानित बिलिंग संचय", "ಅಂದಾಜು ಬಿಲ್ ಮೊತ್ತ"), icon: DollarSign, color: "text-emerald-400" },
                    { title: t("AI Core Accuracy", "एआई कोर सटीकता", "ಎಐ ಮಾದರಿಯ ದಕ್ಷತೆ"), value: "95.8% ACC", desc: t("Trained validation score", "प्रशिक्षित प्रमाणीकरण फिट स्कोर", "ತರಬೇತಿ ಪಡೆದ ಮಾದರಿಯ ನಿಖರತೆ"), icon: Sparkles, color: "text-emerald-400" }
                  ].map((card, idx) => {
                    const CardIcon = card.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={`glass-panel p-4 rounded-xl border border-dark-border hover:border-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.01)] ${
                          card.color.includes("rose") || card.color.includes("amber") ? "shadow-glow-" + (card.color.includes("rose") ? "rose" : "amber") : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono block">{card.title}</span>
                            <h3 className={`text-xl font-bold mt-1.5 tracking-tight ${card.color}`}>{card.value}</h3>
                            <span className="text-[9px] text-gray-400 mt-1 font-light leading-snug block">{card.desc}</span>
                          </div>
                          <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${card.color}`}>
                            <CardIcon className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Dashboard Charts Grid (Real-Time Energy & Pie Chart) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Real-Time Energy Consumption Graph */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Real-Time Energy Consumption Graph", "वास्तविक समय ऊर्जा खपत ग्राफ", "ನೈಜ ಸಮಯದ ವಿದ್ಯುತ್ ಬಳಕೆ ನಕ್ಷೆ")}</h3>
                        <p className="text-[9px] text-gray-500 font-mono mt-0.5">{t("Actual Electricity Usage (kWh) vs. ML Forecast", "वास्तविक बिजली उपयोग बनाम मशीन लर्निंग पूर्वानुमान", "ನೈಜ ಬಳಕೆ ಮತ್ತು ಎಐ ಮುನ್ಸೂಚನೆ ಹೋಲಿಕೆ")}</p>
                      </div>
                      <span className="text-[9px] font-mono text-neon-cyan px-2 py-0.5 bg-neon-cyan/5 border border-neon-cyan/20 rounded uppercase">
                        {t("Live Area Plot", "लाइव क्षेत्र प्लॉट", "ಲೈವ್ ನಕ್ಷೆ")}
                      </span>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="resEnergy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0072ff" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#0072ff" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="resForecast" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="energy" name="Actual Draw (kWh)" stroke="#0072ff" fillOpacity={1} fill="url(#resEnergy)" strokeWidth={2} />
                          <Area type="monotone" dataKey="voltage" name="Forecast (kWh)" stroke="#10b981" fillOpacity={1} fill="url(#resForecast)" strokeWidth={1.5} strokeDasharray="3 3" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Anomaly Distribution Pie Chart */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Anomaly Type Distribution", "विसंगति प्रकार वितरण", "ಅಸಂಗತತೆಗಳ ವಿಂಗಡಣೆ")}</h3>
                      
                      <div className="h-44 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: t("Power Theft", "बिजली चोरी", "ವಿದ್ಯುತ್ ಕಳ್ಳತನ"), value: 25 },
                                { name: t("Unexpected Spike", "अचानक लोड स्पाइक", "ಹಠಾತ್ ಏರಿಕೆ"), value: 30 },
                                { name: t("Appliance Fault", "उपकरण खराबी", "ಉಪಕರಣ ದೋಷ"), value: 20 },
                                { name: t("Continuous Overload", "निरंतर ओवरलोड", "ನಿರಂತರ ಓವರ್‌ಲೋಡ್"), value: 15 },
                                { name: t("Midnight Anomaly", "आधी रात का उपयोग विसंगति", "ಮಧ್ಯರಾತ್ರಿ ಅಸಂಗತತೆ"), value: 10 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={60}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {COLORS.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={["#ef4444", "#f59e0b", "#00f0ff", "#0072ff", "#10b981"][idx % 5]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                          <span className="text-xl font-bold font-mono text-white leading-none">5</span>
                          <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">{t("Active classes", "सक्रिय श्रेणियां", "ಸಕ್ರಿಯ ವಿಭಾಗ")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono mt-3">
                      {[
                        { name: t("Theft", "चोरी", "ಕಳ್ಳತನ"), color: "#ef4444", val: "25%" },
                        { name: t("Spike", "स्पाइक", "ಸ್ಪೈಕ್"), color: "#f59e0b", val: "30%" },
                        { name: t("Fault", "खराबी", "ದೋಷ"), color: "#00f0ff", val: "20%" },
                        { name: t("Overload", "ओवरलोड", "ಲೋಡ್"), color: "#0072ff", val: "15%" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.01]">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                          <span className="text-gray-400 truncate">{item.name}:</span>
                          <span className="font-bold text-gray-200 ml-auto">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dashboard Bottom Section (Heatmap, Health Gauge & Alerts center Feed) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Left: Health radial and Mini grid of Apartments */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Apartment Risk Grid Status", "अपार्टमेंट जोखिम ग्रिड स्थिति", "ಅಪಾರ್ಟ್ಮೆಂಟ್ ಅಪಾಯದ ಸ್ಥಿತಿ")}</h3>
                      <span className="text-[9px] text-gray-400 font-mono uppercase">{t("Cell selectable", "चयन योग्य सेल", "ಕ್ಲಿಕ್ ಮಾಡಬಹುದು")}</span>
                    </div>

                    {/* Interactive Apartment Cells Grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {Array.from({ length: 12 }, (_, i) => {
                        const aptId = `HH_10${20 + i}`;
                        const isSelected = selectedApartment === aptId;
                        let cellBg = "border-emerald-500/25 bg-emerald-500/5 text-emerald-400";
                        if (i === 1 || i === 7) cellBg = "border-rose-500/30 bg-rose-500/5 text-rose-400 animate-pulse";
                        else if (i === 4 || i === 9) cellBg = "border-amber-500/35 bg-amber-500/5 text-amber-400";
                        
                        return (
                          <button
                            key={aptId}
                            onClick={() => setSelectedApartment(aptId)}
                            className={`p-2.5 rounded-lg border text-center font-mono text-[10px] font-bold uppercase transition-all hover:scale-105 ${cellBg} ${
                              isSelected ? "ring-2 ring-neon-cyan ring-offset-2 ring-offset-black" : ""
                            }`}
                          >
                            Apt {aptId.split("_")[1]}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-400">{t("Selected Target Apartment", "चयनित अपार्टमेंट", "ಆಯ್ಕೆಮಾಡಿದ ಅಪಾರ್ಟ್ಮೆಂಟ್")}:</span>
                      <span className="text-neon-cyan font-bold font-mono">{selectedApartment}</span>
                    </div>
                  </div>

                  {/* Right: Scrolling AI alerts HUD */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Real-Time AI Event Logs HUD", "वास्तविक समय एआई इवेंट लॉग एचयूडी", "ನೈಜ ಸಮಯದ ಎಐ ಈವೆಂಟ್ ಲಾಗ್")}</h3>
                      <span className="text-[9px] text-gray-400 font-mono uppercase">{t("Continuous synching", "सतत समन्वयन", "ನಿರಂತರ ಚಾಲನೆ")}</span>
                    </div>

                    <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                      {mlHistory.length === 0 ? (
                        <div className="py-10 text-center font-mono text-xs text-gray-500">
                          {t("Syncing telemetry data streams...", "टेलीमेट्री डेटा स्ट्रीम सिंक्रनाइज़ कर रहा है...", "ಟೆಲಿಮೆಟ್ರಿ ಡೇಟಾ ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...")}
                        </div>
                      ) : (
                        mlHistory.slice(-4).reverse().map((h, i) => (
                          <div key={i} className={`p-2.5 rounded-lg border text-[10px] font-mono flex items-center justify-between ${
                            h.mode === "crimson" ? "bg-rose-950/20 border-rose-500/20 text-rose-400" : h.mode === "amber" ? "bg-amber-950/20 border-amber-500/20 text-amber-400" : "bg-emerald-950/20 border-emerald-500/20 text-emerald-400"
                          }`}>
                            <span className="font-bold flex items-center gap-1.5">
                              <span className={`w-1.5 h-1.5 rounded-full ${h.mode === "crimson" ? "bg-rose-400 animate-ping" : h.mode === "amber" ? "bg-amber-400" : "bg-emerald-400"}`}></span>
                              [{h.name}] Apt {selectedApartment.split("_")[1]} - {h.status}
                            </span>
                            <span>{t("Risk Score", "जोखिम स्कोर", "ಅಪಾಯ")}: {h.risk}%</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LIVE MONITORING VIEW */}
            {activeResTab === "live" && (
              <div className="space-y-6">
                {/* Glowing Dials & Progress Bars */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { title: t("Grid Ingestion Voltage", "ग्रिड वोल्टेज", "ಗ್ರಿಡ್ ವೋಲ್ಟೇಜ್"), value: `${(238.4 + (Math.random() - 0.5) * 3).toFixed(1)} V`, target: "240.0 V", fill: "#00f0ff", prc: 98 },
                    { title: t("Substation Current", "सबस्टेशन विद्युत प्रवाह", "ವಿದ್ಯುತ್ ಹರಿವು"), value: `${(8.4 + (Math.random() - 0.5) * 1.5).toFixed(1)} A`, target: "15.0 A Max", fill: "#f59e0b", prc: 56 },
                    { title: t("Power Factor Coefficient", "पावर फैक्टर गुणांक", "ಪವರ್ ಫ್ಯಾಕ್ಟರ್"), value: `${(0.95 + (Math.random() - 0.5) * 0.02).toFixed(2)}`, target: "1.00 PF Optimal", fill: "#10b981", prc: 95 }
                  ].map((meter, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-xl border border-dark-border text-center space-y-4">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono block">{meter.title}</span>
                      <h3 className="text-3xl font-extrabold font-mono tracking-tight text-white">{meter.value}</h3>
                      <div className="space-y-1">
                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full transition-all duration-1000" style={{ width: `${meter.prc}%`, backgroundColor: meter.fill }}></div>
                        </div>
                        <div className="flex justify-between text-[9px] text-gray-500 font-mono">
                          <span>0.0</span>
                          <span>{t("Target", "लक्ष्य", "ಗುರಿ")}: {meter.target}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rolling Telemetry area graphs & Appliance load split charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Rolling Telemetry energy split */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Live Telemetry Flow Ingest", "लाइव टेलीमेट्री प्रवाह", "ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ ಹರಿವು")}</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="energy" name="Energy draw (kWh)" stroke="#00f0ff" fill="rgba(0, 240, 255, 0.05)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Active Appliance Wattage Draw Bar Chart */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Active Appliance load draw", "सक्रिय उपकरण लोड विद्युत प्रवाह", "ಸಾಧನಗಳ ವಿದ್ಯುತ್ ಬಳಕೆ ವಿವರ")}</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: t("Smart AC", "स्मार्ट एसी", "ಏಸಿ"), power: 1.8 },
                          { name: t("EV Charger", "इलेक्ट्रिक वाहन चार्जर", "ಇವಿ ಚಾರ್ಜರ್"), power: 3.2 },
                          { name: t("Refrigerator", "रेफ्रिजरेटर", "ಫ್ರಿಡ್ಜ್"), power: 0.3 },
                          { name: t("Water Geyser", "गीज़र", "ಗೀಸರ್"), power: 2.0 },
                          { name: t("Microwave", "माइक्रोवेव", "ಮೈಕ್ರೋವೇವ್"), power: 1.1 }
                        ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                          <Tooltip />
                          <Bar dataKey="power" name="Wattage load (kW)" fill="#0072ff" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. ANOMALY DETECTION PORTAL */}
            {activeResTab === "anomalies" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-gray-200 font-mono uppercase">{t("Trained Anomaly Classifier Hub", "प्रशिक्षित विसंगति वर्गीकारक हब", "ಅಸಂಗತತೆ ಪತ್ತೆ ಕೇಂದ್ರ")}</h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Our Random Forest Classifier isolates 6 types of residential anomalies automatically.", "हमारा रैंडम फॉरेस्ट मॉडल स्वचालित रूप से 6 प्रकार की विसंगतियों की पहचान करता है।", "ನಮ್ಮ ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ ಮಾದರಿಯು 6 ರೀತಿಯ ವಿದ್ಯುತ್ ಅಸಂಗತತೆಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆ ಮಾಡುತ್ತದೆ.")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: "theft", name: t("Power Theft Analytics", "बिजली चोरी विश्लेषण", "ವಿದ್ಯುತ್ ಕಳ್ಳತನ"), desc: t("Detect suspicious grid diversion bypasses", "संदिग्ध ग्रिड बाईपास का पता लगाएं", "ಸಂಶಯಾಸ್ಪದ ವಿದ್ಯುತ್ ಕಳ್ಳತನ ಪತ್ತೆ ಹಚ್ಚಿ"), accent: "border-rose-500/20 text-rose-400 bg-rose-950/5" },
                    { id: "spike", name: t("Spike Detection", "अचानक लोड स्पाइक", "ಹಠಾತ್ ಏರಿಕೆ ಪತ್ತೆ"), desc: t("Identify sudden rapid short-term load surges", "अचानक लोड वृद्धि की पहचान करें", "ಸಾಧನಗಳಲ್ಲಿ ಹಠಾತ್ ಲೋಡ್ ಏರಿಕೆಯನ್ನು ಗುರುತಿಸಿ"), accent: "border-amber-500/20 text-amber-400 bg-amber-950/5" },
                    { id: "appliance", name: t("Appliance Monitoring", "उपकरण खराबी", "ಉಪಕರಣ ಉಸ್ತುವಾರಿ"), desc: t("Detect faulty mechanical signatures in AC/Fridge", "उपकरणों में यांत्रिक विफलता का पता लगाएं", "ಸಾಧನಗಳ ಯಾಂತ್ರಿಕ ದೋಷಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ"), accent: "border-neon-cyan/20 text-neon-cyan bg-cyan-950/5" },
                    { id: "dashboard", name: t("Continuous Overload", "निरंतर ओवरलोड", "ನಿರಂತರ ಓವರ್‌ಲೋಡ್"), desc: t("Long-duration heavy demand overload detection", "लंबे समय तक चलने वाले भारी ओवरलोड की पहचान करें", "ನಿರಂತರವಾಗಿ ಹೆಚ್ಚಿರುವ ಓವರ್‌ಲೋಡ್ ಪತ್ತೆ ಮಾಡಿ"), accent: "border-rose-500/20 text-rose-400 bg-rose-950/5" },
                    { id: "heatmaps", name: t("Abnormal Midnight Usage", "असामान्य आधी रात का उपयोग", "ಮಧ್ಯರಾತ್ರಿ ಅಸಂಗತ ಬಳಕೆ"), desc: t("Detect unusual nighttime electricity draw spikes", "असामान्य रात्रि बिजली उपयोग को चिह्नित करें", "ಮಧ್ಯರಾತ್ರಿಯಲ್ಲಿ ಕಂಡುಬರುವ ಅಸಂಗತ ಬಳಕೆ ಪತ್ತೆ ಹಚ್ಚಿ"), accent: "border-amber-500/20 text-amber-400 bg-amber-950/5" },
                    { id: "predictions", name: t("Weather Mismatch", "मौसम बेमेल उपयोग", "ಹವಾಮಾನ ಅಸಮಂಜಸ ಬಳಕೆ"), desc: t("Compare outdoor temp averages vs HVAC power draws", "परिवेश मौसम के प्रतिकूल अक्षमता का पता लगाएं", "ಹವಾಮಾನಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗದ ವಿದ್ಯುತ್ ಬಳಕೆ ಪತ್ತೆ ಮಾಡಿ"), accent: "border-teal-500/20 text-teal-400 bg-teal-950/5" }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-all duration-300 ${item.accent}`}>
                      <div>
                        <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-gray-200">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setActiveResTab(item.id)}
                        className="w-full py-1.5 bg-white/5 border border-white/5 hover:border-white/20 rounded font-mono text-[9px] uppercase font-bold text-gray-200"
                      >
                        {t("View Deep Analytics", "गहन विश्लेषण देखें", "ವಿವರವಾದ ವಿಶ್ಲೇಷಣೆ")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. POWER THEFT ANALYTICS */}
            {activeResTab === "theft" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-rose-300 flex items-start gap-3 shadow-glow-rose font-mono">
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 animate-pulse mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      {t("AI PREDICTION THREAT DETECTED", "एआई खतरा चेतावनी", "ಎಐ ಮಾದರಿ ಪತ್ತೆ ಹಚ್ಚಿದ ಗಂಭೀರ ಅಪಾಯ")}
                    </h4>
                    <p className="text-[11px] leading-relaxed">
                      {t("CRITICAL POWER THEFT DETECTED: Unauthorized electricity usage behavior identified at Household " + selectedApartment + ".", "महत्वपूर्ण बिजली चोरी का पता चला: अनधिकृत बिजली उपयोग व्यवहार की पहचान की गई है।", "ವಿದ್ಯುತ್ ಕಳ್ಳತನ ಪತ್ತೆಯಾಗಿದೆ: ಅಪಾರ್ಟ್ಮೆಂಟ್ " + selectedApartment + " ನಲ್ಲಿ ಅನಧಿಕೃತ ವಿದ್ಯುತ್ ಬಳಕೆ ಪತ್ತೆಯಾಗಿದೆ.")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Theft probability meter */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border text-center flex flex-col justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono block">{t("Theft Probability Score", "चोरी की संभावना स्कोर", "ವಿದ್ಯುತ್ ಕಳ್ಳತನದ ಸಂಭವನೀಯತೆ")}</span>
                    
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-4 border-rose-500/10 border-t-rose-500 flex items-center justify-center animate-spin">
                        <span className="text-3xl font-extrabold font-mono text-rose-400 rotate-[-360deg] select-none">82%</span>
                      </div>
                      <span className="text-[9px] font-mono text-rose-400 uppercase mt-3 tracking-widest animate-pulse font-bold">{t("CRITICAL ANOMALY", "गंभीर विसंगति", "ಗಂಭೀರ ಅಸಂಗತತೆ")}</span>
                    </div>

                    <button
                      onClick={() => setIsInspectionTriggered(true)}
                      className="w-full py-2 bg-rose-500 text-white rounded-lg font-mono font-bold text-[10px] uppercase shadow-glow-rose hover:opacity-90 transition-all"
                    >
                      {t("Initiate Smart Meter Inspection", "स्मार्ट मीटर निरीक्षण शुरू करें", "ತಪಾಸಣಾ ತಂಡವನ್ನು ಕಳುಹಿಸಿ")}
                    </button>
                  </div>

                  {/* Comparison analytics graph */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Theft vs. Baseline Consumption Curve", "चोरी बनाम बेसलाइन बिजली खपत वक्र", "ಬಳಕೆಯ ಹೋಲಿಕೆ ನಕ್ಷೆ")}</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="energy" name="Actual usage (kWh)" stroke="#ef4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={2} />
                          <Area type="monotone" dataKey="voltage" name="Average Baseline" stroke="#10b981" fill="rgba(16, 185, 129, 0.02)" strokeWidth={1} strokeDasharray="3 3" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SPIKE DETECTION VIEW */}
            {activeResTab === "spike" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-start gap-3 shadow-glow-amber font-mono">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 animate-pulse mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">{t("AI WARNING SPIKE DETECTED", "एआई अचानक लोड स्पाइक चेतावनी", "ಎಐ ಹಠಾತ್ ಲೋಡ್ ಏರಿಕೆ ಅಲರ್ಟ್")}</h4>
                    <p className="text-[11px] leading-relaxed">
                      {t("WARNING: Sudden residential electricity spike detected at Household " + selectedApartment + ".", "चेतावनी: घरेलू ग्रिड लाइन पर बिजली की अचानक तेज उछाल दर्ज की गई है।", "ಎಚ್ಚರಿಕೆ: ಅಪಾರ್ಟ್ಮೆಂಟ್ " + selectedApartment + " ನಲ್ಲಿ ಹಠಾತ್ ವಿದ್ಯುತ್ ಏರಿಕೆ ಪತ್ತೆಯಾಗಿದೆ.")}
                    </p>
                  </div>
                </div>

                <div className="glass-panel p-5 rounded-xl border border-dark-border">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Spike Graph with red anomaly markers", "विसंगति मार्करों के साथ लोड स्पाइक ग्राफ", "ಹಠಾತ್ ಏರಿಕೆ ಗುರುತಿಸುವ ನಕ್ಷೆ")}</h3>
                    <button
                      onClick={() => setIsLoadReduced(true)}
                      className="px-4 py-1.5 bg-amber-500 text-black rounded-lg font-mono font-bold text-[9px] uppercase shadow-glow-amber hover:opacity-90 transition-all"
                    >
                      {t("Reduce High-Power Appliance Usage", "उच्च-बिजली उपकरण का उपयोग कम करें", "ಹೆಚ್ಚು ವಿದ್ಯುತ್ ಬಳಸುವ ಸಾಧನಗಳ ಬಳಕೆ ಕಡಿಮೆ ಮಾಡಿ")}
                    </button>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="energy" name="Load (kWh)" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.05)" strokeWidth={2} dot={<RenderSpikeDot />} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 6. APPLIANCE MONITORING VIEW */}
            {activeResTab === "appliance" && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 flex items-start gap-3 shadow-glow-amber font-mono">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 animate-pulse mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">{t("APPLIANCE FATIGUE FLAG WARNING", "उपकरण यांत्रिक खराबी चेतावनी", "ಸಾಧನಗಳ ಯಾಂತ್ರಿಕ ದೋಷದ ಎಚ್ಚರಿಕೆ")}</h4>
                    <p className="text-[11px] leading-relaxed">
                      {t("FAULT WARNING: Smart refrigerator operating outside safe electrical threshold at Household " + selectedApartment + ".", "खराबी चेतावनी: स्मार्ट रेफ्रिजरेटर सुरक्षित सीमा के बाहर चल रहा है।", "ದೋಷದ ಎಚ್ಚರಿಕೆ: ಅಪಾರ್ಟ್ಮೆಂಟ್ " + selectedApartment + " ನಲ್ಲಿ ರೆಫ್ರಿಜರೇಟರ್ ಸುರಕ್ಷಿತ ಮಿತಿಗಿಂತ ಹೊರಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ.")}
                    </p>
                  </div>
                </div>

                {/* Appliance Health Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: t("Smart Refrigerator", "स्मार्ट रेफ्रिजरेटर", "ರೆಫ್ರಿಜರೇಟರ್"), status: t("Fault Risk (88%)", "खराबी का खतरा (88%)", "ದೋಷದ ಸಂಭವನೀಯತೆ (88%)"), color: "text-amber-400 border-amber-500/30 bg-amber-950/5 animate-pulse", prc: 88 },
                    { name: t("HVAC Climate AC", "स्मार्ट एसी", "ಏಸಿ"), status: t("94% Stable", "94% स्थिर", "94% ಸ್ಥಿರವಾಗಿದೆ"), color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/5", prc: 6 },
                    { name: t("Water Geyser", "गीज़र", "ಗೀಸರ್"), status: t("91% Stable", "91% स्थिर", "91% ಸ್ಥಿರವಾಗಿದೆ"), color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/5", prc: 9 },
                    { name: t("EV Charger Terminal", "इलेक्ट्रिक वाहन चार्जर", "ಇವಿ ಚಾರ್ಜರ್"), status: t("98% Stable", "98% स्थिर", "98% ಸ್ಥಿರವಾಗಿದೆ"), color: "text-emerald-400 border-emerald-500/20 bg-emerald-950/5", prc: 2 }
                  ].map((app, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border font-mono space-y-3 ${app.color}`}>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold uppercase">{app.name}</span>
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-sm font-extrabold">{app.status}</h4>
                      <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-current" style={{ width: `${100 - app.prc}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setIsMaintenanceScheduled(true)}
                    className="px-6 py-2 bg-neon-cyan text-black rounded-lg font-mono font-bold text-[10px] uppercase shadow-glow-cyan hover:opacity-90 transition-all"
                  >
                    {t("Schedule Appliance Maintenance", "उपकरण रखरखाव अनुसूची करें", "ನಿರ್ವಹಣಾ ಸಮಯ ನಿಗದಿಪಡಿಸಿ")}
                  </button>
                </div>
              </div>
            )}

            {/* 7. AI PREDICTIONS & ENERGY FORECASTING */}
            {activeResTab === "predictions" && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-dark-border">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("AI Energy Demand Forecasting Graph", "एआई बिजली मांग पूर्वानुमान ग्राफ", "ಎಐ ವಿದ್ಯುತ್ ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ ನಕ್ಷೆ")}</h3>
                      <p className="text-[9px] text-gray-500 font-mono mt-0.5">{t("Historical actual draws vs. 3-Hour projected dotted forecast with confidence overlay", "3-घंटे के भविष्य के अनुमानित डॉटेड पूर्वानुमान के साथ ऐतिहासिक वास्तविक बिजली उपयोग", "3 ಗಂಟೆಗಳ ಭವಿಷ್ಯದ ವಿದ್ಯುತ್ ಬೇಡಿಕೆ ಮತ್ತು ಅಂದಾಜು ನಕ್ಷೆ")}</p>
                    </div>
                    <button
                      onClick={() => setIsEcoOptimized(true)}
                      className="px-4 py-1.5 bg-teal-600 text-white rounded-lg font-mono font-bold text-[9px] uppercase shadow-glow-teal hover:opacity-90 transition-all"
                    >
                      {t("Enable Smart Energy Optimization", "स्मार्ट ऊर्जा अनुकूलन सक्षम करें", "ಸ್ಮಾರ್ಟ್ ಎನರ್ಜಿ ಸಕ್ರಿಯಗೊಳಿಸಿ")}
                    </button>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="foreConfidence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="upperBound" stroke="none" fill="url(#foreConfidence)" />
                        <Area type="monotone" dataKey="lowerBound" stroke="none" fill="url(#foreConfidence)" />
                        <Area type="monotone" dataKey="actual" name="Actual Draw (kWh)" stroke="#0072ff" fill="none" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="forecast" name="Projected Forecast (kWh)" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Weather vs Energy Usage Graph */}
                <div className="glass-panel p-5 rounded-xl border border-dark-border">
                  <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Weather temperature vs Energy usage", "मौसम का तापमान बनाम बिजली उपयोग", "ಹವಾಮಾನ ತಾಪಮಾನ ಮತ್ತು ವಿದ್ಯುತ್ ಬಳಕೆ ಹೋಲಿಕೆ")}</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="temperature" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="energy" name="Electricity usage (kWh)" stroke="#00f0ff" fill="rgba(0, 240, 255, 0.05)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 8. APARTMENT HEATMAPS */}
            {activeResTab === "heatmaps" && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-6">
                  <div className="border-b border-white/5 pb-2">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Residential Substation Hotspots (30 Apartments)", "आवासीय सबस्टेशन हॉटस्पॉट (30 अपार्टमेंट)", "ವಸತಿ ವಿದ್ಯುತ್ ಬಳಕೆ ನಕ್ಷೆ (30 ಅಪಾರ್ಟ್ಮೆಂಟ್)")}</h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Select any apartment to bind it as the current active target simulation context.", "वर्तमान सक्रिय लक्ष्य सिमुलेशन संदर्भ के रूप में इसे बाँधने के लिए किसी भी अपार्टमेंट का चयन करें।", "ಯಾವುದೇ ಅಪಾರ್ಟ್ಮೆಂಟ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅದರ ಸಂಪೂರ್ಣ ವಿವರ ವೀಕ್ಷಿಸಬಹುದು.")}</p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 30 }, (_, i) => {
                      const aptId = `HH_10${10 + i}`;
                      const isSelected = selectedApartment === aptId;
                      let cellBg = "border-emerald-500/25 bg-emerald-500/5 text-emerald-400";
                      
                      // Inject some red/amber alerts for authentic heatmap distribution
                      if (i === 4 || i === 12 || i === 22) cellBg = "border-rose-500/30 bg-rose-500/5 text-rose-400 animate-pulse";
                      else if (i === 8 || i === 17 || i === 27) cellBg = "border-amber-500/35 bg-amber-500/5 text-amber-400";

                      return (
                        <button
                          key={aptId}
                          onClick={() => setSelectedApartment(aptId)}
                          className={`p-3 rounded-xl border font-mono text-[10px] font-bold transition-all hover:scale-105 ${cellBg} ${
                            isSelected ? "ring-2 ring-neon-cyan ring-offset-2 ring-offset-black" : ""
                          }`}
                        >
                          Apt {aptId.split("_")[1]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 9. ANALYTICS & REPORTS */}
            {activeResTab === "reports" && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Administrative Reports & Analytics HUD", "प्रशासनिक रिपोर्ट और विश्लेषिकी एचयूडी", "ವರದಿ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ")}</h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Simulate downloading analytical summaries, predictive audits, and actions.", "विश्लेषणात्मक सारांश, पूर्वानुमानित ऑडिट और क्रियाएं डाउनलोड करने का अनुकरण करें।", "ವಿದ್ಯುತ್ ಬಳಕೆ ಮತ್ತು ಅಪಾಯದ ಮುನ್ಸೂಚನೆ ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.")}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownloadReport("pdf")}
                        disabled={reportProgress !== -1}
                        className="px-3.5 py-1.5 bg-rose-500 text-white rounded font-mono text-[9px] uppercase font-bold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>
                      
                      <button
                        onClick={() => handleDownloadReport("excel")}
                        disabled={reportProgress !== -1}
                        className="px-3.5 py-1.5 bg-emerald-500 text-black rounded font-mono text-[9px] uppercase font-bold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Export Excel</span>
                      </button>
                    </div>
                  </div>

                  {/* Report Download simulator loading bar */}
                  {reportProgress !== -1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                        <span>{reportType === "pdf" ? "Rendering PDF Document canvas..." : "Assembling Excel Cell Database matrices..."}</span>
                        <span>{reportProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-cyan transition-all duration-300" style={{ width: `${reportProgress}%` }}></div>
                      </div>
                      {reportProgress === 100 && (
                        <div className="text-[10px] font-mono text-emerald-400 font-bold mt-1 uppercase flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t("File successfully compiled & downloaded to local storage directory.", "फ़ाइल सफलतापूर्वक संकलित और डाउनलोड की गई।", "ವರದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.")}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Apartment Monitoring Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[10px] font-mono">
                      <thead>
                        <tr className="border-b border-dark-border text-gray-500 uppercase">
                          <th className="pb-3 pl-2">{t("Apartment ID", "अपार्टमेंट आईडी", "ಅಪಾರ್ಟ್ಮೆಂಟ್ ಐಡಿ")}</th>
                          <th className="pb-3">{t("Timestamp", "समय", "ಸಮಯ")}</th>
                          <th className="pb-3">{t("Electricity (kWh)", "बिजली (kWh)", "ವಿದ್ಯುತ್ (kWh)")}</th>
                          <th className="pb-3">{t("Temp", "मौसम तापमान", "ತಾಪಮಾನ")}</th>
                          <th className="pb-3">{t("Humidity", "आर्द्रता", "ಆರ್ದ್ರತೆ")}</th>
                          <th className="pb-3">{t("Anomaly Type", "विसंगति प्रकार", "ಅಸಂಗತತೆಯ ವಿಧ")}</th>
                          <th className="pb-3">{t("Severity", "तीव्रता", "ಅಪಾಯದ ಮಟ್ಟ")}</th>
                          <th className="pb-3 pr-2 text-right">{t("AI Confidence", "एआई सटीकता", "ನಿಖರತೆ")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/40 text-gray-300">
                        {resRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.01]">
                            <td className="py-2.5 pl-2 font-bold text-gray-200">{row.Household_ID || "HH_1027"}</td>
                            <td className="py-2.5 text-gray-400">{row.Timestamp}</td>
                            <td className="py-2.5 text-neon-cyan font-bold">{row.Electricity_Usage_kWh} kWh</td>
                            <td className="py-2.5">{row.Temperature}°C</td>
                            <td className="py-2.5">{row.Humidity}%</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                row.Anomaly_Status === "Critical" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : row.Anomaly_Status === "Warning" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {row.Anomaly_Type}
                              </span>
                            </td>
                            <td className="py-2.5">{row.Anomaly_Status}</td>
                            <td className="py-2.5 pr-2 text-right font-bold text-emerald-400">95.8%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 10. AI CHATBOT SYSTEM */}
            {activeResTab === "chatbot" && (
              <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-4">
                <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Residential AI Agent Assistant Console", "आवासीय एआई सहायक कंसोल", "ವಸತಿ ವಿದ್ಯುತ್ ಎಐ ಸಹಾಯಕ")}</h3>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">{t("Fully localized diagnostic support in English, Hindi, and Kannada", "अंग्रेजी, हिंदी और कन्नड़ में स्थानीयकृत नैदानिक सहायता", "ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ")}</p>
                  </div>
                  <Brain className="w-5 h-5 text-neon-cyan" />
                </div>

                {/* Prebuilt Quick Query Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    t("What is causing the Power Theft alert?", "बिजली चोरी की चेतावनी का क्या कारण है?", "ವಿದ್ಯುತ್ ಕಳ್ಳತನದ ಎಚ್ಚರಿಕೆಗೆ ಕಾರಣವೇನು?"),
                    t("Explain the unexpected spike at 15:00", "अचानक लोड स्पाइक की व्याख्या करें", "ಮಧ್ಯಾಹ್ನ 3 ಗಂಟೆಯ ಹಠಾತ್ ಲೋಡ್ ಏರಿಕೆಗೆ ಕಾರಣವೇನು?"),
                    t("How do I optimize AC energy usage?", "एसी बिजली उपयोग को कैसे अनुकूलित करें?", "ಏಸಿ ಬಳಕೆಯನ್ನು ನಿಯಂತ್ರಿಸುವುದು ಹೇಗೆ?")
                  ].map((queryText, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUserQuery(queryText);
                      }}
                      className="px-3 py-1.5 rounded bg-white/5 border border-white/5 hover:border-neon-cyan/35 text-[9px] font-mono text-gray-300 hover:text-neon-cyan transition-all"
                    >
                      {queryText}
                    </button>
                  ))}
                </div>

                {/* Message logs scrolling box */}
                <div className="h-64 overflow-y-auto border border-white/5 bg-black/30 p-4 rounded-xl space-y-4 font-mono text-xs max-h-72">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-neon-cyan text-black font-bold rounded-tr-none shadow-glow-cyan" 
                          : "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none"
                      }`}>
                        {msg.sender === "user" ? msg.text : t(msg.text, msg.text_hi || msg.text, msg.text_kn || msg.text)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Query submission form */}
                <form onSubmit={handleChatSubmit} className="flex gap-2 font-mono">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={t("Type your residential energy questions...", "अपनी बिजली ऊर्जा संबंधी प्रश्न टाइप करें...", "ವಿದ್ಯುತ್ ಬಳಕೆಯ ಬಗ್ಗೆ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ...")}
                    className="flex-1 bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2.5 text-xs text-gray-200"
                  />
                  <button type="submit" className="p-2.5 bg-neon-cyan hover:opacity-90 text-black rounded-lg transition-all shadow-glow-cyan">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* 11. SYSTEM SETTINGS */}
            {activeResTab === "settings" && (
              <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-6 font-mono text-xs">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Residential Subsystem Simulation Parameters", "आवासीय सिमुलेशन पैरामीटर", "ವ್ಯವಸ್ಥೆಯ ನಿಯತಾಂಕಗಳು")}</h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Tune warning thresholds and model inference triggers for residential smart grid loops.", "आवासीय स्मार्ट ग्रिड के लिए चेतावनी सीमा और एआई निष्कर्ष मापदंडों को ट्यून करें।", "ಸ್ಮಾರ್ಟ್ ಗ್ರಿಡ್ ಅಲರ್ಟ್‌ಗಳು ಮತ್ತು ಮಾದರಿಯ ದಕ್ಷತೆಯನ್ನು ಹೊಂದಿಸಿ.")}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">{t("Critical Overload Threshold", "ओवरलोड थ्रेसहोल्ड", "ಲೋಡ್ ಮಿತಿ")}</label>
                      <input type="text" defaultValue="15.0 kWh" className="w-full bg-white/5 border border-dark-border rounded-lg p-2.5 text-gray-200" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">{t("Voltage Warning Bounds", "वोल्टेज थ्रेसहोल्ड", "ವೋಲ್ಟೇಜ್ ಮಿತಿ")}</label>
                      <input type="text" defaultValue="200V - 250V" className="w-full bg-white/5 border border-dark-border rounded-lg p-2.5 text-gray-200" />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] uppercase font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("Configuration Synced with Random Forest Regressor fits.", "रैंडम फॉरेस्ट रिग्रेशर के साथ विन्यास समन्वयित।", "ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ ಮಾದರಿಯೊಂದಿಗೆ ನಿಯತಾಂಕಗಳನ್ನು ಹೊಂದಿಸಲಾಗಿದೆ.")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================
            FLOATING COLLAPSIBLE AI CHATBOT (Bottom Right Corner)
            ======================================================================== */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {chatbotOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-80 h-96 glass-panel border border-dark-border rounded-2xl shadow-glass flex flex-col justify-between overflow-hidden mb-3"
              >
                <div className="p-3 bg-neon-cyan text-black font-extrabold font-mono text-xs flex justify-between items-center shadow-glow-cyan">
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4" />
                    <span>{t("Residential Energy AI Assistant", "आवासीय एआई सहायक", "ವಸತಿ ವಿದ್ಯುತ್ ಸಹಾಯಕ")}</span>
                  </div>
                  <button onClick={() => setChatbotOpen(false)} className="text-black hover:opacity-75 font-bold">✕</button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-[10px] bg-black/40">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                        msg.sender === "user" ? "bg-neon-cyan text-black font-bold" : "bg-white/5 border border-white/5 text-gray-200"
                      }`}>
                        {msg.sender === "user" ? msg.text : t(msg.text, msg.text_hi || msg.text, msg.text_kn || msg.text)}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleChatSubmit} className="p-2 border-t border-white/5 bg-[#0b1020] flex gap-2 font-mono">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={t("Ask energy questions...", "प्रश्न पूछें...", "ಪ್ರಶ್ನೆ ಕೇಳಿ...")}
                    className="flex-1 bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2 text-[10px] text-gray-200"
                  />
                  <button type="submit" className="p-2 bg-neon-cyan hover:opacity-90 text-black rounded-lg transition-all">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setChatbotOpen(!chatbotOpen)}
            className="p-3.5 rounded-full bg-neon-cyan text-black hover:opacity-90 transition-all shadow-glow-cyan flex items-center justify-center border border-neon-cyan"
            title={t("Open AI Assistant Chatbot", "एआई सहायक खोलें", "ಎಐ ಸಹಾಯಕ")}
          >
            <MessageSquare className="w-6 h-6 animate-pulse" />
          </button>
        </div>
      </div>
    );
  };

  // ========================================================================
  // RENDER METHOD FOR AI SMART HOSPITAL MONITORING & ANOMALY DETECTION SYSTEM
  // ========================================================================
  const renderHospital = () => {
    // Trilingual translation helper
    const t = (en, hi, kn) => {
      if (resLanguage === "hi") return hi;
      if (resLanguage === "kn") return kn;
      return en;
    };

    const hospitalMenuItems = [
      { id: "dashboard", name: t("Dashboard Overview", "डैशबोर्ड अवलोकन", "ಡ್ಯಾಶ್ಬೋರ್ಡ್ ಅವಲೋಕನ"), icon: LayoutDashboard },
      { id: "live", name: t("ICU Live Telemetry", "आईसीयू लाइव टेलीमेट्री", "ಐಸಿಯು ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ"), icon: Activity },
      { id: "anomalies", name: t("Anomaly Analytics", "विसंगति विश्लेषण", "ಅಸಂಗತತೆ ವಿಶ್ಲೇಷಣೆ"), icon: ShieldAlert },
      { id: "icurisk", name: t("ICU Risk Control", "आईसीयू जोखिम नियंत्रण", "ಐಸಿಯು ಅಪಾಯದ ನಿಯಂತ್ರಣ"), icon: BrainCircuit },
      { id: "wards", name: t("Ward & Bed Resource", "वार्ड और बेड संसाधन", "ವಾರ್ಡ್ ಮತ್ತು ಬೆಡ್ ಬಳಕೆ ನಿಯೋಜನೆ"), icon: Map },
      { id: "predictions", name: t("AI Predictions", "एआई भविष्यवाणियां", "ಎಐ ಮುನ್ಸೂಚನೆಗಳು"), icon: Brain },
      { id: "heatmaps", name: t("Patient Heatmap", "रोगी हीटमैप", "ರೋಗಿಗಳ ಹೀಟ್ ಮ್ಯಾಪ್"), icon: Sliders },
      { id: "reports", name: t("Reports & Audits", "रिपोर्ट और ऑडिट", "ವರದಿ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನೆ"), icon: FileText },
      { id: "chatbot", name: t("AI Health Assistant", "एआई स्वास्थ्य सहायक", "ಎಐ ಆರೋಗ್ಯ ಸಹಾಯಕ"), icon: MessageSquare },
      { id: "settings", name: t("System Calibration", "सिस्टम अंशांकन", "ಸಿಸ್ಟಮ್ ಮಾಪನಾಂಕ ನಿರ್ಣಯ"), icon: SettingsIcon }
    ];

    // Hospital visual states
    let currentHealth = 98;
    if (currentMlRow) {
      if (currentMlRow.mode === "crimson") currentHealth = 48;
      else if (currentMlRow.mode === "amber") currentHealth = 74;
      else if (currentMlRow.mode === "teal") currentHealth = 88;
    }

    const costAccumulator = (sectorData.energyConsumption * 1.25).toFixed(0);

    // Recharts customized dot
    const RenderSpikeDot = (props) => {
      const { cx, cy, payload } = props;
      if (payload.energy > 85 || payload.mode === "crimson") {
        return (
          <circle cx={cx} cy={cy} r={6} fill="#f43f5e" stroke="#ffffff" strokeWidth={1.5} className="animate-pulse" />
        );
      }
      return <circle cx={cx} cy={cy} r={3.5} fill="#00f0ff" />;
    };

    // Calculate predictions for forecasting charts
    const baseData = sectorData.chartData.slice(-5) || [];
    const forecastChartData = baseData.map(p => ({
      name: p.name,
      actual: p.energy,
      forecast: p.energy,
      lowerBound: Math.max(0, p.energy * 0.95),
      upperBound: p.energy * 1.05
    }));

    // Project 3 future points with dashed line
    const lastPoint = baseData[baseData.length - 1] || { energy: 65 };
    const forecastVal = currentMlRow ? currentMlRow.chilled_water * 3 : 75; 
    forecastChartData.push({
      name: "T+1 hr",
      forecast: forecastVal,
      lowerBound: Math.max(0, forecastVal * 0.9),
      upperBound: forecastVal * 1.1
    });
    forecastChartData.push({
      name: "T+2 hr",
      forecast: forecastVal * 1.05,
      lowerBound: Math.max(0, forecastVal * 0.85),
      upperBound: forecastVal * 1.15
    });
    forecastChartData.push({
      name: "T+3 hr",
      forecast: forecastVal * 0.98,
      lowerBound: Math.max(0, forecastVal * 0.8),
      upperBound: forecastVal * 1.2
    });

    const activeSequence = getActiveRowsSequence();
    const activeRowsToUse = activeSequence.slice(0, 5);

    return (
      <div className="space-y-6 relative">
        {/* Top Header Banner */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-rose-500 flex items-center justify-center shadow-glow-rose animate-pulse">
              <Activity className="w-5.5 h-5.5 text-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-100 uppercase">
                {t("AI Smart Hospital Monitoring & Anomaly Detection System", "एआई स्मार्ट अस्पताल निगरानी और विसंगति पहचान प्रणाली", "ಎಐ ಆಸ್ಪತ್ರೆ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಅಸಂಗತತೆ ಪತ್ತೆ ವ್ಯವಸ್ಥೆ")}
              </h2>
              <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
                {t("Predict. Detect. Prevent. | AI Command Center Console", "भविष्यवाणी। पता लगाना। रोकना। | एआई कमांड सेंटर कंसोल", "ಮುನ್ಸೂಚನೆ. ಪತ್ತೆ. ತಡೆಗಟ್ಟುವಿಕೆ. | ಎಐ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch lg:self-auto justify-between lg:justify-start">
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-lg">
              <button 
                onClick={() => setResLanguage("en")}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${resLanguage === "en" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"}`}
              >
                EN
              </button>
              <button 
                onClick={() => setResLanguage("hi")}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${resLanguage === "hi" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"}`}
              >
                हिन्दी
              </button>
              <button 
                onClick={() => setResLanguage("kn")}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${resLanguage === "kn" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"}`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {t("LIVE FEED ACTIVE (5S)", "लाइव फीड सक्रिय (5S)", "ಲೈವ್ ಫೀಡ್ ಸಕ್ರಿಯ (5S)")}
            </div>
          </div>
        </div>

        {/* Stateful Dispatches confirmation banners */}
        {isMedicalReviewTriggered && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("MEDICAL REVIEW DISPATCHED: Emergency clinical review team mobilized for Patient ID: " + selectedPatientId + ".", "चिकित्सा समीक्षा भेजी गई: आपातकालीन चिकित्सा समीक्षा टीम को रोगी आईडी " + selectedPatientId + " के लिए भेजा गया।", "ವೈದ್ಯಕೀಯ ಪರಿಶೀಲನೆ ಸಕ್ರಿಯ: ತುರ್ತು ವೈದ್ಯಕೀಯ ತಂಡವನ್ನು ರೋಗಿ ಐಡಿ " + selectedPatientId + " ಬಳಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsMedicalReviewTriggered(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {isIcuEscalationTriggered && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between shadow-glow-rose animate-pulse"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>{t("ICU ESCALATION INITIATED: Critical care transfer and bed allocation prioritized for Patient ID: " + selectedPatientId + ".", "आईसीयू आपातकालीन वृद्धि शुरू: रोगी आईडी " + selectedPatientId + " के लिए महत्वपूर्ण बेड आवंटन को प्राथमिकता दी गई।", "ಐಸಿಯು ತುರ್ತು ವರ್ಗಾವಣೆ ಸಕ್ರಿಯ: ರೋಗಿ ಐಡಿ " + selectedPatientId + " ಗಾಗಿ ಐಸಿಯು ಬೆಡ್ ವ್ಯವಸ್ಥೆಯನ್ನು ಆದ್ಯತೆಯ ಮೇರೆಗೆ ಮಾಡಲಾಗುತ್ತಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsIcuEscalationTriggered(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {isResourceAllocationOptimized && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("RESOURCE ALLOCATION OPTIMIZED: Dynamic staff rescheduling and bed assignments updated across wards.", "संसाधन आवंटन अनुकूलित: गतिशील स्टाफ पुनर्निर्धारण और वार्डों में बेड असाइनमेंट अपडेट किया गया।", "ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ ಸಕ್ರಿಯ: ಸಿಬ್ಬಂದಿ ಮತ್ತು ಬೆಡ್ ಬಳಕೆ ನಿಯೋಜನೆಯನ್ನು ವಾರ್ಡ್‌ಗಳಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsResourceAllocationOptimized(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {isFollowUpScheduled && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center justify-between shadow-glow-emerald"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t("FOLLOW-UP SCHEDULED: Post-discharge monitoring consultation booked for Patient ID: " + selectedPatientId + ".", "अनुवर्ती कार्रवाई निर्धारित: रोगी आईडी " + selectedPatientId + " के लिए डिस्चार्ज के बाद अनुवर्ती परामर्श बुक किया गया।", "ಸಮಾಲೋಚನೆ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ: ರೋಗಿ ಐಡಿ " + selectedPatientId + " ಗಾಗಿ ಡಿಸ್ಚಾರ್ಜ್ ನಂತರದ ಸಮಾಲೋಚನೆ ಸಮಯ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.")}</span>
            </div>
            <button onClick={() => setIsFollowUpScheduled(false)} className="text-gray-400 hover:text-white">✕</button>
          </motion.div>
        )}

        {/* Stream Controller panel */}
        <div className={`p-4 rounded-xl glass-panel border ${themeBorderGlow} transition-all duration-500`}>
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                </span>
                <span className="text-xs font-bold font-mono tracking-wider text-gray-200 uppercase">
                  {t("HOSPITAL TELEMETRY STREAM CONTROL BOARD", "अस्पताल टेलीमेट्री स्ट्रीम कंट्रोल बोर्ड", "ಆಸ್ಪತ್ರೆ ಟೆಲಿಮೆಟ್ರಿ ಸ್ಟ್ರೀಮಿಂಗ್ ನಿಯಂತ್ರಣ")}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">
                {t("Streaming Patient ID", "रोगी आईडी स्ट्रीमिंग", "ರೋಗಿ ಐಡಿ ಸ್ಟ್ರೀಮಿಂಗ್")}: <strong className="text-neon-cyan">#{currentMlRow?.patient_id || selectedPatientId}</strong> | {t("Model Inference Latency", "मॉडल निष्कर्ष विलंबता", "ಮಾದರಿ ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ")}: <strong className="text-neon-cyan">{inferenceLatency}ms</strong>
              </p>
            </div>

            {/* Test Module Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setTestModule("auto"); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "auto" ? "bg-neon-cyan text-black border-neon-cyan shadow-glow-cyan" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                Auto-Stream
              </button>
              
              <button
                onClick={() => { setTestModule("emergency"); setStreamIndex(1); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "emergency" ? "bg-rose-600 text-white border-rose-600 shadow-glow-rose" : "bg-rose-950/20 border-rose-500/25 text-rose-400 hover:bg-rose-950/30"
                }`}
              >
                {t("1. Critical Deterioration", "1. गंभीर रोगी गिरावट", "1. ರೋಗಿ ಸ್ಥಿತಿ ಗಂಭೀರ")}
              </button>

              <button
                onClick={() => { setTestModule("decay"); setStreamIndex(0); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "decay" ? "bg-amber-600 text-white border-amber-600 shadow-glow-amber" : "bg-amber-950/20 border-amber-500/25 text-amber-400 hover:bg-amber-950/30"
                }`}
              >
                {t("2. Recovery Decay", "2. रिकवरी में गिरावट", "2. ಗುಣಮುಖವಾಗುವಿಕೆ ಕುಸಿತ")}
              </button>

              <button
                onClick={() => { setTestModule("optimizer"); setStreamIndex(0); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "optimizer" ? "bg-teal-600 text-white border-teal-600 shadow-glow-teal" : "bg-teal-950/20 border-teal-500/25 text-teal-400 hover:bg-teal-950/30"
                }`}
              >
                {t("3. Resource Saturation", "3. संसाधन ओवरलोड", "3. ಸಂಪನ್ಮೂಲ ಕೊರತೆ")}
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-1 rounded-lg">
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-1.5 hover:bg-white/5 rounded text-gray-300">
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => setStreamIndex(prev => prev + 1)} className="p-1.5 hover:bg-white/5 rounded text-gray-300">
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-[10px] font-mono text-gray-300 outline-none pr-2 cursor-pointer"
              >
                <option value={1000} className="bg-dark-bg text-gray-300">1.0x</option>
                <option value={500} className="bg-dark-bg text-gray-300">2.0x</option>
                <option value={250} className="bg-dark-bg text-gray-300">4.0x</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2-Column Sidebar Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* LEFT SUB-SIDEBAR */}
          <div className="xl:col-span-1 space-y-4">
            <div className="glass-panel p-4 rounded-xl border border-dark-border space-y-3">
              <div className="flex items-center gap-2 border-b border-white/5 pb-2.5">
                <div className="w-6 h-6 rounded-lg bg-rose-500 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-black" />
                </div>
                <span className="text-xs font-mono font-black uppercase text-gray-200 tracking-wider">
                  {t("Hospital", "अस्पताल", "ಆಸ್ಪತ್ರೆ")}
                </span>
              </div>

              {hospitalMenuItems.map(item => {
                const MenuItemIcon = item.icon;
                const isSelected = activeHospitalTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveHospitalTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                      isSelected 
                        ? "bg-gradient-to-r from-rose-500/25 to-rose-500/5 text-rose-400 border-rose-500/35 shadow-glow-rose" 
                        : "text-gray-400 border-transparent hover:bg-white/5 hover:text-gray-200"
                    }`}
                  >
                    <MenuItemIcon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT VIEW PORTAL */}
          <div className="xl:col-span-3 space-y-6">

            {/* 1. DASHBOARD PORTAL */}
            {activeHospitalTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* 8 Glowing KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: t("Active Telemetry Nodes", "सक्रिय टेलीमेट्री नोड्स", "ಸಕ್ರಿಯ ಟೆಲಿಮೆಟ್ರಿ ಸಾಧನಗಳು"), value: sectorData.telemetryNodes, desc: t("Ventilators & Cardiac nodes", "वेंटिलेटर और कार्डिएक नोड्स", "ವೆಂಟಿಲೇಟರ್ ಮತ್ತು ಹೃದಯ ಬಡಿತ ಸಾಧನಗಳು"), icon: Activity, color: "text-emerald-400" },
                    { title: t("AI Risk Level Score", "एआई जोखिम स्तर स्कोर", "ಎಐ ಅಪಾಯದ ಪ್ರಮಾಣ"), value: `${sectorData.aiRiskScore}% Risk`, desc: t("ICU escalation probability", "आईसीयू ट्रांसफर संभावना", "ಐಸಿಯು ತುರ್ತು ವರ್ಗಾವಣೆ ಸಂಭವನೀಯತೆ"), icon: Brain, color: sectorData.aiRiskScore > 70 ? "text-rose-400 animate-pulse font-bold" : sectorData.aiRiskScore > 40 ? "text-amber-400" : "text-neon-cyan" },
                    { title: t("Hospital Resource Load", "अस्पताल संसाधन लोड", "ಆಸ್ಪತ್ರೆ ಸಂಪನ್ಮೂಲ ಬಳಕೆ"), value: `${Math.round(currentMlRow?.hospitalOverloadProb || 63)}% Load`, desc: t("Staffing & Ward capacity index", "स्टाफ और वार्ड क्षमता सूचकांक", "ಸಿಬ್ಬಂದಿ ಮತ್ತು ಬೆಡ್ ಬಳಕೆ ಸೂಚ್ಯಂಕ"), icon: Sliders, color: "text-teal-400" },
                    { title: t("Medical Anomalies Flagged", "विसंगतियां चिह्नित", "ಖಂಡಿಸಿದ ಅಸಂಗತತೆಗಳು"), value: sectorData.detectedAnomalies, desc: t("Active alarms in critical care", "गंभीर देखभाल में सक्रिय अलार्म", "ಸಕ್ರಿಯ ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು"), icon: ShieldAlert, color: sectorData.detectedAnomalies > 0 ? "text-rose-400 animate-pulse font-bold" : "text-gray-400" },
                    { title: t("Clinical Health Score", "नैदानिक स्वास्थ्य स्कोर", "ಆರೋಗ್ಯ ಸ್ಕೋರ್"), value: `${currentHealth}% Score`, desc: t("Aggregate patient stability", "समग्र रोगी स्थिरता सूचकांक", "ರೋಗಿಗಳ ಒಟ್ಟು ಸ್ಥಿರತೆ"), icon: Gauge, color: currentHealth < 60 ? "text-rose-400" : currentHealth < 80 ? "text-amber-400" : "text-emerald-400" },
                    { title: t("ICU Ambient Temp status", "आईसीयू वार्ड तापमान", "ಐಸಿಯು ತಾಪಮಾನ"), value: `${currentMlRow?.humidity ? (currentMlRow.humidity / 5).toFixed(1) : "20.4"} °C`, desc: t("Environmental ward control", "पर्यावरण वार्ड नियंत्रण स्थिति", "ಐಸಿಯು ಪರಿಸರ ತಾಪಮಾನ"), icon: Thermometer, color: "text-neon-cyan" },
                    { title: t("Bed Occupancy Rate", "बेड अधिभोग दर", "ಬೆಡ್ ಬಳಕೆ ಪ್ರಮಾಣ"), value: `${Math.round(currentMlRow?.humidity || 70)}% Capacity`, desc: t("Roll census bed occupancy", "कुल बेड अधिभोग प्रतिशत", "ಒಟ್ಟು ಬೆಡ್ ಬಳಕೆ ಪ್ರಮಾಣ"), icon: Map, color: "text-neon-blue" }
                  ].map((card, idx) => {
                    const CardIcon = card.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={`glass-panel p-4 rounded-xl border border-dark-border hover:border-white/10 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.01)] ${
                          card.color.includes("rose") || card.color.includes("amber") ? "shadow-glow-" + (card.color.includes("rose") ? "rose" : "amber") : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono block">{card.title}</span>
                            <h3 className={`text-lg font-bold mt-1.5 tracking-tight ${card.color}`}>{card.value}</h3>
                            <span className="text-[9px] text-gray-400 mt-1 font-light leading-snug block">{card.desc}</span>
                          </div>
                          <div className={`p-2 rounded-lg bg-white/5 border border-white/5 ${card.color}`}>
                            <CardIcon className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Dashboard Charts (Patient Stability & Operational Breakdown) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Realtime Patient Monitoring Graph */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Patient Stability & ICU Monitoring Graph", "रोगी स्थिरता और आईसीयू निगरानी ग्राफ", "ರೋಗಿಗಳ ಸ್ಥಿರತೆ ಮತ್ತು ಐಸಿಯು ಉಸ್ತುವಾರಿ ನಕ್ಷೆ")}</h3>
                        <p className="text-[9px] text-gray-500 font-mono mt-0.5">{t("Deterioration Score vs Combined Risk Score Over Ingest Inflow", "समय के साथ शारीरिक गिरावट स्कोर बनाम संयुक्त जोखिम सूचकांक", "ಸಮಯಕ್ಕೆ ತಕ್ಕಂತೆ ಆರೋಗ್ಯ ಕುಸಿತ ಮತ್ತು ಒಟ್ಟು ಅಪಾಯದ ಹೋಲಿಕೆ")}</p>
                      </div>
                      <span className="text-[9px] font-mono text-rose-400 px-2 py-0.5 bg-rose-500/5 border border-rose-500/20 rounded uppercase">
                        {t("HOSPITAL SECTOR PLOT", "अस्पताल सेक्टर प्लॉट", "ಆಸ್ಪತ್ರೆ ನಕ್ಷೆ")}
                      </span>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="hospDeterioration" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25}/>
                              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="hospRisk" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="energy" name="Deterioration Score" stroke="#f43f5e" fillOpacity={1} fill="url(#hospDeterioration)" strokeWidth={2} dot={<RenderSpikeDot />} />
                          <Area type="monotone" dataKey="voltage" name="Combined Risk Score" stroke="#00f0ff" fillOpacity={1} fill="url(#hospRisk)" strokeWidth={1.5} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Hospital Operational Breakdown (Donut Chart) */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Hospital Operational Breakdown", "अस्पताल परिचालन विश्लेषण", "ಆಸ್ಪತ್ರೆ ಸಂಪನ್ಮೂಲಗಳ ಹಂಚಿಕೆ")}</h3>
                      
                      <div className="h-44 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: t("Stable Patients", "स्थिर रोगी", "ಸ್ಥಿರವಾಗಿರುವ ರೋಗಿಗಳು"), value: currentMlRow?.mode === "crimson" ? 60 : 78 },
                                { name: t("Critical ICU Patients", "गंभीर आईसीयू रोगी", "ಗಂಭೀರ ಐಸಿಯು ರೋಗಿಗಳು"), value: currentMlRow?.mode === "crimson" ? 28 : 12 },
                                { name: t("Under Observation", "निगरानी में", "ನಿರಂತರ ತಪಾಸಣೆಯಲ್ಲಿರುವವರು"), value: 8 },
                                { name: t("Emergency Cases", "आपातकालीन मामले", "ತುರ್ತು ಪರಿಸ್ถಿತಿ ರೋಗಿಗಳು"), value: currentMlRow?.mode === "crimson" ? 4 : 2 }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={60}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {COLORS.map((entry, idx) => (
                                <Cell key={`cell-${idx}`} fill={["#10b981", "#ef4444", "#f59e0b", "#0072ff"][idx % 4]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                          <span className="text-xl font-bold font-mono text-white leading-none">4</span>
                          <span className="text-[8px] uppercase tracking-wider text-gray-500 font-mono">{t("Active Wards", "सक्रिय वार्ड", "ಸಕ್ರಿಯ ವಾರ್ಡ್‌ಗಳು")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono mt-3">
                      {[
                        { name: t("Stable", "स्थिर", "ಸ್ಥಿರ"), color: "#10b981", val: currentMlRow?.mode === "crimson" ? "60%" : "78%" },
                        { name: t("Critical", "गंभीर", "ಗಂಭೀರ"), color: "#ef4444", val: currentMlRow?.mode === "crimson" ? "28%" : "12%" },
                        { name: t("Observation", "निगरानी", "ತಪಾಸಣೆ"), color: "#f59e0b", val: "8%" },
                        { name: t("Emergency", "आपातकालीन", "ತುರ್ತು"), color: "#0072ff", val: currentMlRow?.mode === "crimson" ? "4%" : "2%" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.01]">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                          <span className="text-gray-400 truncate">{item.name}:</span>
                          <span className="font-bold text-gray-200 ml-auto">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Patient Table and AI Inference Panel */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* Registry Table */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border xl:col-span-2 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-rose-400 animate-pulse" />
                        <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Monitored Hospital Registry", "निगरानी अस्पताल रजिस्ट्री", "ಆಸ್ಪತ್ರೆ ರೋಗಿಗಳ ನೋಂದಣಿ")}</h3>
                      </div>
                      <span className="text-[9px] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400">
                        {t("LIVE TELEMETRY FEED", "लाइव टेलीमेट्री फीड", "ಲೈವ್ ಟೆಲಿಮೆಟ್ರಿ ಫೀಡ್")}
                      </span>
                    </div>

                    <div className="overflow-x-auto flex-1">
                      <table className="w-full text-left border-collapse text-[10px] font-mono">
                        <thead>
                          <tr className="border-b border-dark-border text-gray-500 uppercase">
                            <th className="pb-3 pl-2">{t("Patient / System", "रोगी / प्रणाली", "ರೋಗಿ / ಸಿಸ್ಟಮ್")}</th>
                            <th className="pb-3">{t("Model Tag", "मॉडल टैग", "ಮಾದರಿ ಟ್ಯಾಗ್")}</th>
                            <th className="pb-3">{t("Department", "विभाग", "ವಿಭಾಗ")}</th>
                            <th className="pb-3">{t("Safe Range", "सुरक्षित सीमा", "ಸುರಕ್ಷಿತ ಶ್ರೇಣಿ")}</th>
                            <th className="pb-3">{t("Current Status", "वर्तमान स्थिति", "ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ")}</th>
                            <th className="pb-3 pr-2 text-right">{t("Action", "कार्रवाई", "ಕ್ರಮ")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border/40 text-gray-300">
                          {[
                            { name: t("ICU Ventilator Support", "आईसीयू वेंटिलेटर समर्थन", "ಐಸಿಯು ವೆಂಟಿಲೇಟರ್ ಸಹಾಯ"), tag: "PB-980-Vent", dept: t("ICU Critical Care", "आईसीयू गंभीर देखभाल", "ಐಸಿಯು ತುರ್ತು ನಿಗಾ"), range: "12V - 24V DC", status: currentMlRow?.mode === "crimson" ? "critical" : "optimal", val: currentMlRow?.mode === "crimson" ? "9.4V" : "23.8V" },
                            { name: t("Heart Monitoring Unit", "हृदय निगरानी इकाई", "ಹೃದಯ ಬಡಿತ ಉಸ್ತುವಾರಿ ಸಾಧನ"), tag: "Philips-Intellivue", dept: t("Cardiology Ward", "हृदय रोग वार्ड", "ಹೃದಯ ರೋಗ ವಾರ್ಡ್"), range: "15V - 19V DC", status: currentMlRow?.mode === "crimson" ? "warning" : "optimal", val: "18.2V" },
                            { name: t("Emergency Oxygen System", "आपातकालीन ऑक्सीजन प्रणाली", "ತುರ್ತು ಆಮ್ಲಜನಕ ವ್ಯವಸ್ಥೆ"), tag: "O2-Flow-Sensor", dept: t("Emergency Wing", "आपातकालीन विंग", "ತುರ್ತು ವಿಭಾಗ"), range: "80 - 120 PSI", status: currentMlRow?.mode === "crimson" ? "unstable" : "optimal", val: "102 PSI" },
                            { name: t("ICU Patient Stability Monitor", "आईसीयू रोगी स्थिरता मॉनिटर", "ಐಸಿಯು ರೋಗಿ ಸ್ಥಿರತೆ ಉಸ್ತುವಾರಿ"), tag: "RF-Deterioration-Fit", dept: t("ICU Ward B", "आईसीयू वार्ड बी", "ಐಸಿಯು ವಾರ್ಡ್ ಬಿ"), range: "0 - 50 Score", status: currentMlRow?.mode === "crimson" ? "critical" : currentMlRow?.mode === "amber" ? "warning" : "optimal", val: `${Math.round(currentMlRow?.severity || 12)} Score` },
                            { name: t("Critical Care Bed Allocation", "गंभीर देखभाल बेड आवंटन", "ತುರ್ತು ನಿಗಾ ಬೆಡ್ ಹಂಚಿಕೆ"), tag: "Bed-Sensor-C3", dept: t("ICU Critical Care", "आईसीयू गंभीर देखभाल", "ಐಸಿಯು ತುರ್ತು ನಿಗಾ"), range: "0 - 1 Grid", status: currentMlRow?.mode === "teal" ? "warning" : "optimal", val: "Optimal" }
                          ].map((dev, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.01]">
                              <td className="py-3 pl-2 font-bold text-gray-200">{dev.name}</td>
                              <td className="py-3 text-gray-400">{dev.tag}</td>
                              <td className="py-3 text-gray-400">{dev.dept}</td>
                              <td className="py-3 text-rose-400 font-bold">{dev.range}</td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                                  dev.status === "critical" 
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-glow-rose animate-pulse" 
                                    : dev.status === "warning" 
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-glow-amber" 
                                    : dev.status === "unstable"
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}>
                                  {t(dev.status, dev.status === "optimal" ? "इष्टतम" : dev.status === "critical" ? "गंभीर" : dev.status === "warning" ? "चेतावनी" : "ಅಸ್ಥಿರ", dev.status === "optimal" ? "ಅತ್ಯುತ್ತಮ" : dev.status === "critical" ? "ತೀವ್ರ" : dev.status === "warning" ? "ಎಚ್ಚರಿಕೆ" : "ಅಸ್ಥಿರ")} ({dev.val})
                                </span>
                              </td>
                              <td className="py-3 pr-2 text-right">
                                <button 
                                  onClick={() => {
                                    setSelectedPatientId("P00" + (idx + 1));
                                    if (dev.status === "critical") setIsIcuEscalationTriggered(true);
                                    else setIsMedicalReviewTriggered(true);
                                  }}
                                  className="px-2 py-1 bg-white/5 border border-white/5 hover:border-rose-500/30 text-rose-400 hover:text-white rounded transition-all text-[8px] uppercase font-bold"
                                >
                                  {t("Assess", "आकलन करें", "ಪರಿಶೀಲಿಸಿ")}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* AI Recommendation Engine */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-200 font-mono uppercase">
                          <Brain className="w-4 h-4 text-rose-400 shadow-glow-rose" />
                          <span>{t("AI Inference Engine", "एआई निष्कर्ष इंजन", "ಎಐ ತೀರ್ಮಾನ ಯಂತ್ರ")}</span>
                        </div>
                        <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                          {currentMlRow?.confidence}% ACC
                        </span>
                      </div>

                      {/* Dynamic Anomaly Cards */}
                      <div className="space-y-3 font-mono">
                        <div className={`p-3 rounded-lg border text-xs leading-relaxed ${
                          currentMlRow?.mode === "crimson" 
                            ? "bg-rose-950/20 border-rose-500/30 text-rose-300 shadow-glow-rose" 
                            : currentMlRow?.mode === "amber" 
                            ? "bg-amber-950/20 border-amber-500/30 text-amber-300 shadow-glow-amber"
                            : currentMlRow?.mode === "teal"
                            ? "bg-teal-950/20 border-teal-500/30 text-teal-300"
                            : "bg-emerald-950/10 border-emerald-500/20 text-emerald-400"
                        }`}>
                          <div className="flex justify-between text-[8px] text-gray-500 font-bold mb-1">
                            <span>ALERT INGEST LOG:</span>
                            <span className="uppercase">{currentMlRow?.status}</span>
                          </div>
                          <h4 className="font-extrabold text-[11px] mb-1.5 uppercase text-gray-200">{currentMlRow?.type}</h4>
                          <p className="text-[10px] text-gray-400 leading-snug">{currentMlRow?.aiPrediction}</p>
                        </div>

                        {/* Inference Probability Parameters */}
                        <div className="space-y-2 text-[9px] pt-1 text-gray-400">
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span>ICU Escalation Probability:</span>
                              <strong className="text-rose-400 font-bold">{currentMlRow?.icuEscalationProb}%</strong>
                            </div>
                            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500" style={{ width: `${currentMlRow?.icuEscalationProb}%` }}></div>
                            </div>
                          </div>
                          
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span>Patient Deterioration Index:</span>
                              <strong className="text-amber-400 font-bold">{Math.round((currentMlRow?.server_load / 150) * 100)}%</strong>
                            </div>
                            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: `${Math.round((currentMlRow?.server_load / 150) * 100)}%` }}></div>
                            </div>
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span>Hospital Overload Probability:</span>
                              <strong className="text-teal-400 font-bold">{currentMlRow?.hospitalOverloadProb}%</strong>
                            </div>
                            <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-400" style={{ width: `${currentMlRow?.hospitalOverloadProb}%` }}></div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 font-mono">
                      {currentMlRow?.mode === "crimson" ? (
                        <button
                          onClick={() => setIsMedicalReviewTriggered(true)}
                          className="w-full py-2 bg-rose-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-glow-rose hover:opacity-90 transition-all"
                        >
                          [ {t("Initiate Emergency Medical Review", "आपातकालीन चिकित्सा समीक्षा शुरू करें", "ತುರ್ತು ವೈದ್ಯಕೀಯ ಪರಿಶೀಲನೆ ಆರಂಭಿಸಿ")} ]
                        </button>
                      ) : currentMlRow?.mode === "amber" ? (
                        <button
                          onClick={() => setIsFollowUpScheduled(true)}
                          className="w-full py-2 bg-amber-500 text-black rounded-lg font-bold text-[10px] uppercase shadow-glow-amber hover:opacity-90 transition-all"
                        >
                          [ {t("Schedule Immediate Follow-Up", "तत्काल अनुवर्ती कार्रवाई निर्धारित करें", "ತ್ವರಿತ ಸಮಾಲೋಚನೆ ಸಮಯ ನಿಗದಿಮಾಡಿ")} ]
                        </button>
                      ) : currentMlRow?.mode === "teal" ? (
                        <button
                          onClick={() => setIsResourceAllocationOptimized(true)}
                          className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold text-[10px] uppercase shadow-glow-teal hover:opacity-90 transition-all"
                        >
                          [ {t("Optimize Resource Allocation", "संसाधन आवंटन अनुकूलित करें", "ಸಂಪನ್ಮೂಲ ಹಂಚಿಕೆ ನಿಯಂತ್ರಿಸಿ")} ]
                        </button>
                      ) : (
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase font-bold text-center rounded-lg">
                          {t("All Subsystems nominal. Monitoring Active.", "सभी उपप्रणालियाँ सामान्य। निगरानी सक्रिय।", "ಎಲ್ಲಾ ವ್ಯವಸ್ಥೆಗಳು ಸರಿಯಾಗಿವೆ. ಪರಿಶೀಲನೆ ಚಾಲನೆಯಲ್ಲಿದೆ.")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 2. LIVE VITALS PORTAL */}
            {activeHospitalTab === "live" && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-dark-border">
                  <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("ICU Patient Stability & Electrocardiogram (ECG) Simulator", "आईसीयू रोगी स्थिरता और ईसीजी सिमुलेटर", "ಐಸಿಯು ರೋಗಿಗಳ ಹೃದಯ ಬಡಿತ ಉಸ್ತುವಾರಿ")}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="energy" name="ECG Vitals Trend" stroke="#ef4444" fill="rgba(239, 68, 68, 0.05)" strokeWidth={2.5} dot={<RenderSpikeDot />} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 3. MEDICAL ANOMALIES PORTAL */}
            {activeHospitalTab === "anomalies" && (
              <div className="space-y-6">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-sm font-bold text-gray-200 font-mono uppercase">{t("Trained Clinical Anomaly Classifier Hub", "प्रशिक्षित नैदानिक विसंगति वर्गीकारक हब", "ರೋಗಿಗಳ ಗಂಭೀರ ಅನಾರೋಗ್ಯ ಪತ್ತೆ ಕೇಂದ್ರ")}</h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Our Random Forest Classifier isolates clinical anomalies dynamically across 10 vital parameters.", "हमारा रैंडम फॉरेस्ट मॉडल 10 से अधिक महत्वपूर्ण स्वास्थ्य संकेतकों पर आधारित विसंगतियों की पहचान करता है।", "ನಮ್ಮ ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ ಮಾದರಿಯು ರೋಗಿಗಳ 10 ಮುಖ್ಯ ಆರೋಗ್ಯ ದೋಷಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆ ಮಾಡುತ್ತದೆ.")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: t("Silent Patient Deterioration", "मूक रोगी गिरावट", "ಸೈಲೆಂಟ್ ಪೇಷಂಟ್ ಡಿಟೆರಿಯೊರೇಶನ್"), desc: t("Gradual cardiovascular physiological drift isolation", "हृदय गति में क्रमिक शारीरिक गिरावट की पहचान", "ರೋಗಿಯ ಆರೋಗ್ಯ ಕ್ರಮೇಣ ಕುಸಿಯುವುದನ್ನು ಪತ್ತೆ ಹಚ್ಚುವುದು"), action: () => setIsMedicalReviewTriggered(true) },
                    { name: t("Recovery Degradation Pattern", "रिकवरी विफलता", "ಗುಣಮುಖವಾಗುವಿಕೆ ಕುಸಿತ"), desc: t("Long-term post-discharge rehabilitation decay analysis", "अस्पताल से छुट्टी मिलने के बाद क्रमिक स्वास्थ्य गिरावट", "ಡಿಸ್ಚಾರ್ಜ್ ನಂತರದ ಚೇತರಿಕೆ ಕುಸಿತ ವಿಶ್ಲೇಷಣೆ"), action: () => setIsFollowUpScheduled(true) },
                    { name: t("ICU Risk Escalation", "आईसीयू ट्रांसफर जोखिम", "ಐಸಿಯು ತುರ್ತು ವರ್ಗಾವಣೆ"), desc: t("Predictive critical care admission risk modeling", "गंभीर देखभाल में प्रवेश जोखिम का पूर्वानुमान मॉडल", "ರೋಗಿಯು ಐಸಿಯುಗೆ ಸೇರುವ ಅಪಾಯದ ಪ್ರಮಾಣ ಮುನ್ಸೂಚನೆ"), action: () => setIsIcuEscalationTriggered(true) },
                    { name: t("Hospital Resource Overload", "अस्पताल संसाधन ओवरलोड", "ಆಸ್ಪತ್ರೆ ಸಂಪನ್ಮೂಲಗಳ ಕೊರತೆ"), desc: t("Bed occupancy capacity and doctor workloads pressure", "बिस्तरों की क्षमता और डॉक्टरों के काम के बोझ का दबाव", "ಬೆಡ್ ಭರ್ತಿ ಮತ್ತು ಸಿಬ್ಬಂದಿ ಮೇಲಿನ ಒತ್ತಡ"), action: () => setIsResourceAllocationOptimized(true) },
                    { name: t("Long-Term Health Instability", "दीर्घकालिक स्वास्थ्य अस्थिरता", "ದೀರ್ಘಕಾಲದ ಅನಾರೋಗ್ಯ"), desc: t("Chronic condition fluctuations and readmission risks", "पुरानी बीमारियों में उतार-चढ़ाव और पुन प्रवेश जोखिम", "ದೀರ್ಘಕಾಲದ ರೋಗಿಗಳ ಚೇತರಿಕೆ ಏರುಪೇರು"), action: () => setIsFollowUpScheduled(true) }
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-rose-500/20 text-rose-400 bg-rose-950/5 flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-all duration-300">
                      <div>
                        <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-gray-200">{item.name}</h4>
                        <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">{item.desc}</p>
                      </div>
                      <button
                        onClick={item.action}
                        className="w-full py-1.5 bg-white/5 border border-white/5 hover:border-white/20 rounded font-mono text-[9px] uppercase font-bold text-gray-200"
                      >
                        {t("Activate Protocol Dispatch", "प्रोटोकॉल प्रेषण सक्रिय करें", "ತುರ್ತು ಕ್ರಮ ಕೈಗೊಳ್ಳಿ")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ICU RISK PORTAL */}
            {activeHospitalTab === "icurisk" && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-dark-border">
                  <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("ICU Risk Index Trend Graph", "आईसीयू जोखिम सूचकांक रुझान ग्राफ", "ಐಸಿಯು ಅಪಾಯದ ಸೂಚ್ಯಂಕ ಏರಿಳಿತ")}</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="risk" name="ICU Risk Index %" stroke="#f59e0b" fill="rgba(245, 158, 11, 0.05)" strokeWidth={2.5} dot={<RenderSpikeDot />} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* 5. WARDS & BEDS PORTAL */}
            {activeHospitalTab === "wards" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Bed Occupancy Analytics */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Bed Occupancy Census Analytics", "बेड अधिभोग जनगणना विश्लेषण", "ಬೆಡ್ ಬಳಕೆ ವಿವರಗಳು")}</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="humidity" name="Bed Occupancy Rate %" stroke="#00f0ff" fill="rgba(0, 240, 255, 0.05)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Doctor Workload Graph */}
                  <div className="glass-panel p-5 rounded-xl border border-dark-border">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Doctor Workload Stress Index Graph", "डॉक्टर कार्यभार तनाव सूचकांक ग्राफ", "ವೈದ್ಯರ ಕೆಲಸದ ಒತ್ತಡದ ಸೂಚ್ಯಂಕ ನಕ್ಷೆ")}</h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                          <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="temperature" name="Doctor Workload Index %" stroke="#10b981" fill="rgba(16, 185, 129, 0.05)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 6. AI PREDICTIONS PORTAL */}
            {activeHospitalTab === "predictions" && (
              <div className="space-y-6">
                
                {/* Recovery Degradation Dotted Timeline */}
                <div className="glass-panel p-5 rounded-xl border border-dark-border">
                  <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-2">{t("Post-Discharge Recovery Degradation Forecasting Timeline", "डिस्चार्ज के बाद रिकवरी में गिरावट का पूर्वानुमान समय", "ಡಿಸ್ಚಾರ್ಜ್ ನಂತರದ ಚೇತರಿಕೆ ಕುಸಿತ ಮುನ್ಸೂಚನೆ ನಕ್ಷೆ")}</h3>
                  <p className="text-[9px] text-gray-500 font-mono uppercase mb-4">{t("Historical recovery index vs. Dotted 3-Hour regression prediction line with Confidence overlay", "3-घंटे के भविष्य के अनुमानित डॉटेड पूर्वानुमान के साथ ऐतिहासिक शारीरिक चहेतता", "ಭವಿಷ್ಯದ ಚೇತರಿಕೆ ಕುಸಿತ ಮತ್ತು ಅಂದಾಜು ನಕ್ಷೆ")}</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="foreHospConfidence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="upperBound" stroke="none" fill="url(#foreHospConfidence)" />
                        <Area type="monotone" dataKey="lowerBound" stroke="none" fill="url(#foreHospConfidence)" />
                        <Area type="monotone" dataKey="actual" name="Clinical Actual" stroke="#f43f5e" fill="none" strokeWidth={2.5} />
                        <Area type="monotone" dataKey="forecast" name="Projected Path" stroke="#10b981" fill="none" strokeWidth={2} strokeDasharray="4 4" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Readmission Prediction Graph */}
                <div className="glass-panel p-5 rounded-xl border border-dark-border">
                  <h3 className="text-xs font-bold text-gray-200 font-mono uppercase mb-4">{t("Emergency Readmission Risk Likelihood", "आपातकालीन पुन प्रवेश जोखिम की संभावना", "ತುರ್ತು ಮರು ದಾಖಲಾತಿ ಅಪಾಯ")}</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 8 }} />
                        <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 9 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="energy" name="Readmission Risk score" stroke="#0072ff" fill="rgba(0, 114, 255, 0.05)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {/* 7. PATIENTBed HEATMAP */}
            {activeHospitalTab === "heatmaps" && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-6">
                  <div className="border-b border-white/5 pb-2">
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Emergency Ward Clinical Heatmap Grid (30 Intensive Care Beds)", "आपातकालीन वार्ड क्लिनिकल हीटमैप ग्रिड (30 आईसीयू बेड)", "ತುರ್ತು ವಾರ್ಡ್ ಬೆಡ್‌ಗಳ ನಕ್ಷೆ (30 ಬೆಡ್‌ಗಳು)")}</h3>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Select any clinical sensor cell to bind target simulation context.", "सिमुलेशन के लिए किसी भी बेड सेंसर cell का चयन करें।", "ಯಾವುದೇ ಬೆಡ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಆಸ್ಪತ್ರೆ ಪರಿಶೀಲನೆ ನಡೆಸಬಹುದು.")}</p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-3">
                    {Array.from({ length: 30 }, (_, i) => {
                      const patientId = `P0${i + 1 < 10 ? "0" + (i + 1) : (i + 1)}`;
                      const isSelected = selectedPatientId === patientId;
                      let cellBg = "border-emerald-500/25 bg-emerald-500/5 text-emerald-400";
                      
                      // heatmaps alarm splits
                      if (i === 1 || i === 9 || i === 21) cellBg = "border-rose-500/30 bg-rose-500/5 text-rose-400 animate-pulse";
                      else if (i === 4 || i === 14 || i === 25) cellBg = "border-amber-500/35 bg-amber-500/5 text-amber-400";

                      return (
                        <button
                          key={patientId}
                          onClick={() => setSelectedPatientId(patientId)}
                          className={`p-3 rounded-xl border font-mono text-[10px] font-bold transition-all hover:scale-105 ${cellBg} ${
                            isSelected ? "ring-2 ring-rose-500 ring-offset-2 ring-offset-black" : ""
                          }`}
                        >
                          {t("Bed", "बिस्तर", "ಹಾಸಿಗೆ")} {patientId.split("P0")[1] || patientId.split("P")[1]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 8. REPORTS PORTAL */}
            {activeHospitalTab === "reports" && (
              <div className="space-y-6">
                <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Clinical Administrative Audits & Reports HUD", "नैदानिक प्रशासनिक ऑडिट और रिपोर्ट एचयूडी", "ಆಡಳಿತಾತ್ಮಕ ವೈದ್ಯಕೀಯ ವರದಿ")}</h3>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Simulate downloading physiological audits, predictive risk metrics, and dispatches.", "चिकित्सा विसंगति रिपोर्ट, जोखिम विश्लेषण और कार्रवाई रिपोर्ट डाउनलोड करें।", "ಆಸ್ಪತ್ರೆಯ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಅಪಾಯದ ಮುನ್ಸೂಚನೆ ವರದಿಯನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.")}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleHospitalDownloadReport("pdf")}
                        disabled={reportProgress !== -1}
                        className="px-3.5 py-1.5 bg-rose-500 text-white rounded font-mono text-[9px] uppercase font-bold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{t("Download PDF", "पीडीएफ डाउनलोड", "ವರದಿ ಡೌನ್‌ಲೋಡ್")}</span>
                      </button>
                      
                      <button
                        onClick={() => handleHospitalDownloadReport("excel")}
                        disabled={reportProgress !== -1}
                        className="px-3.5 py-1.5 bg-emerald-500 text-black rounded font-mono text-[9px] uppercase font-bold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>{t("Export Excel", "एक्सेल निर्यात", "ಎಕ್ಸೆಲ್ ರಫ್ತು")}</span>
                      </button>
                    </div>
                  </div>

                  {/* Report Download simulator loading bar */}
                  {reportProgress !== -1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                        <span>{reportType === "pdf" ? "Compiling clinical PDF chart metrics..." : "Exporting doctor workload and bed occupancy cells..."}</span>
                        <span>{reportProgress}%</span>
                      </div>
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${reportProgress}%` }}></div>
                      </div>
                      {reportProgress === 100 && (
                        <div className="text-[10px] font-mono text-emerald-400 font-bold mt-1 uppercase flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{t("File compiled & saved to local downloads directory.", "फ़ाइल संकलित और सहेजी गई।", "ವರದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲಾಗಿದೆ.")}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Clinical telemetry Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[10px] font-mono">
                      <thead>
                        <tr className="border-b border-dark-border text-gray-500 uppercase">
                          <th className="pb-3 pl-2">{t("Patient ID", "रोगी आईडी", "ರೋಗಿ ಐಡಿ")}</th>
                          <th className="pb-3">{t("Name", "नाम", "ಹೆಸರು")}</th>
                          <th className="pb-3">{t("Age / Gender", "आयु / लिंग", "ವಯಸ್ಸು / ಲಿಂಗ")}</th>
                          <th className="pb-3">{t("Deterioration Score", "गिरावट स्कोर", "ಆರೋಗ್ಯ ಕುಸಿತ")}</th>
                          <th className="pb-3">{t("Anomaly Flagged", "विसंगति चिह्नित", "ಖಂಡಿಸಿದ ಅಸಂಗತತೆ")}</th>
                          <th className="pb-3">{t("ICU Stay Days", "आईसीयू रहने के दिन", "ಐಸಿಯು ವಾಸ್ತವ್ಯದ ದಿನಗಳು")}</th>
                          <th className="pb-3">{t("Doctor Workload", "डॉक्टर कार्यभार", "ವೈದ್ಯರ ಕೆಲಸದ ಒತ್ತಡ")}</th>
                          <th className="pb-3 pr-2 text-right">{t("Confidence", "विश्वास", "ಖಚಿತತೆ")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-border/40 text-gray-300">
                        {activeRowsToUse.map((row, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.01]">
                            <td className="py-2.5 pl-2 font-bold text-gray-200">{row.patient_id}</td>
                            <td className="py-2.5">{row.patient_name}</td>
                            <td className="py-2.5 text-gray-400">{row.age} yrs / {row.gender}</td>
                            <td className="py-2.5 text-rose-400 font-bold">{row.deterioration_score}</td>
                            <td className="py-2.5">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                                row.anomaly_flag === "1" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {row.anomaly_flag === "1" ? (row.detected_anomaly || t("Anomaly", "विसंगति", "ಅಸಂಗತತೆ")) : t("Normal", "सामान्य", "ಸಾಮಾನ್ಯ")}
                              </span>
                            </td>
                            <td className="py-2.5">{row.hospital_stay_days} days</td>
                            <td className="py-2.5">{row.doctor_workload}%</td>
                            <td className="py-2.5 pr-2 text-right font-bold text-emerald-400">97.4%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 9. AI CHATBOT PORTAL */}
            {activeHospitalTab === "chatbot" && (
              <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-4">
                <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("AI Smart Clinical Agent Assistant Console", "आवासीय एआई सहायक कंसोल", "ವಸತಿ ವಿದ್ಯುತ್ ಎಐ ಸಹಾಯಕ")}</h3>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">{t("Fully localized diagnostic support in English, Hindi, and Kannada", "अंग्रेजी, हिंदी और कन्नड़ में स्थानीयकृत नैदानिक सहायता", "ಇಂಗ್ಲಿಷ್, ಹಿಂದಿ ಮತ್ತು ಕನ್ನಡ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯವಿದೆ")}</p>
                  </div>
                  <Brain className="w-5 h-5 text-rose-400" />
                </div>

                {/* Prebuilt Quick Query Buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    t("What is causing the Silent Patient Deterioration alert?", "मूक रोगी गिरावट चेतावनी का क्या कारण है?", "ಸೈಲೆಂಟ್ ಪೇಷಂಟ್ ಡಿಟೆರಿಯೊರೇಶನ್‌ನ ಎಚ್ಚರಿಕೆಗೆ ಕಾರಣವೇನು?"),
                    t("Explain the ICU escalation risk at 91%", "आईसीयू Transfer जोखिम की व्याख्या करें", "ಐಸಿಯು ತುರ್ತು ವರ್ಗಾವಣೆ ಸಂಭವನೀಯತೆಯ ವಿವರಣೆ ಕೊಡಿ"),
                    t("How do I optimize bed and staff workload?", "संसाधन ओवरलोड को कैसे अनुकूलित करें?", "ಆಸ್ಪತ್ರೆ ಬೆಡ್ ಮತ್ತು ಸಿಬ್ಬಂದಿ ಕೆಲಸದ ಒತ್ತಡ ಕಡಿಮೆ ಮಾಡುವುದು ಹೇಗೆ?")
                  ].map((queryText, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUserQuery(queryText);
                      }}
                      className="px-3 py-1.5 rounded bg-white/5 border border-white/5 hover:border-rose-500/35 text-[9px] font-mono text-gray-300 hover:text-rose-400 transition-all"
                    >
                      {queryText}
                    </button>
                  ))}
                </div>

                {/* Message logs scrolling box */}
                <div className="h-64 overflow-y-auto border border-white/5 bg-black/30 p-4 rounded-xl space-y-4 font-mono text-xs max-h-72">
                  {hospitalChatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                        msg.sender === "user" 
                          ? "bg-rose-600 text-white font-bold rounded-tr-none shadow-glow-rose" 
                          : "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none"
                      }`}>
                        {msg.sender === "user" ? msg.text : t(msg.text, msg.text_hi || msg.text, msg.text_kn || msg.text)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Query submission form */}
                <form onSubmit={handleHospitalChatSubmit} className="flex gap-2 font-mono">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={t("Type patient clinical telemetry questions...", "नैदानिक प्रश्न टाइप करें...", "ಆರೋಗ್ಯ ಕುಸಿತ ಮತ್ತು ಐಸಿಯು ಅಪಾಯದ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...")}
                    className="flex-1 bg-white/5 border border-dark-border focus:border-rose-500/40 outline-none rounded-lg p-2.5 text-xs text-gray-200"
                  />
                  <button type="submit" className="p-2.5 bg-rose-600 hover:opacity-90 text-white rounded-lg transition-all shadow-glow-rose">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* 10. SYSTEM SETTINGS */}
            {activeHospitalTab === "settings" && (
              <div className="glass-panel p-5 rounded-xl border border-dark-border space-y-6 font-mono text-xs">
                <div className="border-b border-white/5 pb-2">
                  <h3 className="text-xs font-bold text-gray-200 font-mono uppercase">{t("Intensive Care Sensory Alarm Threshold Calibration", "आईसीयू संवेदी सीमा अंशांकन", "ಐಸಿಯು ಅಲರ್ಟ್ ಮತ್ತು ಬಯೋಸಿಗ್ನಲ್ ಮಿತಿ ಸೆಟ್ಟಿಂಗ್ಸ್")}</h3>
                  <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Tune alarm tolerances and model regression weights for patient biosignals.", "रोगी के बायोसिग्नल्स के लिए अलार्म सीमा और मॉडल मापदंडों को ट्यून करें।", "ಐಸಿಯು ಅಲರ್ಟ್ ಹಾಗೂ ಅಪಾಯದ ಗರಿಷ್ಠ ಮಿತಿ ಸೆಟ್ಟಿಂಗ್ಸ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ.")}</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">{t("Deterioration Score Alarm Level", "गिरावट स्कोर अलार्म सीमा", "ಆರೋಗ್ಯ ಕುಸಿತ ಅಲರ್ಟ್ ಮಿತಿ")}</label>
                      <input type="text" defaultValue="90.0 Score" className="w-full bg-white/5 border border-dark-border rounded-lg p-2.5 text-gray-200" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold uppercase">{t("ICU Transfer Risk Tolerance Bounds", "आईसीयू ट्रांसफर जोखिम सहनशीलता सीमा", "ಐಸಿಯು ವರ್ಗಾವಣೆ ಸಂಭವನೀಯತೆ ಅಲರ್ಟ್")}</label>
                      <input type="text" defaultValue="70.0% Risk Limit" className="w-full bg-white/5 border border-dark-border rounded-lg p-2.5 text-gray-200" />
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] uppercase font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("Configuration Synced with trained Random Forest classification fits.", "प्रशिक्षित रैंडम फॉरेस्ट वर्गीकरण फिट के साथ कॉन्फ़िगरेशन समन्वयित।", "ತರಬೇತಿ ಪಡೆದ ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ ಮಾದರಿಯೊಂದಿಗೆ ಸಂರಚನೆ ಹೊಂದಿಸಲಾಗಿದೆ.")}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* FLOATING COLLAPSIBLE AI CHATBOT (Bottom Right Corner) */}
        <div className="fixed bottom-6 right-6 z-50">
          <AnimatePresence>
            {chatbotOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-80 h-96 glass-panel border border-dark-border rounded-2xl shadow-glass flex flex-col justify-between overflow-hidden mb-3"
              >
                <div className="p-3 bg-rose-600 text-white font-extrabold font-mono text-xs flex justify-between items-center shadow-glow-rose">
                  <div className="flex items-center gap-1.5">
                    <BrainCircuit className="w-4 h-4" />
                    <span>{t("Clinical Health AI Assistant", "नैदानिक स्वास्थ्य एआई सहायक", "ವೈದ್ಯಕೀಯ ಎಐ ಸಹಾಯಕ")}</span>
                  </div>
                  <button onClick={() => setChatbotOpen(false)} className="text-white hover:opacity-75 font-bold">✕</button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-3 font-mono text-[10px] bg-black/40">
                  {hospitalChatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                        msg.sender === "user" ? "bg-rose-600 text-white font-bold" : "bg-white/5 border border-white/5 text-gray-200"
                      }`}>
                        {msg.sender === "user" ? msg.text : t(msg.text, msg.text_hi || msg.text, msg.text_kn || msg.text)}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleHospitalChatSubmit} className="p-2 border-t border-white/5 bg-[#0b1020] flex gap-2 font-mono">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    placeholder={t("Ask patient health questions...", "प्रश्न पूछें...", "ಪ್ರಶ್ನೆ ಕೇಳಿ...")}
                    className="flex-1 bg-white/5 border border-dark-border focus:border-rose-500/40 outline-none rounded-lg p-2 text-[10px] text-gray-200"
                  />
                  <button type="submit" className="p-2 bg-rose-600 hover:opacity-90 text-white rounded-lg transition-all">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setChatbotOpen(!chatbotOpen)}
            className="p-3.5 rounded-full bg-rose-600 text-white hover:opacity-90 transition-all shadow-glow-rose flex items-center justify-center border border-rose-600"
            title={t("Open Clinical Health AI Assistant", "एआई सहायक खोलें", "ಎಐ ಸಹಾಯಕ")}
          >
            <MessageSquare className="w-6 h-6 animate-pulse" />
          </button>
        </div>

      </div>
    );
  };

  if (isResidential) {
    return renderResidential();
  }

  if (isHospital) {
    return renderHospital();
  }

  if (isGovernment) {
    return (
      <GovernmentDashboard 
        user={user}
        metrics={metrics}
        alerts={alerts}
        acknowledgeAlert={acknowledgeAlert}
        devices={devices}
        addDevice={addDevice}
        deleteDevice={deleteDevice}
        triggerManualAlert={triggerManualAlert}
        updateSectorMetrics={updateSectorMetrics}
      />
    );
  }

  return (
    <div className={`space-y-8 ${boardThemeBorder}`}>
      {/* Sector Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("System Control Board", "सिस्टम नियंत्रण बोर्ड", "ಸಿಸ್ಟಮ್ ನಿಯಂತ್ರಣ ಮಂಡಳಿ")}</h2>
          <p className="text-xs text-gray-500 font-mono mt-1 uppercase">
            {t("Domain: ", "डोमेन: ", "ಕ್ಷೇತ್ರ: ")}
            <span className={`${themeText}`}>
              {activeSector === "Industrial Sector" 
                ? (industrialDomain === "safety" 
                  ? t("Worker Safety Monitoring", "श्रमिक सुरक्षा निगरानी", "ಕಾರ್ಮಿಕ ಸುರಕ್ಷತೆ ಉಸ್ತುವಾರಿ") 
                  : t("Electrical Infrastructure Monitoring", "विद्युत बुनियादी ढांचा निगरानी", "ವಿದ್ಯುತ್ ಮೂಲಸೌಕರ್ಯ ಉಸ್ತುವಾರಿ"))
                : t(activeSector, activeSector === "Institutional Sector" ? "संस्थागत क्षेत्र" : activeSector, activeSector === "Institutional Sector" ? "ಸಂಸ್ಥೆಯ ವಲಯ" : activeSector)
              }
            </span>
          </p>
          {activeSector === "Industrial Sector" && industrialDomain === "safety" && (
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">
                {t("Detect. Protect. Prevent.", "खोजें। रक्षा करें। रोकें।", "ಪತ್ತೆಹಚ್ಚಿ. ರಕ್ಷಿಸಿ. ತಡೆಯಿರಿ.")}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {t("AI Worker Safety Monitoring & Predictive Analytics System", "एआई श्रमिक सुरक्षा निगरानी और पूर्वानुमान विश्लेषणात्मक प्रणाली", "ಎಐ ಕಾರ್ಮಿಕ ಸುರಕ್ಷತೆ ಉಸ್ತುವಾರಿ ಮತ್ತು ಮುನ್ಸೂಚನಾ ವಿಶ್ಲೇಷಣೆ ವ್ಯವಸ್ಥೆ")}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-dark-border p-2.5 rounded-xl text-xs font-mono text-gray-400">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-lg">
            <button 
              onClick={() => setResLanguage("en")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${resLanguage === "en" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"}`}
            >
              EN
            </button>
            <button 
              onClick={() => setResLanguage("hi")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${resLanguage === "hi" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"}`}
            >
              हिन्दी
            </button>
            <button 
              onClick={() => setResLanguage("kn")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${resLanguage === "kn" ? "bg-neon-cyan text-black" : "text-gray-400 hover:text-gray-200"}`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {isMLActive && (
            <span className="flex items-center gap-1 bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan px-2.5 py-0.5 rounded font-mono">
              <Database className="w-3.5 h-3.5" />
              {t("Trained Model: Random Forest (v1.0.0)", "प्रशिक्षित मॉडल: रैंडम फॉरेस्ट (v1.0.0)", "ತರಬೇತಿ ಪಡೆದ ಮಾದರಿ: ರಾಂಡಮ್ ಫಾರೆಸ್ಟ್ (v1.0.0)")}
            </span>
          )}
          <span>{t("Telemetry Status:", "टेलीमेट्री स्थिति:", "ಟೆಲಿಮೆಟ್ರಿ ಸ್ಥಿತಿ:")}</span>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {t("LIVE FEED INGEST (5S INTERVAL)", "लाइव फीड इनजेस्ट (5S अंतराल)", "ಲೈವ್ ಫೀಡ್ ಇಂಜೆಸ್ಟ್ (5 ಸೆಕೆಂಡ್ ವಿವರ)")}
          </span>
        </div>
      </div>

      {/* Industrial Domain Switcher */}
      {activeSector === "Industrial Sector" && (
        <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setIndustrialDomain("electrical")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
              industrialDomain === "electrical"
                ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 shadow-glow-cyan"
                : "text-gray-400 border border-transparent hover:text-gray-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {t("Electrical Monitoring", "विद्युत निगरानी", "ವಿದ್ಯುತ್ ಉಸ್ತುವಾರಿ")}
          </button>
          <button
            onClick={() => setIndustrialDomain("safety")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
              industrialDomain === "safety"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-glow-rose"
                : "text-gray-400 border border-transparent hover:text-gray-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {t("Worker Safety Monitoring", "श्रमिक सुरक्षा निगरानी", "ಕಾರ್ಮಿಕ ಸುರಕ್ಷತೆ ಉಸ್ತುವಾರಿ")}
          </button>
        </div>
      )}

      {/* ==========================================
          INTERACTIVE AI MODEL STREAM CONTROLLER PANEL
          (For BOTH Institutional & Residential Sectors)
          ========================================== */}
      {isMLActive && currentMlRow && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl glass-panel border ${themeBorderGlow} transition-all duration-500`}
        >
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                </span>
                <span className="text-xs font-bold font-mono tracking-wider text-gray-200">
                  {isIndustrialSafety 
                    ? t("WORKER SAFETY PIPELINE INTERFACE", "श्रमिक सुरक्षा पाइपलाइन इंटरफेस", "ಕಾರ್ಮಿಕ ಸುರಕ್ಷತೆ ಪೈಪ್‌ಲೈನ್ ಇಂಟರ್ಫೇಸ್") 
                    : (isResidential 
                      ? t("RESIDENTIAL POWER GRID STREAM PIPELINE", "आवासीय पावर ग्रिड स्ट्रीम पाइपलाइन", "ವಸತಿ ವಿದ್ಯುತ್ ಗ್ರಿಡ್ ಸ್ಟ್ರೀಮ್ ಪೈಪ್‌ಲೈನ್") 
                      : t("DATASET STREAM PIPELINE INTERFACE", "डेटासेट स्ट्रीम पाइपलाइन इंटरफेस", "ಡೇಟಾಸೆಟ್ ಸ್ಟ್ರೀಮ್ ಪೈಪ್‌ಲೈನ್ ಇಂಟರ್ಫೇಸ್"))}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                {t("Streaming row ", "स्ट्रीमिंग रो ", "ಸ್ಟ್ರೀಮಿಂಗ್ ಸಾಲು ")}<strong className="text-neon-cyan font-bold">#{streamIndex % (isIndustrialSafety ? (industrialRows.length > 0 ? industrialRows.length : FALLBACK_INDUSTRIAL_ROWS.length) : (isResidential ? resRows.length : mlRows.length))}</strong>{t(" | Model Latency: ", " | मॉडल विलंबता: ", " | ಮಾಡೆಲ್ ಲೇಟೆನ್ಸಿ: ")}<strong className="text-neon-cyan font-bold">{inferenceLatency}ms</strong>
              </p>
            </div>

            {/* Test Module Action Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { setTestModule("auto"); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "auto" 
                    ? "bg-neon-cyan text-black border-neon-cyan shadow-glow-cyan" 
                    : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {t("Auto-Stream Mode", "ऑटो-स्ट्रीम मोड", "ಸ್ವಯಂ ಸ್ಟ್ರೀಮ್ ಮೋಡ್")}
              </button>
              
              <button
                onClick={() => { setTestModule("emergency"); setStreamIndex(0); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "emergency" 
                    ? "bg-rose-600 text-white border-rose-600 shadow-glow-rose" 
                    : "bg-rose-950/20 border-rose-500/25 text-rose-400 hover:bg-rose-950/30"
                }`}
              >
                {isIndustrialSafety 
                  ? t("1. Critical Safety Incident", "1. महत्वपूर्ण सुरक्षा घटना", "1. ಗಂಭೀರ ಸುರಕ್ಷತಾ ಘಟನೆ") 
                  : (isResidential 
                    ? t("1. Power Theft Alert", "1. बिजली चोरी चेतावनी", "1. ವಿದ್ಯುತ್ ಕಳ್ಳತನ ಎಚ್ಚरीके") 
                    : t("1. Emergency Crash Test", "1. आपातकालीन क्रैश टेस्ट", "1. ತುರ್ತು ಸ್ಥಗಿತ ಪರೀಕ್ಷೆ"))}
              </button>

              <button
                onClick={() => { setTestModule("degradation"); setStreamIndex(0); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "degradation" 
                    ? "bg-amber-600 text-white border-amber-600 shadow-glow-amber" 
                    : "bg-amber-950/20 border-amber-500/25 text-amber-400 hover:bg-amber-950/30"
                }`}
              >
                {isIndustrialSafety 
                  ? t("2. Physiological Stress", "2. शारीरिक तनाव", "2. ಶಾರೀಕ ಒತ್ತಡ") 
                  : (isResidential 
                    ? t("2. Appliance Fault Tracker", "2. उपकरण खराबी ट्रैकर", "2. ಗೃಹೋಪಯೋಗಿ ಸಾಧನಗಳ ದೋಷ ಟ್ರ್ಯಾಕರ್") 
                    : t("2. Degradation Tracker", "2. गिरावट ट्रैकर", "2. ಕುಸಿತ ಟ್ರ್ಯಾಕರ್"))}
              </button>

              <button
                onClick={() => { setTestModule("optimizer"); setStreamIndex(0); setIsPlaying(true); }}
                className={`px-3 py-1.5 rounded-lg font-mono text-[10px] uppercase font-bold border transition-all ${
                  testModule === "optimizer" 
                    ? "bg-teal-600 text-white border-teal-600 shadow-glow-teal" 
                    : "bg-teal-950/20 border-teal-500/25 text-teal-400 hover:bg-teal-950/30"
                }`}
              >
                {isIndustrialSafety 
                  ? t("3. Safe Baseline", "3. सुरक्षित बेसलाइन", "3. ಸುರಕ್ಷಿತ ಬೇಸ್ಲೈನ್") 
                  : (isResidential 
                    ? t("3. Grid Optimizer", "3. ग्रिड अनुकूलक", "3. ಗ್ರಿಡ್ ಆಪ್ಟಿಮೈಜರ್") 
                    : t("3. Environment Optimizer", "3. पर्यावरण अनुकूलक", "3. ಪರಿಸर ಆಪ್ಟಿಮೈಜರ್"))}
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-1 rounded-lg">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 hover:bg-white/5 rounded text-gray-300"
                title={isPlaying ? "Pause Stream" : "Play Stream"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setStreamIndex(prev => prev + 1)}
                className="p-1.5 hover:bg-white/5 rounded text-gray-300"
                title="Next Row"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-transparent text-[10px] font-mono text-gray-300 outline-none pr-2 cursor-pointer"
              >
                <option value={2000}>2s interval</option>
                <option value={5000}>5s interval</option>
                <option value={10000}>10s interval</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Global Flashing Emergency Crimson Banner */}
      {isMLActive && currentMlRow?.mode === "crimson" && (
        <motion.div 
          animate={{ scale: [1, 1.01, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3 shadow-glow-rose font-mono"
        >
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 animate-pulse mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
              !!! {isResidential ? "GRID SECURITY EXPLOIT TRIGGERED" : "CRITICAL INFRASTRUCTURE WARNING"} !!!
            </h4>
            <p className="text-[11px] leading-relaxed">
              {isResidential 
                ? "Sudden energy usage spike detected. Unmapped current bypass matching Power Theft signature is isolated." 
                : "Complete Loss of Cooling Infrastructure detected. Chilled-water flow collapsed to 0.0 kJ/s under peak load."}
            </p>
          </div>
        </motion.div>
      )}

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((w, index) => {
          const WidgetIcon = w.icon;
          const isGlowingWidget = isMLActive && currentMlRow && currentMlRow.mode !== "green" && (w.title === "AI Risk Level" || w.title === "Anomalies Flagged" || w.title === "System Health Core" || w.title === "Ambient Temperature");
          return (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`glass-panel p-5 rounded-xl border border-dark-border hover:border-white/10 transition-all duration-300 ${
                isGlowingWidget ? themeBorderGlow : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">{w.title}</p>
                  <h3 className={`text-2xl font-bold mt-2 tracking-tight ${w.color}`}>{w.value}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 font-light leading-relaxed">{w.desc}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-white/5 border border-white/5 ${w.color}`}>
                  <WidgetIcon className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts & Predictive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Real-Time Energy Area Chart / Worker Safety Analytics */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2">
          {isIndustrialSafety ? (
            <div className="space-y-4">
              {/* Header and Sub-tabs */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-200">
                    {t("Worker Health & Safety Telemetry Matrix", "श्रमिक स्वास्थ्य और सुरक्षा टेलीमेट्री मैट्रिक्स", "ಕಾರ್ಮಿಕರ ಆರೋಗ್ಯ ಮತ್ತು ಸುರಕ್ಷತೆ ಟೆಲಿಮೆಟ್ರಿ")}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
                    {t("AI physiological & safety compliance sensor feeds", "एआई शारीरिक और सुरक्षा अनुपालन सेंसर फीड", "ಎಐ ದೈಹಿಕ ಮತ್ತು ಸುರಕ್ಷತೆ ಅನುಸರಣೆ ಸೆನ್ಸಾರ್ ವಿವರ")}
                  </p>
                </div>
                
                {/* 3 subtabs */}
                <div className="flex flex-wrap items-center gap-1.5 bg-black/40 border border-white/5 p-1 rounded-lg">
                  {[
                    { id: "health", label: t("Health Vital Trend", "स्वास्थ्य महत्वपूर्ण रुझान", "ಆರೋಗ್ಯ ವೈಟಲ್ ಟ್ರೆಂಡ್") },
                    { id: "ppe", label: t("PPE Compliance", "पीपीई अनुपालन", "ಪಿಪಿಇ ಅನುಸರಣೆ") },
                    { id: "fatigue", label: t("Fatigue Forecast", "थकान पूर्वानुमान", "ಸುಸ್ತು ಮುನ್ಸೂಚನೆ") }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveWorkerSafetyChartTab(tab.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all ${
                        activeWorkerSafetyChartTab === tab.id 
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" 
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart container */}
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  {activeWorkerSafetyChartTab === "health" ? (
                    // LineChart of heart rate (energy) and body temperature (voltage)
                    <LineChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="energy" name={t("Heart Rate (BPM)", "हृदय गति (BPM)", "ಹೃದಯ ಬಡಿತ (BPM)")} stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="voltage" name={t("Body Temp (°C)", "शरीर का तापमान (°C)", "ದೇಹದ ತಾಪಮಾನ (°C)")} stroke="#00f0ff" strokeWidth={2} dot={{ r: 2 }} />
                    </LineChart>
                  ) : activeWorkerSafetyChartTab === "ppe" ? (
                    // BarChart of helmet compliance and vest compliance
                    <BarChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="cooling_eff" name={t("Helmet Compliance (%)", "हेलमेट अनुपालन (%)", "ಹೆಲ್ಮೆಟ್ ಧರಿಸುವಿಕೆ (%)")} fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="thermal_stress" name={t("Vest Compliance (%)", "वेस्ट अनुपालन (%)", "ಜಾಕೆಟ್ ಧರಿಸುವಿಕೆ (%)")} fill="#0072ff" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  ) : (
                    // Fatigue progression (current vs prediction)
                    <LineChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9 }} />
                      <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} domain={[0, 10]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="hvac_runtime" name={t("Active Fatigue Index", "सक्रिय थकान सूचकांक", "ಪ್ರಸ್ತುತ ದಣಿವು ಸೂಚ್ಯಂಕ")} stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 2 }} />
                      <Line type="monotone" dataKey="severity" name={t("Predicted Progression (10x)", "पूर्वानुमानित प्रगति (10x)", "ಮುನ್ಸೂಚಿತ ದಣಿವು ಹೆಚ್ಚಳ (10x)")} stroke="#a855f7" strokeDasharray="3 3" strokeWidth={2} dot={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-200">
                    {isMLActive ? (isResidential ? t("Household Consumption & Predictive Analysis", "घरेलू खपत और पूर्वानुमान विश्लेषण", "ಮನೆಯ ವಿದ್ಯುತ್ ಬಳಕೆ ಮತ್ತು ಮುನ್ಸೂಚನೆ ವಿಶ್ಲೇಷಣೆ") : t("Sensory Telemetry Matrix Ingest", "संवेदी टेलीमेट्री मैट्रिक्स इनजेस्ट", "ಸೆನ್ಸಾರ್ ಟೆಲಿಮೆಟ್ರಿ ಮ್ಯಾಟ್ರಿಕ್ಸ್ ವಿವರ")) : t("Energy & Power Transmission", "ऊर्जा और बिजली संचरण", "ವಿದ್ಯುತ್ ಶಕ್ತಿ ಮತ್ತು ಪ್ರಸರಣ")}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">
                    {isMLActive ? (isResidential ? t("Grid Load Ingestion vs. Regression Model Forecast (kWh)", "ग्रिड लोड इनजेस्ट बनाम प्रतिगमन घोषित", "ಗ್ರಿಡ್ ಲೋಡ್ ಬಳಕೆ ವರ್ಸಸ್ ರಿಗ್ರೆಷನ್ ಮಾಡೆಲ್ ಮುನ್ಸೂಚನೆ (kWh)") : t("Server Workload Power Draw (kW) & Cooling Flow Rate (kJ)", "सर्वर लोड पावर ड्रा (kW) और कूलिंग फ्लो रेट (kJ)", "ಸರ್ವರ್ ಲೋಡ್ ಪವರ್ ಬಳಕೆ (kW) ಮತ್ತು ಕೂಲಿಂಗ್ ಫ್ಲೋ ರೇಟ್ (kJ)")) : t("Real-Time rolling power draw load (kW)", "वास्तवಿಕ समय रोलिंग power draw load (kW)", "ನೈಜ-ಸಮಯದ ವಿದ್ಯುತ್ ಬಳಕೆಯ ಪ್ರಮಾಣ (kW)")}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-neon-cyan px-2 py-0.5 bg-neon-cyan/5 border border-neon-cyan/20 rounded">
                  {t("5-Second Ingest Timeline", "5-सेकंड इनजेस्ट टाइमलाइन", "5 ಸೆಕೆಂಡ್ ಇಂಜೆಸ್ಟ್ ಕಾಲಗತಿ")}
                </span>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sectorData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isMLActive && currentMlRow?.mode === "crimson" ? "#ef4444" : "#0072ff"} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={isMLActive && currentMlRow?.mode === "crimson" ? "#ef4444" : "#0072ff"} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isMLActive ? (currentMlRow?.mode === "crimson" ? "#ef4444" : "#14b8a6") : "#00f0ff"} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={isMLActive ? (currentMlRow?.mode === "crimson" ? "#ef4444" : "#14b8a6") : "#00f0ff"} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 9 }} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="energy" name="energy" stroke={isMLActive && currentMlRow?.mode === "crimson" ? "#ef4444" : "#0072ff"} fillOpacity={1} fill="url(#colorEnergy)" strokeWidth={2} />
                    <Area type="monotone" dataKey="voltage" name="voltage" stroke={isMLActive ? (currentMlRow?.mode === "crimson" ? "#f43f5e" : "#14b8a6") : "#00f0ff"} fillOpacity={1} fill="url(#colorRisk)" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

{/* Dynamic Devices Table / Worker Safety Registry and Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isIndustrialSafety ? (
          <>
            {/* Monitored Worker Registry Table */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-rose-400 shadow-glow-rose" />
                  <h3 className="text-sm font-bold text-gray-200">
                    {t("Monitored Worker Registry", "निगरानी किए गए कर्मचारियों की रजिस्ट्री", "ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲಾದ ಕಾರ್ಮಿಕರ ವಿವರ")}
                  </h3>
                </div>
                <span className="text-[9px] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400">
                  {t("Fluctuating Live", "लाइव उतार-चढ़ाव", "ಲೈವ್ ಬದಲಾವಣೆಗಳು")}
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-dark-border text-gray-500 font-mono text-[9px] uppercase">
                      <th className="pb-3 pl-2">{t("Worker ID", "कर्मचारी आईडी", "ಕಾರ್ಮಿಕರ ಐಡಿ")}</th>
                      <th className="pb-3">{t("Department", "विभाग", "ವಿಭಾಗ")}</th>
                      <th className="pb-3">{t("Shift", "शिफ्ट", "ಶಿಫ್ಟ್")}</th>
                      <th className="pb-3">{t("Current Risk", "वर्तमान जोखिम", "ಪ್ರಸ್ತುತ ಅಪಾಯ")}</th>
                      <th className="pb-3">{t("Safety Status", "सुरक्षा स्थिति", "ಸುರಕ್ಷತಾ ಸ್ಥಿತಿ")}</th>
                      <th className="pb-3">{t("Active Anomaly", "सक्रिय विसंगति", "ಸಕ್ರಿಯ अಸಂಗತತೆ")}</th>
                      <th className="pb-3 pr-2 text-right">{t("Action", "कार्रवाई", "ಕ್ರಮ")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/40 font-sans">
                    {FALLBACK_INDUSTRIAL_ROWS.map((wRow) => {
                      const isSelected = currentMlRow && currentMlRow.worker_id === wRow.worker_id;
                      const rScore = isSelected ? currentMlRow.riskScore : parseFloat(wRow.overall_risk_score);
                      const label = isSelected ? currentMlRow.anomaly_label : wRow.actual_anomaly_label;
                      const safetyStatus = isSelected ? currentMlRow.status : (label === "Normal" ? "Safe" : (label === "Heat_Stress" || label === "Worker_Fatigue" ? "Warning" : "Critical"));
                      
                      let statusColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                      if (safetyStatus === "Warning") statusColor = "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-glow-amber";
                      else if (label === "PPE_Violation") statusColor = "bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-glow-orange";
                      else if (safetyStatus === "Critical") statusColor = "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-glow-rose animate-pulse";
                      
                      return (
                        <tr key={wRow.worker_id} className={`hover:bg-white/[0.01] transition-colors ${isSelected ? "bg-white/[0.02]" : ""}`}>
                          <td className="py-3.5 pl-2 font-semibold text-gray-200">{wRow.worker_id}</td>
                          <td className="py-3.5 text-gray-400">
                            {wRow.worker_id === "W001" || wRow.worker_id === "W004" ? "Assembly Line B" : wRow.worker_id === "W002" ? "Welding Cell 3" : "Hazardous zone"}
                          </td>
                          <td className="py-3.5 text-gray-400 font-mono">
                            {wRow.worker_id === "W001" || wRow.worker_id === "W005" ? "Morning" : wRow.worker_id === "W002" || wRow.worker_id === "W006" ? "Night" : "Evening"}
                          </td>
                          <td className="py-3.5 text-neon-cyan font-mono">{rScore}%</td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${statusColor}`}>
                              {safetyStatus}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-400 font-mono">{label.replace("_", " ")}</td>
                          <td className="py-3.5 pr-2 text-right font-mono text-[10px]">
                            {label === "PPE_Violation" ? (
                              <button 
                                onClick={() => handleTriggerAction("dispatched")}
                                className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded"
                              >
                                {t("Alert Supervisor", "पर्यवेक्षक चेतावनी", "ಅಲರ್ಟ್ ಸೂಪರ್ವೈಸರ್")}
                              </button>
                            ) : label === "Fall_Detected" || label === "Worker_Collapse" ? (
                              <button 
                                onClick={() => handleTriggerAction("migrated")}
                                className="px-2 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded animate-pulse"
                              >
                                {t("Dispatch EMS", "ईएमएस प्रेषण", "ಪ್ರೇಷಣೆ ಇಎಂಎಸ್")}
                              </button>
                            ) : (
                              <span className="text-gray-500">Normal</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Factory Zone Heatmap */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-sm font-bold text-gray-200">{t("Factory Zone Heatmap", "फैक्ट्री जोन हीटमैप", "ಕಾರ್ಖಾನೆ ವಲಯದ ಹೀಟ್‌ಮ್ಯಾಪ್")}</h3>
                </div>
                <p className="text-[10px] text-gray-500 font-mono uppercase leading-relaxed">
                  {t("Realtime occupancy footprint mapping & boundary triggers", "वास्तविक समय अधिभोग पदचिह्न मानचित्रण और सीमा ट्रिगर", "ನೈಜ ಸಮಯದ ವಲಯ ನಕ್ಷೆ")}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {[
                    { name: "Fabrication", occupancy: 12, status: "safe", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
                    { name: "Welding Cell 3", occupancy: 4, status: "safe", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
                    { name: "High-Temp Grid", occupancy: 3, status: "warning", color: currentMlRow && currentMlRow.anomaly_label === "Heat_Stress" ? "border-rose-500/35 bg-rose-500/5 text-rose-400 animate-pulse font-bold" : "border-amber-500/35 bg-amber-500/5 text-amber-400" },
                    { name: "Warehouse", occupancy: 5, status: "safe", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" },
                    { name: "Restricted Area", occupancy: currentMlRow && currentMlRow.anomaly_label === "Unauthorized_Access" ? 1 : 0, status: "critical", color: currentMlRow && currentMlRow.anomaly_label === "Unauthorized_Access" ? "border-rose-500/30 bg-rose-500/5 text-rose-400 animate-pulse font-bold" : "border-white/5 bg-white/5 text-gray-400" },
                    { name: "Assembly B", occupancy: 28, status: "safe", color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" }
                  ].map((zone) => (
                    <div key={zone.name} className={`p-2 border rounded-lg flex flex-col justify-between h-16 transition-all duration-300 ${zone.color}`}>
                      <span className="text-[9px] font-bold truncate">{zone.name}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[8px] opacity-75">{t("Occ:", "अधिभोग:", "ಒಳಗೆ:")} {zone.occupancy}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-gray-500 leading-snug font-mono">
                {t("* Real-time worker position tracking synced via local BLE beacons & CCTV nodes.", "* स्थानीय बीएलई बीकन और सीसीटीवी नोड्स के माध्यम से सिंक किया गया वास्तविक समय कर्मचारी स्थान ट्रैकिंग।", "* ಕಾರ್ಮಿಕರ ಸ್ಥಳವನ್ನು ಬಿಎಲ್‌ಇ ಮತ್ತು ಸಿಸಿಟಿವಿ ಮೂಲಕ ನೈಜ ಸಮಯದಲ್ಲಿ ಉಸ್ತುವಾರಿ ನಡೆಸಲಾಗುತ್ತದೆ.")}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Device List Table */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2 overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-neon-cyan shadow-glow-cyan" />
                  <h3 className="text-sm font-bold text-gray-200">{t("Monitored Devices Registry", "निगरानी किए गए उपकरणों की रजिस्ट्री", "ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲಾದ ಸಾಧನಗಳ ವಿವರ")}</h3>
                </div>
                <span className="text-[9px] font-mono bg-white/5 border border-white/5 px-2 py-0.5 rounded text-gray-400">
                  {t("Fluctuating Live", "लाइव उतार-चढ़ाव", "ಲೈವ್ ಬದಲಾವಣೆಗಳು")}
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-dark-border text-gray-500 font-mono text-[9px] uppercase">
                      <th className="pb-3 pl-2">{t("Device / Sensor", "उपकरण / सेंसर", "ಸಾಧನ / ಸೆನ್ಸಾರ್")}</th>
                      <th className="pb-3">{t("Model Tag", "मॉडल टैग", "ಮಾದರಿ ಟ್ಯಾಗ್")}</th>
                      <th className="pb-3">{t("Subsystem", "उपकंट्रोल", "ಉಪವ್ಯವಸ್ಥೆ")}</th>
                      <th className="pb-3">{t("Rated Range", "रेटेड रेंज", "ರೇಟೆಡ್ ಶ್ರೇಣಿ")}</th>
                      <th className="pb-3">{t("Current Status", "वर्तमान स्थिति", "ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ")}</th>
                      <th className="pb-3 pr-2 text-right">{t("Action", "कार्रवाई", "ಕ್ರಮ")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-border/40 font-sans">
                    {sectorDevices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500 font-mono">
                          {t("No active telemetry devices registered in this sector.", "इस क्षेत्र में कोई सक्रिय टेलीमेट्री उपकरण पंजीकृत नहीं है।", "ಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ಯಾವುದೇ ಸಕ್ರಿಯ ಸಾಧನಗಳು ನೋಂದಾಯಿಸಲ್ಪಟ್ಟಿಲ್ಲ.")}
                        </td>
                      </tr>
                    ) : (
                      sectorDevices.map((d) => {
                        const isDeviceUnstable = isMLActive && currentMlRow && currentMlRow.mode !== "green";
                        const statusText = isMLActive && currentMlRow ? currentMlRow.status : d.status;
                        return (
                          <tr key={d.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-3.5 pl-2 font-semibold text-gray-200">{d.name}</td>
                            <td className="py-3.5 text-gray-400 font-mono">{d.model}</td>
                            <td className="py-3.5 text-gray-400">{d.system}</td>
                            <td className="py-3.5 text-neon-cyan font-mono">{d.voltageRange}</td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold border ${
                                isDeviceUnstable
                                  ? (currentMlRow.mode === "crimson" ? "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-glow-rose animate-pulse" : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-glow-amber")
                                  : (d.status === "unstable" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20")
                              }`}>
                                {t(statusText, statusText === "optimal" || statusText === "Optimal" ? "इष्टतम" : statusText === "unstable" || statusText === "Unstable" ? "अस्थिर" : statusText === "critical" || statusText === "Critical" ? "गंभीर" : "चेतावनी", statusText === "optimal" || statusText === "Optimal" ? "ಅತ್ಯುತ್ತಮ" : statusText === "unstable" || statusText === "Unstable" ? "ಅಸ್ಥಿರ" : statusText === "critical" || statusText === "Critical" ? "ಗಂಭೀರ" : "ಎಚ್ಚರಿಕೆ")}
                              </span>
                            </td>
                            <td className="py-3.5 pr-2 text-right">
                              <button
                                onClick={() => deleteDevice(d.id)}
                                className="p-1 text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Device Form */}
            <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-200">{t("Register Sensory Device", "संवेदी उपकरण पंजीकृत करें", "ಹೊಸ ಸೆನ್ಸಾರ್ ಸಾಧನ ನೋಂದಾಯಿಸಿ")}</h3>
                  <div className="relative group">
                    <HelpCircle className="w-4 h-4 text-gray-500 hover:text-neon-cyan cursor-pointer" />
                    <div className="absolute right-0 bottom-6 w-52 p-2.5 rounded-lg bg-dark-panel border border-dark-border text-[9px] text-gray-400 leading-relaxed font-mono hidden group-hover:block z-20 shadow-glass">
                      <strong>{t("AI Analyzer Options:", "एआई विश्लेषक विकल्प:", "ಎಐ ವಿಶ್ಲೇಷಕ ಆಯ್ಕೆಗಳು:")}</strong> {t("The platform reads manufacturer keywords (e.g. Siemens, Tesla, medical) to automatically query and seed rated operating voltage boundaries.", "प्लेटफ़ॉर्म स्वचालित रूप से रेटेड ऑपरेटिंग वोल्टेज सीमाओं को क्वेरी और सीड करने के लिए निर्माता कीवर्ड (जैसे सीमेंस, टेस्ला, मेडिकल) को पढ़ता है।", "ಕಾರ್ಯಾಚರಣೆಯ ವೋಲ್ಟೇಜ್ ಮಿತಿಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆಹಚ್ಚಲು ಈ ವ್ಯವಸ್ಥೆಯು ತಯಾರಕರ ಕೀವರ್ಡ್‌ಗಳನ್ನು ಬಳಸುತ್ತದೆ (ಉದಾ: ಸೀಮೆನ್ಸ್, ಟೆಸ್ಲಾ, ವೈದ್ಯಕೀಯ).")}
                    </div>
                  </div>
                </div>

                {formSuccess && (
                  <div className="mb-4 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-mono">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{t("Sensor registry online.", "सेंसर रजिस्ट्री ऑनलाइन।", "ಸೆನ್ಸಾರ್ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ.")}</span>
                  </div>
                )}

                <form onSubmit={handleAddDeviceSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 font-mono block">{t("Device Name", "उपकरण का नाम", "ಸಾಧನದ ಹೆಸರು")}</label>
                    <input
                      type="text"
                      value={newDevName}
                      onChange={(e) => setNewDevName(e.target.value)}
                      placeholder={t("e.g. Smart Utility Meter", "जैसे स्मार्ट उपयोगिता मीटर", "ಉದಾ: ಸ್ಮಾರ್ಟ್ ಯುಟಿಲಿಟಿ ಮೀಟರ್")}
                      className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2.5 text-gray-200 placeholder:text-gray-600"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 font-mono block">{t("Model / Manufacturer", "मॉडल / निर्माता", "ಮಾದರಿ / ತಯಾರಕರು")}</label>
                    <input
                      type="text"
                      value={newDevModel}
                      onChange={(e) => setNewDevModel(e.target.value)}
                      placeholder={t("e.g. Tesla Gateway 2", "जैसे टेस्ला गेटवे 2", "ಉದಾ: ಟೆಸ್ಲಾ ಗೇಟ್‌ವೇ 2")}
                      className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2.5 text-gray-200 placeholder:text-gray-600"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-500 font-mono block">{t("System Category", "सिस्टम श्रेणी", "ವ್ಯವಸ್ಥೆಯ ವರ್ಗ")}</label>
                    <input
                      type="text"
                      value={newDevSystem}
                      onChange={(e) => setNewDevSystem(e.target.value)}
                      placeholder={t("e.g. Residential Solar Grid", "जैसे आवासीय सौर ग्रिड", "ಉದಾ: ಸೋಲಾರ್ ಗ್ರಿಡ್")}
                      className="w-full bg-white/5 border border-dark-border focus:border-neon-cyan/40 outline-none rounded-lg p-2.5 text-gray-200 placeholder:text-gray-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-mono font-bold text-black uppercase bg-neon-cyan hover:opacity-90 transition-all shadow-glow-cyan"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t("Bind Sensor", "सेंसर बांधें", "ಸಾಧನ ಜೋಡಿಸಿ")}</span>
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-gray-600 leading-snug font-mono">
                {t("* Operational boundaries will be determined automatically by the AI classifier engine upon submission.", "* सबमिशन के बाद एआई क्लासीफायर इंजन द्वारा परिचालन सीमाएं स्वचालित रूप से निर्धारित की जाएंगी।", "* ಸಲ್ಲಿಸಿದ ನಂತರ ಕಾರ್ಯಾಚರಣೆಯ ಮಿತಿಗಳನ್ನು ಎಐ ಕ್ಲಾಸಿಫೈಯರ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನಿರ್ಧರಿಸುತ್ತದೆ.")}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Industrial Domain Switcher */}
      {activeSector === "Industrial Sector" && (
        <div className="flex items-center gap-2 bg-white/5 border border-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setIndustrialDomain("electrical")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
              industrialDomain === "electrical"
                ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 shadow-glow-cyan"
                : "text-gray-400 border border-transparent hover:text-gray-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {t("Electrical Monitoring", "विद्युत निगरानी", "ವಿದ್ಯುತ್ ಉಸ್ತುವಾರಿ")}
          </button>
          <button
            onClick={() => setIndustrialDomain("safety")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
              industrialDomain === "safety"
                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-glow-rose"
                : "text-gray-400 border border-transparent hover:text-gray-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {t("Worker Safety Monitoring", "श्रमिक सुरक्षा निगरानी", "ಕಾರ್ಮಿಕ ಸುರಕ್ಷತೆ ಉಸ್ತುವಾರಿ")}
          </button>
        </div>
      )}

      {/* ==========================================
          TRAINED AI CORE MODEL VISUALIZATION PANELS
          ========================================== */}
      {isMLActive && currentMlRow && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 1. Live Model Inference Monitor */}
          <div className={`p-5 rounded-xl glass-panel border ${themeBorderGlow} transition-all`}>
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gray-200">
                <Brain className="w-4 h-4 text-neon-cyan" />
                Model Inference Monitor
              </div>
              <span className="flex items-center gap-1 text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE INFERENCE
              </span>
            </div>

            {/* Neural inputs list */}
            <div className="space-y-2 text-[10px] font-mono text-gray-400 font-bold">
              <div className="flex justify-between border-b border-white/[0.02] py-0.5">
                <span>{isIndustrialSafety ? t("1. Heart Rate (BPM)", "1. हृदय गति (BPM)", "1. ಹೃದಯ ಬಡಿತ (BPM)") : (isResidential ? t("Electricity Usage (kWh)", "बिजली उपयोग (kWh)", "ವಿದ್ಯುತ್ ಬಳಕೆ (kWh)") : t("1. Server Room Load (kW)", "1. सर्वर रूम लोड (kW)", "1. ಸರ್ವರ್ ಕೊಠಡಿಯ ಲೋಡ್ (kW)"))}:</span>
                <span className="text-gray-200 font-bold">{currentMlRow.server_load}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] py-0.5">
                <span>{isIndustrialSafety ? t("2. Body Temp (°C)", "2. शरीर का तापमान (°C)", "2. ದೇಹದ ಉಷ್ಣತೆ (°C)") : (isResidential ? t("Predicted Usage (kWh)", "पूर्वानुमानित उपयोग (kWh)", "ಮುನ್ಸೂಚಿತ ಬಳಕೆ (kWh)") : t("2. Chilled Water Flow (kJ)", "2. चिल्ड वॉटर फ्लो (kJ)", "2. ತಂಪಾಗಿಸಿದ ನೀರಿನ ಹರಿವು (kJ)"))}:</span>
                <span className="text-gray-200 font-bold">{currentMlRow.chilled_water}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] py-0.5">
                <span>{isIndustrialSafety ? t("3. Ambient Temp (°C)", "3. परिवेश का तापमान (°C)", "3. ಸುತ್ತಲಿನ ತಾಪಮಾನ (°C)") : (isResidential ? t("Local Temp (°C)", "स्थानीय तापमान (°C)", "ಸ್ಥಳೀಯ ತಾಪಮಾನ (°C)") : t("3. Core Temperature (°C)", "3. कोर तापमान (°C)", "3. ಕೋರ್ ತಾಪಮಾನ (°C)"))}:</span>
                <span className="text-gray-200 font-bold">{currentMlRow.outdoor_temp}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] py-0.5">
                <span>{isIndustrialSafety ? t("4. EDA (Electrodermal Activity)", "4. ईडीए (इलेक्ट्रोडर्मल गतिविधि)", "4. ಇಡಿಎ (ಎಲೆಕ್ಟ್ರೋಡರ್ಮಲ್ ಚಟುವಟಿಕೆ)") : (isResidential ? t("Relative Humidity (%)", "सापेक्ष आर्द्रता (%)", "ಸಾಪೇಕ್ಷ ಆರ್ದ್ರತೆ (%)") : t("4. Relative Humidity (%)", "सापेक्ष आर्द्रता (%)", "ಸಾಪೇಕ್ಷ ಆರ್ದ್ರತೆ (%)"))}:</span>
                <span className="text-gray-200 font-bold">{currentMlRow.humidity}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] py-0.5">
                <span>{isIndustrialSafety ? t("5. Fatigue Index", "5. थकान सूचकांक", "5. ಆಯಾಸದ ಸೂಚ್ಯಂಕ") : (isResidential ? t("Appliance Count Usage", "उपकरण गणना उपयोग", "ಸಾಧನಗಳ ಬಳಕೆಯ ಸಂಖ್ಯೆ") : t("5. HVAC Continuous Hours", "5. एचवीएसी सतत घंटे", "5. ಎಚ್‌ವಿಎಸಿ ನಿರಂತರ ಗಂಟೆಗಳು"))}:</span>
                <span className="text-gray-200 font-bold">{currentMlRow.hvac_runtime}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] py-0.5">
                <span>{isIndustrialSafety ? t("6. Blink Rate (pm)", "6. पलक झपकने की दर (pm)", "6. ಕಣ್ಣು ಮಿಟುಕಿಸುವ ದರ (pm)") : (isResidential ? t("Midnight Peak Usage", "आधी रात का चरम उपयोग", "ಮಧ್ಯರಾತ್ರಿಯ ಗರಿಷ್ಠ ಬಳಕೆ") : t("6. Ambient Cooling Eff", "6. परिवेशी शीतलन क्षमता", "6. ಸುತ್ತಲಿನ ತಂಪಾಗಿಸುವ ಸಾಮರ್ಥ್ಯ"))}:</span>
                <span className="text-gray-200 font-bold">{currentMlRow.airflow_velocity}</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] py-0.5">
                <span>{isIndustrialSafety ? t("7. Acceleration Impact (G)", "7. त्वरण प्रभाव (G)", "7. ವೇಗೋತ್ಕರ್ಷದ ಪರಿಣಾಮ (G)") : (isResidential ? t("Continuous Load Flag", "सतत लोड ध्वज", "ನಿರಂತರ ಲೋಡ್ ಫ್ಲ್ಯಾಗ್") : t("7. Thermal Stress Score", "7. थर्मल तनाव स्कोर", "7. ಉಷ್ಣ ಒತ್ತಡದ ಸ್ಕೋರ್"))}:</span>
                <span className="text-gray-200 font-bold">{currentMlRow.airflow_eff}</span>
              </div>
            </div>

            {/* Inference parameters footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500">
              <span>Decision Trees: 100</span>
              <span>Predictive Fit: 95.8%</span>
            </div>
          </div>

          {/* 2. Model Prediction Probability Gauges */}
          <div className={`p-5 rounded-xl glass-panel border ${themeBorderGlow} transition-all`}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200 mb-4 border-b border-white/5 pb-2 font-mono">
              Prediction Probability Gauges
            </h3>
            
            <div className="space-y-4">
              {/* HVAC / Grid Load */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{isIndustrialSafety ? t("Fatigue Accumulation Risk:", "थकान संचय जोखिम:", "ದಣಿವು ಸಂಗ್ರಹಣೆಯ ಅಪಾಯ:") : (isResidential ? "Continuous Overload Risk:" : "HVAC Compressor Degradation:")}</span>
                  <span className={`${isIndustrialSafety ? (currentMlRow.hvacDegradation > 60 ? "text-rose-400 animate-pulse font-bold" : "text-amber-400") : "text-neon-cyan font-bold"}`}>{currentMlRow.hvacDegradation}%</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isIndustrialSafety ? (currentMlRow.hvacDegradation > 60 ? "bg-rose-500 shadow-glow-rose" : "bg-amber-500") : "bg-neon-cyan"}`} 
                    style={{ width: `${currentMlRow.hvacDegradation}%` }}
                  />
                </div>
              </div>

              {/* Thermal Failure / Grid Leak */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{isIndustrialSafety ? t("Heat Stress Escalation Risk:", "हीट स्ट्रेस बढ़ने का जोखिम:", "ತಾಪಮಾನ ಏರಿಕೆಯ ಅಪಾಯ:") : (isResidential ? "Appliance Failure Risk:" : "Thermal Failure Risk Level:")}</span>
                  <span className={`${currentMlRow.thermalRisk > 60 ? "text-rose-400" : "text-amber-400"} font-bold`}>
                    {currentMlRow.thermalRisk}%
                  </span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${currentMlRow.thermalRisk > 60 ? "bg-rose-500 shadow-glow-rose" : "bg-amber-500"}`} 
                    style={{ width: `${currentMlRow.thermalRisk}%` }}
                  />
                </div>
              </div>

              {/* Overload / Appliance Fault Probability */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">{isIndustrialSafety ? t("Injury / Fall Risk Probability:", "चोट / गिरने की जोखिम संभावना:", "ಗಾಯ / ಬೀಳುವ ಅಪಾಯದ ಸಂಭವನೀಯತೆ:") : (isResidential ? "Grid Load Spike Probability:" : "Workload Overload Probability:")}</span>
                  <span className={`${isIndustrialSafety ? (currentMlRow.overloadProb > 60 ? "text-rose-400 animate-pulse font-bold" : "text-emerald-400") : "text-neon-blue font-bold"}`}>{currentMlRow.overloadProb}%</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isIndustrialSafety ? (currentMlRow.overloadProb > 60 ? "bg-rose-500 shadow-glow-rose" : "bg-emerald-500") : "bg-neon-blue"}`} 
                    style={{ width: `${currentMlRow.overloadProb}%` }}
                  />
                </div>
              </div>
            </div>

            {/* AI Confidence Meter */}
            <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
              <span className="text-gray-500">AI Inference Confidence:</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
                {currentMlRow.confidence}% ACC
              </span>
            </div>
          </div>

          {/* 3. Anomaly Classification & Timeline */}
          <div className={`p-5 rounded-xl glass-panel border ${themeBorderGlow} transition-all flex flex-col justify-between`}>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-200 mb-4 border-b border-white/5 pb-2 font-mono">
                Classification & Timeline
              </h3>
              
              <div className="space-y-3 font-mono">
                <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>ANOMALY CLASSIFICATION:</span>
                    <span className={`font-bold ${themeAccent}`}>
                      {currentMlRow.category}
                    </span>
                  </div>
                  <div className="text-gray-200 font-bold">
                    {currentMlRow.type}
                  </div>
                </div>

                {/* Risk Score Visual Indicator */}
                <div className="flex justify-between items-center text-xs p-1">
                  <span className="text-gray-500">Predicted Threat Assessment:</span>
                  <span className={`text-base font-bold font-mono ${
                    currentMlRow.riskScore > 65 ? "text-rose-400 glow-text-rose" : currentMlRow.riskScore > 35 ? "text-amber-400" : "text-emerald-400"
                  }`}>
                    {currentMlRow.riskScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Ingest Timeline list (last 3 predictions) */}
            <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
              <div className="text-[9px] uppercase tracking-wider font-mono text-gray-500">
                Prediction Timeline Feed
              </div>
              <div className="space-y-1 text-[9px] font-mono text-gray-400">
                {mlHistory.slice(-3).reverse().map((h, i) => (
                  <div key={i} className="flex justify-between py-0.5 border-b border-white/[0.01] last:border-0 font-mono">
                    <span>[{h.name}] {h.type || "Stable Operations"}</span>
                    <span className={h.mode === "crimson" ? "text-rose-400 font-bold" : h.mode === "amber" ? "text-amber-400" : h.mode === "teal" ? "text-teal-400" : "text-emerald-400"}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Ingestion & Recommendations section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Recommendation Engine */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-neon-cyan shadow-glow-cyan" />
              <h3 className="text-sm font-bold text-gray-200">
                {isIndustrialSafety 
                  ? t("AI Worker Safety Inference & Recommendation Engine", "एआई कर्मचारी सुरक्षा निष्कर्ष और अनुशंसा इंजन", "ಎಐ ಕಾರ್ಮಿಕ ಸುರಕ್ಷತೆ ಮತ್ತು ಶಿಫಾರಸು ಎಂಜಿನ್") 
                  : t("AI Model Inference & Recommendation Engine", "एआई मॉडल निष्कर्ष और अनुशंसा इंजन", "ಎಐ ಮಾದರಿ ತೀರ್ಮಾನ ಮತ್ತು ಶಿಫಾರಸು ಎಂಜಿನ್")}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Confidence Index: {isMLActive && currentMlRow ? `${currentMlRow.confidence}%` : "98.4%"}
            </span>
          </div>

          <div className="space-y-4">
            {isMLActive && currentMlRow ? (
              <div className={`p-5 rounded-xl border ${themeBorderGlow} bg-gradient-to-r from-white/[0.01] to-transparent`}>
                <div className="space-y-4 font-mono">
                  {/* Status Banner */}
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-gray-500">
                        DECISION FORECAST LOG
                      </span>
                      <h4 className={`text-sm font-bold tracking-wide mt-1 ${themeAccent}`}>
                        {currentMlRow.type}
                      </h4>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-wider ${
                      currentMlRow.mode === "crimson" 
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-glow-rose animate-pulse" 
                        : currentMlRow.mode === "amber" 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-400 shadow-glow-amber"
                        : currentMlRow.mode === "teal"
                        ? "bg-teal-500/10 border-teal-500/20 text-teal-400 shadow-glow-teal"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-glow-emerald"
                    }`}>
                      {currentMlRow.status}
                    </span>
                  </div>

                  {/* AI Prediction explanation */}
                  <div className="p-3 bg-black/40 border border-white/5 rounded-lg text-xs leading-relaxed text-gray-300">
                    <strong>AI Decision Node:</strong> "{currentMlRow.aiPrediction}"
                  </div>

                  {/* Recommendations Actions Grid */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] uppercase text-gray-500 tracking-wider">
                      Prescriptive Recommendations
                    </span>
                    
                    {currentMlRow.recommendations.map((rec, i) => (
                      <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg text-xs">
                        <div className="flex items-center gap-2">
                          <Wrench className={`w-4 h-4 ${themeAccent}`} />
                          <span className="font-semibold text-gray-200">{rec}</span>
                        </div>
                        {currentMlRow.mode !== "green" && (
                          <button
                            onClick={() => handleTriggerAction(
                              currentMlRow.mode === "crimson" ? "migrated" : currentMlRow.mode === "amber" ? "dispatched" : "smart_cooled"
                            )}
                            disabled={appliedAction !== ""}
                            className={`px-3 py-1 rounded text-[10px] uppercase font-bold bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded transition-all text-neon-cyan`}
                          >
                            Execute Dispatch
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Inline Feedback HUD Overlay */}
                  <AnimatePresence>
                    {appliedAction !== "" && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono"
                      >
                        <CheckCircle className="w-4 h-4 inline-block mr-2 align-middle" />
                        {appliedAction === "migrated" && (isIndustrialSafety ? t("EMERGENCY PROTOCOL ACTIVATED: Safety response team dispatched to zone.", "आपातकालीन प्रोटोकॉल सक्रिय: सुरक्षा प्रतिक्रिया दल क्षेत्र में रवाना।", "ತುರ್ತು ಪ್ರೋಟೋಕಾಲ್ ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ: ಸುರಕ್ಷತಾ ತಂಡವನ್ನು ವಲಯಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ.") : (isResidential ? "Inspection Request Filed: Field teams dispatched to investigate Household HH_1027 grid line." : "Workload Cloud Migration Triggered: 24 VM nodes moved to Oregon-West Grid successfully."))}
                        {appliedAction === "dispatched" && (isIndustrialSafety ? t("PHYSIOLOGICAL WARNING RESOLUTION: Mandated rest period & cooling cycle scheduled.", "शारीरिक चेतावनी समाधान: अनिवार्य विश्राम अवधि और कूलिंग चक्र निर्धारित।", "ಶಾರೀರಿಕ ಎಚ್ಚರಿಕೆ ಪರಿಹಾರ: ಕಡ್ಡಾಯ ವಿಶ್ರಾಂತಿ ಅವಧಿ ಮತ್ತು ಕೂಲಿಂಗ್ ಸೈಕಲ್ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.") : (isResidential ? "Homeowner Warning Sent: Diagnostic alert pushed to customer mobile portal." : "Facilities Maintenance Dispatch Ticket #GEN-9921 Generated."))}
                        {appliedAction === "smart_cooled" && (isIndustrialSafety ? t("SAFETY BASELINE ACTIVE: All monitored environments running nominally.", "सुरक्षा बेसलाइन सक्रिय: सभी निगरानी वाले वातावरण सामान्य रूप से चल रहे हैं।", "ಸುರಕ್ಷತಾ ಬೇಸ್‌ಲೈನ್ ಸಕ್ರಿಯ: ಎಲ್ಲಾ ಉಸ್ತುವಾರಿ ಪರಿಸರಗಳು ಸಾಮಾನ್ಯವಾಗಿ ಚಲಿಸುತ್ತಿವೆ.") : "Load Shifting Profile Activated: Local battery bank eco-schedules initiated.")}
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            ) : (
              predictions.map((p, idx) => (
                <div 
                  key={p.component}
                  className="p-4 rounded-xl border border-dark-border bg-gradient-to-r from-white/[0.02] to-transparent hover:from-white/[0.04] transition-all"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-3">
                    <div>
                      <h4 className="text-xs font-bold font-mono tracking-wide text-gray-200">{t(p.component, p.component === "Cooling Comp 3B" ? "कूलिंग कंप्रेसर 3B" : p.component === "Conveyor Engine #2" ? "कनवेयर इंजन #2" : p.component === "Main Power Sub-Station 4" ? "मुख्य विद्युत सब-स्टेशन 4" : p.component === "Community Battery Bank C" ? "सामुदायिक बैटरी बैंक C" : p.component, p.component === "Cooling Comp 3B" ? "ಕೂಲಿಂಗ್ ಕಂಪ್ರೆಸರ್ 3B" : p.component === "Conveyor Engine #2" ? "ಕನ್ವೇಯರ್ ಇಂಜಿನ್ #2" : p.component === "Main Power Sub-Station 4" ? "ಮುಖ್ಯ ವಿದ್ಯುತ್ ಸಬ್-ಸ್ಟೇಷನ್ 4" : p.component === "Community Battery Bank C" ? "ಸಮುದಾಯ ಬ್ಯಾಟರಿ ಬ್ಯಾಂಕ್ C" : p.component)}</h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">{t("Alert Flag: ", "अलर्ट फ़्लैग: ", "ಎಚ್ಚರಿಕೆ ವಿವರ: ")}{t(p.reason, p.reason === "Sustained temperature variance" ? "निरंतर तापमान भिन्नता" : p.reason === "Vibration frequency spike" ? "कंपन आवृत्ति स्पाइक" : p.reason === "Voltage leak detected in grid line" ? "ग्रिड लाइन में वोल्टेज रिसाव का पता चला" : p.reason === "Cell temperature imbalance" ? "सेल तापमान असंतुलन" : p.reason, p.reason === "Sustained temperature variance" ? "ನಿರಂತರ ತಾಪಮಾನ ವ್ಯತ್ಯಾಸ" : p.reason === "Vibration frequency spike" ? "ಕಂಪನ ತರಂಗಾಂತರ ಏರಿಕೆ" : p.reason === "Voltage leak detected in grid line" ? "ಗ್ರಿಡ್ ಲೈನ್ ವೋಲ್ಟೇಜ್ ಸೋರಿಕೆ ಪತ್ತೆಯಾಗಿದೆ" : p.reason === "Cell temperature imbalance" ? "ಬ್ಯಾಟರಿ ಸೆಲ್ ತಾಪಮಾನ ಅಸಮತೋಲನ" : p.reason)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-gray-400">{t("Est. Fatigue Window: ", "अनुमानित विफलता अवधि: ", "ಅಂದಾಜು ಬಾಳಿಕೆ ಅವಧಿ: ")}<strong className="text-neon-cyan">{t(p.time, p.time === "36 hrs" ? "36 घंटे" : p.time === "5 days" ? "5 दिन" : p.time === "18 hrs" ? "18 घंटे" : p.time === "8 days" ? "8 दिन" : p.time, p.time === "36 hrs" ? "36 ಗಂಟೆ" : p.time === "5 days" ? "5 ದಿನ" : p.time === "18 hrs" ? "18 ಗಂಟೆ" : p.time === "8 days" ? "8 ದಿನ" : p.time)}</strong></span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        p.risk > 70 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                          : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {t("Risk Score: ", "जोखिम स्कोर: ", "ಅಪಾಯದ ಸ್ಕೋರ್: ")}{p.risk}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-1 bg-gray-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          p.risk > 70 ? 'bg-rose-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${p.risk}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-mono pt-1 text-gray-500">
                      <span>{t("Diagnostic Action Required:", "नैदानिक कार्रवाई आवश्यक:", "ರೋಗನಿರ್ಣಯ ಕ್ರಮ ಅಗತ್ಯವಿದೆ:")}</span>
                      <span className="text-neon-cyan font-semibold flex items-center gap-1">
                        <Wrench className="w-3 h-3" />
                        {t(
                          p.action,
                          p.action === "Calibrate throttle" ? "थ्रॉटल कैलिब्रेट करें" : p.action === "Inspect bearings" ? "बियरिंग्स का निरीक्षण करें" : p.action === "Isolate capacitor banks" ? "कंडेनसर बैंकों को अलग करें" : p.action === "Run thermal cooling cycle" ? "थर्मल कूलिंग चक्र चलाएं" : p.action === "Perform immediate filter swap" ? "तत्काल फिल्टर बदलें" : p.action === "Top up coolant reservoir" ? "शीतलक जलाशय भरें" : p.action === "Swap filter grid" ? "फिल्टर ग्रिड बदलें" : p.action === "Check battery cells" ? "बैटरी सेल की जाँच करें" : p.action,
                          p.action === "Calibrate throttle" ? "ಥ್ರೊಟಲ್ ಮಾಪನಾಂಕ ಮಾಡಿ" : p.action === "Inspect bearings" ? "ಬೇರಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" : p.action === "Isolate capacitor banks" ? "ಕೆಪಾಸಿಟರ್ ಬ್ಯಾಂಕ್‌ಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ" : p.action === "Run thermal cooling cycle" ? "ಥರ್ಮಲ್ ಕೂಲಿಂಗ್ ಸೈಕಲ್ ಚಾಲನೆ ಮಾಡಿ" : p.action === "Perform immediate filter swap" ? "ತಕ್ಷಣ ಫಿಲ್ಟರ್ ಬದಲಾಯಿಸಿ" : p.action === "Top up coolant reservoir" ? "ಕೂಲಂಟ್ ಪ್ರಮಾಣ ಹೆಚ್ಚಿಸಿ" : p.action === "Swap filter grid" ? "ಫಿಲ್ಟರ್ ಗ್ರಿಡ್ ಬದಲಾಯಿಸಿ" : p.action === "Check battery cells" ? "ಬ್ಯಾಟರಿ ಸೆಲ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ" : p.action
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-Time Alerts HUD */}
        <div className="glass-panel p-5 rounded-xl border border-dark-border flex flex-col font-mono">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-200">{t("Alert Center HUD", "अलर्ट सेंटर HUD", "ಎಚ್ಚರಿಕೆ ಕೇಂದ್ರ HUD")}</h3>
            <span className="text-[9px] font-mono text-gray-400">{t("Domain filtered", "डोमेन फ़िल्टर किया गया", "ವಲಯ ಫಿಲ್ಟರ್ ಮಾಡಲಾಗಿದೆ")}</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-80 pr-1">
            {activeSectorAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
                <span className="text-xs font-mono text-gray-500">{t("No active anomalies detected", "कोई सक्रिय विसंगति नहीं मिली", "ಯಾವುದೇ ಸಕ್ರಿಯ ಅಸಂಗತತೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ")}</span>
              </div>
            ) : (
              activeSectorAlerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs relative overflow-hidden transition-all ${
                    alert.type === "critical" 
                      ? "bg-rose-950/20 border-rose-500/30 text-rose-300 hover:border-rose-500/50 shadow-glow-rose" 
                      : "bg-amber-950/20 border-amber-500/30 text-amber-300 hover:border-amber-500/50 shadow-glow-amber"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 font-mono">
                    <span className="font-bold tracking-wider">{alert.idCode}</span>
                    <span className="text-[9px] text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-medium leading-relaxed pr-8">{translateAlertMessage(alert.message)}</p>
                  
                  <div className="flex items-center justify-between mt-2.5 pt-1.5 border-t border-white/5">
                    <span className="text-[9px] font-mono uppercase bg-white/5 px-1.5 py-0.5 rounded">
                      {translateAlertField(alert.system)}
                    </span>
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold uppercase transition-colors"
                    >
                      {t("Acknowledge", "स्वीकार करें", "ಸ್ವೀಕರಿಸಿ")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

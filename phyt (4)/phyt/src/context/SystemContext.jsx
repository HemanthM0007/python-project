import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, useSupabase } from "../config/supabaseClient";
import { useAuth } from "./AuthContext";

const SystemContext = createContext(null);

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used within a SystemProvider");
  }
  return context;
};

// Seed Device Lists for the 4 Sectors
const INITIAL_DEVICES = [
  {
    id: "dev_1",
    name: "Heavy Duty Conveyor Motor",
    model: "Siemens 1LA9 Three-Phase",
    sector: "Industrial Sector",
    system: "Robotic Assembly Line 2",
    voltageRange: "380V - 415V",
    currentVoltage: 412.5,
    status: "optimal"
  },
  {
    id: "dev_2",
    name: "Air Compressor Motor",
    model: "Atlas Copco GA37",
    sector: "Industrial Sector",
    system: "Hydraulic Press C",
    voltageRange: "400V - 480V",
    currentVoltage: 415.8,
    status: "optimal"
  },
  {
    id: "dev_3",
    name: "HVAC Climate Intake Fan",
    model: "Carrier 39M Series",
    sector: "Institutional Sector",
    system: "HVAC Zone 4 Main Intake",
    voltageRange: "208V - 230V",
    currentVoltage: 228.4,
    status: "optimal"
  },
  {
    id: "dev_4",
    name: "ICU Ventilator backup supply",
    model: "Puritan Bennett 980",
    sector: "Hospital Sector",
    system: "Critical Care Unit",
    voltageRange: "12V - 24V DC",
    currentVoltage: 23.8,
    status: "optimal"
  },
  {
    id: "dev_5",
    name: "ICU Patient Monitor Battery",
    model: "Philips Intellivue MX800",
    sector: "Hospital Sector",
    system: "Critical Care Unit",
    voltageRange: "15V - 19V DC",
    currentVoltage: 18.2,
    status: "optimal"
  },
  {
    id: "dev_6",
    name: "Emergency Backup Generator",
    model: "Caterpillar C15 Diesel",
    sector: "Hospital Sector",
    system: "ICU Generator B",
    voltageRange: "400V - 480V",
    currentVoltage: 478.5,
    status: "optimal"
  },
  {
    id: "dev_7",
    name: "Main Grid Solar Inverter",
    model: "Tesla Gateway 2 Solar",
    sector: "Residential Sector",
    system: "Solar Inverter Array 4",
    voltageRange: "120V - 240V",
    currentVoltage: 235.4,
    status: "optimal"
  },
  {
    id: "dev_8",
    name: "EV Fast Charger",
    model: "ChargePoint Home Flex",
    sector: "Residential Sector",
    system: "EV Charging Terminal",
    voltageRange: "208V - 240V",
    currentVoltage: 238.1,
    status: "optimal"
  },
  {
    id: "gov_1",
    name: "Bengaluru East 33/11kV Substation",
    model: "ABB 15MVA Power Transformer",
    sector: "Government Sector",
    system: "BESCOM Grid",
    voltageRange: "11kV - 33kV",
    currentVoltage: 11.0,
    status: "optimal"
  },
  {
    id: "gov_2",
    name: "Mysuru North Feeder Line B-4",
    model: "11kV ACSR Conductor",
    sector: "Government Sector",
    system: "CESC Grid",
    voltageRange: "10kV - 12kV",
    currentVoltage: 11.0,
    status: "optimal"
  },
  {
    id: "gov_3",
    name: "Mangaluru Coastal Substation",
    model: "CG Power 10MVA Transformer",
    sector: "Government Sector",
    system: "MESCOM Grid",
    voltageRange: "11kV - 33kV",
    currentVoltage: 11.0,
    status: "optimal"
  }
];

const INITIAL_SECTOR_METRICS = {
  "Industrial Sector": {
    totalDevices: 148,
    activeSystems: 142,
    aiRiskScore: 34,
    energyConsumption: 924,
    detectedAnomalies: 3,
    systemHealth: 96,
    temperature: 68.5,
    voltage: 415.2,
    chartData: [
      { name: "Mon", risk: 25, energy: 890, health: 98, voltage: 412.5, anomalies: 1, temperature: 65 },
      { name: "Tue", risk: 32, energy: 940, health: 95, voltage: 414.8, anomalies: 2, temperature: 68 },
      { name: "Wed", risk: 20, energy: 910, health: 97, voltage: 416.1, anomalies: 0, temperature: 63 },
      { name: "Thu", risk: 35, energy: 965, health: 91, voltage: 410.2, anomalies: 5, temperature: 78 },
      { name: "Fri", risk: 42, energy: 930, health: 94, voltage: 413.6, anomalies: 3, temperature: 70 },
      { name: "Sat", risk: 28, energy: 880, health: 96, voltage: 415.4, anomalies: 1, temperature: 66 },
      { name: "Sun", risk: 34, energy: 924, health: 96, voltage: 415.2, anomalies: 3, temperature: 68 }
    ]
  },
  "Institutional Sector": {
    totalDevices: 320,
    activeSystems: 312,
    aiRiskScore: 12,
    energyConsumption: 248,
    detectedAnomalies: 0,
    systemHealth: 99,
    temperature: 22.4,
    voltage: 230.1,
    chartData: [
      { name: "Mon", risk: 10, energy: 240, health: 99, voltage: 230.5, anomalies: 0, temperature: 22 },
      { name: "Tue", risk: 15, energy: 255, health: 98, voltage: 229.8, anomalies: 0, temperature: 23 },
      { name: "Wed", risk: 11, energy: 235, health: 99, voltage: 230.2, anomalies: 0, temperature: 21 },
      { name: "Thu", risk: 14, energy: 260, health: 99, voltage: 231.1, anomalies: 0, temperature: 23 },
      { name: "Fri", risk: 12, energy: 250, health: 99, voltage: 230.6, anomalies: 0, temperature: 22 },
      { name: "Sat", risk: 8, energy: 210, health: 100, voltage: 230.4, anomalies: 0, temperature: 21 },
      { name: "Sun", risk: 12, energy: 248, health: 99, voltage: 230.1, anomalies: 0, temperature: 22 }
    ]
  },
  "Hospital Sector": {
    totalDevices: 1890,
    activeSystems: 1854,
    aiRiskScore: 28,
    energyConsumption: 512,
    detectedAnomalies: 1,
    systemHealth: 94,
    temperature: 19.8,
    voltage: 228.4,
    chartData: [
      { name: "Mon", risk: 20, energy: 490, health: 95, voltage: 229.1, anomalies: 1, temperature: 18 },
      { name: "Tue", risk: 25, energy: 530, health: 94, voltage: 228.5, anomalies: 2, temperature: 20 },
      { name: "Wed", risk: 18, energy: 505, health: 96, voltage: 229.0, anomalies: 0, temperature: 19 },
      { name: "Thu", risk: 35, energy: 540, health: 92, voltage: 227.4, anomalies: 3, temperature: 22 },
      { name: "Fri", risk: 30, energy: 520, health: 93, voltage: 228.1, anomalies: 2, temperature: 21 },
      { name: "Sat", risk: 22, energy: 485, health: 95, voltage: 228.6, anomalies: 1, temperature: 18 },
      { name: "Sun", risk: 28, energy: 512, health: 94, voltage: 228.4, anomalies: 1, temperature: 20 }
    ]
  },
  "Residential Sector": {
    totalDevices: 450,
    activeSystems: 446,
    aiRiskScore: 18,
    energyConsumption: 1480,
    detectedAnomalies: 1,
    systemHealth: 98,
    temperature: 42.1,
    voltage: 480.6,
    chartData: [
      { name: "Mon", risk: 15, energy: 1420, health: 98, voltage: 481.5, anomalies: 1, temperature: 39 },
      { name: "Tue", risk: 22, energy: 1490, health: 97, voltage: 479.2, anomalies: 2, temperature: 43 },
      { name: "Wed", risk: 14, energy: 1460, health: 99, voltage: 480.4, anomalies: 0, temperature: 41 },
      { name: "Thu", risk: 30, energy: 1510, health: 95, voltage: 478.1, anomalies: 3, temperature: 46 },
      { name: "Fri", risk: 25, energy: 1475, health: 96, voltage: 479.9, anomalies: 2, temperature: 44 },
      { name: "Sat", risk: 12, "energy": 1390, "health": 99, "voltage": 480.8, "anomalies": 0, "temperature": 40 },
      { name: "Sun", risk: 18, "energy": 1480, "health": 98, "voltage": 480.6, "anomalies": 1, "temperature": 42 }
    ]
  },
  "Government Sector": {
    totalDevices: 840,
    activeSystems: 832,
    aiRiskScore: 15,
    energyConsumption: 4850,
    detectedAnomalies: 0,
    systemHealth: 98,
    temperature: 28.5,
    voltage: 11.0,
    chartData: [
      { name: "Mon", risk: 12, energy: 4700, health: 99, voltage: 11.0, anomalies: 0, temperature: 28 },
      { name: "Tue", risk: 15, energy: 4800, health: 98, voltage: 11.1, anomalies: 0, temperature: 29 },
      { name: "Wed", risk: 18, energy: 4900, health: 98, voltage: 10.9, anomalies: 0, temperature: 28 },
      { name: "Thu", risk: 25, energy: 4750, health: 97, voltage: 11.0, anomalies: 1, temperature: 27 },
      { name: "Fri", risk: 30, energy: 4850, health: 96, voltage: 10.8, anomalies: 1, temperature: 26 },
      { name: "Sat", risk: 20, energy: 4600, health: 99, voltage: 11.0, anomalies: 0, temperature: 29 },
      { name: "Sun", risk: 15, energy: 4850, health: 98, voltage: 11.0, anomalies: 0, temperature: 28 }
    ]
  }
};

export const SystemProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [metrics, setMetrics] = useState(INITIAL_SECTOR_METRICS);
  const [alerts, setAlerts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem("infrasense_devices");
    return saved ? JSON.parse(saved) : INITIAL_DEVICES;
  });

  // Fetch initial data from Supabase or LocalStorage on mount
  const syncSystemData = async () => {
    if (useSupabase && supabase) {
      try {
        const { data: metricsData, error: metricsErr } = await supabase
          .from("metrics")
          .select("*");
        
        if (metricsErr) throw metricsErr;

        if (metricsData && metricsData.length > 0) {
          const mappedMetrics = {};
          metricsData.forEach(row => {
            mappedMetrics[row.sector] = {
              totalDevices: row.total_devices,
              activeSystems: row.active_systems,
              aiRiskScore: row.ai_risk_score,
              energyConsumption: row.energy_consumption,
              detectedAnomalies: row.detected_anomalies,
              systemHealth: row.system_health,
              temperature: parseFloat(row.temperature),
              voltage: parseFloat(row.voltage),
              chartData: Array.isArray(row.chart_data) ? row.chart_data : []
            };
          });
          // Merge to ensure new sectors (e.g. Hospital Sector, Residential Sector) are not lost if they are missing in the Supabase database
          const merged = { ...INITIAL_SECTOR_METRICS, ...mappedMetrics };
          setMetrics(merged);
        }

        const { data: alertsData, error: alertsErr } = await supabase
          .from("alerts")
          .select("*")
          .order("timestamp", { ascending: false });

        if (alertsErr) throw alertsErr;

        if (alertsData) {
          const mappedAlerts = alertsData.map(a => ({
            id: a.id,
            idCode: a.id_code,
            sector: a.sector,
            system: a.system,
            message: a.message,
            type: a.type,
            timestamp: a.timestamp,
            status: a.status
          }));
          setAlerts(mappedAlerts);
        }

        const { data: profilesData, error: profilesErr } = await supabase
          .from("profiles")
          .select("*");

        if (profilesErr) throw profilesErr;

        if (profilesData) {
          const mappedProfiles = profilesData.map(p => ({
            uid: p.id,
            displayName: p.display_name,
            email: p.id === user?.uid ? user?.email : "operator@infrasense.ai",
            phoneNumber: p.phone_number,
            companyName: p.company_name,
            role: p.role,
            sector: p.sector,
            photoURL: p.photo_url
          }));
          setAllUsers(mappedProfiles);
        }
      } catch (err) {
        console.error("❌ Failed to query Supabase tables:", err.message);
      }
    } else {
      const savedAlerts = localStorage.getItem("infrasense_alerts");
      const savedMetrics = localStorage.getItem("infrasense_sector_metrics");
      
      if (savedAlerts) {
        try {
          setAlerts(JSON.parse(savedAlerts));
        } catch (e) {
          console.error("Failed to parse saved alerts:", e);
        }
      }
      
      if (savedMetrics) {
        try {
          const parsed = JSON.parse(savedMetrics);
          // Merge to ensure new sectors (e.g. Hospital Sector, Residential Sector) are not lost if user has old localStorage
          const merged = { ...INITIAL_SECTOR_METRICS, ...parsed };
          setMetrics(merged);
        } catch (e) {
          console.error("Failed to parse saved metrics:", e);
          setMetrics(INITIAL_SECTOR_METRICS);
        }
      } else {
        setMetrics(INITIAL_SECTOR_METRICS);
      }
      
      const savedUsers = JSON.parse(localStorage.getItem("infrasense_mock_users") || "[]");
      setAllUsers(savedUsers);
    }
  };

  useEffect(() => {
    syncSystemData();
  }, [user]);

  // Persist devices list on changes
  useEffect(() => {
    localStorage.setItem("infrasense_devices", JSON.stringify(devices));
  }, [devices]);

  // Telemetry fluctuation & scrolling 5-second interval
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update overall sector metrics & append new 5-second chart points
      setMetrics((prevMetrics) => {
        const updated = { ...prevMetrics };
        
        Object.keys(updated).forEach((sector) => {
          const sData = updated[sector];
          if (!sData || sData.isStreaming) return;

          const tempDelta = (Math.random() - 0.5) * 0.4;
          const voltDelta = (Math.random() - 0.5) * 0.8;
          const energyDelta = (Math.random() - 0.5) * 5;

          const nextTemp = parseFloat((sData.temperature + tempDelta).toFixed(1));
          const nextVolt = parseFloat((sData.voltage + voltDelta).toFixed(1));
          const nextEnergy = Math.max(10, Math.round(sData.energyConsumption + energyDelta));

          const riskDelta = Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const nextRisk = Math.max(5, Math.min(95, sData.aiRiskScore + riskDelta));

          // Generate scrolling 5-second chart points
          const updatedChartData = [...(sData.chartData || [])];
          const now = new Date();
          const timestamp = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

          // Append new 5-second telemetry point
          updatedChartData.push({
            name: timestamp,
            energy: nextEnergy,
            risk: nextRisk,
            temperature: Math.round(nextTemp),
            voltage: nextVolt,
            anomalies: sData.detectedAnomalies
          });

          // Cap chart points length at 10 items for a scrolling effect
          if (updatedChartData.length > 10) {
            updatedChartData.shift();
          }

          updated[sector] = {
            ...sData,
            temperature: nextTemp,
            voltage: nextVolt,
            energyConsumption: nextEnergy,
            aiRiskScore: nextRisk,
            chartData: updatedChartData
          };
        });
        
        if (!useSupabase) {
          localStorage.setItem("infrasense_sector_metrics", JSON.stringify(updated));
        }

        return updated;
      });

      // 2. Fluctuate voltages on individual devices in real-time
      setDevices((prevDevices) => {
        return prevDevices.map(device => {
          const lowerName = (device.name || "").toLowerCase();
          const lowerModel = (device.model || "").toLowerCase();
          const isAnomalyTrigger = lowerName.includes("fault") || lowerName.includes("anomaly") || lowerName.includes("unstable") || lowerName.includes("defect") ||
                                  lowerModel.includes("fault") || lowerModel.includes("anomaly") || lowerModel.includes("unstable") || lowerModel.includes("defect") ||
                                  lowerName.includes("overload") || lowerModel.includes("overload");

          // Parse voltage range (e.g. "380V - 415V" or "12V - 24V DC")
          const rangeMatch = device.voltageRange.match(/(\d+)\s*[a-zA-Z]*\s*-\s*(\d+)/);
          if (rangeMatch) {
            const minV = parseInt(rangeMatch[1]);
            const maxV = parseInt(rangeMatch[2]);
            const midV = (minV + maxV) / 2;

            let nextV;
            let status = "optimal";

            if (isAnomalyTrigger) {
              // Force voltage to be outside safe range to trigger warning
              nextV = maxV + (Math.random() * 5) + 1;
              status = "unstable";
            } else {
              // Generate slight deviation around midpoint
              const fluctuation = (Math.random() - 0.5) * (maxV - minV) * 0.15;
              nextV = parseFloat((device.currentVoltage + fluctuation).toFixed(1));

              // Keep within bounds
              if (nextV < minV) nextV = minV + Math.random() * 5;
              if (nextV > maxV) nextV = maxV - Math.random() * 5;

              // If voltage is too close to limit, flag warning
              const percentage = (nextV - minV) / (maxV - minV);
              if (percentage > 0.9 || percentage < 0.1) status = "unstable";
            }

            return {
              ...device,
              currentVoltage: parseFloat(nextV.toFixed(1)),
              status
            };
          }
          return device;
        });
      });

    }, 5000); // 5-second interval execution

    return () => clearInterval(interval);
  }, []);

  // Smart Voltage Range Lookup Classifier (Manufacturer RAG mock helper)
  const lookupVoltageRange = (name, model, sector) => {
    const combined = `${name} ${model}`.toLowerCase();
    
    // 1. Check for specific medical / battery standards
    if (combined.includes("ventilator") || combined.includes("monitor") || combined.includes("biomedical") || combined.includes("ecg")) {
      return "12V - 24V DC";
    }
    // 2. Heavy industrial motors / generators
    if (combined.includes("siemens") || combined.includes("motor") || combined.includes("three-phase") || combined.includes("compressor") || combined.includes("caterpillar") || combined.includes("turbine") || combined.includes("pump")) {
      return "380V - 480V";
    }
    // 3. Residential grid / smart charging / home
    if (combined.includes("tesla") || combined.includes("charger") || combined.includes("chargepoint") || combined.includes("home") || combined.includes("inverter") || combined.includes("solar")) {
      return "120V - 240V";
    }
    // 4. Default based on active sector fallback
    if (sector === "Industrial Sector") return "400V - 480V";
    if (sector === "Hospital Sector") return "220V - 240V";
    if (sector === "Residential Sector") return "110V - 240V";
    if (sector === "Government Sector") return "11kV - 33kV";
    return "208V - 230V"; // Institutional / Default
  };

  // Device actions
  const addDevice = (name, model, system) => {
    const sector = user?.sector || "Industrial Sector";
    const voltageRange = lookupVoltageRange(name, model, sector);

    // Parse starting voltage from range
    const rangeMatch = voltageRange.match(/(\d+)\s*[a-zA-Z]*\s*-\s*(\d+)/);

    const lowerName = (name || "").toLowerCase();
    const lowerModel = (model || "").toLowerCase();
    const isAnomalyTrigger = lowerName.includes("fault") || lowerName.includes("anomaly") || lowerName.includes("unstable") || lowerName.includes("defect") ||
                            lowerModel.includes("fault") || lowerModel.includes("anomaly") || lowerModel.includes("unstable") || lowerModel.includes("defect") ||
                            lowerName.includes("overload") || lowerModel.includes("overload");

    let startV;
    if (rangeMatch) {
      const minV = parseInt(rangeMatch[1]);
      const maxV = parseInt(rangeMatch[2]);
      startV = isAnomalyTrigger ? maxV + 2 : parseFloat(((minV + maxV) / 2).toFixed(1));
    } else {
      startV = 220;
    }

    const newDevice = {
      id: "dev_" + Math.random().toString(36).substr(2, 9),
      name,
      model,
      sector,
      system,
      voltageRange,
      currentVoltage: startV,
      status: isAnomalyTrigger ? "unstable" : "optimal"
    };

    setDevices(prev => [...prev, newDevice]);

    // Update overall tracked device counts in metrics
    setMetrics(prev => {
      const updated = { ...prev };
      if (updated[sector]) {
        updated[sector].totalDevices += 1;
        updated[sector].activeSystems += 1;
        if (!useSupabase) {
          localStorage.setItem("infrasense_sector_metrics", JSON.stringify(updated));
        }
      }
      return updated;
    });

    // Sync metrics to Supabase if live
    if (useSupabase && supabase) {
      try {
        const sectorMetrics = metrics[sector];
        if (sectorMetrics) {
          supabase
            .from("metrics")
            .update({
              total_devices: sectorMetrics.totalDevices + 1,
              active_systems: sectorMetrics.activeSystems + 1
            })
            .eq("sector", sector);
        }
      } catch (err) {
        console.error("❌ Failed to update devices count in Supabase:", err.message);
      }
    }
  };

  const deleteDevice = (id) => {
    const deviceToDelete = devices.find(d => d.id === id);
    if (!deviceToDelete) return;

    setDevices(prev => prev.filter(d => d.id !== id));

    const sector = deviceToDelete.sector;
    setMetrics(prev => {
      const updated = { ...prev };
      if (updated[sector]) {
        updated[sector].totalDevices = Math.max(0, updated[sector].totalDevices - 1);
        updated[sector].activeSystems = Math.max(0, updated[sector].activeSystems - 1);
        if (!useSupabase) {
          localStorage.setItem("infrasense_sector_metrics", JSON.stringify(updated));
        }
      }
      return updated;
    });
  };

  // Alert acknowledgment handler
  const acknowledgeAlert = async (id) => {
    const targetAlert = alerts.find(a => a.id === id);
    if (!targetAlert) return;

    setAlerts(prev => prev.map(a => (a.id === id ? { ...a, status: "acknowledged" } : a)));

    setMetrics(prev => {
      const updated = { ...prev };
      const sector = targetAlert.sector;
      if (updated[sector]) {
        updated[sector].detectedAnomalies = Math.max(0, updated[sector].detectedAnomalies - 1);
        updated[sector].aiRiskScore = Math.max(5, updated[sector].aiRiskScore - (targetAlert.type === "critical" ? 8 : 4));
        if (!useSupabase) {
          localStorage.setItem("infrasense_sector_metrics", JSON.stringify(updated));
        }
      }
      return updated;
    });

    if (useSupabase && supabase) {
      try {
        const { error: alertErr } = await supabase
          .from("alerts")
          .update({ status: "acknowledged" })
          .eq("id", id);
        
        if (alertErr) throw alertErr;

        const sector = targetAlert.sector;
        const currentSectorMetrics = metrics[sector];
        if (currentSectorMetrics) {
          const nextAnomalies = Math.max(0, currentSectorMetrics.detectedAnomalies - 1);
          const nextRisk = Math.max(5, currentSectorMetrics.aiRiskScore - (targetAlert.type === "critical" ? 8 : 4));

          await supabase
            .from("metrics")
            .update({
              detected_anomalies: nextAnomalies,
              ai_risk_score: nextRisk
            })
            .eq("sector", sector);
        }
      } catch (err) {
        console.error("❌ Failed to acknowledge alert in database:", err.message);
      }
    } else {
      const savedAlerts = JSON.parse(localStorage.getItem("infrasense_alerts") || "[]");
      const updated = savedAlerts.map(a => (a.id === id ? { ...a, status: "acknowledged" } : a));
      localStorage.setItem("infrasense_alerts", JSON.stringify(updated));
    }
  };

  // Alert purge handler
  const clearAlert = async (id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));

    if (useSupabase && supabase) {
      try {
        const { error: err } = await supabase
          .from("alerts")
          .delete()
          .eq("id", id);
        if (err) throw err;
      } catch (err) {
        console.error("❌ Failed to delete alert from database:", err.message);
      }
    } else {
      const savedAlerts = JSON.parse(localStorage.getItem("infrasense_alerts") || "[]");
      const filtered = savedAlerts.filter(a => a.id !== id);
      localStorage.setItem("infrasense_alerts", JSON.stringify(filtered));
    }
  };

  // Manual Alert Ingestion
  const triggerManualAlert = async (sector, system, message, type) => {
    const idCode = `ALT-${Math.floor(1000 + Math.random() * 9000)}`;
    const timestamp = new Date().toISOString();

    const newAlert = {
      id: "alert_" + Math.random().toString(36).substr(2, 9),
      idCode,
      sector,
      system,
      message,
      type,
      timestamp,
      status: "active"
    };

    setAlerts(prev => [newAlert, ...prev]);

    setMetrics(prev => {
      const updated = { ...prev };
      if (updated[sector]) {
        updated[sector].detectedAnomalies += 1;
        updated[sector].aiRiskScore = Math.min(95, updated[sector].aiRiskScore + (type === "critical" ? 15 : 6));
        if (!useSupabase) {
          localStorage.setItem("infrasense_sector_metrics", JSON.stringify(updated));
        }
      }
      return updated;
    });

    if (useSupabase && supabase) {
      try {
        const { error: alertErr } = await supabase
          .from("alerts")
          .insert({
            id_code: idCode,
            sector,
            system,
            message,
            type,
            status: "active"
          });
        
        if (alertErr) throw alertErr;

        const currentSectorMetrics = metrics[sector];
        if (currentSectorMetrics) {
          const nextAnomalies = currentSectorMetrics.detectedAnomalies + 1;
          const nextRisk = Math.min(95, currentSectorMetrics.aiRiskScore + (type === "critical" ? 15 : 6));
          
          await supabase
            .from("metrics")
            .update({
              detected_anomalies: nextAnomalies,
              ai_risk_score: nextRisk
            })
            .eq("sector", sector);
        }
      } catch (err) {
        console.error("❌ Failed to insert manual alert in database:", err.message);
      }
    } else {
      const savedAlerts = JSON.parse(localStorage.getItem("infrasense_alerts") || "[]");
      savedAlerts.unshift(newAlert);
      localStorage.setItem("infrasense_alerts", JSON.stringify(savedAlerts));
    }
  };

  // Administrative deletions
  const deleteUser = async (uid) => {
    setAllUsers(prev => prev.filter(u => u.uid !== uid));

    if (useSupabase && supabase) {
      try {
        const { error: err } = await supabase
          .from("profiles")
          .delete()
          .eq("id", uid);
        if (err) throw err;
      } catch (err) {
        console.error("❌ Failed to delete profile record from database:", err.message);
      }
    } else {
      const mockUsers = JSON.parse(localStorage.getItem("infrasense_mock_users") || "[]");
      const filtered = mockUsers.filter(u => u.uid !== uid);
      localStorage.setItem("infrasense_mock_users", JSON.stringify(filtered));
    }
  };

  // Administrative creation (Mock mode helper)
  const createUser = (name, email, password, phone, company) => {
    if (useSupabase) {
      console.warn("⚠️ Administrative user provisioning is restricted to mock mode. Operators register themselves at /register.");
      return;
    }

    const mockUsers = JSON.parse(localStorage.getItem("infrasense_mock_users") || "[]");
    
    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error("User with that email already exists");
    }

    const newUser = {
      uid: "mock_" + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      password: password,
      displayName: name,
      phoneNumber: phone,
      companyName: company,
      role: "user",
      address: "Industrial Complex Substation",
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      sector: ""
    };

    mockUsers.push(newUser);
    localStorage.setItem("infrasense_mock_users", JSON.stringify(mockUsers));
    setAllUsers(mockUsers);
  };

  const updateSectorMetrics = (sector, updatedData) => {
    setMetrics(prev => {
      const updated = {
        ...prev,
        [sector]: {
          ...prev[sector],
          ...updatedData
        }
      };
      if (!useSupabase) {
        localStorage.setItem("infrasense_sector_metrics", JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <SystemContext.Provider value={{
      metrics,
      alerts,
      allUsers,
      devices,
      addDevice,
      deleteDevice,
      acknowledgeAlert,
      clearAlert,
      triggerManualAlert,
      deleteUser,
      createUser,
      updateSectorMetrics
    }}>
      {children}
    </SystemContext.Provider>
  );
};

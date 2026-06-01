# InfraSense AI - Industrial Sector Operational Reference Manual

**Tagline**: "Precision. Safety. Continuity."  
**Scope**: Heavy Duty Manufacturing & Rotational Telemetry Systems

This reference file compiles all operational, technical, and analytical details of the **Industrial Sector** within the InfraSense AI platform. It serves as a comprehensive reference guide for developers, operators, and judges.

---

## Sector Overview
The Industrial Sector is structured into two distinct monitoring domains, each targeting specific vectors of infrastructure health and site safety:
1. **Electrical Infrastructure Monitoring** (Manual & rule-based telemetry for rotary components and compressed air lines).
2. **Worker Safety Monitoring** (AI/ML-driven bio-physical telemetry streams targeting physical worker safety, compliance, and fatigue).

---

## Domain 1: Electrical Infrastructure Monitoring

### Core Concept
Monitors stationary heavy-duty automation machinery, conveyor systems, and air compressions to predict mechanical failure, electrical overload, or line leaks.

### Vital Metrics Tracked
- **Telemetry Health**: Operational status of hardware sensors (%).
- **Rotation Vibration**: Shaft vibration indices (mm/s).
- **Compressed Air Flow**: Pressure flow rate in pneumatic air lines (m/s).
- **Hydraulic Temperature**: Core motor operating temperature (°C).
- **Operational Voltage**: Electrical voltage inputs across systems (V).

### Monitored Devices & Limits
- **Heavy Duty Conveyor Motor**
  - **Model**: Siemens 1LA9 Three-Phase Core
  - **Rated Voltage Range**: `380V - 415V`
  - **Optimal Telemetry**: Fluctuation midpoint around `412.5V`.
- **Air Compressor Motor**
  - **Model**: Atlas Copco GA37 Pneumatic
  - **Rated Voltage Range**: `400V - 480V`
  - **Optimal Telemetry**: Fluctuation midpoint around `415.8V`.

### Dynamic Anomaly Triggers (For Demonstration)
To demonstrate anomalies to judges, a keyword-based override is implemented. Registering a device with any of these keywords in the **Device Name** or **Model / Manufacturer** will immediately trigger a warning:
- **Keywords**: `fault`, `anomaly`, `unstable`, `defect`, `overload`
- **Behavior**: Telemetry voltage is forced out-of-bounds, and status is set to `unstable`.

### Automated Dispatches
- **Perform Bearing Lubrication**: Triggered when vibration metrics exceed safety thresholds.
- **Initiate Pressure Seal Calibration**: Triggered when pneumatic airflow velocity drops (indicating leakage).
- **Deploy Core Cooling Maintenance**: Triggered when hydraulic operating temperatures overheat.

---

## Domain 2: Worker Safety Monitoring

### Core Concept
Uses real-time wearable sensor feeds (physiological and environmental) to monitor worker safety, detect falls/collapses, and track PPE compliance in hazardous environments.

### 14 Telemetry Features
The system processes a 14-dimensional feature vector for each worker:
1. `hr`: Heart Rate (BPM)
2. `temp`: Body Temperature (°C)
3. `eda`: Electrodermal Activity (skin conductance)
4. `fatigue_score`: Cumulative fatigue score (0-5)
5. `blink_rate_pm`: Eye blink rate per minute
6. `activity_score`: Movement activity score (0-100)
7. `accel_impact_g`: Accelerometer impact force (G)
8. `body_angle_deg`: Body inclination angle (degrees)
9. `motion_detected`: Motion presence (0 or 1)
10. `helmet`: Helmet compliance (0 = missing, 1 = present)
11. `vest`: Vest compliance (0 = missing, 1 = present)
12. `zone_authorized`: Authorization status (0 = unauthorized, 1 = authorized)
13. `movement_magnitude`: Vector sum of movement velocity
14. `ppe_compliance_score`: Compiled PPE compliance score

### 6 Safety Anomalies Detected
The AI classifier checks telemetry to flag these specific safety violations:
- **PPE_Violation**: Worker enters a hazardous area without a helmet or vest.
- **Unauthorized_Access**: Worker breaches unauthorized boundaries.
- **Heat_Stress**: Elevated heart rate combined with high core body temperature.
- **Worker_Fatigue**: High fatigue index, low activity, and sluggish blink rate.
- **Fall_Detected**: Sudden high-impact G-force combined with a horizontal body angle change.
- **Worker_Collapse**: Extended period of motionlessness in a horizontal position.

---

## Machine Learning Pipeline (Classifier & Regressor)

The ML pipelines are trained using Random Forest models to process sensor feeds and predict risk levels:

### 1. Classification Model (`industrial_classifier.joblib`)
- **Type**: Random Forest Classifier
- **Task**: Classify telemetry into one of 7 statuses: `Normal`, `PPE_Violation`, `Unauthorized_Access`, `Heat_Stress`, `Worker_Fatigue`, `Fall_Detected`, `Worker_Collapse`.
- **Accuracy**: **97.14%**
- **Dataset Size**: 350 samples

### 2. Regression Model (`industrial_regressor.joblib`)
- **Type**: Random Forest Regressor
- **Task**: Predict overall occupational risk score (0 to 100).
- **MAE**: **6.45**
- **R-squared (R2)**: **85.02%**

### Feature Importance Rankings
The features that impact classification the most are ranked below:

| Rank | Telemetry Feature | Importance Score |
|------|-------------------|------------------|
| 1 | `ppe_compliance_score` | 0.2264 |
| 2 | `helmet` | 0.1311 |
| 3 | `eda` | 0.1159 |
| 4 | `zone_authorized` | 0.1151 |
| 5 | `temp` | 0.1024 |
| 6 | `hr` | 0.0615 |
| 7 | `fatigue_score` | 0.0549 |
| 8 | `activity_score` | 0.0465 |
| 9 | `accel_impact_g` | 0.0449 |
| 10 | `body_angle_deg` | 0.0382 |
| 11 | `blink_rate_pm` | 0.0339 |
| 12 | `motion_detected` | 0.0190 |
| 13 | `movement_magnitude` | 0.0102 |
| 14 | `vest` | 0.0000 |

---

## Project Technical Map
- **Frontend Dashboard View**: [UserDashboard.jsx](file:///c:/Users/keert/OneDrive/Desktop/phyt/src/pages/UserDashboard.jsx)
- **Analytics & Graphs View**: [AnalyticsPage.jsx](file:///c:/Users/keert/OneDrive/Desktop/phyt/src/pages/AnalyticsPage.jsx)
- **Global Context Provider**: [SystemContext.jsx](file:///c:/Users/keert/OneDrive/Desktop/phyt/src/context/SystemContext.jsx)
- **ML Training Pipeline Script**: [industrial.py](file:///c:/Users/keert/OneDrive/Desktop/phyt/industrial.py)
- **Ingested CSV Dataset**: [industrial.csv](file:///c:/Users/keert/OneDrive/Desktop/phyt/industrial.csv)

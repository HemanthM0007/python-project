import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, accuracy_score, mean_absolute_error, r2_score
import joblib
import os

def main():
    print("[INFO] Starting Model Training Pipeline for InfraSense AI (Hospital Data)...")
    
    # 1. Load Dataset
    csv_path = "hospital.csv"
    if not os.path.exists(csv_path):
        print(f"[ERROR] Dataset {csv_path} not found.")
        return
        
    df = pd.read_csv(csv_path)
    print(f"[INFO] Loaded dataset successfully. Shape: {df.shape[0]} rows, {df.shape[1]} columns.\n")
    
    # 2. Preprocess & Target Encoding
    # Map detected_anomaly to anomaly_encoded
    anomaly_map = {
        "Normal": 0,
        "Silent Patient Deterioration": 1,
        "Recovery Degradation Pattern": 2,
        "Hospital Resource Overload": 3
    }
    
    df['anomaly_encoded'] = df['detected_anomaly'].map(anomaly_map)
    
    feature_cols = [
        'age',
        'previous_admissions',
        'hospital_stay_days',
        'medications_count',
        'emergency_visits',
        'doctor_workload',
        'bed_occupancy_percent',
        'appointment_conflicts',
        'billing_amount',
        'combined_risk_score'
    ]
    
    # Check for missing columns
    missing_cols = [col for col in feature_cols if col not in df.columns]
    if missing_cols:
        print(f"[ERROR] Missing expected columns: {missing_cols}")
        return
        
    # Drop rows with NaN in features or targets
    df_clean = df.dropna(subset=feature_cols + ['anomaly_encoded', 'deterioration_score'])
    
    X = df_clean[feature_cols]
    y_class = df_clean['anomaly_encoded'].astype(int)
    y_reg = df_clean['deterioration_score']
    
    # Print target stats
    print("[INFO] Target Distribution (detected_anomaly):")
    for val, count in y_class.value_counts().items():
        status_str = [k for k, v in anomaly_map.items() if v == val][0]
        print(f"  - [{val}] {status_str}: {count} samples")
    print()
    
    # 3. Train/Test Splits
    X_train, X_test, y_train_class, y_test_class = train_test_split(X, y_class, test_size=0.2, random_state=42)
    _, _, y_train_reg, y_test_reg = train_test_split(X, y_reg, test_size=0.2, random_state=42)
    
    # 4. Train Anomaly Classifier
    print("[RUN] Training Hospital Anomaly Classification Model (Random Forest)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X_train, y_train_class)
    
    y_pred_class = clf.predict(X_test)
    acc = accuracy_score(y_test_class, y_pred_class)
    
    print("\n[SUCCESS] Classification Evaluation:")
    print(f"  - Accuracy Score: {acc:.4f} ({acc*100:.2f}%)")
    print("\nClassification Report:")
    target_names = [k for k, v in sorted(anomaly_map.items(), key=lambda item: item[1]) if v in y_class.unique()]
    print(classification_report(y_test_class, y_pred_class, target_names=target_names))
    
    # 5. Train Deterioration Regressor
    print("[RUN] Training Hospital Deterioration Regressor Model (Random Forest)...")
    reg = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
    reg.fit(X_train, y_train_reg)
    
    y_pred_reg = reg.predict(X_test)
    mae = mean_absolute_error(y_test_reg, y_pred_reg)
    r2 = r2_score(y_test_reg, y_pred_reg)
    
    print("\n[SUCCESS] Regression Evaluation:")
    print(f"  - Mean Absolute Error (MAE): {mae:.4f}")
    print(f"  - R-squared (R2) Score: {r2:.4f} ({r2*100:.2f}%)")
    print()
    
    # 6. Feature Importances
    importances = clf.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    print("[INFO] Feature Importance Ranking (for Anomaly Classification):")
    feature_ranking_md = []
    for f in range(X.shape[1]):
        feat_name = feature_cols[indices[f]]
        score = importances[indices[f]]
        print(f"  {f + 1}. {feat_name:<25} : {score:.4f}")
        feature_ranking_md.append(f"| {f + 1} | `{feat_name}` | {score:.4f} |")
    print()
    
    # 7. Save Models
    clf_model_path = "hospital_classifier.joblib"
    reg_model_path = "hospital_regressor.joblib"
    
    joblib.dump(clf, clf_model_path)
    joblib.dump(reg, reg_model_path)
    
    print(f"[SAVE] Saved Classifier Model to: {clf_model_path}")
    print(f"[SAVE] Saved Regressor Model to: {reg_model_path}")
    print("\n[INFO] Model Training Pipeline Completed Successfully.")
    
    # 8. Generate Report Markdown Artifact
    report_md = f"""# InfraSense AI - Hospital Model Training Report

This report summarizes the results of the machine learning model training pipeline executed on the `hospital.csv` dataset.

---

## Dataset Ingestion Metrics

* **Source File**: `hospital.csv`
* **Monitored Patients/Rows**: {df.shape[0]} records
* **Feature Columns**: {len(feature_cols)} columns
* **Target Classes (detected_anomaly)**:
{chr(10).join([f"  - **{[k for k, v in anomaly_map.items() if v == val][0]}**: {count} samples" for val, count in y_class.value_counts().items()])}

---

## Model Performance Summary

### 1. Anomaly Classification (Random Forest Classifier)
Classifies clinical telemetry into alert categories (Normal, Silent Patient Deterioration, Recovery Degradation Pattern, Hospital Resource Overload).
* **Test Accuracy**: {acc*100:.2f}%
* **Precision/Recall**: Reflected in logs.

### 2. Deterioration Score Regression (Random Forest Regressor)
Predicts exact continuous patient physical deterioration scores (0 to 150).
* **Mean Absolute Error (MAE)**: {mae:.4f}
* **R-squared (R2) Score**: {r2*100:.2f}%

---

## Feature Importance Rankings
Shows which clinical sensory indexes and patient metrics have the most significant impact on detecting anomalies:

| Rank | Clinical sensory feature | Importance Score |
|------|--------------------------|------------------|
{chr(10).join(feature_ranking_md)}

---

## Saved Model Artifacts
The trained hospital models are saved in the project root:
* **Classifier Model**: [hospital_classifier.joblib](file:///C:/Users/keert/OneDrive/Desktop/phyt/hospital_classifier.joblib)
* **Regressor Model**: [hospital_regressor.joblib](file:///C:/Users/keert/OneDrive/Desktop/phyt/hospital_regressor.joblib)
"""
    # Write report file
    report_path = r"C:\Users\keert\.gemini\antigravity\brain\4056c3d0-834e-40cd-9bec-3ad0322ac8c7\hospital_training_results.md"
    with open(report_path, "w", encoding="utf-8") as f_out:
        f_out.write(report_md)
    print(f"[INFO] Wrote hospital training report to: {report_path}")

if __name__ == "__main__":
    main()

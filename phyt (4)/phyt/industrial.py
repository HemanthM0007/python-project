import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, accuracy_score, mean_absolute_error, r2_score
import joblib
import os

def main():
    print("[INFO] Starting Model Training Pipeline for InfraSense AI (Industrial Data)...")
    
    # 1. Load Dataset
    csv_path = "industrial.csv"
    if not os.path.exists(csv_path):
        print(f"[ERROR] Dataset {csv_path} not found.")
        return
        
    df = pd.read_csv(csv_path)
    print(f"[INFO] Loaded dataset successfully. Shape: {df.shape[0]} rows, {df.shape[1]} columns.\n")
    
    # 2. Preprocess & Target Encoding
    # Map actual_anomaly_label to anomaly_encoded (aligned with actual dataset values)
    anomaly_map = {
        "Fall_Detected": 0,
        "Heat_Stress": 1,
        "Normal": 2,
        "PPE_Violation": 3,
        "Unauthorized_Access": 4,
        "Worker_Collapse": 5,
        "Worker_Fatigue": 6
    }
    
    df['anomaly_encoded'] = df['actual_anomaly_label'].map(anomaly_map)
    
    # 14 key bio-physical and environment features for industrial safety telemetry
    feature_cols = [
        'hr',
        'temp',
        'eda',
        'fatigue_score',
        'blink_rate_pm',
        'activity_score',
        'accel_impact_g',
        'body_angle_deg',
        'motion_detected',
        'helmet',
        'vest',
        'zone_authorized',
        'movement_magnitude',
        'ppe_compliance_score'
    ]
    
    # Check for missing columns
    missing_cols = [col for col in feature_cols if col not in df.columns]
    if missing_cols:
        print(f"[ERROR] Missing expected columns: {missing_cols}")
        return
        
    # Drop rows with NaN in features or targets
    df_clean = df.dropna(subset=feature_cols + ['anomaly_encoded', 'overall_risk_score'])
    
    X = df_clean[feature_cols]
    y_class = df_clean['anomaly_encoded'].astype(int)
    y_reg = df_clean['overall_risk_score']
    
    # Print target stats
    print("[INFO] Target Distribution (actual_anomaly_label):")
    for val, count in y_class.value_counts().items():
        status_str = [k for k, v in anomaly_map.items() if v == val][0]
        print(f"  - [{val}] {status_str}: {count} samples")
    print()
    
    # 3. Train/Test Splits
    X_train, X_test, y_train_class, y_test_class = train_test_split(X, y_class, test_size=0.2, random_state=42)
    _, _, y_train_reg, y_test_reg = train_test_split(X, y_reg, test_size=0.2, random_state=42)
    
    # 4. Train Anomaly Classifier
    print("[RUN] Training Industrial Anomaly Classification Model (Random Forest)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X_train, y_train_class)
    
    y_pred_class = clf.predict(X_test)
    acc = accuracy_score(y_test_class, y_pred_class)
    
    print("\n[SUCCESS] Classification Evaluation:")
    print(f"  - Accuracy Score: {acc:.4f} ({acc*100:.2f}%)")
    print("\nClassification Report:")
    unique_test_classes = sorted(y_test_class.unique())
    target_names = [k for k, v in sorted(anomaly_map.items(), key=lambda item: item[1]) if v in unique_test_classes]
    print(classification_report(y_test_class, y_pred_class, labels=unique_test_classes, target_names=target_names))
    
    # 5. Train Overall Risk Regressor
    print("[RUN] Training Industrial Overall Risk Regressor Model (Random Forest)...")
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
    clf_model_path = "industrial_classifier.joblib"
    reg_model_path = "industrial_regressor.joblib"
    
    joblib.dump(clf, clf_model_path)
    joblib.dump(reg, reg_model_path)
    
    print(f"[SAVE] Saved Classifier Model to: {clf_model_path}")
    print(f"[SAVE] Saved Regressor Model to: {reg_model_path}")
    print("\n[INFO] Model Training Pipeline Completed Successfully.")
    
    # 8. Generate Report Markdown Artifact
    report_md = f"""# InfraSense AI - Industrial Model Training Report

This report summarizes the results of the machine learning model training pipeline executed on the `industrial.csv` dataset.

---

## Dataset Ingestion Metrics

* **Source File**: `industrial.csv`
* **Monitored Workers/Rows**: {df.shape[0]} records
* **Feature Columns**: {len(feature_cols)} columns
* **Target Classes (actual_anomaly_label)**:
{chr(10).join([f"  - **{ [k for k, v in anomaly_map.items() if v == val][0] }**: {count} samples" for val, count in y_class.value_counts().items()])}

---

## Model Performance Summary

### 1. Anomaly Classification (Random Forest Classifier)
Classifies telemetry into specific safety and fatigue alert statuses (Normal, Fall_Detected, Heat_Stress, PPE_Violation, Unauthorized_Access, Worker_Collapse, Worker_Fatigue).
* **Test Accuracy**: {acc*100:.2f}%
* **Precision/Recall**: Reflected in logs.

### 2. Overall Risk Score Regression (Random Forest Regressor)
Predicts exact industrial occupational risk scores (0 to 100).
* **Mean Absolute Error (MAE)**: {mae:.4f}
* **R-squared (R2) Score**: {r2*100:.2f}%

---

## Feature Importance Rankings
Shows which bio-physical parameters and environment signals have the most significant impact on detecting anomalies:

| Rank | Telemetry Feature | Importance Score |
|------|-------------------|------------------|
{chr(10).join(feature_ranking_md)}

---

## Saved Model Artifacts
The trained industrial models are saved in the project root:
* **Classifier Model**: [industrial_classifier.joblib](file:///C:/Users/keert/OneDrive/Desktop/phyt/industrial_classifier.joblib)
* **Regressor Model**: [industrial_regressor.joblib](file:///C:/Users/keert/OneDrive/Desktop/phyt/industrial_regressor.joblib)
"""
    # Write report file
    report_path = r"C:\Users\keert\.gemini\antigravity\brain\4056c3d0-834e-40cd-9bec-3ad0322ac8c7\industrial_training_results.md"
    with open(report_path, "w", encoding="utf-8") as f_out:
        f_out.write(report_md)
    print(f"[INFO] Wrote industrial training report to: {report_path}")

if __name__ == "__main__":
    main()

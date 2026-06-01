import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.metrics import classification_report, accuracy_score, mean_absolute_error, r2_score
import joblib
import os

def main():
    print("[INFO] Starting Model Training Pipeline for InfraSense AI...")
    
    # 1. Load Dataset
    csv_path = "university.csv"
    if not os.path.exists(csv_path):
        print(f"[ERROR] Dataset {csv_path} not found.")
        return
        
    df = pd.read_csv(csv_path)
    print(f"[INFO] Loaded dataset successfully. Shape: {df.shape[0]} rows, {df.shape[1]} columns.\n")
    
    # 2. Select Features & Targets
    feature_cols = [
        'server_load_kw', 
        'chilled_water_kj', 
        'outdoor_temp_c', 
        'humidity_pct', 
        'hvac_runtime_hr', 
        'airflow_velocity_mps', 
        'power_consumption_kw', 
        'cooling_efficiency', 
        'thermal_stress_index', 
        'airflow_efficiency'
    ]
    
    # Check for missing columns
    missing_cols = [col for col in feature_cols if col not in df.columns]
    if missing_cols:
        print(f"[ERROR] Missing expected sensor columns: {missing_cols}")
        return
        
    # Drop rows with NaN in features or targets
    df_clean = df.dropna(subset=feature_cols + ['status_encoded', 'ai_risk_score'])
    
    X = df_clean[feature_cols]
    y_class = df_clean['status_encoded']
    y_reg = df_clean['ai_risk_score']
    
    # Print target stats
    print("[INFO] Target Distribution (status_encoded):")
    for val, count in y_class.value_counts().items():
        # Get matching status string
        status_str = df_clean[df_clean['status_encoded'] == val]['status'].iloc[0]
        print(f"  - [{val}] {status_str}: {count} samples")
    print()
    
    # 3. Train/Test Splits
    X_train, X_test, y_train_class, y_test_class = train_test_split(X, y_class, test_size=0.2, random_state=42)
    _, _, y_train_reg, y_test_reg = train_test_split(X, y_reg, test_size=0.2, random_state=42)
    
    # 4. Train Anomaly Classifier
    print("[RUN] Training Anomaly Classification Model (Random Forest)...")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    clf.fit(X_train, y_train_class)
    
    y_pred_class = clf.predict(X_test)
    acc = accuracy_score(y_test_class, y_pred_class)
    
    print("\n[SUCCESS] Classification Evaluation:")
    print(f"  - Accuracy Score: {acc:.4f} ({acc*100:.2f}%)")
    print("\nClassification Report:")
    target_names = [df_clean[df_clean['status_encoded'] == i]['status'].iloc[0] for i in sorted(y_class.unique())]
    print(classification_report(y_test_class, y_pred_class, target_names=target_names))
    
    # 5. Train Risk Score Regressor
    print("[RUN] Training AI Risk Level Regression Model (Random Forest)...")
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
    clf_model_path = "anomaly_classifier.joblib"
    reg_model_path = "risk_regressor.joblib"
    
    joblib.dump(clf, clf_model_path)
    joblib.dump(reg, reg_model_path)
    
    print(f"[SAVE] Saved Classifier Model to: {clf_model_path}")
    print(f"[SAVE] Saved Regressor Model to: {reg_model_path}")
    print("\n[INFO] Model Training Pipeline Completed Successfully.")
    
    # 8. Generate Report Markdown Artifact
    report_md = f"""# InfraSense AI - Model Training Report

This report summarizes the results of the machine learning model training pipeline executed on the `university.csv` dataset.

---

## Dataset Ingestion Metrics

* **Source File**: `university.csv`
* **Monitored Rows**: {df.shape[0]} rows
* **Sensory Columns**: {df.shape[1]} columns
* **Target Classes**:
{chr(10).join([f"  - **{df_clean[df_clean['status_encoded'] == val]['status'].iloc[0]}**: {count} samples" for val, count in y_class.value_counts().items()])}

---

## Model Performance Summary

### 1. Anomaly Classification (Random Forest Classifier)
Classifies telemetry into warning severities (Critical, Warning, Optimization Alert).
* **Test Accuracy**: {acc*100:.2f}%
* **Precision/Recall**: Reflected in logs.

### 2. Risk Level Regression (Random Forest Regressor)
Predicts the exact continuous `ai_risk_score` (0% to 100%) for widgets.
* **Mean Absolute Error (MAE)**: {mae:.2f} %
* **R-squared (R2) Score**: {r2*100:.2f}%

---

## Feature Importance Rankings
Shows which sensory feeds have the most significant impact on detecting failures:

| Rank | Sensor Feature | Importance Score |
|------|----------------|------------------|
{chr(10).join(feature_ranking_md)}

---

## Saved Model Artifacts
The models are saved in the project root:
* **Classifier Model**: [anomaly_classifier.joblib](file:///C:/Users/keert/OneDrive/Desktop/phyt/anomaly_classifier.joblib)
* **Regressor Model**: [risk_regressor.joblib](file:///C:/Users/keert/OneDrive/Desktop/phyt/risk_regressor.joblib)
"""
    # Write report file
    report_path = r"C:\Users\keert\.gemini\antigravity\brain\4056c3d0-834e-40cd-9bec-3ad0322ac8c7\model_training_results.md"
    with open(report_path, "w", encoding="utf-8") as f_out:
        f_out.write(report_md)
    print(f"[INFO] Wrote training report artifact to: {report_path}")

if __name__ == "__main__":
    main()

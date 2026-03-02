# 🇹🇿 Tanzania Traffic AI: Project Technical Report

## 🌟 Executive Summary
The **Tanzania Traffic AI Classifier** is a cutting-edge, localized computer vision solution designed to address the unique challenges of traffic management in Dar es Salaam and other Tanzanian cities. By fine-tuning a YOLOv5 model on Tanzanian vehicle classes—including the iconic **Bajaj** and **Daladala**—this project demonstrates the potential of AI to improve urban infrastructure and road safety.

---

## 🚩 The Problem
Traditional vehicle detection models are often trained on Western datasets, failing to recognize specific African vehicle types:
*   **Localized Vehicle Types**: Standard models often misclassify *Daladalas* as "buses" or *Bajajs* as "motorcycles/cars".
*   **High Traffic Density**: Tanzanian urban centers feature dense, mixed traffic that requires robust detection.
*   **Infrastructure Connectivity**: Many areas lack stable internet, making cloud-based AI impractical for real-time edge use.

---

## 🛠️ Our Solution
We built an **offline-ready web application** that brings AI detection directly to the browser. 

### Key Technical Achievements:
1.  **Transfer Learning**: Re-trained a YOLOv5 model specifically for Tanzanian traffic (7+ classes).
2.  **Edge Inference**: Enabled detection running entirely on the user's computer via TensorFlow.js.
3.  **No-Code Distribution**: A single-file HTML solution that works without Python or complex installations.

---

## 📸 Visual Evidence (System Showcase)

### 1. The Home Interface
The application features a modern, dark-themed dashboard inspired by Tanzania's national colors. It provides multiple ways to input data, including file uploads, sample emoji buttons, and live webcam support.

![Home Landing Interface](file:///c:/Users/M%20I%20C%20R%20O%20S%20P%20A%20C%20E/Desktop/My%20Projects/AI-Programme-Vibe-Coding/Week_2/01_home_landing.png)

### 2. Precise Bajaj Detection
The model accurately identifies *Bajaj* (3-wheelers) with high confidence, distinguishing them from standard cars. This is critical for micro-mobility tracking.

![Bajaj Detection Analysis](file:///c:/Users/M%20I%20C%20R%20O%20S%20P%20A%20C%20E/Desktop/My%20Projects/AI-Programme-Vibe-Coding/Week_2/03_bajaj_detection.png)

### 3. Complex Scene Analysis
In crowded "Mixed Traffic" scenarios, the AI successfully isolates multiple targets—including *Daladalas*, *Pikipikis*, and pedestrians—simultaneously.

![Mixed Traffic Detection](file:///c:/Users/M%20I%20C%20R%20O%20S%20P%20A%20C%20E/Desktop/My%20Projects/AI-Programme-Vibe-Coding/Week_2/05_mixed_detection.png)

### 4. Real-time Session Statistics
The app tracks cumulative performance, showing the distribution of vehicle types and average detection confidence over time.

![Session Statistics and Daladala Detection](file:///c:/Users/M%20I%20C%20R%20O%20S%20P%20A%20C%20E/Desktop/My%20Projects/AI-Programme-Vibe-Coding/Week_2/06_daladala_with_stats.png)

### 5. Full System Overview
A look at the complete edge-AI environment, integrating the detection canvas with the real-time sidebar results.

![Full System View](file:///c:/Users/M%20I%20C%20R%20O%20S%20P%20A%20C%20E/Desktop/My%20Projects/AI-Programme-Vibe-Coding/Week_2/07_full_page.png)

---

## 📊 Vehicle Classification Table
| Class | Local Name | Recognition Support |
| :--- | :--- | :--- |
| **Pikipiki** | Motorcycle/Boda | ✅ High |
| **Gari** | Car | ✅ High |
| **Bajaj** | Tuk-tuk | ✅ Specialized |
| **Daladala** | City Mini-bus | ✅ Specialized |
| **Mtu** | Pedestrian | ✅ High |

---

## 🚀 Impact & Roadmap
*   **Offline Accessibility**: Can be deployed on low-cost hardware in schools or rural offices.
*   **Custom Data**: Future iterations (Week 3) will focus on fine-tuning with 100% locally sourced Tanzanian street photography.
*   **Mobile First**: Optimizing for mobile browsers to allow "on-the-street" traffic counting by transport planners.

---
*Created as part of the **Tanzania AI Education 2026** initiative.*

# 🇹🇿 Tanzania Vehicle AI - World Class Edition

A professional, engineer-grade vehicle classification system designed for Dar es Salaam traffic monitoring using **Google Gemini 1.5 Flash Vision AI**.

## 🚀 Overview
This project leverages cutting-edge computer vision to identify and classify the three most common transit vehicles in Tanzania:
- **🛺 Bajaj** (Auto-rickshaws)
- **🚌 Daladala** (Commuter minibuses)
- **🏍️ Bodaboda** (Motorcycle taxis)

The system is built with **OOAD (Object-Oriented Analysis and Design)** principles, ensuring scalability, maintainability, and clean separation of concerns.

## 🏗️ Architecture (Clean OOAD)

### Backend (Python / FastAPI)
- **Domain-Driven Design**: Core business logic is isolated from external frameworks.
- **Repository Pattern**: Abstract data layer allows swapping Supabase for Postgres/Redis easily.
- **Dependency Injection**: Services and repositories are injected into API routes for high testability.
- **AI Strategy**: The classification engine uses an interface-based design to support multiple LLM providers.

### Frontend (Modern Glassmorphism)
- **Premium UI**: Built with a custom Tailwind-based design system.
- **Component Architecture**: Modular React components loaded via ESM.
- **Responsive**: Mobile-first design for real-time traffic officers.

## 🛠️ Tech Stack
- **AI**: Google Gemini 1.5 Flash (Vision)
- **Backend**: FastAPI (Python 3.10+)
- **Database**: Supabase (PostgreSQL)
- **Frontend**: React (ESM), Tailwind CSS
- **Deployment**: Render.com (Backend), GitHub Pages (Frontend)

## 📋 Features
- [x] Real-time vehicle detection with color and confidence markers.
- [x] Historical data logging to Supabase.
- [x] Automated team/location metadata tagging.
- [x] Health-check dashboard for API/DB connectivity.
- [x] Interactive AI reasoning (Why did the AI choose this class?).

## 🚦 Getting Started

### 1. Prerequisites
- Python 3.10+
- Google AI Studio API Key
- Supabase Account

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 3. Frontend Setup
Open `frontend/index.html` in any modern browser.

## 📄 License
MIT License - Developed for the World 🌍

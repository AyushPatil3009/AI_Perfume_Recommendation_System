# 👑 Aura Scent Atelier
> **AI Fragrance Recommendation Platform**  
> *Built with Next.js 15 (App Router), PostgreSQL, Google Gemini AI, Stripe & Resend.*

---

## ✨ Overview
**Aura Scent Atelier** is an ultra-luxury AI perfume curation platform that bridges mathematical olfactory science with haute parfumerie. Users describe their mood, season, memories, or fragrance preferences to receive **5 bespoke perfume prescriptions** complete with personalized Gemini sommelier explanations, note pyramids, and direct verified retail store links.

---

## 🚀 Key Features

* **🤖 Gemini AI Sommelier:** Powered by `gemini-2.5-flash` for natural language intent parsing, off-topic prompt guard, and custom 2-sentence flacon explanations.
* **🧪 6D Olfactory SQL Scoring:** Weighted matching across top, heart, base accords, season, occasion, and intensity.
* **💳 Stripe Monetization ($1.99 Pass):** Seamless checkout flow with metadata packing and automated callback fulfillment.
* **🔐 Dual Authentication & Scent Vault:** Email/Password (bcrypt + Zod) and Google OAuth 2.0 PKCE with persistent consultation history.
* **✉️ Luxury Transactional Emails:** Automated Welcome and Scent Prescription & Receipt delivery via Resend.
* **🎨 24K Imperial Gold Design System:** Tailwind CSS v4 `@theme` token bridge, glassmorphism, and custom micro-animations (`moving-border-card`).

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Actions, React 19) |
| **Styling** | Tailwind CSS v4, CSS Variables, Lucide Icons |
| **AI Engine** | Google Gemini SDK (`gemini-2.5-flash`) |
| **Database** | PostgreSQL + Prisma ORM (`@prisma/adapter-pg`) |
| **Payments** | Stripe API & Hosted Checkout Sessions |
| **Emails** | Resend Transactional Email API |
| **Auth** | Bcrypt Password Hashing + Google OAuth 2.0 PKCE |

---

## 🏁 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AyushPatil3009/AI_Perfume_Recommendation_System.git
cd my-app
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# PostgreSQL Database
DATABASE_URL="postgresql://username:password@localhost:5432/perfume_db?schema=public"

# Google Gemini AI
GEMINI_API_KEY="your_gemini_api_key"

# Stripe Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google OAuth 2.0
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Resend Email Service
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Aura Scent Atelier <onboarding@resend.dev>"
ADMIN_EMAIL="your_email@gmail.com"
```

### 3. Sync Database Schema
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Architecture
Detailed folder-by-folder codebase architecture is documented in [`PROJECT_ARCHITECTURE_GUIDE.md`](./PROJECT_ARCHITECTURE_GUIDE.md).

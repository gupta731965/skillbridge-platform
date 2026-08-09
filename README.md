# ⚡ SkillBridge — AI-Powered Skill Evaluation & Verification Platform

> **Proof of Skill, Not Degree.** An end-to-end AI platform that evaluates live candidate code submissions, computes multidimensional competency scores, and issues cryptographically signed SHA-256 digital badges and downloadable QR credentials for skills-based hiring.

---

## ✨ Key Features

### 👨‍💻 Candidate Panel
- **AI Code Evaluation Workspace**: Live code editor supporting React, Node.js, Python, TypeScript, System Design, and DevOps challenges.
- **Instant Downside Result Stream**: Single-column downward scrolling view presenting AI competency breakdown (Quality, Logic, Performance), earned verified digital badge, and embed code widgets.
- **Bounded Earned Badge Gallery**: Real-time track search bar, tier filter chips (*Platinum*, *Gold*, *Silver*, *Bronze*), and compact card gallery aligned side-by-side with overall skill radar charts.
- **High-Resolution QR & Hash Sharing**: Inline high-res PNG QR code downloader and single-click SHA-256 hashcode copy for resume and portfolio attachments.

### 💼 Employer Verification Portal
- **Role-Gated Corporate Access**: Enterprise login system requiring corporate email verification.
- **Dual Verification Modes**:
  1. **SHA-256 Hash / Short ID Lookup**: Direct 64-char hash or 12-char Short ID (e.g. `#D7BC453A491C`) verification.
  2. **Device QR Image Parser**: Drag & drop or upload candidate QR code images (`.PNG`, `.JPG`, `.SVG`) directly from local device.
- **Centered Verification Audit Center**: Pure centered layout rendering authentic credential seals, candidate scores, radar charts, and AI-identified key strengths.
- **Employer Account Management**: Dedicated employer account details page (`/employer`).

### 🌐 Smart Navigation & Portal Gateway
- **Portal Selection Gateway (`/login`)**: Side-by-side portal chooser for candidates and recruiters.
- **Real-Time Dynamic Navbar**: Automatically adapts based on session state — showing a single `Login` button for guests, `Candidate Panel` actions (`/tracks`, `/dashboard`), or `Employer Portal` actions (`/verify`, `/employer`).

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 2. Run Locally (2 Commands)

```bash
# Terminal 1 — Start the Express API backend
cd server
npm start

# Terminal 2 — Start the Next.js frontend
cd client
npm run dev
```

Open **`http://localhost:3000`** in your browser 🎉

---

## 🏗️ Project Architecture

```
SkillBridge/
├── server/                   # Express.js API Backend (Port 5000)
│   ├── app.js                # Server entry point & CORS configuration
│   ├── .env                  # Environment config (USE_MOCK_DB=true by default)
│   ├── controllers/          # Business logic
│   │   ├── evaluationController.js
│   │   └── verificationController.js
│   ├── models/               # Mongoose schemas (MongoDB)
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   └── Badge.js
│   ├── routes/               # API endpoints
│   │   ├── users.js          # POST /api/users, GET /api/users/:id
│   │   ├── assessments.js    # POST /api/assessments/evaluate, GET /api/assessments/tracks
│   │   └── verify.js         # GET /api/verify/:hash
│   └── services/
│       ├── aiEvaluator.js    # OpenAI GPT-4o-mini + heuristic fallback engine
│       ├── hashService.js    # SHA-256 badge hashing engine
│       └── mockDb.js         # Pre-seeded in-memory DB (no MongoDB required for local dev)
│
└── client/                   # Next.js 14 App Router Frontend (Port 3000)
    ├── app/
    │   ├── page.tsx           # Clean landing hero
    │   ├── login/             # Portal selection page (Candidate vs Employer)
    │   ├── tracks/            # Skill challenge track catalog
    │   ├── dashboard/         # Candidate profile, badge gallery & skill radar
    │   ├── assess/[track]/    # Interactive code assessment workspace
    │   ├── verify/[[...hash]]/ # Centered employer verification center & QR parser
    │   └── employer/          # Dedicated employer account details page
    ├── components/
    │   ├── Navbar.tsx         # Dynamic real-time session navbar
    │   ├── BadgeCard.tsx      # Tiered badge card with PNG QR downloader & SHA-256 hash copy
    │   ├── VerificationView.tsx # Aligned audit report with AI key strengths & radar chart
    │   ├── CodeEditor.tsx     # Monaco-style line-numbered code editor
    │   ├── SkillRadarChart.tsx# Recharts radar visualization
    │   ├── AIEvaluationPanel.tsx # Multidimensional AI score panel
    │   └── EmbedWidget.tsx    # GitHub & portfolio badge embed code generator
    └── lib/api.ts             # Typed API client
```

---

## 🏆 Badge Tiers & Scoring

| Tier | Score Range | Badge Color | Description |
| :--- | :--- | :--- | :--- |
| 💎 **Platinum** | 85 – 100 | Indigo / Purple | Production-grade code with zero critical flaws and optimal performance. |
| 🥇 **Gold** | 70 – 84 | Yellow / Amber | Solid architecture, robust logic, and clean modular structure. |
| 🥈 **Silver** | 55 – 69 | Silver / Gray | Functional code meeting core requirements with minor optimization areas. |
| 🥉 **Bronze** | < 55 | Bronze / Brown | Basic implementation demonstrating initial track competency. |

---

## 🔐 Cryptographic SHA-256 Verification

Each issued badge is assigned a 64-character SHA-256 hash signature computed as:
$$\text{BadgeHash} = \text{SHA256}(\text{userId} + \text{":"} + \text{assessmentId} + \text{":"} + \text{timestamp} + \text{":skillbridge-v1"})$$

Employers can audit badges using the full 64-character hashcode or the 12-character Short ID (e.g. `#D7BC453A491C`).

---

## 📡 API Endpoints Reference

```http
GET  /api/health                        Health check & DB status
POST /api/users                         Create or retrieve user profile
GET  /api/users/:id                     Get candidate profile with badges
GET  /api/assessments/tracks            List all available skill tracks
GET  /api/assessments/track/:id/task    Get challenge specifications
POST /api/assessments/evaluate          Submit code for AI evaluation & badge generation
GET  /api/verify/:hash                  Verify SHA-256 hash or Short ID
```

---

## 🔧 Environment Variables

### Server (`server/.env`)
```env
PORT=5000
USE_MOCK_DB=true
MONGO_URI=mongodb://localhost:27017/skillbridge
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_URL=http://localhost:3000
```

### Client (`client/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 🚀 Production Deployment Guide

### Deploying Backend to Render / Railway
1. Push repository to GitHub.
2. Create a **New Web Service** on Render linked to your repository.
3. Set **Root Directory**: `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add Environment Variables: `CLIENT_URL=https://your-app.vercel.app`, `USE_MOCK_DB=true` (or your `MONGO_URI`).

### Deploying Frontend to Vercel
1. Import repository on [Vercel](https://vercel.com).
2. Set **Root Directory**: `client`
3. Framework: **Next.js** (Auto-detected).
4. Add Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
5. Deploy!

---

## 🛠️ Built With

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS, Lucide React, Recharts, QR Code SVG
- **Backend**: Node.js, Express.js, SHA-256 Crypto Engine, OpenAI API / Heuristic Evaluator
- **Storage**: MongoDB (Mongoose) + Pre-seeded In-Memory Mock Database

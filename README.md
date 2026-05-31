# 💼 Corporate Ledger — Employee Expense Tracker

A Employee Travel and Petty Cash Expense Tracking System built with React, Node.js, Express, and MongoDB. Features role-based access, approval workflows, a 4-step travel lifecycle, automatic compliance audit engine, and receipt uploads.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Database | MongoDB + Mongoose |
| Icons | Lucide React |
| Animations | Motion (Framer Motion v12) |

---

## ✨ Features

- 🔐 **Role-Based Access** — Employee and Admin roles with different views and permissions
- 📋 **Expense Submission** — Submit travel and petty cash claims with receipt upload
- ✅ **Approval Workflow** — Pending → Approved → Reimbursed lifecycle
- ✈️ **4-Step Travel Lifecycle** — Estimate → Approval → Booking → Actual Bills
- 🔍 **Compliance Audit Engine** — Auto-checks every expense for policy violations (risk: LOW / MEDIUM / HIGH)
- 📊 **Analytics Dashboard** — Summary cards, spend by category, travel cost comparison
- 🔎 **Search & Filters** — Filter by status, type, travel/petty cash, full-text search
- 📥 **CSV Export** — Export filtered expense data to CSV
- 💾 **MongoDB Fallback** — Works with in-memory storage if DB is unavailable

---

## 🧑‍💻 Demo Users

Use any of the emails below with password **`demo123`**

### 👑 Admin
| Name | Email | Department |
|---|---|---|
| Adithi Ankam | `adithi.ankam@company.com` | Sales & BD |

### 👤 Employees
| Name | Email | Department |
|---|---|---|
| Vemula Ravi | `vemula@company.com` | Product Engineering |
| Anjali Mehta | `anjali.mehta@company.com` | Customer Success |
| Shivam Kapoor | `shivam.kapoor@company.com` | HR & Finance Admin |
| Adithi Sharma | `adithi@company.com` | HR & Finance Admin |

---

## 🛠️ Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root:
   ```env
   MONGODB_URI=your_mongodb_connection_string_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** If `MONGODB_URI` is not set, the app automatically falls back to in-memory storage. All features still work.

---

## 📁 Project Structure

```
├── server.js              # Express backend — all API routes + MongoDB connection
├── src/
│   ├── main.jsx           # React entry point
│   ├── App.jsx            # Root component — state management
│   ├── components/
│   │   ├── LoginPage.jsx          # Login with role tab switcher
│   │   ├── Dashboard.jsx          # Analytics overview
│   │   ├── ExpenseTable.jsx       # Expense list with filters
│   │   ├── ExpenseForm.jsx        # New expense submission form
│   │   ├── ExpenseDetailModal.jsx # Expense detail + admin actions
│   │   ├── ProfilePage.jsx        # User profile + permissions
│   │   └── RoleSelector.jsx       # Dev user switcher
│   └── data/
│       └── sampleData.js          # Sample employees, expenses, receipt templates
├── .env.local             # Environment variables (not committed)
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies and scripts
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | Fetch all expenses |
| POST | `/api/expenses` | Create a new expense |
| PUT | `/api/expenses/:id` | Update expense (approve/reject/reimburse) |
| DELETE | `/api/expenses/:id` | Delete an expense |
| POST | `/api/ai/audit` | Run compliance audit on an expense |
| GET | `/api/db-status` | Check MongoDB connection status |
| POST | `/api/reset-db` | Reset all data to original seed data |

---

## 📜 Available Scripts

```bash
npm run dev      # Start development server (Express + Vite on port 3000)
```

---

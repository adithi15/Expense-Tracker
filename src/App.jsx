import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard.jsx";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseTable from "./components/ExpenseTable.jsx";
import ExpenseDetailModal from "./components/ExpenseDetailModal.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import {
  BarChart4,
  FileSpreadsheet,
  Coins,
  Plus,
  Info,
  LogOut,
  UserCircle,
} from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState(null);

  // active: "Dashboard" or "ClaimsLog"
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "Dashboard";
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      if (Array.isArray(data)) setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDbStatus = async () => {
    try {
      const res = await fetch("/api/db-status");
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      console.error("Failed to fetch DB status:", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchExpenses();
      fetchDbStatus();
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  // Login starts
  const handleLogin = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("activeTab");

    setCurrentUser(null);
    setExpenses([]);
    setSelectedExpense(null);
    setIsFormOpen(false);
    setActiveTab("Dashboard");
  };

  const handleAddExpense = async (newExpensePayload) => {
    const nextNum = expenses.reduce((max, exp) => {
      const match = exp.id.match(/^exp-(\d+)$/);
      if (match) {
        const val = parseInt(match[1], 10);
        return val > max ? val : max;
      }
      return max;
    }, 100);

    const formedExpense = {
      ...newExpensePayload,
      id: `exp-${nextNum + 1}`,
      status: "Pending",
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formedExpense),
      });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error("Error creating expense:", err);
    }
    setIsFormOpen(false);
  };

  const handleUpdateStatus = async (id, status, adminNotes) => {
    const exp = expenses.find((e) => e.id === id);

    let updateFields = {
      status,
      adminNotes,
      updatedAt: new Date().toISOString(),
    };

    // If travel trip, also advance the approval step
    if (exp?.isTravelTrip && exp.travelDetails) {
      const step = exp.travelDetails.approvalStep;
      const nextStep =
        status === "Approved" && step === "1_Estimated_Submitted"
          ? "2_Estimated_Approved"
          : step;
      updateFields.travelDetails = {
        ...exp.travelDetails,
        approvalStep: nextStep,
      };
    }

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateFields),
      });
      if (res.ok) {
        const updated = await res.json();
        setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
        if (selectedExpense?.id === id) setSelectedExpense(updated);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Employee:(book → submit actual bills)
  const handleAdvanceTravelStep = async (
    id,
    nextStep,
    actualAmount,
    receiptName,
    receiptUrl,
  ) => {
    const exp = expenses.find((e) => e.id === id);
    if (!exp?.isTravelTrip || !exp.travelDetails) return;

    const updatedDetails = {
      ...exp.travelDetails,
      approvalStep: nextStep,
      ...(actualAmount !== undefined && { actualAmount }),
    };

    const updateFields = {
      travelDetails: updatedDetails,
      updatedAt: new Date().toISOString(),
      ...(actualAmount !== undefined && { amount: actualAmount }),
      ...(receiptName !== undefined && { receiptName }),
      ...(receiptUrl !== undefined && { receiptUrl }),
      ...(nextStep === "4_Actual_Submitted" && { status: "Pending" }),
    };

    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateFields),
      });
      if (res.ok) {
        const updated = await res.json();
        setExpenses((prev) => prev.map((e) => (e.id === id ? updated : e)));
        if (selectedExpense?.id === id) setSelectedExpense(updated);
      }
    } catch (err) {
      console.error("Error advancing travel step:", err);
    }
  };

  // Delete an expense
  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        if (selectedExpense?.id === id) setSelectedExpense(null);
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  // Reset database to original sample data
  const handleResetData = async () => {
    if (
      window.confirm("Restore original sample dataset? This wipes all changes.")
    ) {
      try {
        const res = await fetch("/api/reset-db", { method: "POST" });
        if (res.ok) fetchExpenses();
      } catch (err) {
        console.error("Error resetting data:", err);
      }
    }
  };

  // Show login page if not logged in
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Filter expenses: employees only see their own; admins see all
  const visibleExpenses =
    currentUser.role === "Admin"
      ? expenses
      : expenses.filter((e) => e.employeeEmail === currentUser.email);

  return (
    <div className="bg-slate-50 min-h-screen font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-100 shadow-xs px-4 sm:px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
              <Coins className="size-4" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Corporate Ledger
            </span>
          </div>

          {/* Tabs + Logout */}
          <div className="flex items-center gap-4">
            <nav className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("Dashboard")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "Dashboard"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <BarChart4 className="size-3.5" />
                  Dashboard
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("ClaimsLog")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "ClaimsLog"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FileSpreadsheet className="size-3.5" />
                  Claims Log
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("Profile")}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === "Profile"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <UserCircle className="size-3.5" />
                  Profile
                </span>
              </button>
            </nav>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="p-2 rounded-xl border border-slate-100 text-slate-500 hover:text-rose-500 transition hover:bg-slate-50"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Role info banner */}
      <div className="bg-slate-100/50 py-2 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row gap-2 sm:items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="size-3.5 text-indigo-500 flex-shrink-0" />
            <span>
              Signed in as <strong>{currentUser.name}</strong> (
              {currentUser.role}).
              {currentUser.role === "Admin" ? "" : " "}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {dbStatus && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                  dbStatus.connected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                />
                {dbStatus.connected ? "MongoDB Live" : "Local Fallback"}
              </span>
            )}
            {currentUser.role === "Employee" && (
              <span className="hidden sm:inline font-mono bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md font-bold">
                {currentUser.department}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {activeTab === "Dashboard"
                ? "Expense Tracker Insights"
                : activeTab === "ClaimsLog"
                  ? "Executive Claims Ledger"
                  : "My Profile"}
            </h2>
            <p className="text-xs text-slate-400">
              {activeTab === "Dashboard"
                ? "Real-time analytics, pending vouchers, and categorizations."
                : activeTab === "ClaimsLog"
                  ? "Audit logs, retract claims, modify statuses, or export ledger sheets."
                  : "Your personal account details and permissions."}
            </p>
          </div>

          {activeTab !== "Profile" && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white py-2.5 px-4 rounded-xl transition self-start sm:self-center"
            >
              <Plus className="size-4" />
              File Claim / Quote
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "Profile" ? (
          <ProfilePage currentUser={currentUser} />
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 border border-slate-200 rounded-2xl bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            <p className="text-xs text-slate-500">Syncing with database...</p>
          </div>
        ) : activeTab === "Dashboard" ? (
          <Dashboard
            expenses={visibleExpenses}
            onViewExpense={(exp) => setSelectedExpense(exp)}
          />
        ) : (
          <ExpenseTable
            expenses={visibleExpenses}
            currentUser={currentUser}
            onViewExpense={(exp) => setSelectedExpense(exp)}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </main>

      {/* New Expense Form Modal */}
      {isFormOpen && (
        <ExpenseForm
          currentUser={currentUser}
          onAddExpense={handleAddExpense}
          onClose={() => setIsFormOpen(false)}
        />
      )}

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <ExpenseDetailModal
          expense={selectedExpense}
          currentUser={currentUser}
          onUpdateStatus={handleUpdateStatus}
          onAdvanceTravelStep={handleAdvanceTravelStep}
          onClose={() => setSelectedExpense(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-center text-xs text-slate-400 font-mono">
        <p>Expense Tracker © 2026</p>
      </footer>
    </div>
  );
}
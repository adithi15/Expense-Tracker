import React, { useState } from "react";
import { UserX, UserCheck, Trash2, ShieldCheck, User, Search, AlertTriangle } from "lucide-react";

export default function UserManagement({ employees, onToggleStatus, onRemoveEmployee }) {
  const [search, setSearch] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(null); // holds employee to confirm delete

  const filtered = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter((e) => e.status !== "Inactive").length;
  const inactiveCount = employees.filter((e) => e.status === "Inactive").length;

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-xs">
          <p className="text-2xl font-bold text-slate-900">{employees.length}</p>
          <p className="text-xs text-slate-400 mt-1">Total Employees</p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 text-center shadow-xs">
          <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
          <p className="text-xs text-slate-400 mt-1">Active</p>
        </div>
        <div className="bg-white rounded-2xl border border-rose-200 p-4 text-center shadow-xs">
          <p className="text-2xl font-bold text-rose-500">{inactiveCount}</p>
          <p className="text-xs text-slate-400 mt-1">Inactive</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-xs"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">All Employees</h3>
          <p className="text-xs text-slate-400 mt-0.5">Toggle active status or remove employees who have left.</p>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">No employees found.</div>
          ) : (
            filtered.map((emp) => {
              const isInactive = emp.status === "Inactive";
              const isAdmin = emp.role === "Admin";
              return (
                <div
                  key={emp.email}
                  className={`flex items-center gap-4 px-5 py-4 transition ${isInactive ? "opacity-50 bg-slate-50" : "hover:bg-slate-50"}`}
                >
                  {/* Avatar */}
                  <div className={`size-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${isAdmin ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"}`}>
                    {emp.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${isInactive ? "line-through text-slate-400" : "text-slate-800"}`}>
                        {emp.name}
                      </p>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${isAdmin ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
                        {isAdmin ? <ShieldCheck className="size-2.5" /> : <User className="size-2.5" />}
                        {emp.role}
                      </span>
                      {isInactive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex-shrink-0">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{emp.email}</p>
                    {emp.department && (
                      <p className="text-xs text-slate-400">{emp.department}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle Active/Inactive */}
                    <button
                      type="button"
                      onClick={() => onToggleStatus(emp.email)}
                      title={isInactive ? "Mark as Active" : "Mark as Inactive"}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                        isInactive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                      }`}
                    >
                      {isInactive ? <UserCheck className="size-3.5" /> : <UserX className="size-3.5" />}
                      {isInactive ? "Activate" : "Deactivate"}
                    </button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => setConfirmRemove(emp)}
                      title="Remove employee"
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Confirm Remove Modal */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="size-5 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Remove Employee</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Are you sure you want to remove <strong>{confirmRemove.name}</strong> from the system?
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onRemoveEmployee(confirmRemove.email);
                  setConfirmRemove(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-sm font-semibold text-white transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
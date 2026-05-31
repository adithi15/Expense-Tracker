import React, { useState, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Trash2,
  Eye,
  Download,
  MapPin,
  IndianRupee,
  CheckCircle2,
} from "lucide-react";

export default function ExpenseTable({
  expenses,
  currentUser,
  onViewExpense,
  onDeleteExpense,
}) {
  const isAdmin = currentUser.role === "Admin";

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [tripFilter, setTripFilter] = useState("All"); // 'All', 'TravelOnly', 'PettyCashOnly'
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc, date_asc, amount_desc, amount_asc

  // Filtered and Sorted list
  const filteredAndSortedExpenses = useMemo(() => {
    // 1. Employee isolation constraint
    let list = isAdmin
      ? expenses
      : expenses.filter((exp) => exp.employeeEmail === currentUser.email);

    // 2. Search filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (exp) =>
          exp.employeeName.toLowerCase().includes(q) ||
          exp.description.toLowerCase().includes(q) ||
          exp.expenseType.toLowerCase().includes(q) ||
          (exp.travelDetails?.clientName &&
            exp.travelDetails.clientName.toLowerCase().includes(q)) ||
          (exp.travelDetails?.purpose &&
            exp.travelDetails.purpose.toLowerCase().includes(q)),
      );
    }

    // 3. Status filter
    if (statusFilter !== "All") {
      list = list.filter((exp) => exp.status === statusFilter);
    }

    // 4. Type filter
    if (typeFilter !== "All") {
      list = list.filter((exp) => exp.expenseType === typeFilter);
    }

    // 5. Trip category filter
    if (tripFilter === "TravelOnly") {
      list = list.filter((exp) => exp.isTravelTrip);
    } else if (tripFilter === "PettyCashOnly") {
      list = list.filter((exp) => !exp.isTravelTrip);
    }

    // 6. Sorting
    list = [...list].sort((a, b) => {
      const getAmount = (exp) => {
        if (
          exp.isTravelTrip &&
          exp.travelDetails &&
          exp.travelDetails.actualAmount > 0
        ) {
          return exp.travelDetails.actualAmount;
        }
        return exp.amount || exp.travelDetails?.estimatedAmount || 0;
      };

      if (sortBy === "date_desc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "date_asc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "amount_desc") {
        return getAmount(b) - getAmount(a);
      } else if (sortBy === "amount_asc") {
        return getAmount(a) - getAmount(b);
      }
      return 0;
    });

    return list;
  }, [
    expenses,
    currentUser,
    isAdmin,
    searchQuery,
    statusFilter,
    typeFilter,
    tripFilter,
    sortBy,
  ]);

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Claim ID",
      "Employee Name",
      "Employee Email",
      "Expense Type",
      "Transaction Date",
      "Actual Amount (INR)",
      "Payment Mode",
      "Status",
      "Is Travel Event",
      "Client Name",
      "Itinerary Description",
      "Admin Review Note",
    ];

    const rows = filteredAndSortedExpenses.map((exp) => {
      const actualCost =
        exp.isTravelTrip &&
        exp.travelDetails &&
        exp.travelDetails.actualAmount > 0
          ? exp.travelDetails.actualAmount
          : exp.amount;
      const client = exp.travelDetails?.clientName || "–";
      const detail =
        exp.isTravelTrip && exp.travelDetails
          ? `${exp.travelDetails.purpose} [Route: ${exp.travelDetails.fromLocation} to ${exp.travelDetails.toLocation} (Est: ₹${exp.travelDetails.estimatedAmount})]`
          : exp.description;

      return [
        exp.id,
        `"${exp.employeeName.replace(/"/g, '""')}"`,
        exp.employeeEmail,
        exp.expenseType,
        exp.date,
        actualCost,
        exp.paymentMode,
        exp.status,
        exp.isTravelTrip ? "Yes" : "No",
        `"${client.replace(/"/g, '""')}"`,
        `"${detail.replace(/"/g, '""')}"`,
        `"${(exp.adminNotes || "").replace(/"/g, '""')}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `claims_export_${currentUser.name.toLowerCase().replace(/ /g, "_")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Search, Filter Tools Ribbon */}
      <div className="bg-white dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <Search className="size-4" />
            </span>
            <input
              type="text"
              id="claims-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses description, employees, client visits or purposes..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export Actions Button */}
            <button
              id="export-csv-btn"
              onClick={handleExportCSV}
              disabled={filteredAndSortedExpenses.length === 0}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs py-2 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition disabled:opacity-50"
            >
              <Download className="size-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Multi Select filters */}
        <div className="flex flex-wrap gap-2.5 items-center pt-2 border-t border-slate-50 dark:border-slate-800/60 text-xs">
          <div className="flex items-center gap-1 text-slate-400">
            <SlidersHorizontal className="size-3.5" />
            <span>Filters:</span>
          </div>

          {/* Trip classification toggler */}
          <select
            id="trip-filter-select"
            value={tripFilter}
            onChange={(e) => setTripFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Vouchers / Categories</option>
            <option value="TravelOnly">✈️ Travel Events Only</option>
            <option value="PettyCashOnly">💵 Petty Cash Expenses Only</option>
          </select>

          {/* Status value filter */}
          <select
            id="status-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Reimbursed">Reimbursed</option>
          </select>

          {/* Category type filter */}
          <select
            id="type-filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none text-slate-700 dark:text-slate-300"
          >
            <option value="All">All Claim Types</option>
            <option value="Food">Food / Dining</option>
            <option value="Local Travel (Auto/Cab)">Local Travel (Cab)</option>
            <option value="Train/Flight">Train / Flights</option>
            <option value="Hotel">Hotel Stay</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>

          {/* Custom Sorting index */}
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-[11px] focus:outline-none text-slate-700 dark:text-slate-300 ml-auto"
          >
            <option value="date_desc">📅 Newest Date First</option>
            <option value="date_asc">📅 Oldest Date First</option>
            <option value="amount_desc">💰 Highest Amount</option>
            <option value="amount_asc">💰 Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-1.5 px-6">
            <CheckCircle2 className="size-10 mx-auto stroke-1 text-slate-300" />
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              No expenses detected
            </h4>
            <p className="text-xs">
              Adjust filter settings, clear search parameters, or submit a new
              voucher claim to begin.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3.5 px-4 font-mono w-[100px]">ID</th>
                  {isAdmin && <th className="py-3.5 px-4">Employee</th>}
                  <th className="py-3.5 px-4">Expense Type</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 max-w-[280px]">
                    Description & Client details
                  </th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredAndSortedExpenses.map((exp) => {
                  const hasCompletedActual =
                    exp.isTravelTrip &&
                    exp.travelDetails &&
                    exp.travelDetails.actualAmount > 0;
                  const finalCost = hasCompletedActual
                    ? exp.travelDetails.actualAmount
                    : exp.amount || exp.travelDetails?.estimatedAmount || 0;

                  const isTravelEstimateOnly =
                    exp.isTravelTrip &&
                    exp.travelDetails &&
                    exp.travelDetails.actualAmount === 0;

                  return (
                    <tr
                      key={exp.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition group"
                    >
                      {/* ID Block */}
                      <td className="py-4 px-4 font-mono text-slate-400 font-semibold select-all">
                        {exp.id}
                      </td>

                      {/* Employee Identifier (Admin Only) */}
                      {isAdmin && (
                        <td className="py-4 px-4 font-medium text-slate-950 dark:text-slate-100">
                          <div>
                            <p className="font-semibold">{exp.employeeName}</p>
                            <span className="text-[10px] font-normal text-slate-400">
                              {exp.employeeEmail}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Type badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full select-none text-[10px] border ${
                            exp.expenseType === "Food"
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/60"
                              : exp.expenseType === "Local Travel (Auto/Cab)"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/60"
                                : exp.expenseType === "Train/Flight"
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900/60"
                                  : exp.expenseType === "Hotel"
                                    ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/20 dark:border-violet-900/60"
                                    : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800"
                          }`}
                        >
                          {exp.expenseType}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-400 white-space-nowrap font-mono">
                        {exp.date}
                      </td>

                      {/* Description & Client trip details */}
                      <td className="py-4 px-4 max-w-[280px]">
                        <div className="space-y-1">
                          <p
                            className="text-slate-600 dark:text-slate-300 truncate font-normal"
                            title={exp.description}
                          >
                            {exp.description}
                          </p>
                          {exp.isTravelTrip && exp.travelDetails && (
                            <p className="text-[10px] text-indigo-500 font-semibold flex items-center gap-1.5">
                              <MapPin className="size-3 text-slate-400" />
                              <span>
                                Client: {exp.travelDetails.clientName}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="text-slate-400 capitalize">
                                {exp.travelDetails.fromLocation} to{" "}
                                {exp.travelDetails.toLocation}
                              </span>
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Amount column with estimate indicators */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        <div className="inline-flex items-center">
                          <IndianRupee className="size-3 inline text-slate-400 mr-0.5" />
                          <span>{finalCost.toLocaleString("en-IN")}</span>
                        </div>
                        {isTravelEstimateOnly && (
                          <span className="block text-[9px] text-amber-500 font-medium font-sans">
                            Estimates Only
                          </span>
                        )}
                      </td>

                      {/* Status badge */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] select-none font-bold px-2 py-0.5 rounded-md border ${
                            exp.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20"
                              : exp.status === "Approved"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20"
                                : exp.status === "Rejected"
                                  ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20"
                                  : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              exp.status === "Pending"
                                ? "bg-amber-500 animate-pulse"
                                : exp.status === "Approved"
                                  ? "bg-emerald-500"
                                  : exp.status === "Rejected"
                                    ? "bg-rose-500"
                                    : "bg-blue-500"
                            }`}
                          />
                          <span>{exp.status}</span>
                        </span>
                      </td>

                      {/* Action columns */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Inspect Item Details */}
                          <button
                            type="button"
                            id={`view-expense-${exp.id}`}
                            onClick={() => onViewExpense(exp)}
                            title="Launch Interactive Inspect modal"
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 p-1.5 rounded-lg transition"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          {/* Delete Item */}
                          {(isAdmin ||
                            exp.status === "Pending" ||
                            exp.status === "Rejected") && (
                            <button
                              type="button"
                              id={`delete-expense-${exp.id}`}
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Retract & delete expense voucher ${exp.id}? This operation cannot be undone.`,
                                  )
                                ) {
                                  onDeleteExpense(exp.id);
                                }
                              }}
                              title="Delete/Retract claim entry"
                              className="bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 p-1.5 rounded-lg transition text-slate-400 dark:text-slate-500"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

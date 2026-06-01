// import React, { useMemo } from "react";
// import {
//   Clock,
//   CheckCircle,
//   Layers,
//   MapPin,
//   ArrowRight,
//   TrendingUp,
//   PieChart as PieIcon,
//   Activity,
//   IndianRupee,
// } from "lucide-react";

// export default function Dashboard({ expenses, onViewExpense }) {
//   //  metric calculations
//   const stats = useMemo(() => {
//     let totalSpent = 0;
//     let pendingAmount = 0;
//     let approvedAmount = 0;
//     let reimbursedAmount = 0;
//     let totalCount = expenses.length;
//     let travelCount = 0;
//     let pettyCashCount = 0;

//     expenses.forEach((exp) => {
//       if (exp.isTravelTrip) {
//         travelCount++;
//       } else {
//         pettyCashCount++;
//       }

//       const val =
//         exp.amount ||
//         exp.travelDetails?.actualAmount ||
//         exp.travelDetails?.estimatedAmount ||
//         0;

//       if (exp.status === "Pending") {
//         pendingAmount += val;
//       } else if (exp.status === "Approved") {
//         approvedAmount += val;
//         totalSpent += val;
//       } else if (exp.status === "Reimbursed") {
//         reimbursedAmount += val;
//         totalSpent += val;
//       }
//     });

//     return {
//       totalSpent,
//       pendingAmount,
//       approvedAmount,
//       reimbursedAmount,
//       totalCount,
//       travelCount,
//       pettyCashCount,
//     };
//   }, [expenses]);

//   const categoryStats = useMemo(() => {
//     const categories = {
//       Food: {
//         count: 0,
//         sum: 0,
//         color:
//           "text-amber-600 border-amber-600 bg-amber-50 dark:bg-amber-950/20",
//         bg: "bg-amber-500",
//       },
//       "Local Travel (Auto/Cab)": {
//         count: 0,
//         sum: 0,
//         color:
//           "text-emerald-600 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20",
//         bg: "bg-emerald-500",
//       },
//       "Train/Flight": {
//         count: 0,
//         sum: 0,
//         color: "text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-950/20",
//         bg: "bg-blue-500",
//       },
//       Hotel: {
//         count: 0,
//         sum: 0,
//         color:
//           "text-violet-600 border-violet-600 bg-violet-50 dark:bg-violet-950/20",
//         bg: "bg-violet-500",
//       },
//       Miscellaneous: {
//         count: 0,
//         sum: 0,
//         color:
//           "text-slate-600 border-slate-600 bg-slate-50 dark:bg-slate-900/40",
//         bg: "bg-slate-500",
//       },
//     };

//     expenses.forEach((exp) => {
//       const cat = exp.expenseType;
//       const val =
//         exp.amount ||
//         exp.travelDetails?.actualAmount ||
//         exp.travelDetails?.estimatedAmount ||
//         0;
//       if (categories[cat]) {
//         categories[cat].count++;
//         categories[cat].sum += val;
//       }
//     });

//     return Object.entries(categories)
//       .map(([k, v]) => ({
//         name: k,
//         ...v,
//       }))
//       .sort((a, b) => b.sum - a.sum);
//   }, [expenses]);

//   // Travel Comparison stats
//   const travelTrips = useMemo(() => {
//     return expenses.filter((exp) => exp.isTravelTrip && exp.travelDetails);
//   }, [expenses]);

//   return (
//     <div className="space-y-6">
//       {/* Cards  */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Card 1: Total Sum */}
//         <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
//           <div className="space-y-1.5">
//             <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
//               Total Settled Spend
//             </span>
//             <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
//               <IndianRupee className="size-5 inline mr-1 text-slate-400" />
//               {stats.totalSpent.toLocaleString("en-IN")}
//             </h3>
//             <p className="text-[10px] text-slate-400">
//               Approved & Reimbursed entries
//             </p>
//           </div>
//           <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl text-emerald-600">
//             <CheckCircle className="size-6" />
//           </div>
//         </div>

//         {/* Card 2: Pending Amount */}
//         <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
//           <div className="space-y-1.5">
//             <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
//               Awaiting Approval
//             </span>
//             <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
//               <IndianRupee className="size-5 inline mr-1 text-slate-400" />
//               {stats.pendingAmount.toLocaleString("en-IN")}
//             </h3>
//             <p className="text-[10px] text-amber-500 font-medium">
//               Pending Manager Action
//             </p>
//           </div>
//           <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl text-amber-500 animate-pulse">
//             <Clock className="size-6" />
//           </div>
//         </div>

//         {/* Card 3: Reimbursed Amount */}
//         <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
//           <div className="space-y-1.5">
//             <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
//               Reimbursed To Date
//             </span>
//             <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
//               <IndianRupee className="size-5 inline mr-1 text-slate-400" />
//               {stats.reimbursedAmount.toLocaleString("en-IN")}
//             </h3>
//             <p className="text-[10px] text-slate-400">
//               Transferred back to employees
//             </p>
//           </div>
//           <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-xl text-blue-600">
//             <TrendingUp className="size-6" />
//           </div>
//         </div>

//         {/* Card 4: Total Counts */}
//         <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
//           <div className="space-y-1.5">
//             <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
//               Receipt Entries
//             </span>
//             <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
//               {stats.totalCount}{" "}
//               <span className="text-xs font-normal text-slate-400">Claims</span>
//             </h3>
//             <p className="text-[10px] text-slate-400">
//               {stats.travelCount} Travel • {stats.pettyCashCount} Petty Cash
//             </p>
//           </div>
//           <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-300">
//             <Layers className="size-6" />
//           </div>
//         </div>
//       </div>

//       {/* Visual Analytics Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Category breakdown (Visual 1) */}
//         <div className="bg-white dark:bg-slate-900/70 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-1 space-y-4">
//           <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-3">
//             <div className="flex items-center gap-2">
//               <PieIcon className="size-4 text-indigo-500" />
//               <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
//                 Spend by Category
//               </h4>
//             </div>
//             <span className="text-xs text-slate-400">Total volume view</span>
//           </div>

//           <div className="space-y-4 pt-1">
//             {categoryStats.map((item) => {
//               const totalAllCategoryDollars =
//                 categoryStats.reduce((acc, c) => acc + c.sum, 0) || 1;
//               const pct = (item.sum / totalAllCategoryDollars) * 100;

//               return (
//                 <div key={item.name} className="space-y-1.5">
//                   <div className="flex justify-between items-center text-xs">
//                     <span className="font-medium text-slate-700 dark:text-slate-300">
//                       {item.name}
//                     </span>
//                     <span className="text-slate-500 font-mono">
//                       ₹{item.sum.toLocaleString("en-IN")} ({pct.toFixed(0)}%)
//                     </span>
//                   </div>
//                   <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//                     <div
//                       className={`h-full ${item.bg} rounded-full transition-all duration-500`}
//                       style={{ width: `${pct}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Travel Expenses Comparison (Estimated vs. Actual) (Visual 2) */}
//         <div className="bg-white dark:bg-slate-900/70 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-2 space-y-4">
//           <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-3">
//             <div className="flex items-center gap-2">
//               <MapPin className="size-4 text-emerald-500" />
//               <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
//                 Travel Costs Balance Comparison
//               </h4>
//             </div>
//             <span className="text-xs text-indigo-500 font-medium">
//               Estimated vs. Actual Outlays
//             </span>
//           </div>

//           {travelTrips.length === 0 ? (
//             <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-1 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
//               <Activity className="size-8 stroke-1 text-slate-300" />
//               <p className="text-xs">No active travel itineraries logged</p>
//             </div>
//           ) : (
//             <div className="overflow-y-auto max-h-[280px] pr-1 space-y-4">
//               {travelTrips.map((exp) => {
//                 const est = exp.travelDetails?.estimatedAmount || 0;
//                 const act = exp.travelDetails?.actualAmount || 0;
//                 const diff = est - act;
//                 const isUnder = diff >= 0;
//                 const step = exp.travelDetails?.approvalStep;

//                 // Percent of estimate reached or exceeded
//                 const percentage = est > 0 ? (act / est) * 100 : 0;

//                 return (
//                   <div
//                     key={exp.id}
//                     className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:bg-slate-50/10 transition"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <span className="text-xs font-semibold text-slate-900 dark:text-white">
//                             {exp.travelDetails?.clientName}
//                           </span>
//                           <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
//                             {exp.id}
//                           </span>
//                         </div>
//                         <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
//                           <span>{exp.travelDetails?.fromLocation}</span>
//                           <ArrowRight className="size-2.5 inline" />
//                           <span>{exp.travelDetails?.toLocation}</span>
//                           <span className="text-slate-300">•</span>
//                           <span>{exp.employeeName}</span>
//                         </p>
//                       </div>

//                       {/* State Tracker Badge for review */}
//                       <span
//                         className={`text-[10px] self-start sm:self-center font-medium px-2 py-0.5 rounded-full border ${
//                           step === "1_Estimated_Submitted"
//                             ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20"
//                             : step === "2_Estimated_Approved"
//                               ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20"
//                               : step === "3_Bookings_Completed"
//                                 ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20"
//                                 : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20"
//                         }`}
//                       >
//                         {step === "1_Estimated_Submitted" &&
//                           "1. Estimate Pending"}
//                         {step === "2_Estimated_Approved" &&
//                           "2. Estimate Approved"}
//                         {step === "3_Bookings_Completed" && "3. Booked/Ready"}
//                         {step === "4_Actual_Submitted" && "4. Travel Completed"}
//                       </span>
//                     </div>

//                     {/* Progress Bar comparing est vs act */}
//                     <div className="space-y-1.5">
//                       <div className="flex justify-between items-center text-xs text-slate-500">
//                         <span className="flex items-center gap-1">
//                           Est:{" "}
//                           <strong className="text-slate-800 dark:text-slate-200 font-medium font-mono">
//                             ₹{est.toLocaleString("en-IN")}
//                           </strong>
//                         </span>
//                         <span>
//                           Act:{" "}
//                           <strong
//                             className={`${act > est ? "text-rose-500" : "text-emerald-500"} font-medium font-mono`}
//                           >
//                             ₹{act > 0 ? act.toLocaleString("en-IN") : "–"}
//                           </strong>
//                         </span>
//                       </div>

//                       {act > 0 && (
//                         <div className="space-y-1">
//                           <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
//                             <div
//                               className={`h-full rounded-full transition-all duration-500 ${
//                                 percentage > 100
//                                   ? "bg-rose-500"
//                                   : "bg-emerald-500"
//                               }`}
//                               style={{ width: `${Math.min(percentage, 100)}%` }}
//                             />
//                           </div>

//                           <div className="flex justify-between items-center text-[10px]">
//                             <span className="text-slate-400">
//                               Budget matching index
//                             </span>
//                             {isUnder ? (
//                               <span className="text-emerald-500 font-medium font-mono bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">
//                                 Saved: ₹{diff.toLocaleString()}
//                               </span>
//                             ) : (
//                               <span className="text-rose-500 font-medium font-mono bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded">
//                                 Over-budget: ₹{Math.abs(diff).toLocaleString()}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       )}

//                       {act === 0 && (
//                         <p className="text-[10px] text-amber-500 bg-amber-500/5 p-1 px-2 rounded-md italic">
//                           Trip in planning/booking step. Awaiting actual trip
//                           completion expense bills.
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex justify-end pt-1">
//                       <button
//                         onClick={() => onViewExpense(exp)}
//                         className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 transition"
//                       >
//                         Launch Interactive Lifecycle →
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useMemo } from "react";
import {
  Clock,
  CheckCircle,
  Layers,
  MapPin,
  ArrowRight,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  IndianRupee,
} from "lucide-react";

export default function Dashboard({ expenses, currentUser, onViewExpense }) {
  const isAdmin = currentUser?.role === "Admin";

  // Admins see all expenses; employees only see their own
  const scopedExpenses = useMemo(() => {
    if (isAdmin) return expenses;
    return expenses.filter((e) => e.employeeEmail === currentUser?.email);
  }, [expenses, isAdmin, currentUser?.email]);

  //  metric calculations
  const stats = useMemo(() => {
    let totalSpent = 0;
    let pendingAmount = 0;
    let approvedAmount = 0;
    let reimbursedAmount = 0;
    let totalCount = scopedExpenses.length;
    let travelCount = 0;
    let pettyCashCount = 0;

    scopedExpenses.forEach((exp) => {
      if (exp.isTravelTrip) {
        travelCount++;
      } else {
        pettyCashCount++;
      }

      const val =
        exp.amount ||
        exp.travelDetails?.actualAmount ||
        exp.travelDetails?.estimatedAmount ||
        0;

      if (exp.status === "Pending") {
        pendingAmount += val;
      } else if (exp.status === "Approved") {
        approvedAmount += val;
        totalSpent += val;
      } else if (exp.status === "Reimbursed") {
        reimbursedAmount += val;
        totalSpent += val;
      }
    });

    return {
      totalSpent,
      pendingAmount,
      approvedAmount,
      reimbursedAmount,
      totalCount,
      travelCount,
      pettyCashCount,
    };
  }, [scopedExpenses]);

  const categoryStats = useMemo(() => {
    const categories = {
      Food: {
        count: 0,
        sum: 0,
        color:
          "text-amber-600 border-amber-600 bg-amber-50 dark:bg-amber-950/20",
        bg: "bg-amber-500",
      },
      "Local Travel (Auto/Cab)": {
        count: 0,
        sum: 0,
        color:
          "text-emerald-600 border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20",
        bg: "bg-emerald-500",
      },
      "Train/Flight": {
        count: 0,
        sum: 0,
        color: "text-blue-600 border-blue-600 bg-blue-50 dark:bg-blue-950/20",
        bg: "bg-blue-500",
      },
      Hotel: {
        count: 0,
        sum: 0,
        color:
          "text-violet-600 border-violet-600 bg-violet-50 dark:bg-violet-950/20",
        bg: "bg-violet-500",
      },
      Miscellaneous: {
        count: 0,
        sum: 0,
        color:
          "text-slate-600 border-slate-600 bg-slate-50 dark:bg-slate-900/40",
        bg: "bg-slate-500",
      },
    };

    scopedExpenses.forEach((exp) => {
      const cat = exp.expenseType;
      const val =
        exp.amount ||
        exp.travelDetails?.actualAmount ||
        exp.travelDetails?.estimatedAmount ||
        0;
      if (categories[cat]) {
        categories[cat].count++;
        categories[cat].sum += val;
      }
    });

    return Object.entries(categories)
      .map(([k, v]) => ({
        name: k,
        ...v,
      }))
      .sort((a, b) => b.sum - a.sum);
  }, [scopedExpenses]);

  // Travel Comparison stats
  const travelTrips = useMemo(() => {
    return scopedExpenses.filter((exp) => exp.isTravelTrip && exp.travelDetails);
  }, [scopedExpenses]);

  return (
    <div className="space-y-6">
      {/* Cards  */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sum */}
        <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Total Settled Spend
            </span>
            <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
              <IndianRupee className="size-5 inline mr-1 text-slate-400" />
              {stats.totalSpent.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400">
              Approved & Reimbursed entries
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl text-emerald-600">
            <CheckCircle className="size-6" />
          </div>
        </div>

        {/* Card 2: Pending Amount */}
        <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Awaiting Approval
            </span>
            <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
              <IndianRupee className="size-5 inline mr-1 text-slate-400" />
              {stats.pendingAmount.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-amber-500 font-medium">
              Pending Manager Action
            </p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-xl text-amber-500 animate-pulse">
            <Clock className="size-6" />
          </div>
        </div>

        {/* Card 3: Reimbursed Amount */}
        <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Reimbursed To Date
            </span>
            <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white flex items-center">
              <IndianRupee className="size-5 inline mr-1 text-slate-400" />
              {stats.reimbursedAmount.toLocaleString("en-IN")}
            </h3>
            <p className="text-[10px] text-slate-400">
              Transferred back to employees
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-xl text-blue-600">
            <TrendingUp className="size-6" />
          </div>
        </div>

        {/* Card 4: Total Counts */}
        <div className="bg-white dark:bg-slate-900/70 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Receipt Entries
            </span>
            <h3 className="text-2xl font-bold font-sans text-slate-900 dark:text-white">
              {stats.totalCount}{" "}
              <span className="text-xs font-normal text-slate-400">Claims</span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {stats.travelCount} Travel • {stats.pettyCashCount} Petty Cash
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-slate-600 dark:text-slate-300">
            <Layers className="size-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category breakdown (Visual 1) */}
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <PieIcon className="size-4 text-indigo-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Spend by Category
              </h4>
            </div>
            <span className="text-xs text-slate-400">Total volume view</span>
          </div>

          <div className="space-y-4 pt-1">
            {categoryStats.map((item) => {
              const totalAllCategoryDollars =
                categoryStats.reduce((acc, c) => acc + c.sum, 0) || 1;
              const pct = (item.sum / totalAllCategoryDollars) * 100;

              return (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                    <span className="text-slate-500 font-mono">
                      ₹{item.sum.toLocaleString("en-IN")} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Travel Expenses Comparison (Estimated vs. Actual) (Visual 2) */}
        <div className="bg-white dark:bg-slate-900/70 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-emerald-500" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                Travel Costs Balance Comparison
              </h4>
            </div>
            <span className="text-xs text-indigo-500 font-medium">
              Estimated vs. Actual Outlays
            </span>
          </div>

          {travelTrips.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-1 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
              <Activity className="size-8 stroke-1 text-slate-300" />
              <p className="text-xs">No active travel itineraries logged</p>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[280px] pr-1 space-y-4">
              {travelTrips.map((exp) => {
                const est = exp.travelDetails?.estimatedAmount || 0;
                const act = exp.travelDetails?.actualAmount || 0;
                const diff = est - act;
                const isUnder = diff >= 0;
                const step = exp.travelDetails?.approvalStep;

                // Percent of estimate reached or exceeded
                const percentage = est > 0 ? (act / est) * 100 : 0;

                return (
                  <div
                    key={exp.id}
                    className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 hover:bg-slate-50/10 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {exp.travelDetails?.clientName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                            {exp.id}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>{exp.travelDetails?.fromLocation}</span>
                          <ArrowRight className="size-2.5 inline" />
                          <span>{exp.travelDetails?.toLocation}</span>
                          <span className="text-slate-300">•</span>
                          <span>{exp.employeeName}</span>
                        </p>
                      </div>

                      {/* State Tracker Badge for review */}
                      <span
                        className={`text-[10px] self-start sm:self-center font-medium px-2 py-0.5 rounded-full border ${
                          step === "1_Estimated_Submitted"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20"
                            : step === "2_Estimated_Approved"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20"
                              : step === "3_Bookings_Completed"
                                ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20"
                        }`}
                      >
                        {step === "1_Estimated_Submitted" &&
                          "1. Estimate Pending"}
                        {step === "2_Estimated_Approved" &&
                          "2. Estimate Approved"}
                        {step === "3_Bookings_Completed" && "3. Booked/Ready"}
                        {step === "4_Actual_Submitted" && "4. Travel Completed"}
                      </span>
                    </div>

                    {/* Progress Bar comparing est vs act */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          Est:{" "}
                          <strong className="text-slate-800 dark:text-slate-200 font-medium font-mono">
                            ₹{est.toLocaleString("en-IN")}
                          </strong>
                        </span>
                        <span>
                          Act:{" "}
                          <strong
                            className={`${act > est ? "text-rose-500" : "text-emerald-500"} font-medium font-mono`}
                          >
                            ₹{act > 0 ? act.toLocaleString("en-IN") : "–"}
                          </strong>
                        </span>
                      </div>

                      {act > 0 && (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                percentage > 100
                                  ? "bg-rose-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-400">
                              Budget matching index
                            </span>
                            {isUnder ? (
                              <span className="text-emerald-500 font-medium font-mono bg-emerald-50 dark:bg-emerald-950/20 px-1.5 py-0.5 rounded">
                                Saved: ₹{diff.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-rose-500 font-medium font-mono bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded">
                                Over-budget: ₹{Math.abs(diff).toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {act === 0 && (
                        <p className="text-[10px] text-amber-500 bg-amber-500/5 p-1 px-2 rounded-md italic">
                          Trip in planning/booking step. Awaiting actual trip
                          completion expense bills.
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => onViewExpense(exp)}
                        className="text-[10px] font-semibold text-indigo-500 hover:text-indigo-600 transition"
                      >
                        Launch Interactive Lifecycle →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import React, { useState } from 'react';
import { MOCK_RECEIPT_TEMPLATES } from '../data/sampleData.js';
import { 
  X, 
  MapPin, 
  Briefcase, 
  FileText, 
  Check, 
  ArrowRight, 
  AlertCircle,
  Eye,
  MessageSquare,
  IndianRupee,
  ShieldCheck
} from 'lucide-react';

export default function ExpenseDetailModal({ 
  expense, 
  currentUser, 
  onUpdateStatus, 
  onAdvanceTravelStep, 
  onClose 
}) {
  const isAdmin = currentUser.role === 'Admin';
  
  // Admin Action Form State
  const [adminNotes, setAdminNotes] = useState(expense.adminNotes || '');
  const [successMsg, setSuccessMsg] = useState('');

  // Travel Completion Form State (For Step 3 -> 4)
  const [actualAmountInput, setActualAmountInput] = useState(
    expense.travelDetails?.estimatedAmount || 0
  );
  const [selectedReceiptTemplate, setSelectedReceiptTemplate] = useState('placeholder_invoice');
  const [isFinishingTravelForm, setIsFinishingTravelForm] = useState(false);

  // Read mock template details
  const receiptTemplate = expense.receiptUrl ? MOCK_RECEIPT_TEMPLATES[expense.receiptUrl] : null;

  const handleAdminAction = (newStatus) => {
    onUpdateStatus(expense.id, newStatus, adminNotes);
    setSuccessMsg(`Status updated to ${newStatus}!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  const handleCompleteTravelBookings = () => {
    onAdvanceTravelStep(expense.id, '3_Bookings_Completed');
    setSuccessMsg('Booking status prioritized. Ready to submit actual bills.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  const handleSubmitActualTravelExpenses = () => {
    const receiptNameMap = {
      placeholder_invoice: 'air_india_invoice_final.pdf',
      placeholder_hotel: 'hotel_guest_folio_final.png',
      placeholder_uber: 'uber_logistics_ride.pdf'
    };

    onAdvanceTravelStep(
      expense.id, 
      '4_Actual_Submitted', 
      actualAmountInput, 
      receiptNameMap[selectedReceiptTemplate] || 'travel_receipt.pdf', 
      selectedReceiptTemplate
    );

    setSuccessMsg('Actual travel expenses submitted for HR review!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-950 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Detail & Action Sheet */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                expense.id.startsWith('exp-') ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500' : 'bg-emerald-50 text-emerald-500'
              }`}>
                {expense.isTravelTrip ? '✈️ Corporate Travel Claim' : '💵 Petty Cash / Day Reimbursement'}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                Claim {expense.id}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Submitted on {expense.date}</p>
            </div>
            <button 
              id="close-detail-modal-btn"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1.5 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Success feedback slider */}
          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-emerald-700 dark:text-emerald-400 text-xs px-3.5 py-2.5 rounded-xl animate-fade-in flex items-center gap-2">
              <Check className="size-4" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {/* Core Claim Details Grid */}
          <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 gap-4 grid grid-cols-2">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Employee</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{expense.employeeName}</p>
              <p className="text-[10px] text-slate-400">{expense.employeeEmail}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Expense Category</span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{expense.expenseType}</p>
              <p className="text-[10px] text-slate-400">Paid via {expense.paymentMode}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Claim Status</span>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 mt-0.5 rounded-md border ${
                expense.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20' :
                expense.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20' :
                expense.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20' :
                'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20'
              }`}>
                {expense.status}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Amount</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white font-mono flex items-center">
                <IndianRupee className="size-3.5 inline text-slate-400" />
                {expense.amount > 0 ? expense.amount.toLocaleString('en-IN') : (expense.travelDetails?.estimatedAmount?.toLocaleString('en-IN') + ' (Est.)')}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Business Purpose</span>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {expense.description}
            </p>
          </div>

          {/* Policy Audit Compliance Assessment Box */}
          {expense.aiAudit ? (
            <div className="border border-indigo-100 dark:border-indigo-900/40 rounded-2xl p-4 bg-indigo-50/20 dark:bg-indigo-950/10 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                  <ShieldCheck className="size-4 animate-pulse text-indigo-500" />
                  <span>Policy Compliance Audit Report</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  expense.aiAudit.riskLevel === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                    : expense.aiAudit.riskLevel === 'MEDIUM'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                }`}>
                  {expense.aiAudit.riskLevel} COMPLIANCE RISK (Score: {expense.aiAudit.riskScore}/100)
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-900/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Policy Notes & Analysis:</span>
                <p className="italic font-sans leading-relaxed text-slate-700 dark:text-slate-300">
                  "{expense.aiAudit.policyNotes}"
                </p>
              </div>

              {expense.aiAudit.flaggedIssues && expense.aiAudit.flaggedIssues.length > 0 && (
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Policy Triggers Audited:</span>
                  <ul className="space-y-0.5 pl-1">
                    {expense.aiAudit.flaggedIssues.map((issue, idx) => (
                      <li key={idx} className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1">
                        <span className="text-indigo-400">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center text-slate-400 dark:text-slate-500 space-y-1">
              <ShieldCheck className="size-5 mx-auto text-slate-300 animate-pulse" />
              <p className="text-xs font-semibold">No digital compliance checkpoint logs found.</p>
              <p className="text-[10.5px]">This is an older legacy record or offline-created claim.</p>
            </div>
          )}

          {/* TRAVEL SPECIFIC DETAILS WORKFLOW */}
          {expense.isTravelTrip && expense.travelDetails && (
            <div className="border border-indigo-100 dark:border-slate-800 rounded-2xl p-4 bg-indigo-50/10 dark:bg-slate-900/10 space-y-3.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400">
                <MapPin className="size-4" />
                <span>Travel Booking Workflow Lifecycle</span>
              </div>

              {/* Progress Flow graphic */}
              <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] text-slate-400 select-none pb-2">
                {[
                  { id: '1_Estimated_Submitted', label: '1. Quotation' },
                  { id: '2_Estimated_Approved', label: '2. HR Approved' },
                  { id: '3_Bookings_Completed', label: '3. Booked' },
                  { id: '4_Actual_Submitted', label: '4. Claim Ready' }
                ].map((st, i) => {
                  const currentSteps = [
                    '1_Estimated_Submitted',
                    '2_Estimated_Approved',
                    '3_Bookings_Completed',
                    '4_Actual_Submitted'
                  ];
                  const activeIndex = currentSteps.indexOf(expense.travelDetails?.approvalStep || '1_Estimated_Submitted');
                  const isFinished = i <= activeIndex;

                  return (
                    <div key={st.id} className="space-y-1">
                      <div className={`h-1.5 rounded-full ${isFinished ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`} />
                      <span className={`font-semibold text-[9px] ${isFinished ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400'}`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Trip Logistics details */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400">Corporate Client</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{expense.travelDetails.clientName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Visit Agenda</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{expense.travelDetails.purpose}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Booking Route</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1 flex-wrap">
                    <span>{expense.travelDetails.fromLocation}</span>
                    <ArrowRight className="size-3 text-slate-300" />
                    <span>{expense.travelDetails.toLocation}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Estimated Budget</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    ₹{expense.travelDetails.estimatedAmount?.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* ESTIMATE VS ACTUAL COMPARISON BANNER */}
              {expense.travelDetails.actualAmount > 0 && (
                <div className="bg-slate-100/60 dark:bg-slate-800 p-2.5 rounded-xl flex items-center justify-between text-[11px] font-semibold">
                  <span>Estimated vs. Actual Variance:</span>
                  <div className="font-mono">
                    ₹{expense.travelDetails.estimatedAmount?.toLocaleString()} vs ₹{expense.travelDetails.actualAmount?.toLocaleString()}
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      expense.travelDetails.actualAmount <= expense.travelDetails.estimatedAmount
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-500'
                    }`}>
                      {expense.travelDetails.estimatedAmount - expense.travelDetails.actualAmount >= 0 
                        ? `Saved ₹${(expense.travelDetails.estimatedAmount - expense.travelDetails.actualAmount).toLocaleString()}`
                        : `Over-budget ₹${Math.abs(expense.travelDetails.estimatedAmount - expense.travelDetails.actualAmount).toLocaleString()}`}
                    </span>
                  </div>
                </div>
              )}

              {/* EMPLOYEE WORKFLOW TRIGGERS */}
              {!isAdmin && expense.employeeEmail === currentUser.email && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  {/* Step 2 -> Step 3 Trigger */}
                  {expense.travelDetails.approvalStep === '2_Estimated_Approved' && (
                    <div className="bg-indigo-50 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 p-3 rounded-xl space-y-2">
                      <p className="font-medium text-indigo-700 dark:text-indigo-400 text-[11px] flex items-center gap-1">
                        <AlertCircle className="size-3.5 shrink-0" />
                        <span>Manager approved flight/hotel quote limits! Click below to book slots.</span>
                      </p>
                      <button
                        type="button"
                        id="complete-bookings-btn"
                        onClick={handleCompleteTravelBookings}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 rounded-lg text-[10px] uppercase tracking-wider shadow-xs transition"
                      >
                        Proceed to Book Flights & Rooms
                      </button>
                    </div>
                  )}

                  {/* Step 3 -> Step 4 Trigger (Attaching Actual Billing Costs) */}
                  {expense.travelDetails.approvalStep === '3_Bookings_Completed' && !isFinishingTravelForm && (
                    <button
                      type="button"
                      id="trigger-finishing-travel-form-btn"
                      onClick={() => setIsFinishingTravelForm(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wide shadow-xs transition"
                    >
                      Trip Completed? Upload Final Bill Receipts
                    </button>
                  )}

                  {isFinishingTravelForm && (
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3.5">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-slate-700 dark:text-slate-200">Submit Actual Expenses</span>
                        <button 
                          onClick={() => setIsFinishingTravelForm(false)} 
                          className="text-slate-400 hover:text-slate-600 text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label htmlFor="modal-actual-amount-input" className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                            Actual Expense Bill Amount (₹) *
                          </label>
                          <input
                            type="number"
                            id="modal-actual-amount-input"
                            value={actualAmountInput}
                            onChange={(e) => setActualAmountInput(Number(e.target.value))}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-100 font-mono"
                          />
                        </div>

                        <div>
                          <label htmlFor="modal-receipt-template-select" className="block text-[9px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                            Attach Voucher Mock Bill *
                          </label>
                          <select
                            id="modal-receipt-template-select"
                            value={selectedReceiptTemplate}
                            onChange={(e) => setSelectedReceiptTemplate(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-slate-100"
                          >
                            <option value="placeholder_invoice">Air India Ticket Invoice (₹14.5k)</option>
                            <option value="placeholder_hotel">Taj Lodging Bill (₹9.8k)</option>
                            <option value="placeholder_uber">Corporate Cab Bill (₹450)</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          id="submit-actuals-btn"
                          onClick={handleSubmitActualTravelExpenses}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-[10px] uppercase tracking-wide shadow-xs transition"
                        >
                          Send Actual Expense & Bills File
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ADMIN ACTION PANEL OR USER RESPONSE LOG */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            
            {isAdmin ? (
              <div className="bg-indigo-50/40 dark:bg-slate-900/50 p-4 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl space-y-3">
                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Briefcase className="size-4" />
                  <span>Administrative Review Desk Panel</span>
                </div>

                <div>
                  <label htmlFor="admin-notes-textarea" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                    Administrative Notes / Reason for Decision
                  </label>
                  <textarea
                    id="admin-notes-textarea"
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Provide justification for approval, rejection comments, or disbursement cycle ID..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    id="admin-approve-btn"
                    onClick={() => handleAdminAction('Approved')}
                    className="flex-1 min-w-[90px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-[11px] uppercase tracking-wider shadow-xs transition"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    id="admin-reject-btn"
                    onClick={() => handleAdminAction('Rejected')}
                    className="flex-1 min-w-[90px] bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-3 rounded-lg text-[11px] uppercase tracking-wider shadow-xs transition"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    id="admin-reimburse-btn"
                    onClick={() => handleAdminAction('Reimbursed')}
                    className="flex-1 min-w-[90px] bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg text-[11px] uppercase tracking-wider shadow-xs transition"
                  >
                    Reimburse
                  </button>
                </div>
              </div>
            ) : (
              expense.adminNotes && (
                <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <MessageSquare className="size-4 text-slate-500" />
                    <span>Manager Review Notes Response</span>
                  </div>
                  <p className="text-xs italic text-slate-700 dark:text-slate-300 leading-normal pl-5">
                    "{expense.adminNotes}"
                  </p>
                </div>
              )
            )}
          </div>

        </div>

        {/* Right Side: Virtual Printer Bill Receipts / Proof image preview */}
        <div className="w-full md:w-[360px] bg-slate-50 dark:bg-slate-900 p-6 flex flex-col justify-start overflow-y-auto space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Proof Receipt Folio</span>
            <span className="text-[10px] text-slate-400 font-mono">Receipt Scan UI</span>
          </div>

          {/* RENDERING DYNAMIC PRINT BILL FOR SIMULATED SYSTEM */}
          {receiptTemplate ? (
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-300 relative space-y-4 overflow-hidden select-text">
              {/* Receipts Jagged Edge Effect Decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 flex justify-between">
                {Array.from({ length: 20 }).map((_, idx) => (
                  <div key={idx} className="size-2 bg-slate-50 dark:bg-slate-900 rotate-45 -translate-y-1" />
                ))}
              </div>

              <div className="text-center pt-2">
                <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                  {receiptTemplate.title}
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{receiptTemplate.vendor}</span>
                <span className="text-[9px] text-slate-400 block font-mono">Date: {expense.date}</span>
                <div className="border-b border-dashed border-slate-200 dark:border-slate-800 my-3" />
              </div>

              {/* Items Table */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Billed Deliverables</span>
                {receiptTemplate.items.map((item, idx) => (
                  <div key={idx} className="text-[10px] pl-2 border-l border-slate-200/80 dark:border-slate-800 leading-snug">
                    {item}
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-slate-200 dark:border-slate-800 my-3" />

              {/* Financial Summary */}
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{receiptTemplate.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Integrated Tax:</span>
                  <span>{receiptTemplate.tax}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-900 dark:text-white pt-2 border-t border-dashed border-slate-100 dark:border-slate-800 mt-2">
                  <span>GRAND TOTAL (INR):</span>
                  <span>₹{receiptTemplate.total}</span>
                </div>
              </div>

              {/* Footer Stamp decoration */}
              <div className="text-center space-y-1 bg-emerald-500/5 dark:bg-emerald-500/10 p-2.5 rounded-xl border border-dashed border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                🔒 CERTIFIED VERIFIED VOUCHER
                <span className="text-[8px] font-normal block text-slate-400">Match Code: XML-CLAIM-{expense.id.toUpperCase()}</span>
              </div>
            </div>
          ) : expense.receiptName ? (
            <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="mx-auto size-12 bg-indigo-50 dark:bg-indigo-950 rounded-full flex items-center justify-center text-indigo-500">
                <FileText className="size-6" />
              </div>
              <div className="space-y-1">
                <h5 className="text-[11px] font-bold truncate text-slate-900 dark:text-white" title={expense.receiptName}>
                  {expense.receiptName}
                </h5>
                <p className="text-[10px] text-slate-400">Uploader Receipt Proof</p>
              </div>

              {/* If it's a real custom uploaded data URI image, render its image element */}
              {expense.receiptUrl && expense.receiptUrl.startsWith('data:') ? (
                <div className="mt-3 rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[160px] flex items-center justify-center bg-slate-50">
                  <img 
                    src={expense.receiptUrl} 
                    alt="Receipt Upload Preview" 
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border text-[10px] text-slate-500 italic">
                  Document attachments active. Visual digital snapshot archived safely.
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-1 p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 italic">
              <Eye className="size-8 stroke-1 text-slate-300" />
              <p className="text-[10px] text-center pt-2">No receipt document/bill uploaded for this stage.</p>
              <p className="text-[9px] text-center text-slate-400">Attach a bill receipt voucher under custom edit controls.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

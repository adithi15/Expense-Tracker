/**
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "25mb" }));

const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

const SAMPLE_EMPLOYEES_SEED = [
  { name: "Adithi Ankam",   email: "adithi.ankam@company.com",  role: "Admin",     department: "Sales & BD" },
  { name: "Vemula Ravi",    email: "vemula@company.com",         role: "Employee",  department: "Product Engineering" },
  { name: "Anjali Mehta",   email: "anjali.mehta@company.com",   role: "Employee",  department: "Customer Success" },
  { name: "Shivam Kapoor",  email: "shivam.kapoor@company.com",  role: "Employee",  department: "HR & Finance Admin" },
  { name: "Adithi Sharma",  email: "adithi@company.com",         role: "Employee",  department: "HR & Finance Admin" },
  { name: "Rohit Desai",    email: "rohit.desai@company.com",    role: "Employee",  department: "Product Engineering" },
  { name: "Priya Nair",     email: "priya.nair@company.com",     role: "Employee",  department: "Customer Success" },
  { name: "Karan Mehta",    email: "karan.mehta@company.com",    role: "Employee",  department: "Sales & BD" },
  { name: "Sneha Joshi",    email: "sneha.joshi@company.com",    role: "Employee",  department: "Marketing" },
  { name: "Arjun Rao",      email: "arjun.rao@company.com",      role: "Employee",  department: "Finance" },
  { name: "Divya Menon",    email: "divya.menon@company.com",    role: "Employee",  department: "Operations" },
  { name: "Nikhil Verma",   email: "nikhil.verma@company.com",   role: "Employee",  department: "Product Engineering" },
];

const SAMPLE_EXPENSES_SEED = [
  {
    id: 'exp-101',
    employeeName: 'Adithi Ankam',
    employeeEmail: 'adithi.ankam@company.com',
    expenseType: 'Train/Flight',
    date: getDateDaysAgo(15),
    amount: 14500,
    description: 'Round-trip flight to Mumbai for TechNova annual partnership renew talks',
    paymentMode: 'Card',
    receiptName: 'air_india_invoice_890.pdf',
    receiptUrl: 'placeholder_invoice',
    status: 'Approved',
    adminNotes: 'Flights are pre-approved under the quarterly sales travel budget. Travel looks high priority.',
    isTravelTrip: true,
    travelDetails: {
      clientName: 'TechNova Solutions',
      purpose: 'Annual Partner Review & System Integration Upgrade Proposal',
      fromLocation: 'Delhi (DEL)',
      toLocation: 'Mumbai (BOM)',
      estimatedAmount: 16000,
      actualAmount: 14500,
      approvalStep: '4_Actual_Submitted'
    },
    aiAudit: {
      riskLevel: 'LOW', riskScore: 8, confidenceScore: 98,
      flaggedIssues: ['Pre-approved travel budget matched', 'UPI/Card channel cleared'],
      policyNotes: 'Validated travel route Delhi to Mumbai. Actual transaction of ₹14,500 is under the pre-approved ₹16,000 estimate limit.'
    }
  },
  {
    id: 'exp-102',
    employeeName: 'Vemula Ravi',
    employeeEmail: 'vemula@company.com',
    expenseType: 'Food',
    date: getDateDaysAgo(2),
    amount: 1250,
    description: 'Database optimization session working dinner with the infrastructure team',
    paymentMode: 'UPI',
    receiptName: 'gourmet_foods_receipt.png',
    receiptUrl: 'placeholder_bill',
    status: 'Pending',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 12, confidenceScore: 94,
      flaggedIssues: ['late night meals policy checklist OK'],
      policyNotes: 'Late working developer dinner meets default departmental caps (₹1,500/head cap). No purchase red flags.'
    }
  },
  {
    id: 'exp-103',
    employeeName: 'Anjali Mehta',
    employeeEmail: 'anjali.mehta@company.com',
    expenseType: 'Local Travel (Auto/Cab)',
    date: getDateDaysAgo(5),
    amount: 450,
    description: 'Cab to Acme headquarters for urgent product onboarding workshop',
    paymentMode: 'UPI',
    receiptName: 'uber_invoice_2392.pdf',
    receiptUrl: 'placeholder_uber',
    status: 'Approved',
    adminNotes: 'Uber business profile matched. Approved.',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 5, confidenceScore: 95,
      flaggedIssues: ['Uber business invoice matches destination'],
      policyNotes: 'Direct client site logistics are 100% reimbursable. GPS matches client address records.'
    }
  },
  {
    id: 'exp-104',
    employeeName: 'Adithi Ankam',
    employeeEmail: 'adithi.ankam@company.com',
    expenseType: 'Hotel',
    date: getDateDaysAgo(12),
    amount: 9800,
    description: '2 nights stay at Taj Lands End for TechNova summit',
    paymentMode: 'Card',
    receiptName: 'reception_invoice_taj_99.png',
    receiptUrl: 'placeholder_hotel',
    status: 'Reimbursed',
    adminNotes: 'Approved and reimbursed on May 25 cycle. Transaction receipt sent to bank.',
    isTravelTrip: true,
    travelDetails: {
      clientName: 'TechNova Solutions',
      purpose: 'Annual Partner Review & System Integration Upgrade Proposal',
      fromLocation: 'Delhi (DEL)',
      toLocation: 'Mumbai (BOM)',
      estimatedAmount: 11000,
      actualAmount: 9800,
      approvalStep: '4_Actual_Submitted'
    },
    aiAudit: {
      riskLevel: 'LOW', riskScore: 15, confidenceScore: 96,
      flaggedIssues: ['Luxury brand tag flagged', 'Regional lodging limits satisfied'],
      policyNotes: 'Standard 2 nights stay at Taj Lands End is within regional tier-A corporate lodging capping (₹6,000/night limit).'
    }
  },
  {
    id: 'exp-105',
    employeeName: 'Vemula Ravi',
    employeeEmail: 'vemula@company.com',
    expenseType: 'Train/Flight',
    date: getDateDaysAgo(8),
    amount: 0,
    description: 'Upcoming travel to Bengaluru for AWS cloud infrastructure summit',
    paymentMode: 'Card',
    status: 'Approved',
    isTravelTrip: true,
    travelDetails: {
      clientName: 'AWS AWS India Summit & Partners',
      purpose: 'AWS Partner cloud infrastructure scaling workshops',
      fromLocation: 'Mumbai (BOM)',
      toLocation: 'Bengaluru (BLR)',
      estimatedAmount: 12500,
      actualAmount: 0,
      approvalStep: '2_Estimated_Approved'
    },
    aiAudit: {
      riskLevel: 'LOW', riskScore: 10, confidenceScore: 92,
      flaggedIssues: ['AWS training ticket matches calendar'],
      policyNotes: 'Approved learning syllabus. Estimate ₹12,500 is within standard ticket pricing index limits.'
    }
  },
  {
    id: 'exp-106',
    employeeName: 'Anjali Mehta',
    employeeEmail: 'anjali.mehta@company.com',
    expenseType: 'Miscellaneous',
    date: getDateDaysAgo(22),
    amount: 1500,
    description: 'High-speed LAN adapters purchased for customer support hub desks',
    paymentMode: 'Cash',
    receiptName: 'apex_electronics_slip.png',
    receiptUrl: 'placeholder_electronics',
    status: 'Reimbursed',
    adminNotes: 'Petty cash disbursed on spot. Original invoice submitted to HR box.',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 15, confidenceScore: 90,
      flaggedIssues: ['IT hardware category matching description'],
      policyNotes: 'Asset is verified under emergency hardware purchases. Matches tech connectivity guidelines.'
    }
  },
  {
    id: 'exp-107',
    employeeName: 'Adithi Ankam',
    employeeEmail: 'adithi.ankam@company.com',
    expenseType: 'Hotel',
    date: getDateDaysAgo(1),
    amount: 0,
    description: 'Estimated hotel stay charges for upcoming client review meeting in Pune',
    paymentMode: 'Card',
    status: 'Pending',
    isTravelTrip: true,
    travelDetails: {
      clientName: 'Saraswat Bank Corp',
      purpose: 'Core Banking API review and project kickoff',
      fromLocation: 'Mumbai (BOM)',
      toLocation: 'Pune (PNQ)',
      estimatedAmount: 7500,
      actualAmount: 0,
      approvalStep: '1_Estimated_Submitted'
    },
    aiAudit: {
      riskLevel: 'LOW', riskScore: 18, confidenceScore: 91,
      flaggedIssues: ['Check-in date matches project kickoff timeline'],
      policyNotes: 'Estimated stay in Pune tier-B hotel is within regional default ₹7,500 bounds.'
    }
  },
  {
    id: 'exp-108',
    employeeName: 'Vemula Ravi',
    employeeEmail: 'vemula@company.com',
    expenseType: 'Food',
    date: getDateDaysAgo(10),
    amount: 4300,
    description: 'Team outing and farewell dinner for lead QA architect at Barbeque Nation',
    paymentMode: 'Card',
    receiptName: 'bbq_nation_invoice_904.pdf',
    receiptUrl: 'placeholder_bill',
    status: 'Rejected',
    adminNotes: 'Farewell events are not covered under team development meals. Please routing this via department budget instead.',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'HIGH', riskScore: 82, confidenceScore: 97,
      flaggedIssues: ['"farewell" event keyword violates single claim rules', 'Amount exceeds food cap (₹1,500/head)'],
      policyNotes: 'Policy alert: Team farewell gatherings, celebrations, or recreational events are classified as social costs. Do not file under travel or personal dining claims.'
    }
  },
  {
    id: 'exp-109',
    employeeName: 'Rohit Desai',
    employeeEmail: 'rohit.desai@company.com',
    expenseType: 'Local Travel (Auto/Cab)',
    date: getDateDaysAgo(3),
    amount: 620,
    description: 'Cab to client office in Andheri for product demo and sprint review meeting',
    paymentMode: 'UPI',
    receiptName: 'ola_invoice_3821.pdf',
    receiptUrl: 'placeholder_uber',
    status: 'Pending',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 5, confidenceScore: 96,
      flaggedIssues: ['Client site visit verified'],
      policyNotes: 'Passed Audit: Local cab for client meeting. Within standard local travel limits.'
    }
  },
  {
    id: 'exp-110',
    employeeName: 'Priya Nair',
    employeeEmail: 'priya.nair@company.com',
    expenseType: 'Food',
    date: getDateDaysAgo(4),
    amount: 980,
    description: 'Working lunch with customer success team for quarterly review preparation',
    paymentMode: 'Card',
    receiptName: 'cafe_coffee_day_slip.png',
    receiptUrl: 'placeholder_bill',
    status: 'Approved',
    adminNotes: 'Team lunch approved under CS department budget.',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 8, confidenceScore: 95,
      flaggedIssues: ['Team meal within per-head cap'],
      policyNotes: 'Passed Audit: Departmental working lunch. Amount within policy limits.'
    }
  },
  {
    id: 'exp-111',
    employeeName: 'Karan Mehta',
    employeeEmail: 'karan.mehta@company.com',
    expenseType: 'Train/Flight',
    date: getDateDaysAgo(6),
    amount: 8200,
    description: 'Train ticket to Hyderabad for SalesForce annual partner conference',
    paymentMode: 'Card',
    receiptName: 'irctc_ticket_karan.pdf',
    receiptUrl: 'placeholder_invoice',
    status: 'Approved',
    adminNotes: 'Conference travel pre-approved by sales head.',
    isTravelTrip: true,
    travelDetails: {
      clientName: 'SalesForce India Partners',
      purpose: 'Annual Sales Partner Conference & Product Roadmap Session',
      fromLocation: 'Mumbai (CSMT)',
      toLocation: 'Hyderabad (HYB)',
      estimatedAmount: 9000,
      actualAmount: 8200,
      approvalStep: '4_Actual_Submitted'
    },
    aiAudit: {
      riskLevel: 'LOW', riskScore: 7, confidenceScore: 97,
      flaggedIssues: ['Conference ticket matches calendar invite'],
      policyNotes: 'Passed Audit: Train fare within economy travel limits. Under approved estimate.'
    }
  },
  {
    id: 'exp-112',
    employeeName: 'Sneha Joshi',
    employeeEmail: 'sneha.joshi@company.com',
    expenseType: 'Miscellaneous',
    date: getDateDaysAgo(7),
    amount: 2400,
    description: 'Marketing collateral printing for product launch event at BKC expo centre',
    paymentMode: 'Cash',
    receiptName: 'printzone_invoice_44.png',
    receiptUrl: 'placeholder_electronics',
    status: 'Reimbursed',
    adminNotes: 'Marketing event expense approved and reimbursed.',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 12, confidenceScore: 93,
      flaggedIssues: ['Marketing event expenditure verified'],
      policyNotes: 'Passed Audit: Print material for official product launch. Within miscellaneous cap.'
    }
  },
  {
    id: 'exp-113',
    employeeName: 'Arjun Rao',
    employeeEmail: 'arjun.rao@company.com',
    expenseType: 'Hotel',
    date: getDateDaysAgo(9),
    amount: 5500,
    description: '1 night stay in Bangalore for finance team offsite and budget planning workshop',
    paymentMode: 'Card',
    receiptName: 'ibis_hotel_blr_inv.pdf',
    receiptUrl: 'placeholder_hotel',
    status: 'Approved',
    adminNotes: 'Finance offsite approved under Q2 team budget.',
    isTravelTrip: true,
    travelDetails: {
      clientName: 'Internal Finance Offsite',
      purpose: 'Q2 Budget Planning & Annual Finance Review Workshop',
      fromLocation: 'Mumbai (BOM)',
      toLocation: 'Bengaluru (BLR)',
      estimatedAmount: 6000,
      actualAmount: 5500,
      approvalStep: '4_Actual_Submitted'
    },
    aiAudit: {
      riskLevel: 'LOW', riskScore: 10, confidenceScore: 94,
      flaggedIssues: ['Internal offsite booking verified'],
      policyNotes: 'Passed Audit: Hotel stay within tier-B city lodging cap of ₹6,000/night.'
    }
  },
  {
    id: 'exp-114',
    employeeName: 'Divya Menon',
    employeeEmail: 'divya.menon@company.com',
    expenseType: 'Food',
    date: getDateDaysAgo(11),
    amount: 1100,
    description: 'Client onboarding lunch at operations center with new enterprise account team',
    paymentMode: 'UPI',
    receiptName: 'mainland_china_receipt.png',
    receiptUrl: 'placeholder_bill',
    status: 'Pending',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 6, confidenceScore: 96,
      flaggedIssues: ['Client onboarding activity verified'],
      policyNotes: 'Passed Audit: Client-facing meal within per-head daily limit.'
    }
  },
  {
    id: 'exp-115',
    employeeName: 'Nikhil Verma',
    employeeEmail: 'nikhil.verma@company.com',
    expenseType: 'Miscellaneous',
    date: getDateDaysAgo(14),
    amount: 3200,
    description: 'Software license renewal for Figma team plan for product design squad',
    paymentMode: 'Card',
    receiptName: 'figma_invoice_2026.pdf',
    receiptUrl: 'placeholder_electronics',
    status: 'Approved',
    adminNotes: 'Tool subscription approved under product team budget.',
    isTravelTrip: false,
    aiAudit: {
      riskLevel: 'LOW', riskScore: 9, confidenceScore: 95,
      flaggedIssues: ['Software license for team use verified'],
      policyNotes: 'Passed Audit: SaaS tool renewal within miscellaneous cap. Business use confirmed.'
    }
  }
];

// In-memory fallback stores
let serverExpensesFallback = [...SAMPLE_EXPENSES_SEED];
let serverEmployeesFallback = [...SAMPLE_EMPLOYEES_SEED];

// ── Mongoose Schemas ──────────────────────────────────────────────────────────

let isMongoDbConnected = false;
let mongoDbErrorMessage = "";

const TravelDetailsSchema = new Schema({
  clientName:      { type: String, required: true },
  purpose:         { type: String, required: true },
  fromLocation:    { type: String, required: true },
  toLocation:      { type: String, required: true },
  estimatedAmount: { type: Number, required: true },
  actualAmount:    { type: Number, required: true },
  approvalStep:    { type: String, required: true }
}, { _id: false });

const AiAuditSchema = new Schema({
  riskLevel:       { type: String, default: "LOW" },
  riskScore:       { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 100 },
  flaggedIssues:   [{ type: String }],
  policyNotes:     { type: String }
}, { _id: false });

const ExpenseSchema = new Schema({
  id:            { type: String, required: true, unique: true },
  employeeName:  { type: String, required: true },
  employeeEmail: { type: String, required: true },
  expenseType:   { type: String, required: true },
  date:          { type: String, required: true },
  amount:        { type: Number, required: true },
  description:   { type: String, required: true },
  paymentMode:   { type: String, required: true },
  receiptName:   { type: String },
  receiptUrl:    { type: String },
  status:        { type: String, required: true },
  adminNotes:    { type: String },
  updatedAt:     { type: String },
  isTravelTrip:  { type: Boolean, required: true, default: false },
  travelDetails: { type: TravelDetailsSchema },
  aiAudit:       { type: AiAuditSchema }
}, { timestamps: true });

const RecordModel = mongoose.model("Expense", ExpenseSchema);

const EmployeeSchema = new Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  role:       { type: String, required: true },
  department: { type: String, required: true },
}, { timestamps: true });

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

// ── MongoDB Connection ────────────────────────────────────────────────────────

async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️ MONGODB_URI not found. Running in memory fallback mode.");
    mongoDbErrorMessage = "MONGODB_URI missing. Running in fallback mode.";
    return;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("🚀 MongoDB connected");
    isMongoDbConnected = true;

    // Seed expenses if empty
    if (await RecordModel.countDocuments() === 0) {
      await RecordModel.insertMany(SAMPLE_EXPENSES_SEED);
      console.log("✅ Expenses seeded");
    }

    // Seed employees if empty
    if (await EmployeeModel.countDocuments() === 0) {
      await EmployeeModel.insertMany(SAMPLE_EMPLOYEES_SEED);
      console.log("✅ Employees seeded");
    }
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    mongoDbErrorMessage = error.message || "Connection failed.";
  }
}

connectToMongo();

// ── API Routes ────────────────────────────────────────────────────────────────

app.get("/api/db-status", (req, res) => {
  res.json({
    connected: isMongoDbConnected,
    mode: isMongoDbConnected ? "mongodb" : "memory_fallback",
    error: mongoDbErrorMessage,
    uriSupplied: !!process.env.MONGODB_URI
  });
});

app.get("/api/employees", async (req, res) => {
  try {
    const employees = isMongoDbConnected
      ? await EmployeeModel.find()
      : serverEmployeesFallback;
    return res.json(employees);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch employees.", message: err.message });
  }
});

app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = isMongoDbConnected
      ? await RecordModel.find().sort({ createdAt: -1 })
      : serverExpensesFallback;
    return res.json(expenses);
  } catch (err) {
    return res.status(500).json({ error: "Failed to read expenses.", message: err.message });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const payload = req.body;
    if (isMongoDbConnected) {
      const newDoc = new RecordModel(payload);
      await newDoc.save();
      return res.status(201).json(newDoc);
    }
    serverExpensesFallback = [payload, ...serverExpensesFallback];
    return res.status(201).json(payload);
  } catch (err) {
    return res.status(500).json({ error: "Could not create expense.", message: err.message });
  }
});

app.post("/api/ai/audit", async (req, res) => {
  try {
    const { expenseType, amount, description, travelDetails } = req.body;
    const descLower  = (description || "").toLowerCase();
    const typeLower  = (expenseType || "").toLowerCase();
    const parsedAmount = Number(amount) || 0;

    let riskLevel       = "LOW";
    let riskScore       = 10;
    let confidenceScore = 100;
    let flaggedIssues   = [];
    let policyNotes     = "Claim conforms to general corporate reimbursement standards.";

    if (descLower.includes("personal") || descLower.includes("vacation") || descLower.includes("family") ||
        descLower.includes("gift") || descLower.includes("spouse") || descLower.includes("holiday") ||
        descLower.includes("movies") || descLower.includes("leisure")) {
      riskLevel = "HIGH"; riskScore = 95;
      flaggedIssues.push("Non-business vacation/personal keyword detected");
      policyNotes = "Policy Violation: Personal charges are ineligible for corporate reimbursement.";
    } else if (descLower.includes("beer") || descLower.includes("alcohol") || descLower.includes("pub") ||
               descLower.includes("party") || descLower.includes("liquor") || descLower.includes("wine") ||
               descLower.includes("bar ")) {
      riskLevel = "MEDIUM"; riskScore = 60;
      flaggedIssues.push("Alcohol/bar charge detected — requires VP approval");
      policyNotes = "Policy Alert: Alcohol expenses require division head override.";
    } else if (typeLower.includes("flight") || typeLower.includes("train") || typeLower.includes("travel")) {
      if (parsedAmount > 30000) {
        riskLevel = "HIGH"; riskScore = 80;
        flaggedIssues.push("Exceeds ₹30,000 flight limit — executive clearance needed");
        policyNotes = "Policy Restriction: Flights over ₹30,000 require executive approval.";
      } else if (parsedAmount > 20000) {
        riskLevel = "MEDIUM"; riskScore = 45;
        flaggedIssues.push("Exceeds ₹20,000 economy cap");
        policyNotes = "Policy Warning: Flight over ₹20,000 needs travel desk validation.";
      }
    } else if (typeLower.includes("miscellaneous") && parsedAmount > 5000) {
      riskLevel = "MEDIUM"; riskScore = 50;
      flaggedIssues.push("Miscellaneous exceeds ₹5,000 petty cash threshold");
      policyNotes = "Policy limit: Items over ₹5,000 should go through purchase portal.";
    } else if (typeLower.includes("food") && parsedAmount > 1500 && !descLower.includes("team")) {
      riskLevel = "MEDIUM"; riskScore = 30;
      flaggedIssues.push("Single meal exceeds ₹1,500 per head limit");
      policyNotes = "Policy Warning: Personal dining capped at ₹1,500/head/day.";
    } else if (travelDetails && travelDetails.estimatedAmount > 0 && travelDetails.actualAmount > 0) {
      const variance = ((travelDetails.actualAmount - travelDetails.estimatedAmount) / travelDetails.estimatedAmount) * 100;
      if (variance > 25) {
        riskLevel = "MEDIUM"; riskScore = 40;
        flaggedIssues.push(`Actual ₹${travelDetails.actualAmount} exceeds estimate ₹${travelDetails.estimatedAmount} by ${variance.toFixed(1)}%`);
        policyNotes = "Variance Alert: Overages >25% need travel manager override.";
      }
    }

    if (flaggedIssues.length === 0) {
      if (descLower.includes("meeting") || descLower.includes("client") ||
          descLower.includes("workshop") || descLower.includes("kickoff")) {
        riskScore = 5;
        flaggedIssues.push("Verified client engagement activity");
        policyNotes = "Passed Audit: Client-facing activity eligible for reimbursement.";
      } else {
        riskScore = 15;
        flaggedIssues.push("Reimbursement satisfies regional finance bylaws");
        policyNotes = "Passed Audit: Expense approved for safe clearance.";
      }
    }

    return res.json({ riskLevel, riskScore, confidenceScore, flaggedIssues, policyNotes });
  } catch (err) {
    return res.status(500).json({ error: "Compliance audit failed." });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    if (isMongoDbConnected) {
      const updatedDoc = await RecordModel.findOneAndUpdate({ id }, { $set: body }, { new: true });
      if (!updatedDoc) return res.status(404).json({ error: "Expense not found." });
      return res.json(updatedDoc);
    }
    let found = false;
    serverExpensesFallback = serverExpensesFallback.map(item => {
      if (item.id === id) { found = true; return { ...item, ...body }; }
      return item;
    });
    if (!found) return res.status(404).json({ error: "Expense not found." });
    return res.json(serverExpensesFallback.find(x => x.id === id));
  } catch (err) {
    return res.status(500).json({ error: "Update failed.", message: err.message });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoDbConnected) {
      const result = await RecordModel.findOneAndDelete({ id });
      if (!result) return res.status(404).json({ error: "Expense not found." });
      return res.json({ success: true });
    }
    const before = serverExpensesFallback.length;
    serverExpensesFallback = serverExpensesFallback.filter(item => item.id !== id);
    if (serverExpensesFallback.length === before) return res.status(404).json({ error: "Expense not found." });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed.", message: err.message });
  }
});

app.post("/api/reset-db", async (req, res) => {
  try {
    if (isMongoDbConnected) {
      await RecordModel.deleteMany({});
      await RecordModel.insertMany(SAMPLE_EXPENSES_SEED);
      await EmployeeModel.deleteMany({});
      await EmployeeModel.insertMany(SAMPLE_EMPLOYEES_SEED);
      return res.json({ success: true, message: "MongoDB reset successfully." });
    }
    serverExpensesFallback = [...SAMPLE_EXPENSES_SEED];
    serverEmployeesFallback = [...SAMPLE_EMPLOYEES_SEED];
    return res.json({ success: true, message: "Memory store reset." });
  } catch (err) {
    return res.status(500).json({ error: "Reset failed.", message: err.message });
  }
});

// ── Frontend Serving ──────────────────────────────────────────────────────────

if (process.env.NODE_ENV !== "production") {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 Server live on http://localhost:${PORT}`);
  });
}

export default app;
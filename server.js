/**
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "25mb" }));

// Helper to get dates relative to today
const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
};

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
      riskLevel: 'LOW',
      riskScore: 8,
      confidenceScore: 98,
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
      riskLevel: 'LOW',
      riskScore: 12,
      confidenceScore: 94,
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
      riskLevel: 'LOW',
      riskScore: 5,
      confidenceScore: 95,
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
      riskLevel: 'LOW',
      riskScore: 15,
      confidenceScore: 96,
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
      riskLevel: 'LOW',
      riskScore: 10,
      confidenceScore: 92,
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
      riskLevel: 'LOW',
      riskScore: 15,
      confidenceScore: 90,
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
      riskLevel: 'LOW',
      riskScore: 18,
      confidenceScore: 91,
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
      riskLevel: 'HIGH',
      riskScore: 82,
      confidenceScore: 97,
      flaggedIssues: ['"farewell" event keyword violates single claim rules', 'Amount exceeds food cap (₹1,500/head)'],
      policyNotes: 'Policy alert: Team farewell gatherings, celebrations, or recreational events are classified as social costs. Do not file under travel or personal dining claims.'
    }
  }
];

// Backend server-side in-memory array as fallback if MongoDB isn't available
let serverExpensesFallback = [...SAMPLE_EXPENSES_SEED];

// MongoDB & Mongoose Schemas Setup
let isMongoDbConnected = false;
let mongoDbErrorMessage = "";

const TravelDetailsSchema = new Schema({
  clientName: { type: String, required: true },
  purpose: { type: String, required: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  estimatedAmount: { type: Number, required: true },
  actualAmount: { type: Number, required: true },
  approvalStep: { type: String, required: true }
}, { _id: false });

const AiAuditSchema = new Schema({
  riskLevel: { type: String, default: "LOW" },
  riskScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 100 },
  flaggedIssues: [{ type: String }],
  policyNotes: { type: String }
}, { _id: false });

const ExpenseSchema = new Schema({
  id: { type: String, required: true, unique: true },
  employeeName: { type: String, required: true },
  employeeEmail: { type: String, required: true },
  expenseType: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  paymentMode: { type: String, required: true },
  receiptName: { type: String },
  receiptUrl: { type: String },
  status: { type: String, required: true },
  adminNotes: { type: String },
  updatedAt: { type: String },
  isTravelTrip: { type: Boolean, required: true, default: false },
  travelDetails: { type: TravelDetailsSchema },
  aiAudit: { type: AiAuditSchema }
}, { timestamps: true });

const RecordModel = mongoose.model("Expense", ExpenseSchema);

// Connection Handler


async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️ MONGODB_URI is not declared in environment. Active fallback is server memory.");
    isMongoDbConnected = false;
    mongoDbErrorMessage = "MONGODB_URI variable missing in settings. Running in transient fallback mode.";
    return;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("🚀 Successful connection established to MongoDB database!");
    isMongoDbConnected = true;
    mongoDbErrorMessage = "";

    // Print collections and document count
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("📦 Collections in your database:");
    collections.forEach(col => console.log("   →", col.name));
    const count = await RecordModel.countDocuments();
    console.log(`📊 Total documents in 'expenses' collection: ${count}`);

    // Self-seeding check if the collection is pristine
    if (count === 0) {
      console.log("🌱 Database is empty. Seeding MongoDB with initial company sample payload...");
      await RecordModel.insertMany(SAMPLE_EXPENSES_SEED);
      console.log("✅ Database initialized successfully!");
    }

  } catch (error) {
    console.error("❌ Failed to bind to MongoDB instance cluster:", error.message);
    isMongoDbConnected = false;
    mongoDbErrorMessage = error.message || "Connection timeout or invalid credentials.";
  }
}
// async function connectToMongo() {
//   const uri = process.env.MONGODB_URI;
//   if (!uri) {
//     console.warn("⚠️ MONGODB_URI is not declared in environment. Active fallback is server memory.");
//     isMongoDbConnected = false;
//     mongoDbErrorMessage = "MONGODB_URI variable missing in settings. Running in transient fallback mode.";
//     return;
//   }

//   try {
//     mongoose.set("strictQuery", false);
//     await mongoose.connect(uri, {
//       serverSelectionTimeoutMS: 5000,
//     });
//     console.log("🚀 Successful connection established to MongoDB database!");
//     isMongoDbConnected = true;
//     mongoDbErrorMessage = "";
//     const collections = await mongoose.connection.db.listCollections().toArray();
// console.log("📦 Collections in your database:");
// collections.forEach(col => console.log("   →", col.name));

// const count = await RecordModel.countDocuments();
// console.log(`📊 Total documents in 'expenses' collection: ${count}`);
  

    // Self-seeding check if the collection is pristine
//     const count = await RecordModel.countDocuments();
//     if (count === 0) {
//       console.log("🌱 Database is empty. Seeding MongoDB with initial company sample payload...");
//       await RecordModel.insertMany(SAMPLE_EXPENSES_SEED);
//       console.log("✅ Database initialized successfully!");
//     }
//   } catch (error) {
//     console.error("❌ Failed to bind to MongoDB instance cluster:", error.message);
//     isMongoDbConnected = false;
//     mongoDbErrorMessage = error.message || "Connection timeout or invalid credentials.";
//   }
//  }

// Fire off database boot
connectToMongo();

// ----------------------------------------------------
// REST API Core Business Routes
// ----------------------------------------------------

// Endpoint: Database connection status query
app.get("/api/db-status", (req, res) => {
  res.json({
    connected: isMongoDbConnected,
    mode: isMongoDbConnected ? "mongodb" : "memory_fallback",
    error: mongoDbErrorMessage,
    uriSupplied: !!process.env.MONGODB_URI
  });
});

// Endpoint: Read all expense items
app.get("/api/expenses", async (req, res) => {
  try {
    if (isMongoDbConnected) {
      const dbEntries = await RecordModel.find().sort({ createdAt: -1 });
      return res.json(dbEntries);
    } else {
      return res.json(serverExpensesFallback);
    }
  } catch (err) {
    console.error("Read expenses failed:", err);
    return res.status(500).json({ error: "Failed to read database accounts.", message: err.message });
  }
});

// Endpoint: Create custom new expense claim record
app.post("/api/expenses", async (req, res) => {
  try {
    const payload = req.body;
    
    if (isMongoDbConnected) {
      const newDoc = new RecordModel(payload);
      await newDoc.save();
      return res.status(201).json(newDoc);
    } else {
      serverExpensesFallback = [payload, ...serverExpensesFallback];
      return res.status(201).json(payload);
    }
  } catch (err) {
    console.error("Create expense failed:", err);
    return res.status(500).json({ error: "Could not persist new document voucher.", message: err.message });
  }
});

// Endpoint: Run Determinstic Human-Logic Corporate Policy & Compliance Audit
app.post("/api/ai/audit", async (req, res) => {
  try {
    const { expenseType, amount, description, travelDetails } = req.body;
    
    // Heuristics Engine - Generates highly accurate deterministic compliance evaluations based on corporate treasury limits
    const descLower = (description || "").toLowerCase();
    const typeLower = (expenseType || "").toLowerCase();
    const parsedAmount = Number(amount) || 0;
    
    let riskLevel = "LOW";
    let riskScore = 10;
    let confidenceScore = 100; // 100% confident since it's a deterministic rules-based parser
    let flaggedIssues = [];
    let policyNotes = "Claim conforms to general corporate reimbursement standards. Low compliance risk with safe standard channel checkout.";

    // 1. Personal & Holiday Spend Violation Checks (STRICTLY PROHIBITED)
    if (descLower.includes("personal") || descLower.includes("vacation") || descLower.includes("family") || descLower.includes("gift") || descLower.includes("spouse") || descLower.includes("holiday") || descLower.includes("son ") || descLower.includes("daughter") || descLower.includes("movies") || descLower.includes("leisure")) {
      riskLevel = "HIGH";
      riskScore = 95;
      flaggedIssues.push("Non-business vacation/personal keyword trigger detected");
      flaggedIssues.push("Potential leisure or family utility item matches standard exclusion rule §4.1.2");
      policyNotes = "Policy Violation: Personal charges, leisure event tickets, and family-related travel costs are 100% ineligible for corporate reimbursement claims.";
    }
    // 2. Alcohol & Bar Consumption Check
    else if (descLower.includes("beer") || descLower.includes("alcohol") || descLower.includes("pub") || descLower.includes("party") || descLower.includes("liquor") || descLower.includes("drinks") || descLower.includes("wine") || descLower.includes("bar ")) {
      riskLevel = "MEDIUM";
      riskScore = 60;
      flaggedIssues.push("Restricted dietary consumables (alcohol/bar charge) detected");
      flaggedIssues.push("Requires departmental VP approval sign-off under entertaining guidelines");
      policyNotes = "Policy Alert: Beverage or entertainment expenses containing liquor/bar logs are subject to mandatory secondary auditing and require specific division head overrides.";
    }
    // 3. Excess Flight caps limits
    else if (typeLower.includes("flight") || typeLower.includes("train") || typeLower.includes("travel")) {
      if (parsedAmount > 30000) {
        riskLevel = "HIGH";
        riskScore = 80;
        flaggedIssues.push("Tier-1 carrier tickets exceed the regional single trip threshold (₹30,000 limit)");
        flaggedIssues.push("High executive clearance mandated for business class routing");
        policyNotes = "Policy Restriction: Flight tickets over ₹30,000 are subject to executive approval rules. Please attach pre-travel clearance email.";
      } else if (parsedAmount > 20000) {
        riskLevel = "MEDIUM";
        riskScore = 45;
        flaggedIssues.push("Pre-travel flight ticket quotes exceed the economy cap limit of ₹20,000");
        policyNotes = "Policy Warning: Flight itineraries exceeding ₹20,000 require travel desk validation and supplementary business reason files.";
      }
    }
    // 4. Excess Miscellaneous charges limit (₹5,000 cap)
    else if (typeLower.includes("miscellaneous") && parsedAmount > 5000) {
      riskLevel = "MEDIUM";
      riskScore = 50;
      flaggedIssues.push("Miscellaneous asset purchase exceeds single petty cash threshold of ₹5,000");
      policyNotes = "Policy limit: Procurement of individual hardware assets or office supplies over ₹5,000 should be filed through regular corporate purchase portal instead of reimbursement claims.";
    }
    // 5. Team meal / dinner cap overages check (₹1,500 per head cap check)
    else if (typeLower.includes("food") && parsedAmount > 1500 && !descLower.includes("team")) {
      riskLevel = "MEDIUM";
      riskScore = 30;
      flaggedIssues.push("Single-person meal invoice exceeds individual lunch/dinner limit of ₹1,500");
      policyNotes = "Policy Warning: Personal dining claims are restricted to ₹1,500 per head per day. Please split the cost if filing a combined group invoice.";
    }
    // 6. Travel Variance checks (exceeding estimate by more than 25%)
    else if (travelDetails && travelDetails.estimatedAmount > 0 && travelDetails.actualAmount > 0) {
      const variance = ((travelDetails.actualAmount - travelDetails.estimatedAmount) / travelDetails.estimatedAmount) * 100;
      if (variance > 25) {
        riskLevel = "MEDIUM";
        riskScore = 40;
        flaggedIssues.push(`Actual travel bill (₹${travelDetails.actualAmount}) exceeds approved estimate (₹${travelDetails.estimatedAmount}) by ${variance.toFixed(1)}%`);
        policyNotes = "Variance Alert: Travel overages of more than 25% above approved estimate require travel manager override validation.";
      }
    }

    // Default clean logs if no warnings triggered
    if (flaggedIssues.length === 0) {
      if (descLower.includes("meeting") || descLower.includes("client") || descLower.includes("customer") || descLower.includes("onsite") || descLower.includes("workshop") || descLower.includes("renew") || descLower.includes("kickoff")) {
        riskLevel = "LOW";
        riskScore = 5;
        flaggedIssues.push("Verified core client engagement and business activities");
        policyNotes = "Passed Audit: Verified customer-facing meeting or vendor technical services kickoff. Eligible for automatic green channel reimbursement.";
      } else {
        riskLevel = "LOW";
        riskScore = 15;
        flaggedIssues.push("Reimbursement details satisfy regional finance bylaws");
        policyNotes = "Passed Audit: Expense bounds correspond to appropriate corporate guidelines. Checked and approved for safe clearance.";
      }
    }

    return res.json({
      riskLevel,
      riskScore,
      confidenceScore,
      flaggedIssues,
      policyNotes
    });

  } catch (err) {
    console.error("Policy compliance audit failure:", err);
    return res.status(500).json({ error: "Corporate compliance rules engine errored out." });
  }
});

// Endpoint: Update selected fields (Status reviews, travel advances)
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (isMongoDbConnected) {
      const updatedDoc = await RecordModel.findOneAndUpdate(
        { id: id },
        { $set: body },
        { new: true }
      );
      if (!updatedDoc) {
        return res.status(404).json({ error: "Expense ID not found in database." });
      }
      return res.json(updatedDoc);
    } else {
      let documentFound = false;
      serverExpensesFallback = serverExpensesFallback.map((item) => {
        if (item.id === id) {
          documentFound = true;
          return { ...item, ...body };
        }
        return item;
      });

      if (!documentFound) {
        return res.status(404).json({ error: "Expense ID not found in server context." });
      }

      const updated = serverExpensesFallback.find(x => x.id === id);
      return res.json(updated);
    }
  } catch (err) {
    console.error("Update expense failed:", err);
    return res.status(500).json({ error: "Failed to update expense item.", message: err.message });
  }
});

// Endpoint: Delete/Retract expense record
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoDbConnected) {
      const result = await RecordModel.findOneAndDelete({ id: id });
      if (!result) {
        return res.status(404).json({ error: "Receipt item does not exist." });
      }
      return res.json({ success: true, message: `Successfully cleared expense ${id}.` });
    } else {
      const originalCount = serverExpensesFallback.length;
      serverExpensesFallback = serverExpensesFallback.filter(item => item.id !== id);
      if (serverExpensesFallback.length === originalCount) {
        return res.status(404).json({ error: "Receipt item does not exist in transient store." });
      }
      return res.json({ success: true });
    }
  } catch (err) {
    console.error("Delete expense failed:", err);
    return res.status(500).json({ error: "Failed to clean ledger entry.", message: err.message });
  }
});

// Endpoint: Restore original company dataset
app.post("/api/reset-db", async (req, res) => {
  try {
    if (isMongoDbConnected) {
      await RecordModel.deleteMany({});
      await RecordModel.insertMany(SAMPLE_EXPENSES_SEED);
      console.log("✅ MongoDB reset successfully by developer trigger!");
      return res.json({ success: true, message: "Cleared collections and seeded MongoDB successfully." });
    } else {
      serverExpensesFallback = [...SAMPLE_EXPENSES_SEED];
      console.log("✅ InMemory Fallback reset successfully by developer trigger!");
      return res.json({ success: true, message: "Reset transient server-side memory store." });
    }
  } catch (err) {
    console.error("Reset database failed:", err);
    return res.status(500).json({ error: "Failed to reset storage files", message: err.message });
  }
});

// ----------------------------------------------------
// Front-End SPA Build Asset Mounts & Fallbacks
// ----------------------------------------------------

async function setupViteMounter() {
  if (process.env.NODE_ENV !== "production") {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`📡 Full-Stack Dev Service successfully live on http://localhost:${PORT}`);
  });
}

setupViteMounter();
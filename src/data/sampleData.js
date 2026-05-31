/**
 * SPDX-License-Identifier: Apache-2.0
 */

export const SAMPLE_EMPLOYEES = [
  {
    name: "Adithi Ankam",
    email: "adithi.ankam@company.com",
    role: "Admin",
    department: "Sales & BD",
  },
  {
    name: "Vemula Ravi",
    email: "vemula@company.com",
    role: "Employee",
    department: "Product Engineering",
  },
  {
    name: "Anjali Mehta",
    email: "anjali.mehta@company.com",
    role: "Employee",
    department: "Customer Success",
  },
  {
    name: "Shivam Kapoor",
    email: "shivam.kapoor@company.com",
    role: "Employee",
    department: "HR & Finance Admin",
  },
  {
    name: "Adithi Sharma",
    email: "adithi@company.com",
    role: "Employee",
    department: "HR & Finance Admin",
  },
];

// Helper to get dates relative to today
const getDateDaysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
};

export const SAMPLE_EXPENSES = [
  {
    id: "exp-101",
    employeeName: "Adithi Ankam",
    employeeEmail: "adithi.ankam@company.com",
    expenseType: "Train/Flight",
    date: getDateDaysAgo(15),
    amount: 14500,
    description:
      "Round-trip flight to Mumbai for TechNova annual partnership renew talks",
    paymentMode: "Card",
    receiptName: "air_india_invoice_890.pdf",
    receiptUrl: "placeholder_invoice",
    status: "Approved",
    adminNotes:
      "Flights are pre-approved under the quarterly sales travel budget. Travel looks high priority.",
    isTravelTrip: true,
    travelDetails: {
      clientName: "TechNova Solutions",
      purpose: "Annual Partner Review & System Integration Upgrade Proposal",
      fromLocation: "Delhi (DEL)",
      toLocation: "Mumbai (BOM)",
      estimatedAmount: 16000,
      actualAmount: 14500,
      approvalStep: "4_Actual_Submitted",
    },
  },
  {
    id: "exp-102",
    employeeName: "Vemula Ravi",
    employeeEmail: "vemula@company.com",
    expenseType: "Food",
    date: getDateDaysAgo(2),
    amount: 1250,
    description:
      "Database optimization session working dinner with the infrastructure team",
    paymentMode: "UPI",
    receiptName: "gourmet_foods_receipt.png",
    receiptUrl: "placeholder_bill",
    status: "Pending",
    isTravelTrip: false,
  },
  {
    id: "exp-103",
    employeeName: "Anjali Mehta",
    employeeEmail: "anjali.mehta@company.com",
    expenseType: "Local Travel (Auto/Cab)",
    date: getDateDaysAgo(5),
    amount: 450,
    description:
      "Cab to Acme headquarters for urgent product onboarding workshop",
    paymentMode: "UPI",
    receiptName: "uber_invoice_2392.pdf",
    receiptUrl: "placeholder_uber",
    status: "Approved",
    adminNotes: "Uber business profile matched. Approved.",
    isTravelTrip: false,
  },
  {
    id: "exp-104",
    employeeName: "Adithi Ankam",
    employeeEmail: "adithi.ankam@company.com",
    expenseType: "Hotel",
    date: getDateDaysAgo(12),
    amount: 9800,
    description: "2 nights stay at Taj Lands End for TechNova summit",
    paymentMode: "Card",
    receiptName: "reception_invoice_taj_99.png",
    receiptUrl: "placeholder_hotel",
    status: "Reimbursed",
    adminNotes:
      "Approved and reimbursed on May 25 cycle. Transaction receipt sent to bank.",
    isTravelTrip: true,
    travelDetails: {
      clientName: "TechNova Solutions",
      purpose: "Annual Partner Review & System Integration Upgrade Proposal",
      fromLocation: "Delhi (DEL)",
      toLocation: "Mumbai (BOM)",
      estimatedAmount: 11000,
      actualAmount: 9800,
      approvalStep: "4_Actual_Submitted",
    },
  },
  {
    id: "exp-105",
    employeeName: "Vemula Ravi",
    employeeEmail: "vemula@company.com",
    expenseType: "Train/Flight",
    date: getDateDaysAgo(8),
    amount: 0,
    description:
      "Upcoming travel to Bengaluru for AWS cloud infrastructure summit",
    paymentMode: "Card",
    status: "Approved",
    isTravelTrip: true,
    travelDetails: {
      clientName: "AWS AWS India Summit & Partners",
      purpose: "AWS Partner cloud infrastructure scaling workshops",
      fromLocation: "Mumbai (BOM)",
      toLocation: "Bengaluru (BLR)",
      estimatedAmount: 12500,
      actualAmount: 0,
      approvalStep: "2_Estimated_Approved",
    },
  },
  {
    id: "exp-106",
    employeeName: "Anjali Mehta",
    employeeEmail: "anjali.mehta@company.com",
    expenseType: "Miscellaneous",
    date: getDateDaysAgo(22),
    amount: 1500,
    description:
      "High-speed LAN adapters purchased for customer support hub desks",
    paymentMode: "Cash",
    receiptName: "apex_electronics_slip.png",
    receiptUrl: "placeholder_electronics",
    status: "Reimbursed",
    adminNotes:
      "Petty cash disbursed on spot. Original invoice submitted to HR box.",
    isTravelTrip: false,
  },
  {
    id: "exp-107",
    employeeName: "Adithi Ankam",
    employeeEmail: "adithi.ankam@company.com",
    expenseType: "Hotel",
    date: getDateDaysAgo(1),
    amount: 0,
    description:
      "Estimated hotel stay charges for upcoming client review meeting in Pune",
    paymentMode: "Card",
    status: "Pending",
    isTravelTrip: true,
    travelDetails: {
      clientName: "Saraswat Bank Corp",
      purpose: "Core Banking API review and project kickoff",
      fromLocation: "Mumbai (BOM)",
      toLocation: "Pune (PNQ)",
      estimatedAmount: 7500,
      actualAmount: 0,
      approvalStep: "1_Estimated_Submitted",
    },
  },
  {
    id: "exp-108",
    employeeName: "Vemula Ravi",
    employeeEmail: "vemula@company.com",
    expenseType: "Food",
    date: getDateDaysAgo(10),
    amount: 4300,
    description:
      "Team outing and farewell dinner for lead QA architect at Barbeque Nation",
    paymentMode: "Card",
    receiptName: "bbq_nation_invoice_904.pdf",
    receiptUrl: "placeholder_bill",
    status: "Rejected",
    adminNotes:
      "Farewell events are not covered under team development meals. Please routing this via department budget instead.",
    isTravelTrip: false,
  },
];

export const MOCK_RECEIPT_TEMPLATES = {
  placeholder_invoice: {
    title: "AIR ALLIANCE PASSENGER TICKET & INVOICE",
    vendor: "Air India / Alliance Air Corp",
    items: [
      "DELHI-MUMBAI BASE FARE: 11,500.00 INR",
      "AIRPORT TAX (YQ/YR): 1,800.00 INR",
      "CGST 2.5% & SGST 2.5%: 1,200.00 INR",
    ],
    tax: "1,200.00 INR",
    subtotal: "13,300.00 INR",
    total: "14,500.00",
  },
  placeholder_bill: {
    title: "GOURMET KITCHEN & DINER INVOICE",
    vendor: "The Gourmet Junction Pvt Ltd",
    items: [
      "2x Wood-Fired Neapolitan Pizza: 800.00 INR",
      "3x Premium Iced Lattes: 350.00 INR",
      "Service Charge 5%: 100.00 INR",
    ],
    tax: "57.50 INR",
    subtotal: "1,192.50 INR",
    total: "1,250.00",
  },
  placeholder_uber: {
    title: "UBER RIDE RECEIPT - TRANSACTION REF #4819",
    vendor: "Uber Tech India Logistics",
    items: [
      "Uber Premier Trip Fare (7.4 km, 22 mins): 380.00 INR",
      "Toll Fees / MCD Surcharge: 70.00 INR",
    ],
    tax: "0.00 INR",
    subtotal: "450.00 INR",
    total: "450.00",
  },
  placeholder_hotel: {
    title: "TAJ LANDS END GUEST FOLIO",
    vendor: "Taj Hotels Resorts & Palaces Group",
    items: [
      "Superior Room - Single Occupancy (2 nights): 8,000.00 INR",
      "Room Dinings & Bottled Waters: 800.00 INR",
      "GST & Luxury Tax 12%: 1,000.00 INR",
    ],
    tax: "1,000.00 INR",
    subtotal: "8,800.00 INR",
    total: "9,800.00",
  },
  placeholder_electronics: {
    title: "APEX DIGITAL ELECTRONICS RETAIL SLIP",
    vendor: "Apex Electronics Hub",
    items: [
      "2x USB-C to Ethernet Gigabit Adaptor: 1,350.00 INR",
      "Local CGST & SGST 18%: 150.00 INR",
    ],
    tax: "150.00 INR",
    subtotal: "1,350.00 INR",
    total: "1,500.00",
  },
};

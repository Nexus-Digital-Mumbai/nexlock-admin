// Realistic mock data for NexLock prototype

export type DealerStatus = "active" | "suspended" | "pending";
export interface Dealer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  devices: number;
  activeLoans: number;
  collections: number;
  status: DealerStatus;
  joined: string;
}

export type CustomerStatus = "active" | "overdue" | "closed" | "defaulted";
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  devices: number;
  loanAmount: number;
  outstanding: number;
  status: CustomerStatus;
  dealer: string;
  enrolled: string;
}

export type DeviceStatus = "active" | "locked" | "offline" | "wiped";
export interface Device {
  id: string;
  imei: string;
  model: string;
  manufacturer: string;
  os: string;
  customer: string;
  dealer: string;
  status: DeviceStatus;
  enrolled: string;
  lastSeen: string;
}

export type LoanStatus = "active" | "overdue" | "closed" | "defaulted";
export interface Loan {
  id: string;
  customer: string;
  dealer: string;
  principal: number;
  emi: number;
  paid: number;
  outstanding: number;
  tenure: number;
  paidInstallments: number;
  status: LoanStatus;
  nextDue: string;
}

export type PaymentStatus = "success" | "pending" | "failed";
export interface Payment {
  id: string;
  customer: string;
  loanId: string;
  amount: number;
  method: "UPI" | "Card" | "NetBanking" | "Cash" | "AutoDebit";
  status: PaymentStatus;
  date: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: "device" | "loan" | "user" | "dealer" | "payment" | "system";
  ip: string;
  timestamp: string;
}

const firstNames = ["Aarav","Vivaan","Aditya","Vihaan","Arjun","Sai","Reyansh","Ayaan","Krishna","Ishaan","Rohan","Ananya","Diya","Saanvi","Aadhya","Pari","Anika","Navya","Kiara","Myra"];
const lastNames = ["Sharma","Verma","Patel","Reddy","Iyer","Kumar","Singh","Gupta","Mehta","Joshi","Nair","Khan","Das","Bose","Shetty"];
const cities = ["Mumbai","Bengaluru","Delhi","Hyderabad","Chennai","Pune","Kolkata","Ahmedabad","Jaipur","Lucknow","Surat","Indore"];
const states = ["MH","KA","DL","TG","TN","MH","WB","GJ","RJ","UP","GJ","MP"];
const dealerNames = ["BrightTel Mobiles","UrbanCell Distributors","PrimeFone Hub","Galaxy Retail Co.","Metro Mobile World","Skyline Devices","Apex Telecom","NextGen Mobiles","Royal Cellular","CityZone Tech","TechBazaar Retail","Connect+ Stores","Spark Mobile Mart","Pixel Point","Infinity Telecom"];
const models = ["Galaxy A14","Redmi Note 13","Realme C55","Moto G34","Pixel 7a","Vivo Y28","Oppo A78","Galaxy M14","Redmi 13C","Tecno Spark 20"];
const manufacturers = ["Samsung","Xiaomi","Realme","Motorola","Google","Vivo","Oppo","Samsung","Xiaomi","Tecno"];

const rand = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};
const r = rand(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)];
const between = (a: number, b: number) => Math.floor(r() * (b - a + 1)) + a;
const pad = (n: number, w = 4) => n.toString().padStart(w, "0");

const daysAgo = (d: number) => {
  const date = new Date(2026, 5, 30);
  date.setDate(date.getDate() - d);
  return date.toISOString().slice(0, 10);
};
const minsAgo = (m: number) => {
  const date = new Date(2026, 5, 30, 14, 22);
  date.setMinutes(date.getMinutes() - m);
  return date.toISOString().slice(0, 16).replace("T", " ");
};

export const dealers: Dealer[] = Array.from({ length: 24 }, (_, i) => {
  const status: DealerStatus = i % 11 === 0 ? "suspended" : i % 7 === 0 ? "pending" : "active";
  return {
    id: `DLR-${pad(1001 + i)}`,
    name: dealerNames[i % dealerNames.length] + (i >= dealerNames.length ? ` ${Math.floor(i / dealerNames.length) + 1}` : ""),
    contact: `${pick(firstNames)} ${pick(lastNames)}`,
    email: `dealer${i + 1}@nexlock.io`,
    phone: `+91 9${between(100000000, 899999999)}`,
    city: pick(cities),
    state: pick(states),
    devices: between(40, 850),
    activeLoans: between(20, 600),
    collections: between(120000, 4500000),
    status,
    joined: daysAgo(between(30, 900)),
  };
});

export const customers: Customer[] = Array.from({ length: 48 }, (_, i) => {
  const principal = between(8000, 45000);
  const paid = between(0, principal);
  const status: CustomerStatus = i % 13 === 0 ? "defaulted" : i % 5 === 0 ? "overdue" : paid >= principal ? "closed" : "active";
  return {
    id: `CUS-${pad(20001 + i, 5)}`,
    name: `${pick(firstNames)} ${pick(lastNames)}`,
    phone: `+91 9${between(100000000, 899999999)}`,
    email: `customer${i + 1}@mail.com`,
    city: pick(cities),
    devices: between(1, 3),
    loanAmount: principal,
    outstanding: Math.max(0, principal - paid),
    status,
    dealer: dealers[i % dealers.length].name,
    enrolled: daysAgo(between(5, 600)),
  };
});

const deviceStatuses: DeviceStatus[] = ["active","active","active","active","locked","locked","offline","wiped"];
export const devices: Device[] = Array.from({ length: 60 }, (_, i) => {
  const mi = i % models.length;
  return {
    id: `DEV-${pad(50001 + i, 5)}`,
    imei: `35${between(100000000000, 999999999999)}`,
    model: models[mi],
    manufacturer: manufacturers[mi],
    os: `Android ${between(11, 14)}`,
    customer: customers[i % customers.length].name,
    dealer: dealers[i % dealers.length].name,
    status: deviceStatuses[i % deviceStatuses.length],
    enrolled: daysAgo(between(1, 500)),
    lastSeen: minsAgo(between(1, 60 * 48)),
  };
});

export const loans: Loan[] = customers.slice(0, 40).map((c, i) => {
  const tenure = pick([6, 9, 12, 18, 24]);
  const emi = Math.round(c.loanAmount / tenure);
  const paidInst = between(0, tenure);
  const paid = emi * paidInst;
  const status: LoanStatus = paidInst === tenure ? "closed" : i % 9 === 0 ? "defaulted" : i % 4 === 0 ? "overdue" : "active";
  return {
    id: `LN-${pad(70001 + i, 5)}`,
    customer: c.name,
    dealer: c.dealer,
    principal: c.loanAmount,
    emi,
    paid,
    outstanding: Math.max(0, c.loanAmount - paid),
    tenure,
    paidInstallments: paidInst,
    status,
    nextDue: daysAgo(between(-15, 30)),
  };
});

const methods: Payment["method"][] = ["UPI","UPI","UPI","AutoDebit","Card","NetBanking","Cash"];
const pStatuses: PaymentStatus[] = ["success","success","success","success","success","pending","failed"];
export const payments: Payment[] = Array.from({ length: 60 }, (_, i) => ({
  id: `PAY-${pad(90001 + i, 5)}`,
  customer: customers[i % customers.length].name,
  loanId: loans[i % loans.length].id,
  amount: between(800, 5500),
  method: methods[i % methods.length],
  status: pStatuses[i % pStatuses.length],
  date: minsAgo(between(5, 60 * 24 * 14)),
}));

const actions = [
  { a: "Locked device", c: "device" as const },
  { a: "Unlocked device", c: "device" as const },
  { a: "Enrolled device", c: "device" as const },
  { a: "Wiped device", c: "device" as const },
  { a: "Created loan", c: "loan" as const },
  { a: "Approved EMI plan", c: "loan" as const },
  { a: "Recorded payment", c: "payment" as const },
  { a: "Refunded payment", c: "payment" as const },
  { a: "Suspended dealer", c: "dealer" as const },
  { a: "Onboarded dealer", c: "dealer" as const },
  { a: "Updated role", c: "user" as const },
  { a: "Policy updated", c: "system" as const },
];
export const auditLogs: AuditLog[] = Array.from({ length: 40 }, (_, i) => {
  const ac = actions[i % actions.length];
  return {
    id: `LOG-${pad(800001 + i, 6)}`,
    actor: i % 5 === 0 ? "system@nexlock" : `admin.${pick(lastNames).toLowerCase()}`,
    action: ac.a,
    target: ac.c === "device" ? devices[i % devices.length].id : ac.c === "loan" ? loans[i % loans.length].id : ac.c === "payment" ? payments[i % payments.length].id : ac.c === "dealer" ? dealers[i % dealers.length].id : "—",
    category: ac.c,
    ip: `10.${between(0,255)}.${between(0,255)}.${between(0,255)}`,
    timestamp: minsAgo(between(2, 60 * 24 * 10)),
  };
});

// Charts
export const collectionTrend = [
  { month: "Jan", target: 2200000, collected: 1980000 },
  { month: "Feb", target: 2400000, collected: 2310000 },
  { month: "Mar", target: 2600000, collected: 2570000 },
  { month: "Apr", target: 2800000, collected: 2640000 },
  { month: "May", target: 3000000, collected: 2920000 },
  { month: "Jun", target: 3200000, collected: 3140000 },
  { month: "Jul", target: 3400000, collected: 3280000 },
  { month: "Aug", target: 3500000, collected: 3460000 },
  { month: "Sep", target: 3700000, collected: 3590000 },
  { month: "Oct", target: 3900000, collected: 3820000 },
  { month: "Nov", target: 4000000, collected: 3970000 },
  { month: "Dec", target: 4200000, collected: 4180000 },
];

export const dealerPerformance = dealers.slice(0, 8).map((d) => ({
  name: d.name.split(" ")[0],
  collections: Math.round(d.collections / 1000),
  devices: d.devices,
}));

export const deviceStatusDist = [
  { name: "Active", value: devices.filter((d) => d.status === "active").length, color: "var(--color-success)" },
  { name: "Locked", value: devices.filter((d) => d.status === "locked").length, color: "var(--color-warning)" },
  { name: "Offline", value: devices.filter((d) => d.status === "offline").length, color: "var(--color-muted-foreground)" },
  { name: "Wiped", value: devices.filter((d) => d.status === "wiped").length, color: "var(--color-destructive)" },
];

export const paymentTrend = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}`,
  success: between(180, 320),
  failed: between(5, 35),
}));

export const monthlyGrowth = [
  { month: "Jan", dealers: 142, customers: 1820 },
  { month: "Feb", dealers: 156, customers: 2010 },
  { month: "Mar", dealers: 168, customers: 2240 },
  { month: "Apr", dealers: 181, customers: 2480 },
  { month: "May", dealers: 195, customers: 2710 },
  { month: "Jun", dealers: 213, customers: 2980 },
  { month: "Jul", dealers: 228, customers: 3220 },
  { month: "Aug", dealers: 246, customers: 3510 },
  { month: "Sep", dealers: 261, customers: 3790 },
  { month: "Oct", dealers: 278, customers: 4080 },
  { month: "Nov", dealers: 294, customers: 4360 },
  { month: "Dec", dealers: 312, customers: 4640 },
];

export const recentEnrollments = devices.slice(0, 6);
export const recentPayments = payments.filter(p => p.status === "success").slice(0, 6);
export const recentLocks = auditLogs.filter(l => l.action === "Locked device").slice(0, 5);
export const recentUnlocks = auditLogs.filter(l => l.action === "Unlocked device").slice(0, 5);
export const recentDealers = dealers.slice(0, 5);

export const notifications = [
  { id: 1, type: "warning" as const, title: "12 accounts overdue >30 days", desc: "Auto-collection retries failed for ₹86,420 across 12 customers.", time: "8m ago" },
  { id: 2, type: "success" as const, title: "Dealer BrightTel Mobiles onboarded", desc: "KYC approved. 24 devices ready for enrollment.", time: "32m ago" },
  { id: 3, type: "info" as const, title: "Monthly collection report generated", desc: "November 2026 reconciliation is ready for review.", time: "1h ago" },
  { id: 4, type: "danger" as const, title: "5 devices reported tampered", desc: "Anti-tamper triggered. Devices auto-locked pending review.", time: "2h ago" },
  { id: 5, type: "info" as const, title: "Platform maintenance scheduled", desc: "Sunday 02:00–04:00 IST. No service impact expected.", time: "5h ago" },
  { id: 6, type: "success" as const, title: "Collection target met for Q3", desc: "₹38.4 Cr collected — 102.3% of target.", time: "1d ago" },
];

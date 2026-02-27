// ── Shared helpers ──
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

// ── Generic types for tabbed dropdowns ──
export interface TabbedItem {
  id: string;
  name: string;
  meta: string; // secondary line in dropdown
}

export interface TabConfig {
  value: string;
  label: string;
  icon: string; // icon key
  items: TabbedItem[];
}

export interface SimpleItem {
  id: string;
  code: string;
  description: string;
}

// ── Entities ──
const entityTypes = ["Account", "Contact", "Lead", "Opportunity", "Case", "Task", "Event", "Product", "Invoice", "Order"];
const adjectives = ["Global", "Pacific", "Atlantic", "Northern", "Southern", "Eastern", "Western", "Central", "Premier", "Elite", "Dynamic", "Strategic", "Innovative", "Advanced", "Digital", "Quantum", "Apex", "Nexus", "Pinnacle", "Summit"];
const nouns = ["Solutions", "Systems", "Technologies", "Industries", "Ventures", "Dynamics", "Partners", "Holdings", "Enterprises", "Labs", "Corp", "Group", "Services", "Networks", "Capital", "Consulting", "Analytics", "Logistics", "Media", "Health"];
const firstNames = ["James", "Maria", "Robert", "Linda", "Michael", "Sarah", "David", "Jennifer", "William", "Patricia", "Richard", "Elizabeth", "Thomas", "Barbara", "Charles", "Susan", "Daniel", "Jessica", "Matthew", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

export const entityItems: TabbedItem[] = Array.from({ length: 1000 }, (_, i) => {
  const type = pick(entityTypes, i * 3 + 1);
  const name = type === "Contact" || type === "Lead"
    ? `${pick(firstNames, i * 7 + 2)} ${pick(lastNames, i * 11 + 3)}`
    : `${pick(adjectives, i * 5 + 4)} ${pick(nouns, i * 13 + 5)}`;
  return { id: `ent-${i + 1}`, name, meta: `${type} · Entity #${i + 1}` };
});

const groupPrefixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Iota", "Kappa", "Lambda", "Sigma", "Omega", "Nova", "Orion", "Vega", "Atlas", "Titan", "Phoenix", "Horizon", "Zenith"];
const groupCategories = ["Department", "Region", "Industry", "Tier", "Segment", "Division", "Team", "Project", "Campaign", "Portfolio"];

export const entityGroupItems: TabbedItem[] = Array.from({ length: 1000 }, (_, i) => {
  const cat = pick(groupCategories, i * 3 + 7);
  const count = Math.floor(seededRandom(i * 23 + 11) * 500) + 1;
  return {
    id: `egrp-${i + 1}`,
    name: `${pick(groupPrefixes, i * 5 + 9)} ${cat} ${Math.floor(seededRandom(i * 17) * 100)}`,
    meta: `${cat} · ${count} members`,
  };
});

// ── Jurisdictions ──
const jurisdictionNames = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "China", "India", "Brazil",
  "Mexico", "Italy", "Spain", "South Korea", "Netherlands", "Switzerland", "Sweden", "Norway", "Denmark", "Finland",
  "Ireland", "Singapore", "Hong Kong", "New Zealand", "Belgium", "Austria", "Luxembourg", "Portugal", "Poland", "Czech Republic",
  "Hungary", "Romania", "Greece", "Turkey", "Israel", "South Africa", "Nigeria", "Kenya", "Egypt", "UAE",
  "Saudi Arabia", "Qatar", "Kuwait", "Bahrain", "Oman", "Thailand", "Vietnam", "Indonesia", "Malaysia", "Philippines",
];
const jurisdictionCodes = [
  "US", "GB", "CA", "AU", "DE", "FR", "JP", "CN", "IN", "BR",
  "MX", "IT", "ES", "KR", "NL", "CH", "SE", "NO", "DK", "FI",
  "IE", "SG", "HK", "NZ", "BE", "AT", "LU", "PT", "PL", "CZ",
  "HU", "RO", "GR", "TR", "IL", "ZA", "NG", "KE", "EG", "AE",
  "SA", "QA", "KW", "BH", "OM", "TH", "VN", "ID", "MY", "PH",
];

export const jurisdictionItems: TabbedItem[] = jurisdictionNames.map((name, i) => ({
  id: `jur-${i + 1}`,
  name: `${jurisdictionCodes[i]} – ${name}`,
  meta: `Jurisdiction · ${jurisdictionCodes[i]}`,
}));

// Add more to reach 200
const stateNames = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

const additionalJurisdictions: TabbedItem[] = stateNames.map((name, i) => ({
  id: `jur-st-${i + 1}`,
  name: `US-${name.substring(0, 2).toUpperCase()} – ${name}`,
  meta: `US State · Subnational`,
}));

export const allJurisdictionItems: TabbedItem[] = [...jurisdictionItems, ...additionalJurisdictions];

export const jurisdictionGroupItems: TabbedItem[] = Array.from({ length: 200 }, (_, i) => {
  const regions = ["EMEA", "APAC", "Americas", "LATAM", "Nordic", "DACH", "Benelux", "ASEAN", "EU", "G7", "G20", "OECD", "BRICS", "Commonwealth", "Eurozone"];
  const types = ["Tax Treaty", "Regulatory", "Reporting", "Compliance", "Transfer Pricing", "Withholding", "VAT/GST", "CbCR"];
  return {
    id: `jgrp-${i + 1}`,
    name: `${pick(regions, i * 3)} ${pick(types, i * 7)} Group ${i + 1}`,
    meta: `${pick(types, i * 7)} · ${Math.floor(seededRandom(i * 11) * 30) + 2} jurisdictions`,
  };
});

// ── Cases ──
const caseStatuses = ["Open", "In Progress", "Under Review", "Pending", "Closed", "Draft"];
const caseTypes = ["Audit", "Dispute", "Advisory", "Compliance", "Planning", "Restructuring", "M&A", "Transfer Pricing", "Ruling", "Litigation"];

export const caseItems: TabbedItem[] = Array.from({ length: 500 }, (_, i) => {
  const type = pick(caseTypes, i * 3 + 1);
  const status = pick(caseStatuses, i * 7 + 2);
  return {
    id: `case-${i + 1}`,
    name: `${type} Case ${1000 + i}`,
    meta: `${type} · ${status}`,
  };
});

export const caseGroupItems: TabbedItem[] = Array.from({ length: 200 }, (_, i) => {
  const groupTypes = ["Portfolio", "Client", "Engagement", "Project", "Workstream", "Matter"];
  const gt = pick(groupTypes, i * 5);
  return {
    id: `cgrp-${i + 1}`,
    name: `${gt} ${pick(groupPrefixes, i * 3)} ${i + 1}`,
    meta: `${gt} · ${Math.floor(seededRandom(i * 13) * 20) + 2} cases`,
  };
});

// ── Periods (Tax Years) ──
export const periodItems: SimpleItem[] = Array.from({ length: 30 }, (_, i) => {
  const year = 2030 - i;
  return { id: `ty-${year}`, code: `TY${year}`, description: `Tax Year ${year}` };
});

// ── Currencies ──
const currencyData: [string, string][] = [
  ["USD", "US Dollar"], ["EUR", "Euro"], ["GBP", "British Pound Sterling"], ["JPY", "Japanese Yen"],
  ["CHF", "Swiss Franc"], ["CAD", "Canadian Dollar"], ["AUD", "Australian Dollar"], ["NZD", "New Zealand Dollar"],
  ["CNY", "Chinese Yuan"], ["HKD", "Hong Kong Dollar"], ["SGD", "Singapore Dollar"], ["SEK", "Swedish Krona"],
  ["NOK", "Norwegian Krone"], ["DKK", "Danish Krone"], ["KRW", "South Korean Won"], ["INR", "Indian Rupee"],
  ["BRL", "Brazilian Real"], ["MXN", "Mexican Peso"], ["ZAR", "South African Rand"], ["TRY", "Turkish Lira"],
  ["RUB", "Russian Ruble"], ["PLN", "Polish Zloty"], ["THB", "Thai Baht"], ["IDR", "Indonesian Rupiah"],
  ["MYR", "Malaysian Ringgit"], ["PHP", "Philippine Peso"], ["CZK", "Czech Koruna"], ["ILS", "Israeli Shekel"],
  ["CLP", "Chilean Peso"], ["AED", "UAE Dirham"], ["SAR", "Saudi Riyal"], ["QAR", "Qatari Riyal"],
  ["KWD", "Kuwaiti Dinar"], ["BHD", "Bahraini Dinar"], ["OMR", "Omani Rial"], ["EGP", "Egyptian Pound"],
  ["NGN", "Nigerian Naira"], ["KES", "Kenyan Shilling"], ["GHS", "Ghanaian Cedi"], ["TWD", "Taiwan Dollar"],
  ["VND", "Vietnamese Dong"], ["PKR", "Pakistani Rupee"], ["BDT", "Bangladeshi Taka"], ["LKR", "Sri Lankan Rupee"],
  ["MMK", "Myanmar Kyat"], ["HUF", "Hungarian Forint"], ["RON", "Romanian Leu"], ["BGN", "Bulgarian Lev"],
  ["HRK", "Croatian Kuna"], ["ISK", "Icelandic Krona"], ["PEN", "Peruvian Sol"], ["COP", "Colombian Peso"],
  ["ARS", "Argentine Peso"], ["UYU", "Uruguayan Peso"], ["JOD", "Jordanian Dinar"], ["LBP", "Lebanese Pound"],
  ["MAD", "Moroccan Dirham"], ["TND", "Tunisian Dinar"], ["XOF", "West African CFA Franc"], ["XAF", "Central African CFA Franc"],
];

export const currencyItems: SimpleItem[] = currencyData.map(([code, desc], i) => ({
  id: `cur-${i}`, code, description: desc,
}));

// ── Ledgers ──
const ledgerData: [string, string][] = [
  ["AED", "Valuation Allowance"], ["ADJ", "Adjustments"], ["BEG", "Beginning Balance"], ["CUR", "Current Provision"],
  ["DEF", "Deferred Provision"], ["DIS", "Discrete Items"], ["EFF", "Effective Tax Rate"], ["FED", "Federal Tax"],
  ["FIN", "FIN 48 Reserve"], ["FOR", "Foreign Tax"], ["ITC", "Investment Tax Credit"], ["LOC", "Local Tax"],
  ["NET", "Net Operating Loss"], ["OCI", "Other Comprehensive Income"], ["PBT", "Profit Before Tax"],
  ["REC", "Reconciliation"], ["RET", "Return to Provision"], ["SBC", "Stock-Based Compensation"],
  ["STA", "State Tax"], ["TEM", "Temporary Differences"], ["TOT", "Total Tax"], ["TRA", "Tax Rate Analysis"],
  ["UTP", "Uncertain Tax Positions"], ["WTH", "Withholding Tax"], ["CFC", "Controlled Foreign Corp"],
  ["GIL", "GILTI"], ["BEA", "BEAT"], ["FDI", "FDII"], ["PTI", "Previously Taxed Income"], ["E&P", "Earnings & Profits"],
];

export const ledgerItems: SimpleItem[] = ledgerData.map(([code, desc], i) => ({
  id: `ldg-${i}`, code, description: desc,
}));

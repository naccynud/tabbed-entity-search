const entityTypes = ["Account", "Contact", "Lead", "Opportunity", "Case", "Task", "Event", "Product", "Invoice", "Order"];
const adjectives = ["Global", "Pacific", "Atlantic", "Northern", "Southern", "Eastern", "Western", "Central", "Premier", "Elite", "Dynamic", "Strategic", "Innovative", "Advanced", "Digital", "Quantum", "Apex", "Nexus", "Pinnacle", "Summit"];
const nouns = ["Solutions", "Systems", "Technologies", "Industries", "Ventures", "Dynamics", "Partners", "Holdings", "Enterprises", "Labs", "Corp", "Group", "Services", "Networks", "Capital", "Consulting", "Analytics", "Logistics", "Media", "Health"];
const firstNames = ["James", "Maria", "Robert", "Linda", "Michael", "Sarah", "David", "Jennifer", "William", "Patricia", "Richard", "Elizabeth", "Thomas", "Barbara", "Charles", "Susan", "Daniel", "Jessica", "Matthew", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.floor(seededRandom(seed) * arr.length)];
}

export interface Entity {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface EntityGroup {
  id: string;
  name: string;
  memberCount: number;
  category: string;
}

export const entities: Entity[] = Array.from({ length: 1000 }, (_, i) => {
  const type = pick(entityTypes, i * 3 + 1);
  const name =
    type === "Contact" || type === "Lead"
      ? `${pick(firstNames, i * 7 + 2)} ${pick(lastNames, i * 11 + 3)}`
      : `${pick(adjectives, i * 5 + 4)} ${pick(nouns, i * 13 + 5)}`;
  return {
    id: `ent-${i + 1}`,
    name,
    type,
    description: `${type} #${i + 1}`,
  };
});

const groupCategories = ["Department", "Region", "Industry", "Tier", "Segment", "Division", "Team", "Project", "Campaign", "Portfolio"];
const groupPrefixes = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Iota", "Kappa", "Lambda", "Sigma", "Omega", "Nova", "Orion", "Vega", "Atlas", "Titan", "Phoenix", "Horizon", "Zenith"];

export const entityGroups: EntityGroup[] = Array.from({ length: 1000 }, (_, i) => {
  const category = pick(groupCategories, i * 3 + 7);
  return {
    id: `grp-${i + 1}`,
    name: `${pick(groupPrefixes, i * 5 + 9)} ${category} ${Math.floor(seededRandom(i * 17) * 100)}`,
    memberCount: Math.floor(seededRandom(i * 23 + 11) * 500) + 1,
    category,
  };
});

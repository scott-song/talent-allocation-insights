export interface LocationData {
  id: string;
  name: string;
  totalResources: number;
  billable: number;
  internal: number;
  bench: number;
}

export interface ForecastData {
  month: string;
  billable: number;
  internal: number;
  bench: number;
}

export interface BillableProject {
  id: string;
  name: string;
  client: string;
  resourceCount: number;
  contribution: number;
  status: 'active' | 'ending-soon' | 'ramping-up';
}

export const locations: LocationData[] = [
  { id: "all", name: "All Locations", totalResources: 450, billable: 320, internal: 85, bench: 45 },
  { id: "nyc", name: "New York", totalResources: 150, billable: 110, internal: 25, bench: 15 },
  { id: "sf", name: "San Francisco", totalResources: 120, billable: 88, internal: 22, bench: 10 },
  { id: "london", name: "London", totalResources: 100, billable: 72, internal: 20, bench: 8 },
  { id: "singapore", name: "Singapore", totalResources: 80, billable: 50, internal: 18, bench: 12 },
];

export const billableProjectsByLocation: Record<string, BillableProject[]> = {
  all: [
    { id: "prj-1", name: "Enterprise Cloud Migration", client: "Acme Corp", resourceCount: 45, contribution: 14.1, status: "active" },
    { id: "prj-2", name: "Digital Banking Platform", client: "First National Bank", resourceCount: 38, contribution: 11.9, status: "active" },
    { id: "prj-3", name: "E-commerce Modernization", client: "RetailMax", resourceCount: 32, contribution: 10.0, status: "active" },
    { id: "prj-4", name: "AI Analytics Suite", client: "DataDrive Inc", resourceCount: 28, contribution: 8.8, status: "ramping-up" },
    { id: "prj-5", name: "Supply Chain Optimization", client: "LogiCorp", resourceCount: 25, contribution: 7.8, status: "active" },
    { id: "prj-6", name: "Healthcare Portal", client: "MedTech Solutions", resourceCount: 22, contribution: 6.9, status: "ending-soon" },
    { id: "prj-7", name: "Insurance Claims System", client: "SafeGuard Insurance", resourceCount: 20, contribution: 6.3, status: "active" },
    { id: "prj-8", name: "CRM Implementation", client: "SalesForce Partners", resourceCount: 18, contribution: 5.6, status: "active" },
    { id: "prj-9", name: "Mobile App Development", client: "TechStart", resourceCount: 15, contribution: 4.7, status: "ramping-up" },
    { id: "prj-10", name: "Infrastructure Audit", client: "SecureNet", resourceCount: 12, contribution: 3.8, status: "ending-soon" },
  ],
  nyc: [
    { id: "prj-nyc-1", name: "Enterprise Cloud Migration", client: "Acme Corp", resourceCount: 25, contribution: 22.7, status: "active" },
    { id: "prj-nyc-2", name: "Digital Banking Platform", client: "First National Bank", resourceCount: 22, contribution: 20.0, status: "active" },
    { id: "prj-nyc-3", name: "Insurance Claims System", client: "SafeGuard Insurance", resourceCount: 18, contribution: 16.4, status: "active" },
    { id: "prj-nyc-4", name: "CRM Implementation", client: "SalesForce Partners", resourceCount: 15, contribution: 13.6, status: "ramping-up" },
    { id: "prj-nyc-5", name: "Infrastructure Audit", client: "SecureNet", resourceCount: 10, contribution: 9.1, status: "ending-soon" },
  ],
  sf: [
    { id: "prj-sf-1", name: "AI Analytics Suite", client: "DataDrive Inc", resourceCount: 22, contribution: 25.0, status: "ramping-up" },
    { id: "prj-sf-2", name: "E-commerce Modernization", client: "RetailMax", resourceCount: 20, contribution: 22.7, status: "active" },
    { id: "prj-sf-3", name: "Mobile App Development", client: "TechStart", resourceCount: 18, contribution: 20.5, status: "active" },
    { id: "prj-sf-4", name: "Cloud Security Audit", client: "CyberShield", resourceCount: 15, contribution: 17.0, status: "active" },
    { id: "prj-sf-5", name: "DevOps Transformation", client: "FastDeploy", resourceCount: 13, contribution: 14.8, status: "ending-soon" },
  ],
  london: [
    { id: "prj-lon-1", name: "Digital Banking Platform", client: "First National Bank", resourceCount: 18, contribution: 25.0, status: "active" },
    { id: "prj-lon-2", name: "Supply Chain Optimization", client: "LogiCorp", resourceCount: 16, contribution: 22.2, status: "active" },
    { id: "prj-lon-3", name: "Healthcare Portal", client: "MedTech Solutions", resourceCount: 14, contribution: 19.4, status: "ending-soon" },
    { id: "prj-lon-4", name: "Regulatory Compliance", client: "FinanceFirst", resourceCount: 12, contribution: 16.7, status: "active" },
    { id: "prj-lon-5", name: "Data Warehouse Migration", client: "InfoBank", resourceCount: 12, contribution: 16.7, status: "ramping-up" },
  ],
  singapore: [
    { id: "prj-sg-1", name: "E-commerce Modernization", client: "RetailMax Asia", resourceCount: 15, contribution: 30.0, status: "active" },
    { id: "prj-sg-2", name: "Mobile Payment Platform", client: "PayQuick", resourceCount: 12, contribution: 24.0, status: "active" },
    { id: "prj-sg-3", name: "Logistics Dashboard", client: "ShipFast", resourceCount: 10, contribution: 20.0, status: "ramping-up" },
    { id: "prj-sg-4", name: "Customer Analytics", client: "InsightCo", resourceCount: 8, contribution: 16.0, status: "active" },
    { id: "prj-sg-5", name: "API Integration", client: "ConnectHub", resourceCount: 5, contribution: 10.0, status: "ending-soon" },
  ],
};

export const generateForecastData = (months: number, locationId: string): ForecastData[] => {
  const location = locations.find(l => l.id === locationId) || locations[0];
  const baseData: ForecastData[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();

  for (let i = 0; i < months; i++) {
    const monthIndex = (currentMonth + i) % 12;
    const variance = (Math.random() - 0.5) * 10;
    
    const billableRate = Math.min(95, Math.max(65, (location.billable / location.totalResources) * 100 + variance));
    const internalRate = Math.min(20, Math.max(5, (location.internal / location.totalResources) * 100 + (Math.random() - 0.5) * 5));
    const benchRate = 100 - billableRate - internalRate;

    baseData.push({
      month: monthNames[monthIndex],
      billable: Math.round(billableRate * 10) / 10,
      internal: Math.round(internalRate * 10) / 10,
      bench: Math.round(benchRate * 10) / 10,
    });
  }

  return baseData;
};

export const getHealthStatus = (billableRate: number, totalUtilization: number): {
  status: 'healthy' | 'warning' | 'critical';
  message: string;
} => {
  if (billableRate >= 80 && totalUtilization >= 90) {
    return { status: 'healthy', message: 'All metrics within target' };
  } else if (billableRate >= 70 && totalUtilization >= 80) {
    return { status: 'warning', message: 'Utilization below optimal levels' };
  } else {
    return { status: 'critical', message: 'Immediate attention required' };
  }
};

export interface ProjectResource {
  id: string;
  name: string;
  role: string;
  grade: string;
  hoursPerWeek: number;
  startDate: string;
  endDate: string;
}

const roles = ['Developer', 'Senior Developer', 'Tech Lead', 'Architect', 'Project Manager', 'Business Analyst', 'QA Engineer', 'DevOps Engineer', 'Designer'];
const grades = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harper', 'Jamie', 'Kendall', 'Logan', 'Micah', 'Peyton'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Lee', 'Chen', 'Wang', 'Kim', 'Patel', 'Singh', 'Anderson', 'Taylor', 'Thomas', 'Moore'];

const generateResourcesForProject = (projectId: string, count: number): ProjectResource[] => {
  const resources: ProjectResource[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    resources.push({
      id: `${projectId}-res-${i + 1}`,
      name: `${firstName} ${lastName}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      grade: grades[Math.floor(Math.random() * grades.length)],
      hoursPerWeek: [20, 24, 32, 36, 40][Math.floor(Math.random() * 5)],
      startDate: '2024-01-15',
      endDate: '2025-06-30',
    });
  }
  return resources;
};

export const getProjectResources = (projectId: string): ProjectResource[] => {
  const allProjects = Object.values(billableProjectsByLocation).flat();
  const project = allProjects.find(p => p.id === projectId);
  if (!project) return [];
  return generateResourcesForProject(projectId, project.resourceCount);
};

export const getProjectById = (projectId: string): BillableProject | undefined => {
  const allProjects = Object.values(billableProjectsByLocation).flat();
  return allProjects.find(p => p.id === projectId);
};

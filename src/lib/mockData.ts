export interface LocationData {
  id: string;
  name: string;
  totalResources: number;
  billable: number;
  internal: number;
  bench: number;
}

export interface ForecastData {
  week: string;
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
  const weeksCount = months * 4; // ~4 weeks per month
  const currentDate = new Date();
  
  // Align to Monday
  currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);

  for (let i = 0; i < weeksCount; i++) {
    const weekDate = new Date(currentDate);
    weekDate.setDate(weekDate.getDate() + i * 7);
    
    // Seed-based variance for consistency
    const seed = weekDate.getDate() + weekDate.getMonth() * 31;
    const variance = ((seed % 20) - 10) / 2;
    
    const billableRate = Math.min(95, Math.max(65, (location.billable / location.totalResources) * 100 + variance));
    const internalRate = Math.min(20, Math.max(5, (location.internal / location.totalResources) * 100 + ((seed % 10) - 5) / 2));
    const benchRate = 100 - billableRate - internalRate;

    const weekLabel = `${weekDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    baseData.push({
      week: weekLabel,
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

export interface ResourceExperience {
  projectName: string;
  client: string;
  role: string;
  startDate: string;
  endDate: string;
  duration: string;
}

export interface ResourceAllocation {
  projectId: string;
  projectName: string;
  client: string;
  hoursPerWeek: number;
  allocation: number;
}

export interface WeeklyBooking {
  weekStart: string;
  weekEnd: string;
  projects: {
    projectId: string;
    projectName: string;
    client: string;
    hours: number;
  }[];
  totalHours: number;
}

export interface PeriodBookingData {
  weeks: WeeklyBooking[];
  totalHours: number;
  projectSummary: {
    projectId: string;
    projectName: string;
    client: string;
    totalHours: number;
    percentage: number;
  }[];
}

export interface ResourceDetail {
  id: string;
  name: string;
  email: string;
  role: string;
  grade: string;
  department: string;
  location: string;
  joinDate: string;
  skills: string[];
  certifications: string[];
  experience: ResourceExperience[];
  currentAllocations: ResourceAllocation[];
  totalAllocatedHours: number;
  availableHours: number;
}

const roles = ['Developer', 'Senior Developer', 'Tech Lead', 'Architect', 'Project Manager', 'Business Analyst', 'QA Engineer', 'DevOps Engineer', 'Designer'];
const grades = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];
const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Quinn', 'Avery', 'Parker', 'Blake', 'Cameron', 'Drew', 'Emery', 'Finley', 'Harper', 'Jamie', 'Kendall', 'Logan', 'Micah', 'Peyton'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Lee', 'Chen', 'Wang', 'Kim', 'Patel', 'Singh', 'Anderson', 'Taylor', 'Thomas', 'Moore'];

const skillSets: Record<string, string[]> = {
  Developer: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'Git'],
  'Senior Developer': ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  'Tech Lead': ['System Design', 'Architecture', 'Team Leadership', 'Agile', 'React', 'Node.js', 'AWS', 'Microservices'],
  Architect: ['Enterprise Architecture', 'Cloud Architecture', 'AWS', 'Azure', 'System Design', 'Security', 'Scalability'],
  'Project Manager': ['Project Planning', 'Agile/Scrum', 'Stakeholder Management', 'Risk Management', 'Jira', 'MS Project'],
  'Business Analyst': ['Requirements Analysis', 'Data Analysis', 'SQL', 'Tableau', 'Process Mapping', 'User Stories'],
  'QA Engineer': ['Test Automation', 'Selenium', 'Jest', 'Cypress', 'API Testing', 'Performance Testing'],
  'DevOps Engineer': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions', 'Linux'],
  Designer: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping', 'User Research', 'Adobe Creative Suite'],
};

const certifications: string[] = ['AWS Solutions Architect', 'AWS Developer Associate', 'Google Cloud Professional', 'PMP', 'Scrum Master', 'Azure Administrator', 'Kubernetes Administrator', 'TOGAF'];

const pastClients = ['GlobalTech', 'FinanceFirst', 'HealthPlus', 'RetailGiant', 'TechStartup', 'MediaCorp', 'EnergyOne', 'AutoDrive'];

// Cache resources by project to maintain consistency
const resourceCache: Map<string, ProjectResource[]> = new Map();

const generateResourcesForProject = (projectId: string, count: number): ProjectResource[] => {
  if (resourceCache.has(projectId)) {
    return resourceCache.get(projectId)!;
  }
  
  const resources: ProjectResource[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[(i * 7 + projectId.charCodeAt(0)) % firstNames.length];
    const lastName = lastNames[(i * 11 + projectId.charCodeAt(1)) % lastNames.length];
    resources.push({
      id: `${projectId}-res-${i + 1}`,
      name: `${firstName} ${lastName}`,
      role: roles[(i + projectId.charCodeAt(0)) % roles.length],
      grade: grades[(i + projectId.charCodeAt(2)) % grades.length],
      hoursPerWeek: [20, 24, 32, 36, 40][(i + projectId.charCodeAt(0)) % 5],
      startDate: '2024-01-15',
      endDate: '2025-06-30',
    });
  }
  
  resourceCache.set(projectId, resources);
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

export const getResourceDetail = (resourceId: string): ResourceDetail | null => {
  // Find the resource from any project
  const allProjects = Object.values(billableProjectsByLocation).flat();
  
  for (const project of allProjects) {
    const resources = getProjectResources(project.id);
    const resource = resources.find(r => r.id === resourceId);
    
    if (resource) {
      const roleSkills = skillSets[resource.role] || skillSets['Developer'];
      const randomCerts = certifications.filter((_, i) => (i + resourceId.charCodeAt(0)) % 3 === 0).slice(0, 2);
      
      // Generate experience history
      const experience: ResourceExperience[] = [];
      const numExperiences = 2 + (resourceId.charCodeAt(0) % 3);
      for (let i = 0; i < numExperiences; i++) {
        const client = pastClients[(i + resourceId.charCodeAt(0)) % pastClients.length];
        experience.push({
          projectName: `${client} ${['Platform', 'Migration', 'Transformation', 'Integration'][i % 4]}`,
          client,
          role: roles[(i + resourceId.charCodeAt(1)) % roles.length],
          startDate: `202${2 - i}-0${1 + i * 3}-01`,
          endDate: i === 0 ? '2023-12-31' : `202${3 - i}-0${6 + i * 2}-30`,
          duration: `${6 + i * 3} months`,
        });
      }
      
      // Current allocations (can be on multiple projects)
      const currentAllocations: ResourceAllocation[] = [{
        projectId: project.id,
        projectName: project.name,
        client: project.client,
        hoursPerWeek: resource.hoursPerWeek,
        allocation: Math.round((resource.hoursPerWeek / 40) * 100),
      }];
      
      // Add secondary project allocation for some resources
      if (resource.hoursPerWeek < 40 && resourceId.charCodeAt(0) % 2 === 0) {
        const otherProject = allProjects.find(p => p.id !== project.id);
        if (otherProject) {
          currentAllocations.push({
            projectId: otherProject.id,
            projectName: otherProject.name,
            client: otherProject.client,
            hoursPerWeek: 40 - resource.hoursPerWeek,
            allocation: Math.round(((40 - resource.hoursPerWeek) / 40) * 100),
          });
        }
      }
      
      const totalAllocated = currentAllocations.reduce((sum, a) => sum + a.hoursPerWeek, 0);
      
      return {
        id: resource.id,
        name: resource.name,
        email: `${resource.name.toLowerCase().replace(' ', '.')}@company.com`,
        role: resource.role,
        grade: resource.grade,
        department: ['Engineering', 'Product', 'Design', 'Operations'][(resourceId.charCodeAt(0)) % 4],
        location: locations[(resourceId.charCodeAt(0)) % locations.length].name,
        joinDate: `202${resourceId.charCodeAt(0) % 4}-0${1 + (resourceId.charCodeAt(1) % 9)}-15`,
        skills: roleSkills,
        certifications: randomCerts,
        experience,
        currentAllocations,
        totalAllocatedHours: totalAllocated,
        availableHours: Math.max(0, 40 - totalAllocated),
      };
    }
  }
  
  return null;
};

export const getResourceBookings = (
  resourceId: string,
  startDate: Date,
  endDate: Date
): PeriodBookingData | null => {
  const resource = getResourceDetail(resourceId);
  if (!resource) return null;

  const weeks: WeeklyBooking[] = [];
  const projectHoursMap: Map<string, { projectName: string; client: string; hours: number }> = new Map();
  
  let currentDate = new Date(startDate);
  // Align to Monday
  currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1);
  
  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 4); // Friday
    
    const weekProjects = resource.currentAllocations.map((allocation) => {
      // Add some variance to weekly hours
      const variance = (resourceId.charCodeAt(0) + currentDate.getDate()) % 5 - 2;
      const hours = Math.max(0, allocation.hoursPerWeek + variance);
      
      // Accumulate for summary
      const existing = projectHoursMap.get(allocation.projectId);
      if (existing) {
        existing.hours += hours;
      } else {
        projectHoursMap.set(allocation.projectId, {
          projectName: allocation.projectName,
          client: allocation.client,
          hours,
        });
      }
      
      return {
        projectId: allocation.projectId,
        projectName: allocation.projectName,
        client: allocation.client,
        hours,
      };
    });
    
    weeks.push({
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      projects: weekProjects,
      totalHours: weekProjects.reduce((sum, p) => sum + p.hours, 0),
    });
    
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  const totalHours = weeks.reduce((sum, w) => sum + w.totalHours, 0);
  const projectSummary = Array.from(projectHoursMap.entries()).map(([projectId, data]) => ({
    projectId,
    projectName: data.projectName,
    client: data.client,
    totalHours: data.hours,
    percentage: totalHours > 0 ? Math.round((data.hours / totalHours) * 100) : 0,
  }));
  
  return { weeks, totalHours, projectSummary };
};

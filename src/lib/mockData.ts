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

export const locations: LocationData[] = [
  { id: "all", name: "All Locations", totalResources: 450, billable: 320, internal: 85, bench: 45 },
  { id: "nyc", name: "New York", totalResources: 150, billable: 110, internal: 25, bench: 15 },
  { id: "sf", name: "San Francisco", totalResources: 120, billable: 88, internal: 22, bench: 10 },
  { id: "london", name: "London", totalResources: 100, billable: 72, internal: 20, bench: 8 },
  { id: "singapore", name: "Singapore", totalResources: 80, billable: 50, internal: 18, bench: 12 },
];

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

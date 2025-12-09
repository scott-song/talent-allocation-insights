import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from "recharts";
import { ForecastData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ForecastChartProps {
  data: ForecastData[];
  className?: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const totalUtilization = payload[0].value + payload[1].value;
    return (
      <div className="glass-card rounded-lg p-4 shadow-xl border border-border">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}:</span>
              <span className="text-sm font-medium text-foreground">{entry.value.toFixed(1)}%</span>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Utilized:</span>
              <span className={cn(
                "text-sm font-semibold",
                totalUtilization >= 90 ? "text-success" : "text-warning"
              )}>
                {totalUtilization.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ForecastChart = ({ data, className }: ForecastChartProps) => {
  return (
    <div className={cn("glass-card rounded-lg p-6 animate-slide-up", className)} style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Utilization Forecast</h3>
          <p className="text-sm text-muted-foreground">Projected resource allocation trends</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="billableGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(174, 62%, 47%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="internalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(220, 70%, 55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 20%)" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 12 }}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => <span className="text-muted-foreground text-sm">{value}</span>}
            />
            <ReferenceLine 
              y={80} 
              stroke="hsl(38, 92%, 50%)" 
              strokeDasharray="5 5" 
              label={{ value: "80% Billable Target", position: "right", fill: "hsl(38, 92%, 50%)", fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="billable"
              name="Billable"
              stackId="1"
              stroke="hsl(174, 62%, 47%)"
              strokeWidth={2}
              fill="url(#billableGradient)"
            />
            <Area
              type="monotone"
              dataKey="internal"
              name="Internal"
              stackId="1"
              stroke="hsl(220, 70%, 55%)"
              strokeWidth={2}
              fill="url(#internalGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;

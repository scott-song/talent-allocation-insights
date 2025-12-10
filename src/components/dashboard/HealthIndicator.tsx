import { cn } from "@/lib/utils";
import { Gauge, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { getHealthStatus } from "@/lib/mockData";

interface HealthIndicatorProps {
  billableRate: number;
  totalUtilization: number;
  className?: string;
}

interface MeterGaugeProps {
  value: number;
  target: number;
  label: string;
  isMet: boolean;
}

const MeterGauge = ({ value, target, label, isMet }: MeterGaugeProps) => {
  const percentage = Math.min(value, 100);
  const rotation = (percentage / 100) * 180 - 90;
  
  return (
    <div className="relative flex flex-col items-center">
      {/* Gauge Container */}
      <div className="relative w-32 h-16 overflow-hidden">
        {/* Background Arc */}
        <div className="absolute inset-0 rounded-t-full border-8 border-b-0 border-muted/30" />
        
        {/* Colored Arc Segments */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 rounded-t-full border-8 border-b-0 border-transparent"
            style={{
              borderTopColor: 'hsl(var(--destructive))',
              borderLeftColor: 'hsl(var(--destructive))',
              clipPath: 'polygon(0 100%, 0 0, 35% 0, 35% 100%)'
            }}
          />
          <div 
            className="absolute inset-0 rounded-t-full border-8 border-b-0 border-transparent"
            style={{
              borderTopColor: 'hsl(var(--warning))',
              clipPath: 'polygon(35% 100%, 35% 0, 65% 0, 65% 100%)'
            }}
          />
          <div 
            className="absolute inset-0 rounded-t-full border-8 border-b-0 border-transparent"
            style={{
              borderTopColor: 'hsl(var(--success))',
              borderRightColor: 'hsl(var(--success))',
              clipPath: 'polygon(65% 100%, 65% 0, 100% 0, 100% 100%)'
            }}
          />
        </div>
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-14 origin-bottom transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className={cn(
            "w-full h-full rounded-full",
            isMet ? "bg-success shadow-[0_0_10px_hsl(var(--success))]" : "bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]"
          )} />
          <div className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full",
            isMet ? "bg-success" : "bg-destructive"
          )} />
        </div>
      </div>
      
      {/* Value Display */}
      <div className="mt-2 text-center">
        <p className={cn(
          "text-2xl font-bold tracking-tight",
          isMet ? "text-success" : "text-destructive"
        )}>
          {value.toFixed(1)}%
        </p>
        <p className="text-xs font-medium text-foreground/80">{label}</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          {isMet ? (
            <TrendingUp className="h-3 w-3 text-success" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span className="text-[10px] text-muted-foreground">Target: ≥{target}%</span>
        </div>
      </div>
    </div>
  );
};

const HealthIndicator = ({ billableRate, totalUtilization, className }: HealthIndicatorProps) => {
  const { status, message } = getHealthStatus(billableRate, totalUtilization);

  const statusConfig = {
    healthy: {
      gradient: "from-success/20 via-success/5 to-transparent",
      borderGlow: "shadow-[0_0_30px_-5px_hsl(var(--success)/0.4)]",
      iconBg: "bg-success/20",
      iconClass: "text-success",
      textClass: "text-success",
      label: "Optimal Performance",
    },
    warning: {
      gradient: "from-warning/20 via-warning/5 to-transparent",
      borderGlow: "shadow-[0_0_30px_-5px_hsl(var(--warning)/0.4)]",
      iconBg: "bg-warning/20",
      iconClass: "text-warning",
      textClass: "text-warning",
      label: "Attention Required",
    },
    critical: {
      gradient: "from-destructive/20 via-destructive/5 to-transparent",
      borderGlow: "shadow-[0_0_30px_-5px_hsl(var(--destructive)/0.4)]",
      iconBg: "bg-destructive/20",
      iconClass: "text-destructive",
      textClass: "text-destructive",
      label: "Critical Alert",
    },
  };

  const config = statusConfig[status];
  const billableHealthy = billableRate >= 80;
  const utilizationHealthy = totalUtilization >= 90;

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/50 p-6 animate-slide-up overflow-hidden",
        config.borderGlow,
        className
      )}
      style={{ animationDelay: "300ms" }}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        config.gradient
      )} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-lg",
              config.iconBg
            )}>
              <Gauge className={cn("h-5 w-5", config.iconClass)} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Zap className={cn("h-4 w-4", config.iconClass)} />
                <span className={cn("font-bold text-lg", config.textClass)}>{config.label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
          
          {/* Status Pill */}
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider",
            status === "healthy" && "bg-success/20 text-success border border-success/30",
            status === "warning" && "bg-warning/20 text-warning border border-warning/30",
            status === "critical" && "bg-destructive/20 text-destructive border border-destructive/30 animate-pulse"
          )}>
            {status}
          </div>
        </div>
        
        {/* Gauges */}
        <div className="flex items-center justify-center gap-12">
          <MeterGauge
            value={billableRate}
            target={80}
            label="Billable Rate"
            isMet={billableHealthy}
          />
          <div className="h-24 w-px bg-border/50" />
          <MeterGauge
            value={totalUtilization}
            target={90}
            label="Utilization"
            isMet={utilizationHealthy}
          />
        </div>
      </div>
    </div>
  );
};

export default HealthIndicator;

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { getHealthStatus } from "@/lib/mockData";

interface HealthIndicatorProps {
  billableRate: number;
  totalUtilization: number;
  className?: string;
}

const HealthIndicator = ({ billableRate, totalUtilization, className }: HealthIndicatorProps) => {
  const { status, message } = getHealthStatus(billableRate, totalUtilization);

  const statusConfig = {
    healthy: {
      icon: CheckCircle,
      bgClass: "bg-success/10 border-success/30",
      iconClass: "text-success",
      textClass: "text-success",
      label: "Healthy",
    },
    warning: {
      icon: AlertTriangle,
      bgClass: "bg-warning/10 border-warning/30",
      iconClass: "text-warning",
      textClass: "text-warning",
      label: "Warning",
    },
    critical: {
      icon: AlertCircle,
      bgClass: "bg-destructive/10 border-destructive/30",
      iconClass: "text-destructive",
      textClass: "text-destructive",
      label: "Critical",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "rounded-lg border p-4 animate-slide-up transition-all duration-300",
        config.bgClass,
        status === "critical" && "animate-pulse-glow",
        className
      )}
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex items-center gap-3">
        <Icon className={cn("h-6 w-6", config.iconClass)} />
        <div>
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold", config.textClass)}>{config.label}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{message}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-center p-2 rounded bg-background/50">
          <p className="text-xs text-muted-foreground">Billable</p>
          <p className={cn(
            "text-xl font-bold",
            billableRate >= 80 ? "text-success" : "text-destructive"
          )}>
            {billableRate.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Target: ≥80%</p>
        </div>
        <div className="text-center p-2 rounded bg-background/50">
          <p className="text-xs text-muted-foreground">Utilization</p>
          <p className={cn(
            "text-xl font-bold",
            totalUtilization >= 90 ? "text-success" : "text-destructive"
          )}>
            {totalUtilization.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Target: ≥90%</p>
        </div>
      </div>
    </div>
  );
};

export default HealthIndicator;

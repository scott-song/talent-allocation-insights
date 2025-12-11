import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: number;
  type?: "billable" | "internal" | "bench" | "default";
  className?: string;
  delay?: number;
  onClick?: () => void;
}

const MetricCard = ({ title, value, subtitle, trend, type = "default", className, delay = 0, onClick }: MetricCardProps) => {
  const typeStyles = {
    billable: "border-l-4 border-l-primary",
    internal: "border-l-4 border-l-chart-internal",
    bench: "border-l-4 border-l-chart-bench",
    default: "",
  };

  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div
      className={cn(
        "glass-card rounded-lg p-6 animate-slide-up group",
        typeStyles[type],
        onClick && "cursor-pointer hover:bg-secondary/50 transition-colors",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-bold mt-2 text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {trend !== undefined && (
            <div className="flex items-center gap-1 text-sm">
              {getTrendIcon()}
              <span className={cn(
                trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
              )}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
          {onClick && (
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;

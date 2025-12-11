import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface UtilizationGaugeProps {
  billable: number;
  internal: number;
  bench: number;
  locationId?: string;
  className?: string;
}

const UtilizationGauge = ({ billable, internal, bench, locationId = "all", className }: UtilizationGaugeProps) => {
  const navigate = useNavigate();
  const totalUtilization = billable + internal;
  const billableHealthy = billable >= 80;
  const utilizationHealthy = totalUtilization >= 90;

  const handleBillableClick = () => {
    navigate(`/location/${locationId}/billable`);
  };

  const handleBenchClick = () => {
    navigate(`/location/${locationId}/available`);
  };

  return (
    <div className={cn("glass-card rounded-lg p-6 animate-slide-up", className)} style={{ animationDelay: "100ms" }}>
      <h3 className="text-lg font-semibold text-foreground mb-6">Utilization Breakdown</h3>
      
      <TooltipProvider>
        <div className="relative h-8 bg-secondary rounded-full mb-6 overflow-visible">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={handleBillableClick}
                className="absolute left-0 top-0 h-full bg-primary rounded-l-full transition-all duration-200 ease-out cursor-pointer hover:brightness-110 hover:scale-y-125 origin-center z-10 hover:z-20"
                style={{ width: `${billable}%` }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view billable projects</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="absolute top-0 h-full bg-chart-internal transition-all duration-200 ease-out hover:brightness-110 hover:scale-y-125 origin-center z-10 hover:z-20"
                style={{ left: `${billable}%`, width: `${internal}%` }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Internal projects</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={handleBenchClick}
                className="absolute top-0 h-full bg-chart-bench rounded-r-full transition-all duration-200 ease-out cursor-pointer hover:brightness-110 hover:scale-y-125 origin-center z-10 hover:z-20"
                style={{ left: `${billable + internal}%`, width: `${bench}%` }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to view available resources</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div 
          onClick={handleBillableClick}
          className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Billable</p>
            <p className="text-lg font-semibold text-foreground">{billable.toFixed(1)}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-internal" />
          <div>
            <p className="text-xs text-muted-foreground">Internal</p>
            <p className="text-lg font-semibold text-foreground">{internal.toFixed(1)}%</p>
          </div>
        </div>
        <div 
          onClick={handleBenchClick}
          className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 rounded-lg p-2 -m-2 transition-colors"
        >
          <div className="w-3 h-3 rounded-full bg-chart-bench" />
          <div>
            <p className="text-xs text-muted-foreground">Bench</p>
            <p className="text-lg font-semibold text-foreground">{bench.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Billable Rate Target (≥80%)</span>
          <span className={cn(
            "text-sm font-medium px-2 py-0.5 rounded",
            billableHealthy ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            {billableHealthy ? "On Track" : "Below Target"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Utilization Target (≥90%)</span>
          <span className={cn(
            "text-sm font-medium px-2 py-0.5 rounded",
            utilizationHealthy ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
          )}>
            {utilizationHealthy ? "On Track" : "Below Target"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UtilizationGauge;

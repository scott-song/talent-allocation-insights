import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Briefcase, TrendingUp, Clock, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { locations, billableProjectsByLocation } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const BillableProjects = () => {
  const { locationId } = useParams<{ locationId: string }>();

  const location = useMemo(
    () => locations.find((l) => l.id === locationId) || locations[0],
    [locationId]
  );

  const projects = useMemo(
    () => billableProjectsByLocation[locationId || "all"] || billableProjectsByLocation.all,
    [locationId]
  );

  const billableRate = (location.billable / location.totalResources) * 100;
  const backUrl = locationId && locationId !== "all" ? `/location/${locationId}` : "/";

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Active', icon: TrendingUp, className: 'bg-success/20 text-success' };
      case 'ending-soon':
        return { label: 'Ending Soon', icon: Clock, className: 'bg-warning/20 text-warning' };
      case 'ramping-up':
        return { label: 'Ramping Up', icon: Rocket, className: 'bg-primary/20 text-primary' };
      default:
        return { label: 'Active', icon: TrendingUp, className: 'bg-success/20 text-success' };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <Button asChild variant="ghost" className="mb-4 -ml-3">
            <Link to={backUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {locationId && locationId !== "all" ? location.name : "Dashboard"}
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                Billable Projects
              </h1>
              <p className="text-muted-foreground mt-2">
                {location.name} • {location.billable} resources on billable projects
              </p>
            </div>
            <div className="glass-card rounded-lg px-6 py-4">
              <p className="text-sm text-muted-foreground">Total Billable Rate</p>
              <p className={cn(
                "text-3xl font-bold",
                billableRate >= 80 ? "text-success" : billableRate >= 70 ? "text-warning" : "text-destructive"
              )}>
                {billableRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-foreground">{projects.length}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-success/30" style={{ animationDelay: "50ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-3xl font-bold text-success">
              {projects.filter(p => p.status === 'active').length}
            </p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-primary/30" style={{ animationDelay: "100ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Ramping Up</p>
            <p className="text-3xl font-bold text-primary">
              {projects.filter(p => p.status === 'ramping-up').length}
            </p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-warning/30" style={{ animationDelay: "150ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Ending Soon</p>
            <p className="text-3xl font-bold text-warning">
              {projects.filter(p => p.status === 'ending-soon').length}
            </p>
          </div>
        </div>

        {/* Projects Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Project Breakdown</h3>
          {projects.map((project, index) => {
            const statusConfig = getStatusConfig(project.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Link
                key={project.id}
                to={`/location/${locationId}/project/${project.id}`}
                className="glass-card rounded-lg p-6 animate-slide-up hover:bg-secondary/30 transition-colors block cursor-pointer group"
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium shrink-0",
                        statusConfig.className
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Client: <span className="text-foreground">{project.client}</span>
                    </p>
                  </div>

                  {/* Resources */}
                  <div className="lg:w-32 shrink-0">
                    <p className="text-sm text-muted-foreground">Resources</p>
                    <p className="text-xl font-semibold text-foreground">{project.resourceCount}</p>
                  </div>

                  {/* Contribution */}
                  <div className="lg:w-64 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Contribution</p>
                      <p className="text-sm font-semibold text-primary">{project.contribution.toFixed(1)}%</p>
                    </div>
                    <Progress 
                      value={project.contribution} 
                      className="h-2 bg-secondary"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BillableProjects;

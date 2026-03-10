import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Filter, TrendingUp, Clock, Rocket, Calendar, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { locations, billableProjectsByLocation, BillableProject } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import AppLayout from "@/components/AppLayout";

const AllProjects = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);

  // Gather all unique projects (use "all" location to avoid duplicates)
  const allProjects = useMemo(() => {
    return billableProjectsByLocation["all"] || [];
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [allProjects, statusFilter]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Active", icon: TrendingUp, className: "bg-success/20 text-success" };
      case "ending-soon":
        return { label: "Ending Soon", icon: Clock, className: "bg-warning/20 text-warning" };
      case "ramping-up":
        return { label: "Ramping Up", icon: Rocket, className: "bg-primary/20 text-primary" };
      default:
        return { label: "Active", icon: TrendingUp, className: "bg-success/20 text-success" };
    }
  };

  const statusCounts = useMemo(() => {
    const counts = { active: 0, "ending-soon": 0, "ramping-up": 0 };
    allProjects.forEach((p) => {
      counts[p.status as keyof typeof counts]++;
    });
    return counts;
  }, [allProjects]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Briefcase className="h-6 w-6 text-primary-foreground" />
                </div>
                All Projects
              </h1>
              <p className="text-muted-foreground mt-2">
                Company-wide project portfolio overview
              </p>
            </div>
            <Button onClick={() => setCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
            <p className="text-3xl font-bold text-foreground">{allProjects.length}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-success/30" style={{ animationDelay: "50ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-3xl font-bold text-success">{statusCounts.active}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-primary/30" style={{ animationDelay: "100ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Ramping Up</p>
            <p className="text-3xl font-bold text-primary">{statusCounts["ramping-up"]}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-warning/30" style={{ animationDelay: "150ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Ending Soon</p>
            <p className="text-3xl font-bold text-warning">{statusCounts["ending-soon"]}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-lg p-4 mb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filters:</span>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-8 text-sm bg-secondary/50 border-border/50">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="ramping-up">Ramping Up</SelectItem>
                <SelectItem value="ending-soon">Ending Soon</SelectItem>
              </SelectContent>
            </Select>
            {statusFilter !== "all" && (
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setStatusFilter("all")}>
                Clear filters
              </Button>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {filteredProjects.length} of {allProjects.length} projects
            </span>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.map((project, index) => {
            const statusConfig = getStatusConfig(project.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/location/all/project/${project.id}`)}
                className="glass-card rounded-lg p-6 animate-slide-up hover:bg-secondary/30 transition-colors cursor-pointer group"
                style={{ animationDelay: `${250 + index * 50}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium shrink-0", statusConfig.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Client: <span className="text-foreground">{project.client}</span>
                    </p>
                  </div>

                  <div className="lg:w-48 shrink-0">
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3" />
                      Timeline
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {format(new Date(project.startDate), "MMM d, yyyy")} – {format(new Date(project.endDate), "MMM d, yyyy")}
                    </p>
                  </div>

                  <div className="lg:w-24 shrink-0">
                    <p className="text-sm text-muted-foreground">Resources</p>
                    <p className="text-xl font-semibold text-foreground">{project.resourceCount}</p>
                  </div>

                  <div className="lg:w-48 shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Contribution</p>
                      <p className="text-sm font-semibold text-primary">{project.contribution.toFixed(1)}%</p>
                    </div>
                    <Progress value={project.contribution} className="h-2 bg-secondary" />
                  </div>

                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Project Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Add a new project to the portfolio.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input id="project-name" placeholder="Enter project name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-name">Client</Label>
              <Input id="client-name" placeholder="Enter client name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setCreateOpen(false)}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default AllProjects;

import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Clock, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProjectById, getProjectResources, locations } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const ResourcePlanning = () => {
  const { locationId, projectId } = useParams<{ locationId: string; projectId: string }>();
  const [period, setPeriod] = useState("current");

  const project = useMemo(() => getProjectById(projectId || ""), [projectId]);
  const resources = useMemo(() => getProjectResources(projectId || ""), [projectId]);
  const location = useMemo(
    () => locations.find((l) => l.id === locationId) || locations[0],
    [locationId]
  );

  const backUrl = `/location/${locationId}/billable`;

  const totalHours = resources.reduce((sum, r) => sum + r.hoursPerWeek, 0);
  const avgHours = resources.length > 0 ? (totalHours / resources.length).toFixed(1) : 0;

  const gradeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach(r => {
      counts[r.grade] = (counts[r.grade] || 0) + 1;
    });
    return counts;
  }, [resources]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
          <Button asChild variant="outline">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <Button asChild variant="ghost" className="mb-4 -ml-3">
            <Link to={backUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Billable Projects
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                Resource Planning
              </h1>
              <p className="text-muted-foreground mt-2">
                {project.name} • {project.client}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-40 bg-secondary/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current Week</SelectItem>
                    <SelectItem value="next-week">Next Week</SelectItem>
                    <SelectItem value="next-month">Next Month</SelectItem>
                    <SelectItem value="next-quarter">Next Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
            <p className="text-3xl font-bold text-foreground">{resources.length}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-primary/30" style={{ animationDelay: "50ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Total Hours/Week</p>
            <p className="text-3xl font-bold text-primary">{totalHours}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-success/30" style={{ animationDelay: "100ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Avg Hours/Week</p>
            <p className="text-3xl font-bold text-success">{avgHours}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-warning/30" style={{ animationDelay: "150ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Contribution</p>
            <p className="text-3xl font-bold text-warning">{project.contribution.toFixed(1)}%</p>
          </div>
        </div>

        {/* Grade Breakdown */}
        <div className="glass-card rounded-lg p-5 mb-8 animate-slide-up" style={{ animationDelay: "200ms" }}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Grade Distribution</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(gradeBreakdown).map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
                <span className="text-sm text-foreground font-medium">{grade}</span>
                <span className="text-xs text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Table */}
        <div className="glass-card rounded-lg overflow-hidden animate-slide-up" style={{ animationDelay: "250ms" }}>
          <div className="p-4 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Resource Allocation</h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="h-4 w-4" />
              <span>{period === "current" ? "Current Week" : period === "next-week" ? "Next Week" : period === "next-month" ? "Next Month" : "Next Quarter"}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Resource Name</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Grade</TableHead>
                  <TableHead className="text-muted-foreground text-right">Hours/Week</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((resource, index) => (
                  <TableRow 
                    key={resource.id} 
                    className="border-border/50 hover:bg-secondary/30 animate-fade-in"
                    style={{ animationDelay: `${300 + index * 20}ms` }}
                  >
                    <TableCell className="font-medium text-foreground">{resource.name}</TableCell>
                    <TableCell className="text-muted-foreground">{resource.role}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        resource.grade === "Principal" || resource.grade === "Lead" 
                          ? "bg-primary/20 text-primary"
                          : resource.grade === "Senior" 
                            ? "bg-success/20 text-success"
                            : "bg-secondary text-muted-foreground"
                      )}>
                        {resource.grade}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-semibold",
                        resource.hoursPerWeek >= 40 ? "text-foreground" : "text-warning"
                      )}>
                        {resource.hoursPerWeek}h
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlanning;

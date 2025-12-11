import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Calendar, Clock, Filter, ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getProjectById, getProjectResources, locations } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type SortField = "name" | "role" | "grade" | "hoursPerWeek";
type SortDirection = "asc" | "desc";

const ResourcePlanning = () => {
  const { locationId, projectId } = useParams<{ locationId: string; projectId: string }>();
  const navigate = useNavigate();
  const [period, setPeriod] = useState("current");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [hoursFilter, setHoursFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const project = useMemo(() => getProjectById(projectId || ""), [projectId]);
  const resources = useMemo(() => getProjectResources(projectId || ""), [projectId]);
  const location = useMemo(
    () => locations.find((l) => l.id === locationId) || locations[0],
    [locationId]
  );

  const backUrl = `/location/${locationId}/billable`;

  // Get unique roles and grades for filters
  const uniqueRoles = useMemo(() => [...new Set(resources.map(r => r.role))].sort(), [resources]);
  const uniqueGrades = useMemo(() => [...new Set(resources.map(r => r.grade))].sort(), [resources]);

  // Filter and sort resources
  const filteredResources = useMemo(() => {
    let filtered = resources.filter(r => {
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      if (gradeFilter !== "all" && r.grade !== gradeFilter) return false;
      if (hoursFilter === "full" && r.hoursPerWeek < 40) return false;
      if (hoursFilter === "part" && r.hoursPerWeek >= 40) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * modifier;
      }
      return String(aVal).localeCompare(String(bVal)) * modifier;
    });

    return filtered;
  }, [resources, roleFilter, gradeFilter, hoursFilter, sortField, sortDirection]);

  const totalHours = filteredResources.reduce((sum, r) => sum + r.hoursPerWeek, 0);
  const avgHours = filteredResources.length > 0 ? (totalHours / filteredResources.length).toFixed(1) : 0;

  const gradeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach(r => {
      counts[r.grade] = (counts[r.grade] || 0) + 1;
    });
    return counts;
  }, [resources]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="h-3 w-3 ml-1 text-primary" /> 
      : <ArrowDown className="h-3 w-3 ml-1 text-primary" />;
  };

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
          <div className="p-4 border-b border-border/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-foreground">Resource Allocation</h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="h-4 w-4" />
                <span>{period === "current" ? "Current Week" : period === "next-week" ? "Next Week" : period === "next-month" ? "Next Month" : "Next Quarter"}</span>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-36 h-8 text-sm bg-secondary/50 border-border/50">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger className="w-36 h-8 text-sm bg-secondary/50 border-border/50">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {uniqueGrades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={hoursFilter} onValueChange={setHoursFilter}>
                <SelectTrigger className="w-36 h-8 text-sm bg-secondary/50 border-border/50">
                  <SelectValue placeholder="All Hours" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hours</SelectItem>
                  <SelectItem value="full">Full-time (40h+)</SelectItem>
                  <SelectItem value="part">Part-time (&lt;40h)</SelectItem>
                </SelectContent>
              </Select>
              {(roleFilter !== "all" || gradeFilter !== "all" || hoursFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => { setRoleFilter("all"); setGradeFilter("all"); setHoursFilter("all"); }}
                >
                  Clear filters
                </Button>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {filteredResources.length} of {resources.length} resources
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <span className="flex items-center">Resource Name <SortIcon field="name" /></span>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("role")}
                  >
                    <span className="flex items-center">Role <SortIcon field="role" /></span>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("grade")}
                  >
                    <span className="flex items-center">Grade <SortIcon field="grade" /></span>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground text-right cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("hoursPerWeek")}
                  >
                    <span className="flex items-center justify-end">Hours/Week <SortIcon field="hoursPerWeek" /></span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No resources match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResources.map((resource, index) => (
                    <TableRow 
                      key={resource.id} 
                      className="border-border/50 hover:bg-secondary/30 animate-fade-in cursor-pointer group"
                      style={{ animationDelay: `${300 + index * 20}ms` }}
                      onClick={() => navigate(`/location/${locationId}/project/${projectId}/resource/${resource.id}`)}
                    >
                      <TableCell className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {resource.name}
                      </TableCell>
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
                        <div className="flex items-center justify-end gap-2">
                          <span className={cn(
                            "font-semibold",
                            resource.hoursPerWeek >= 40 ? "text-foreground" : "text-warning"
                          )}>
                            {resource.hoursPerWeek}h
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcePlanning;

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Filter, ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { locations, getAllResources } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type SortField = "name" | "role" | "grade" | "location" | "status";
type SortDirection = "asc" | "desc";

const AllResources = () => {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const allResources = useMemo(() => getAllResources(), []);

  const uniqueRoles = useMemo(() => [...new Set(allResources.map(r => r.role))].sort(), [allResources]);
  const uniqueGrades = useMemo(() => [...new Set(allResources.map(r => r.grade))].sort(), [allResources]);

  const filteredResources = useMemo(() => {
    let filtered = allResources.filter(r => {
      if (roleFilter !== "all" && r.role !== roleFilter) return false;
      if (gradeFilter !== "all" && r.grade !== gradeFilter) return false;
      if (locationFilter !== "all" && r.location !== locationFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      return String(aVal).localeCompare(String(bVal)) * modifier;
    });

    return filtered;
  }, [allResources, roleFilter, gradeFilter, locationFilter, statusFilter, sortField, sortDirection]);

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

  const statusCounts = useMemo(() => {
    const counts = { billable: 0, internal: 0, bench: 0 };
    allResources.forEach(r => {
      counts[r.status as keyof typeof counts]++;
    });
    return counts;
  }, [allResources]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <Button asChild variant="ghost" className="mb-4 -ml-3">
            <a onClick={() => navigate(-1)} className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </a>
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                All Resources
              </h1>
              <p className="text-muted-foreground mt-2">
                Complete list of all company resources
              </p>
            </div>
          </div>
        </header>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Resources</p>
            <p className="text-3xl font-bold text-foreground">{allResources.length}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-primary/30" style={{ animationDelay: "50ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Billable</p>
            <p className="text-3xl font-bold text-primary">{statusCounts.billable}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-chart-internal/30" style={{ animationDelay: "100ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Internal</p>
            <p className="text-3xl font-bold text-chart-internal">{statusCounts.internal}</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-chart-bench/30" style={{ animationDelay: "150ms" }}>
            <p className="text-sm text-muted-foreground mb-1">On Bench</p>
            <p className="text-3xl font-bold text-chart-bench">{statusCounts.bench}</p>
          </div>
        </div>

        {/* Resource Table */}
        <div className="glass-card rounded-lg overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="p-4 border-b border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resource Directory</h3>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-36 h-8 text-sm bg-secondary/50 border-border/50">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.filter(l => l.id !== "all").map(loc => (
                    <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40 h-8 text-sm bg-secondary/50 border-border/50">
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
                <SelectTrigger className="w-32 h-8 text-sm bg-secondary/50 border-border/50">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {uniqueGrades.map(grade => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-8 text-sm bg-secondary/50 border-border/50">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="billable">Billable</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="bench">Bench</SelectItem>
                </SelectContent>
              </Select>
              {(roleFilter !== "all" || gradeFilter !== "all" || locationFilter !== "all" || statusFilter !== "all") && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={() => { setRoleFilter("all"); setGradeFilter("all"); setLocationFilter("all"); setStatusFilter("all"); }}
                >
                  Clear filters
                </Button>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                {filteredResources.length} of {allResources.length} resources
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
                    <span className="flex items-center">Name <SortIcon field="name" /></span>
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
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("location")}
                  >
                    <span className="flex items-center">Location <SortIcon field="location" /></span>
                  </TableHead>
                  <TableHead 
                    className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    <span className="flex items-center">Status <SortIcon field="status" /></span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No resources match the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResources.map((resource, index) => (
                    <TableRow 
                      key={resource.id} 
                      className="border-border/50 hover:bg-secondary/30 animate-fade-in cursor-pointer group"
                      style={{ animationDelay: `${250 + index * 10}ms` }}
                      onClick={() => navigate(`/location/all/resource/${resource.id}`)}
                    >
                      <TableCell className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {resource.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{resource.role}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          resource.grade === "E1" || resource.grade === "E2" 
                            ? "bg-primary/20 text-primary"
                            : resource.grade === "T4" || resource.grade === "T3"
                              ? "bg-success/20 text-success"
                              : resource.grade === "U1" || resource.grade === "U2"
                                ? "bg-warning/20 text-warning"
                                : "bg-secondary text-muted-foreground"
                        )}>
                          {resource.grade}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{resource.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium capitalize",
                            resource.status === "billable" 
                              ? "bg-primary/20 text-primary"
                              : resource.status === "internal"
                                ? "bg-chart-internal/20 text-chart-internal"
                                : "bg-chart-bench/20 text-chart-bench"
                          )}>
                            {resource.status}
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

export default AllResources;

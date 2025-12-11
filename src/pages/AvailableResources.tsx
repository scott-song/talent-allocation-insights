import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Search, Filter, Clock, Briefcase, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ThemeToggle } from "@/components/ThemeToggle";
import { locations, getAvailableResources, AvailableResource } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const jobFamilies = ["All", "Engineering", "Design", "Product", "Operations", "Data"];
const skillOptions = ["React", "Node.js", "Python", "AWS", "TypeScript", "UI/UX", "Agile", "SQL", "Docker", "Figma"];
const availabilityOptions = ["All", "Full-time (40h)", "Part-time (20-39h)", "Limited (<20h)"];
const periodOptions = ["Current", "Next 2 Weeks", "Next Month", "Next Quarter"];

const AvailableResources = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobFamily, setJobFamily] = useState("All");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availability, setAvailability] = useState("All");
  const [period, setPeriod] = useState("Current");

  const location = locations.find((l) => l.id === locationId) || locations[0];
  const allResources = useMemo(() => getAvailableResources(locationId || "all"), [locationId]);

  const filteredResources = useMemo(() => {
    return allResources.filter((resource) => {
      // Search filter
      if (searchTerm && !resource.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !resource.role.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Job family filter
      if (jobFamily !== "All" && resource.department !== jobFamily) {
        return false;
      }

      // Skills filter
      if (selectedSkills.length > 0) {
        const hasMatchingSkill = selectedSkills.some(skill => 
          resource.skills.some(s => s.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasMatchingSkill) return false;
      }

      // Availability filter
      if (availability !== "All") {
        if (availability === "Full-time (40h)" && resource.availableHours < 40) return false;
        if (availability === "Part-time (20-39h)" && (resource.availableHours < 20 || resource.availableHours >= 40)) return false;
        if (availability === "Limited (<20h)" && resource.availableHours >= 20) return false;
      }

      return true;
    });
  }, [allResources, searchTerm, jobFamily, selectedSkills, availability]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setJobFamily("All");
    setSelectedSkills([]);
    setAvailability("All");
    setPeriod("Current");
  };

  const hasActiveFilters = searchTerm || jobFamily !== "All" || selectedSkills.length > 0 || availability !== "All" || period !== "Current";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="ghost" className="-ml-3">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <ThemeToggle />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Available Resources</h1>
              <p className="text-muted-foreground mt-1">
                {location.name} • {filteredResources.length} resources on bench
              </p>
            </div>
            
            {/* Summary Stats */}
            <div className="flex gap-4">
              <div className="glass-card rounded-lg px-4 py-3 text-center">
                <p className="text-2xl font-bold text-foreground">{filteredResources.length}</p>
                <p className="text-xs text-muted-foreground">Total Available</p>
              </div>
              <div className="glass-card rounded-lg px-4 py-3 text-center">
                <p className="text-2xl font-bold text-primary">
                  {filteredResources.reduce((sum, r) => sum + r.availableHours, 0)}h
                </p>
                <p className="text-xs text-muted-foreground">Total Hours</p>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="glass-card rounded-lg p-6 mb-6 animate-slide-up" style={{ animationDelay: "50ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-muted-foreground">
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Job Family */}
            <Select value={jobFamily} onValueChange={setJobFamily}>
              <SelectTrigger>
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Job Family" />
              </SelectTrigger>
              <SelectContent>
                {jobFamilies.map((family) => (
                  <SelectItem key={family} value={family}>{family}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Availability */}
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger>
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Available Hours" />
              </SelectTrigger>
              <SelectContent>
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Period */}
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skills Filter */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedSkills.includes(skill) 
                      ? "bg-primary hover:bg-primary/80" 
                      : "hover:bg-secondary"
                  )}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Table */}
        <div className="glass-card rounded-lg overflow-hidden animate-slide-up" style={{ animationDelay: "100ms" }}>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Resource</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Grade</TableHead>
                <TableHead className="text-muted-foreground">Department</TableHead>
                <TableHead className="text-muted-foreground">Skills</TableHead>
                <TableHead className="text-muted-foreground text-right">Available Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No resources match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredResources.map((resource, index) => (
                  <TableRow 
                    key={resource.id} 
                    className="border-border hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">{resource.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{resource.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {resource.grade}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{resource.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {resource.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {resource.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resource.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={cn(
                        "font-semibold",
                        resource.availableHours >= 40 ? "text-success" : 
                        resource.availableHours >= 20 ? "text-warning" : "text-muted-foreground"
                      )}>
                        {resource.availableHours}h/week
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AvailableResources;

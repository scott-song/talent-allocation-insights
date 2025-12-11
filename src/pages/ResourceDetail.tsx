import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, MapPin, Calendar, Briefcase, Clock, Award, Star, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getResourceDetail } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const ResourceDetail = () => {
  const { locationId, projectId, resourceId } = useParams<{ 
    locationId: string; 
    projectId: string; 
    resourceId: string;
  }>();

  const resource = useMemo(() => getResourceDetail(resourceId || ""), [resourceId]);
  const backUrl = `/location/${locationId}/project/${projectId}`;

  if (!resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Resource not found</p>
          <Button asChild variant="outline">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const utilizationPercent = Math.round((resource.totalAllocatedHours / 40) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <Button asChild variant="ghost" className="mb-4 -ml-3">
            <Link to={backUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resource Planning
            </Link>
          </Button>
          
          <div className="glass-card rounded-xl p-6 border border-border/50">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center shrink-0">
                <User className="h-10 w-10 text-primary-foreground" />
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-1">{resource.name}</h1>
                <p className="text-lg text-primary mb-3">{resource.role}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {resource.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {resource.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Joined {resource.joinDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {resource.department}
                  </span>
                </div>
              </div>
              
              {/* Grade Badge */}
              <div className="shrink-0">
                <Badge variant="outline" className={cn(
                  "px-4 py-2 text-sm font-semibold",
                  resource.grade === "Principal" || resource.grade === "Lead" 
                    ? "border-primary text-primary"
                    : resource.grade === "Senior"
                      ? "border-success text-success"
                      : "border-muted-foreground"
                )}>
                  {resource.grade}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Total Hours/Week</p>
            <p className="text-3xl font-bold text-foreground">{resource.totalAllocatedHours}h</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-primary/30" style={{ animationDelay: "50ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Utilization</p>
            <p className="text-3xl font-bold text-primary">{utilizationPercent}%</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-success/30" style={{ animationDelay: "100ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Available Hours</p>
            <p className="text-3xl font-bold text-success">{resource.availableHours}h</p>
          </div>
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-warning/30" style={{ animationDelay: "150ms" }}>
            <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
            <p className="text-3xl font-bold text-warning">{resource.currentAllocations.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skills */}
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-border/50" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {resource.skills.map((skill, index) => (
                <Badge 
                  key={skill} 
                  variant="secondary" 
                  className="bg-secondary/50 hover:bg-secondary transition-colors"
                  style={{ animationDelay: `${250 + index * 30}ms` }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="glass-card rounded-lg p-5 animate-slide-up border border-border/50" style={{ animationDelay: "250ms" }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Certifications</h3>
            </div>
            {resource.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resource.certifications.map((cert) => (
                  <Badge key={cert} variant="outline" className="border-primary/50 text-primary">
                    {cert}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No certifications on record</p>
            )}
          </div>
        </div>

        {/* Current Project Allocations */}
        <div className="glass-card rounded-lg overflow-hidden animate-slide-up mb-8" style={{ animationDelay: "300ms" }}>
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Current Project Allocations</h3>
          </div>
          <div className="p-4 space-y-4">
            {resource.currentAllocations.map((allocation) => (
              <div key={allocation.projectId} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{allocation.projectName}</p>
                  <p className="text-sm text-muted-foreground">{allocation.client}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Progress value={allocation.allocation} className="h-2" />
                  </div>
                  <span className="text-sm font-semibold text-foreground w-16 text-right">
                    {allocation.hoursPerWeek}h/week
                  </span>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {allocation.allocation}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Experience History */}
        <div className="glass-card rounded-lg overflow-hidden animate-slide-up" style={{ animationDelay: "350ms" }}>
          <div className="p-4 border-b border-border/50 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Experience History</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Project</TableHead>
                  <TableHead className="text-muted-foreground">Client</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Duration</TableHead>
                  <TableHead className="text-muted-foreground">Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resource.experience.map((exp, index) => (
                  <TableRow 
                    key={index} 
                    className="border-border/50 hover:bg-secondary/30"
                  >
                    <TableCell className="font-medium text-foreground">{exp.projectName}</TableCell>
                    <TableCell className="text-muted-foreground">{exp.client}</TableCell>
                    <TableCell className="text-muted-foreground">{exp.role}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary/50">
                        {exp.duration}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.endDate}
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

export default ResourceDetail;
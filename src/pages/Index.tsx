import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, ChevronRight } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import UtilizationGauge from "@/components/dashboard/UtilizationGauge";
import ForecastChart from "@/components/dashboard/ForecastChart";
import HealthIndicator from "@/components/dashboard/HealthIndicator";
import LocationSelector from "@/components/dashboard/LocationSelector";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { locations, generateForecastData } from "@/lib/mockData";

const Index = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [forecastPeriod, setForecastPeriod] = useState("3");

  const currentLocation = useMemo(
    () => locations.find((l) => l.id === selectedLocation) || locations[0],
    [selectedLocation]
  );

  const forecastData = useMemo(
    () => generateForecastData(parseInt(forecastPeriod), selectedLocation),
    [forecastPeriod, selectedLocation]
  );

  const billableRate = (currentLocation.billable / currentLocation.totalResources) * 100;
  const internalRate = (currentLocation.internal / currentLocation.totalResources) * 100;
  const benchRate = (currentLocation.bench / currentLocation.totalResources) * 100;
  const totalUtilization = billableRate + internalRate;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                Resource Utilization Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Track and forecast human resource allocation across locations
              </p>
            </div>
            <div className="flex items-center gap-3">
              <LocationSelector value={selectedLocation} onChange={setSelectedLocation} />
              <PeriodSelector value={forecastPeriod} onChange={setForecastPeriod} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Health Status Banner */}
        <div className="mb-8">
          <HealthIndicator
            billableRate={billableRate}
            totalUtilization={totalUtilization}
          />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Resources"
            value={currentLocation.totalResources.toString()}
            subtitle={currentLocation.name}
            trend={2.5}
            delay={0}
            onClick={() => navigate("/resources")}
          />
          <MetricCard
            title="Billable"
            value={currentLocation.billable.toString()}
            subtitle={`${billableRate.toFixed(1)}% of total`}
            trend={billableRate >= 80 ? 3.2 : -1.5}
            type="billable"
            delay={50}
            onClick={() => navigate(`/location/${selectedLocation}/billable`)}
          />
          <MetricCard
            title="Internal Projects"
            value={currentLocation.internal.toString()}
            subtitle={`${internalRate.toFixed(1)}% of total`}
            trend={0.8}
            type="internal"
            delay={100}
          />
          <MetricCard
            title="On Bench"
            value={currentLocation.bench.toString()}
            subtitle={`${benchRate.toFixed(1)}% available`}
            trend={benchRate <= 10 ? 1.2 : -2.1}
            type="bench"
            delay={150}
            onClick={() => navigate(`/location/${selectedLocation}/available`)}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ForecastChart data={forecastData} />
          </div>
          <div>
            <UtilizationGauge
              billable={billableRate}
              internal={internalRate}
              bench={benchRate}
              locationId={selectedLocation}
            />
          </div>
        </div>

        {/* Location Summary */}
        <div className="mt-8 glass-card rounded-lg p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Location Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Location</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Billable</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Internal</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Bench</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Billable %</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {locations.filter(l => l.id !== "all").map((location, index) => {
                  const locBillableRate = (location.billable / location.totalResources) * 100;
                  const locTotalUtil = ((location.billable + location.internal) / location.totalResources) * 100;
                  const isHealthy = locBillableRate >= 80 && locTotalUtil >= 90;
                  const isWarning = locBillableRate >= 70 && locTotalUtil >= 80;

                  return (
                    <tr
                      key={location.id}
                      onClick={() => navigate(`/location/${location.id}`)}
                      className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-foreground flex items-center gap-2">
                        {location.name}
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-foreground">{location.totalResources}</td>
                      <td className="py-3 px-4 text-sm text-right text-primary font-medium">{location.billable}</td>
                      <td className="py-3 px-4 text-sm text-right text-chart-internal">{location.internal}</td>
                      <td className="py-3 px-4 text-sm text-right text-muted-foreground">{location.bench}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium">
                        <span className={locBillableRate >= 80 ? "text-success" : "text-warning"}>
                          {locBillableRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          isHealthy
                            ? "bg-success/20 text-success"
                            : isWarning
                            ? "bg-warning/20 text-warning"
                            : "bg-destructive/20 text-destructive"
                        }`}>
                          {isHealthy ? "Healthy" : isWarning ? "Warning" : "Critical"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

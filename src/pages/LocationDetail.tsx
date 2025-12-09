import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import UtilizationGauge from "@/components/dashboard/UtilizationGauge";
import ForecastChart from "@/components/dashboard/ForecastChart";
import HealthIndicator from "@/components/dashboard/HealthIndicator";
import PeriodSelector from "@/components/dashboard/PeriodSelector";
import { Button } from "@/components/ui/button";
import { locations, generateForecastData } from "@/lib/mockData";

const LocationDetail = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [forecastPeriod, setForecastPeriod] = useState("3");

  const location = useMemo(
    () => locations.find((l) => l.id === locationId),
    [locationId]
  );

  const forecastData = useMemo(
    () => generateForecastData(parseInt(forecastPeriod), locationId || "all"),
    [forecastPeriod, locationId]
  );

  if (!location || location.id === "all") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Location not found</h1>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const billableRate = (location.billable / location.totalResources) * 100;
  const internalRate = (location.internal / location.totalResources) * 100;
  const benchRate = (location.bench / location.totalResources) * 100;
  const totalUtilization = billableRate + internalRate;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button asChild variant="ghost" className="mb-4 -ml-3">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg gradient-primary">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                {location.name}
              </h1>
              <p className="text-muted-foreground mt-2">
                Detailed resource utilization for {location.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <PeriodSelector value={forecastPeriod} onChange={setForecastPeriod} />
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
            value={location.totalResources.toString()}
            subtitle={location.name}
            trend={2.5}
            delay={0}
          />
          <MetricCard
            title="Billable"
            value={location.billable.toString()}
            subtitle={`${billableRate.toFixed(1)}% of total`}
            trend={billableRate >= 80 ? 3.2 : -1.5}
            type="billable"
            delay={50}
          />
          <MetricCard
            title="Internal Projects"
            value={location.internal.toString()}
            subtitle={`${internalRate.toFixed(1)}% of total`}
            trend={0.8}
            type="internal"
            delay={100}
          />
          <MetricCard
            title="On Bench"
            value={location.bench.toString()}
            subtitle={`${benchRate.toFixed(1)}% available`}
            trend={benchRate <= 10 ? 1.2 : -2.1}
            type="bench"
            delay={150}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import LocationDetail from "./pages/LocationDetail";
import BillableProjects from "./pages/BillableProjects";
import ResourcePlanning from "./pages/ResourcePlanning";
import ResourceDetail from "./pages/ResourceDetail";
import AvailableResources from "./pages/AvailableResources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/location/:locationId" element={<LocationDetail />} />
            <Route path="/location/:locationId/billable" element={<BillableProjects />} />
            <Route path="/location/:locationId/available" element={<AvailableResources />} />
            <Route path="/location/:locationId/project/:projectId" element={<ResourcePlanning />} />
            <Route path="/location/:locationId/project/:projectId/resource/:resourceId" element={<ResourceDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

import { ReactNode } from "react";
import AppNavbar from "@/components/AppNavbar";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      {children}
    </div>
  );
};

export default AppLayout;

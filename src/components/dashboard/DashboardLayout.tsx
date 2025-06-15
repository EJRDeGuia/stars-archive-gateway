
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => (
  <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
    {children}
  </div>
);

export default DashboardLayout;

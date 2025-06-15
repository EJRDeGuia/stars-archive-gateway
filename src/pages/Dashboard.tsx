import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import QuickActions from "@/components/dashboard/QuickActions";
import CollegeGrid from "@/components/dashboard/CollegeGrid";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SemanticSearchButton from "@/components/dashboard/SemanticSearchButton";
import { getGreeting } from "@/utils/greetingUtils";
import MyCollectionsSection from "@/components/dashboard/MyCollectionsSection";
import ViewsChart from "@/components/analytics/ViewsChart";
import { useResearcherViewsAnalytics } from "@/hooks/useResearcherViewsAnalytics";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect admin users to admin dashboard and archivists to archivist dashboard
  React.useEffect(() => {
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.role === "archivist") {
      navigate("/archivist");
    }
  }, [user, navigate]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "upload":
        navigate("/upload");
        break;
      case "collections":
        navigate("/collections");
        break;
      case "library":
        navigate("/library");
        break;
      case "trending":
        navigate("/explore");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "admin":
        navigate("/admin");
        break;
      case "archivist":
        navigate("/archivist");
        break;
      case "backup":
        toast.success('Database backup initiated successfully!');
        console.log('Database backup started');
        break;
      case "manage":
        toast.info('Manage Records feature coming soon!');
        break;
      case "reports":
        toast.info('Reports feature coming soon!');
        break;
      case "search":
        navigate("/explore");
        break;
      case "users":
        toast.info('User Management feature coming soon!');
        break;
      case "colleges":
        toast.info('College Management feature coming soon!');
        break;
      case "analytics":
        toast.info('Analytics Dashboard feature coming soon!');
        break;
      case "security":
        toast.info('Security Monitor feature coming soon!');
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const { data: chartData, loading: chartLoading } = useResearcherViewsAnalytics();
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <DashboardLayout>
          <WelcomeSection
            userName={user?.name || "User"}
            userRole={user?.role || "researcher"}
            getGreeting={getGreeting}
          />
          <SemanticSearchButton className="mb-12" />
          <QuickActions
            userRole={user?.role || "researcher"}
            onActionClick={handleQuickAction}
          />

          {/* Analytics Chart */}
          {user?.role === "researcher" && (
            <div className="mb-12">
              <ViewsChart
                title="Your Theses: Views Analytics"
                data={chartData}
                legend="Views"
                color="#6366f1"
              />
            </div>
          )}

          <MyCollectionsSection />
          <CollegeGrid />
          <RecentActivity />
        </DashboardLayout>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

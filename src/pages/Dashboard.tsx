
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
import { RecommendationsSection } from "@/components/dashboard/RecommendationsSection";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Only redirect admin users to admin dashboard and archivists to archivist dashboard
  // Remove this redirect to fix the blank screen issue
  // React.useEffect(() => {
  //   if (user?.role === "admin") {
  //     navigate("/admin");
  //   } else if (user?.role === "archivist") {
  //     navigate("/archivist");
  //   }
  // }, [user, navigate]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "upload":
        if (user?.role === "archivist") {
          navigate("/upload");
        } else {
          toast.error("Only archivists can upload theses");
        }
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
        if (user?.role === "admin") {
          navigate("/admin");
        } else {
          toast.error("Admin access required");
        }
        break;
      case "archivist":
        if (user?.role === "archivist" || user?.role === "admin") {
          navigate("/archivist");
        } else {
          toast.error("Archivist access required");
        }
        break;
      case "backup":
        toast.success('Database backup initiated successfully!');
        console.log('Database backup started');
        break;
      case "manage":
        if (user?.role === "archivist" || user?.role === "admin") {
          navigate("/manage-records");
        } else {
          toast.error("Archivist access required");
        }
        break;
      case "reports":
        toast.info('Reports feature coming soon!');
        break;
      case "search":
        navigate("/explore");
        break;
      case "users":
        if (user?.role === "admin") {
          navigate("/user-management");
        } else {
          toast.error("Admin access required");
        }
        break;
      case "colleges":
        if (user?.role === "admin") {
          navigate("/college-management");
        } else {
          toast.error("Admin access required");
        }
        break;
      case "analytics":
        if (user?.role === "admin") {
          navigate("/analytics-dashboard");
        } else {
          toast.error("Admin access required");
        }
        break;
      case "security":
        if (user?.role === "admin") {
          navigate("/security-monitor");
        } else {
          toast.error("Admin access required");
        }
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
          <div className="grid gap-6 lg:grid-cols-3">
            <MyCollectionsSection />
            <RecommendationsSection />
            <div>
              <CollegeGrid />
              <RecentActivity />
            </div>
          </div>
        </DashboardLayout>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

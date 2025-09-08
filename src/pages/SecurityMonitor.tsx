
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Filter, Download, RefreshCw, Play, ArrowLeft } from "lucide-react";
import { useSecurityMonitor } from "@/hooks/useSecurityMonitor";
import SecurityStatsCards from "@/components/security/SecurityStatsCards";
import SecurityAlertsPanel from "@/components/security/SecurityAlertsPanel";
import ActiveSessionsPanel from "@/components/security/ActiveSessionsPanel";
import SystemHealthMonitor from "@/components/security/SystemHealthMonitor";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SecurityMonitor = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { alerts, sessions, stats, loading, error, actions } = useSecurityMonitor();

  const handleRunAnomalyDetection = async () => {
    try {
      toast.loading("Running anomaly detection...");
      await actions.runAnomalyDetection();
      toast.success("Anomaly detection completed");
    } catch (error) {
      toast.error("Failed to run anomaly detection");
    }
  };

  const handleRefresh = async () => {
    try {
      toast.loading("Refreshing security data...");
      await actions.refresh();
      toast.success("Security data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || alert.severity === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredSessions = sessions.filter(session => 
    session.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.ip_address.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-dlsl-green rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 text-white">🛡️</div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Security Monitor</h1>
                <p className="text-xl text-gray-600">Monitor access and security events</p>
              </div>
            </div>
          </div>

          {/* Security Overview */}
          <SecurityStatsCards stats={stats} loading={loading} />

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mt-8">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search alerts, sessions, or IP addresses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">All Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleRunAnomalyDetection}>
                <Play className="w-4 h-4 mr-2" />
                Run Detection
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Security Alerts - spans 2 columns */}
            <div className="lg:col-span-2">
              <SecurityAlertsPanel
                alerts={filteredAlerts}
                loading={loading}
                onResolveAlert={actions.resolveAlert}
              />
            </div>

            {/* Right column - Active Sessions and System Health */}
            <div className="space-y-8">
              <ActiveSessionsPanel
                sessions={filteredSessions}
                loading={loading}
                onTerminateSession={actions.terminateSession}
              />
              
              <SystemHealthMonitor loading={loading} />
            </div>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">Error: {error}</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecurityMonitor;

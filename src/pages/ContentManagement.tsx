import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileText, 
  Users, 
  GraduationCap, 
  Megaphone,
  BarChart3,
  Settings,
  Shield,
  BookOpen,
  UserCheck,
  Globe,
  ArrowLeft
} from 'lucide-react';

const ContentManagement = () => {
  const navigate = useNavigate();

  const managementSections = [
    {
      title: "About Page Content",
      description: "Manage about page sections, mission, vision, and organizational content",
      icon: FileText,
      path: "/admin/content/about",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Resources Management", 
      description: "Create and edit resource guides, documentation, and help content",
      icon: BookOpen,
      path: "/admin/content/resources",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Team Members",
      description: "Add, edit, and manage team member profiles and information",
      icon: Users,
      path: "/admin/content/team",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Announcements",
      description: "Create system-wide announcements and notifications for users",
      icon: Megaphone,
      path: "/admin/announcements",
      color: "from-red-500 to-red-600"
    },
    {
      title: "User Management",
      description: "Manage user accounts, roles, permissions, and access controls",
      icon: UserCheck,
      path: "/user-management",
      color: "from-indigo-500 to-indigo-600"
    },
    {
      title: "College Management",
      description: "Add and edit college information, programs, and academic structure",
      icon: GraduationCap,
      path: "/college-management", 
      color: "from-yellow-500 to-yellow-600"
    },
    {
      title: "Analytics & Reports",
      description: "View content performance, user engagement, and system analytics",
      icon: BarChart3,
      path: "/analytics-dashboard",
      color: "from-pink-500 to-pink-600"
    },
    {
      title: "System Settings",
      description: "Configure system-wide settings, preferences, and configurations",
      icon: Settings,
      path: "/system-settings",
      color: "from-gray-500 to-gray-600"
    },
    {
      title: "Security Monitor",
      description: "Monitor system security, access logs, and security incidents",
      icon: Shield,
      path: "/security-monitor",
      color: "from-red-600 to-red-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Admin Dashboard
            </Button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-dlsl-green to-dlsl-green-light rounded-full mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Content Management Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive tools to manage all aspects of your digital thesis repository system
            </p>
          </div>

          {/* Management Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managementSections.map((section, index) => (
              <Card 
                key={section.title}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
                onClick={() => navigate(section.path)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-dlsl-green transition-colors duration-300">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 dark:text-gray-300 mb-4">
                    {section.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full group-hover:bg-dlsl-green group-hover:text-white group-hover:border-dlsl-green transition-all duration-300"
                  >
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <div className="text-2xl font-bold text-dlsl-green">Active</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Content Management</div>
            </Card>
            <Card className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-600">Real-time</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Updates</div>
            </Card>
            <Card className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-600">Secure</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Access Control</div>
            </Card>
            <Card className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-600">Analytics</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Powered</div>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentManagement;
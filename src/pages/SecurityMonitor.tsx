
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Shield,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Unlock,
  Search,
  Clock
} from 'lucide-react';

const SecurityMonitor = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Mock security data
  const securityAlerts = [
    {
      id: '1',
      type: 'login_attempt',
      severity: 'high',
      message: 'Multiple failed login attempts from IP 192.168.1.100',
      timestamp: '2024-01-16 14:30:25',
      status: 'active',
      user: 'unknown'
    },
    {
      id: '2',
      type: 'permission_change',
      severity: 'medium',
      message: 'User role changed from researcher to archivist',
      timestamp: '2024-01-16 12:15:10',
      status: 'resolved',
      user: 'admin@dlsl.edu.ph'
    },
    {
      id: '3',
      type: 'file_access',
      severity: 'low',
      message: 'Bulk file download detected',
      timestamp: '2024-01-16 09:45:33',
      status: 'monitoring',
      user: 'researcher@dlsl.edu.ph'
    }
  ];

  const activeSessions = [
    {
      id: '1',
      user: 'admin@dlsl.edu.ph',
      role: 'admin',
      ipAddress: '192.168.1.50',
      location: 'Manila, Philippines',
      loginTime: '2024-01-16 08:00:00',
      lastActivity: '2024-01-16 14:35:22',
      status: 'active'
    },
    {
      id: '2',
      user: 'maria.santos@dlsl.edu.ph',
      role: 'archivist',
      ipAddress: '192.168.1.75',
      location: 'Lipa, Philippines',
      loginTime: '2024-01-16 09:15:30',
      lastActivity: '2024-01-16 14:20:15',
      status: 'active'
    },
    {
      id: '3',
      user: 'john.doe@dlsl.edu.ph',
      role: 'researcher',
      ipAddress: '192.168.1.120',
      location: 'Batangas, Philippines',
      loginTime: '2024-01-16 10:30:45',
      lastActivity: '2024-01-16 13:45:10',
      status: 'idle'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />;
      case 'monitoring':
        return <Eye className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Security Monitor</h1>
                <p className="text-xl text-gray-600">Monitor access and security events</p>
              </div>
            </div>
          </div>

          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Alerts</p>
                    <p className="text-3xl font-bold text-red-600">3</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Sessions</p>
                    <p className="text-3xl font-bold text-green-600">156</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Failed Logins</p>
                    <p className="text-3xl font-bold text-yellow-600">12</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                    <Unlock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Security Alerts */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <div key={alert.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">{alert.message}</p>
                      <p className="text-sm text-gray-600">User: {alert.user}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-dlsl-green rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  Active Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search sessions..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{session.user}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              {session.role}
                            </Badge>
                            <Badge className={session.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}>
                              {session.status}
                            </Badge>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Terminate
                        </Button>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>IP: {session.ipAddress} • {session.location}</p>
                        <p>Login: {session.loginTime}</p>
                        <p>Last Activity: {session.lastActivity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SecurityMonitor;

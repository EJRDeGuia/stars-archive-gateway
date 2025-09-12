import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow, format, subDays, startOfDay, endOfDay } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  User,
  Activity,
  AlertTriangle,
  Shield,
  Download,
  RefreshCw,
  Clock,
  MapPin,
  Eye,
  AlertCircle
} from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string;
  created_at: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
}

const AuditLogs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const logsPerPage = 25;

  useEffect(() => {
    loadAuditLogs();
  }, [page, actionFilter, resourceFilter, severityFilter, categoryFilter, dateFilter, searchQuery]);

  // Real-time subscription for new audit logs
  useEffect(() => {
    if (!realTimeEnabled || !user) return;

    const channel = supabase
      .channel('audit-logs-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        (payload) => {
          const newLog = payload.new as AuditLog;
          setLogs(prevLogs => {
            const exists = prevLogs.find(log => log.id === newLog.id);
            if (exists) return prevLogs;
            return [newLog, ...prevLogs.slice(0, logsPerPage - 1)];
          });
          setLastRefresh(new Date());
          toast.info('New audit log entry detected', {
            description: `${newLog.action} on ${newLog.resource_type}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [realTimeEnabled, user, logsPerPage]);

  const getDateRange = (filter: string) => {
    const now = new Date();
    switch (filter) {
      case 'today':
        return [startOfDay(now), endOfDay(now)];
      case 'yesterday':
        return [startOfDay(subDays(now, 1)), endOfDay(subDays(now, 1))];
      case 'week':
        return [startOfDay(subDays(now, 7)), endOfDay(now)];
      case 'month':
        return [startOfDay(subDays(now, 30)), endOfDay(now)];
      default:
        return null;
    }
  };

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * logsPerPage, page * logsPerPage - 1);

      // Apply filters
      if (actionFilter !== 'all') {
        query = query.ilike('action', `%${actionFilter}%`);
      }

      if (resourceFilter !== 'all') {
        query = query.eq('resource_type', resourceFilter);
      }

      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (dateFilter !== 'all') {
        const dateRange = getDateRange(dateFilter);
        if (dateRange) {
          query = query.gte('created_at', dateRange[0].toISOString())
                       .lte('created_at', dateRange[1].toISOString());
        }
      }

      if (searchQuery) {
        query = query.or(`action.ilike.%${searchQuery}%,resource_type.ilike.%${searchQuery}%,ip_address.ilike.%${searchQuery}%,user_id.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error loading audit logs:', error);
        toast.error('Failed to load audit logs');
        return;
      }

      const processedLogs: AuditLog[] = (data || []).map(log => ({
        ...log,
        ip_address: (log.ip_address as string) || null,
        user_agent: log.user_agent || '',
        details: log.details || {},
        severity: (['low', 'medium', 'high', 'critical'].includes(log.severity) 
          ? log.severity 
          : 'low') as 'low' | 'medium' | 'high' | 'critical',
        category: log.category || 'general',
        user_id: log.user_id || null,
        resource_id: log.resource_id || null,
        created_at: log.created_at || new Date().toISOString()
      }));

      setLogs(processedLogs);
      setTotalCount(count || 0);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10000); // Export last 10k logs

      if (error) {
        toast.error('Failed to export logs');
        return;
      }

      const csvContent = [
        'Timestamp,User ID,Action,Resource Type,Resource ID,IP Address,Details',
        ...data.map(log => [
          log.created_at,
          log.user_id,
          log.action,
          log.resource_type,
          log.resource_id || '',
          log.ip_address,
          JSON.stringify(log.details)
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success('Audit logs exported successfully');
    } catch (error) {
      console.error('Error exporting logs:', error);
      toast.error('Failed to export logs');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('delete') || action.includes('unauthorized') || action.includes('failed')) {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    if (action.includes('create') || action.includes('upload') || action.includes('success')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (action.includes('update') || action.includes('edit')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'thesis':
        return <FileText className="w-4 h-4" />;
      case 'user':
        return <User className="w-4 h-4" />;
      case 'system':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const totalPages = Math.ceil(totalCount / logsPerPage);

  if (loading && logs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">Loading audit logs...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Admin Dashboard
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  Last updated: {format(lastRefresh, 'HH:mm:ss')}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAuditLogs}
                  disabled={loading}
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-dlsl-green rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-xl text-gray-600">Comprehensive system activity monitoring and compliance</p>
              </div>
            </div>

            {/* Real-time Status */}
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Real-time monitoring: <strong className="text-dlsl-green">Active</strong>
                  {' '}• Total logs: <strong>{totalCount.toLocaleString()}</strong>
                  {' '}• Showing page {page} of {Math.ceil(totalCount / logsPerPage)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                >
                  {realTimeEnabled ? 'Disable' : 'Enable'} Real-time
                </Button>
              </AlertDescription>
            </Alert>
          </div>

          {/* Advanced Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by action, resource, IP, or user ID..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="upload">Upload</SelectItem>
                    <SelectItem value="download">Download</SelectItem>
                    <SelectItem value="failed">Failed Attempts</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={resourceFilter} onValueChange={setResourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="thesis">Thesis</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="collection">Collection</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button onClick={exportLogs} className="bg-dlsl-green hover:bg-dlsl-green/90">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setActionFilter('all');
                    setResourceFilter('all');
                    setSeverityFilter('all');
                    setCategoryFilter('all');
                    setDateFilter('all');
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Audit Logs ({totalCount.toLocaleString()} total)</span>
                <div className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No audit logs found matching your criteria.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors ${
                        log.severity === 'critical' || log.severity === 'high' 
                          ? 'border-red-200 bg-red-50/30' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        log.severity === 'critical' ? 'bg-red-100' :
                        log.severity === 'high' ? 'bg-orange-100' :
                        log.severity === 'medium' ? 'bg-yellow-100' :
                        'bg-dlsl-green/10'
                      }`}>
                        {getResourceIcon(log.resource_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <Badge className={getActionBadgeColor(log.action)}>
                            {log.action}
                          </Badge>
                          <Badge className={getSeverityColor(log.severity)}>
                            {log.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            {log.resource_type}
                          </span>
                          {log.resource_id && (
                            <span className="text-xs text-gray-500 font-mono">
                              ID: {log.resource_id.substring(0, 8)}...
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-900 mb-1">
                          <User className="w-3 h-3 inline mr-1" />
                          User: <span className="font-mono text-xs">{log.user_id?.substring(0, 8)}...</span>
                        </div>

                        <div className="text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDistanceToNow(new Date(log.created_at))} ago
                          {' '}({format(new Date(log.created_at), 'MMM dd, HH:mm:ss')})
                          {log.ip_address && (
                            <>
                              <MapPin className="w-3 h-3 inline ml-4 mr-1" />
                              IP: {log.ip_address}
                            </>
                          )}
                        </div>

                        {log.user_agent && (
                          <div className="text-xs text-gray-500 mb-2 truncate">
                            Browser: {log.user_agent}
                          </div>
                        )}

                        {log.category && log.category !== 'general' && (
                          <Badge variant="outline" className="mr-2 mb-2">
                            {log.category}
                          </Badge>
                        )}

                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-dlsl-green hover:underline flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              View Technical Details
                            </summary>
                            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto max-h-40 overflow-y-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuditLogs;
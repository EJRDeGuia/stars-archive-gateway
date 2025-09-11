import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
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
  Download
} from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string;
  created_at: string;
}

const AuditLogs: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const logsPerPage = 50;

  useEffect(() => {
    loadAuditLogs();
  }, [page, actionFilter, resourceFilter, searchQuery]);

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
        query = query.eq('action', actionFilter);
      }

      if (resourceFilter !== 'all') {
        query = query.eq('resource_type', resourceFilter);
      }

      if (searchQuery) {
        query = query.or(`action.ilike.%${searchQuery}%,resource_type.ilike.%${searchQuery}%,ip_address.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('Error loading audit logs:', error);
        toast.error('Failed to load audit logs');
        return;
      }

      setLogs((data || []).map(log => ({
        ...log,
        ip_address: log.ip_address as string || null,
        user_agent: log.user_agent || '',
        details: log.details || {}
      })));
      setTotalCount(count || 0);
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
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-xl text-gray-600">System activity monitoring and compliance</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Filter Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by action, resource type, or IP address..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-40">
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
                  </SelectContent>
                </Select>

                <Select value={resourceFilter} onValueChange={setResourceFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Resource" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Resources</SelectItem>
                    <SelectItem value="thesis">Thesis</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="collection">Collection</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={exportLogs} className="bg-dlsl-green hover:bg-dlsl-green/90">
                  <Download className="w-4 h-4 mr-2" />
                  Export
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
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 bg-dlsl-green/10 rounded-full flex items-center justify-center flex-shrink-0">
                        {getResourceIcon(log.resource_type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getActionBadgeColor(log.action)}>
                            {log.action}
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
                          User: <span className="font-mono text-xs">{log.user_id}</span>
                        </div>

                        <div className="text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDistanceToNow(new Date(log.created_at))} ago
                          <span className="ml-4">IP: {log.ip_address}</span>
                        </div>

                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-dlsl-green hover:underline">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
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
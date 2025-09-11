import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface UserData {
  id: string;
  email: string;
  role: 'admin' | 'archivist' | 'researcher' | 'guest_researcher';
  created_at: string;
  last_sign_in_at: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'archivist' | 'researcher'>('researcher');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'archivist':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'researcher':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Get all auth users with their roles
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        toast.error('Failed to load users');
        return;
      }

      // Get user roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (roleError) {
        console.error('Error loading roles:', roleError);
      }

      const usersWithRoles = authUsers.users.map(authUser => {
        const userRole = roleData?.find(r => r.user_id === authUser.id);
        return {
          id: authUser.id,
          email: authUser.email || '',
          role: userRole?.role || 'researcher',
          created_at: authUser.created_at,
          last_sign_in_at: authUser.last_sign_in_at
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Create user via Supabase Auth Admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        email_confirm: true,
        user_metadata: { role: newUserRole }
      });

      if (error) {
        toast.error(`Failed to create user: ${error.message}`);
        return;
      }

      // Assign role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({ user_id: data.user.id, role: newUserRole });

      if (roleError) {
        console.error('Error assigning role:', roleError);
        toast.error('User created but role assignment failed');
      } else {
        toast.success('User created successfully');
        setNewUserEmail('');
        setNewUserRole('researcher');
        setIsDialogOpen(false);
        loadUsers();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'archivist' | 'researcher') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole });

      if (error) {
        toast.error('Failed to update user role');
        return;
      }

      toast.success('User role updated successfully');
      setIsRoleDialogOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        toast.error('Failed to delete user');
        return;
      }

      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">Loading users...</div>
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
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
                <p className="text-xl text-gray-600">Manage system users and permissions</p>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search users by email or role..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-dlsl-green hover:bg-dlsl-green/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="Enter user email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUserRole} onValueChange={(value: any) => setNewUserRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="archivist">Archivist</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleCreateUser}
                    className="w-full bg-dlsl-green hover:bg-dlsl-green/90"
                    disabled={!newUserEmail}
                  >
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                System Users ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No users found.</div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((userData) => (
                    <div key={userData.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-dlsl-green/10 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-dlsl-green" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{userData.email}</h3>
                          <p className="text-gray-600 text-sm">
                            Created: {new Date(userData.created_at).toLocaleDateString()}
                          </p>
                          {userData.last_sign_in_at && (
                            <p className="text-gray-500 text-xs">
                              Last login: {new Date(userData.last_sign_in_at).toLocaleDateString()}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleBadgeColor(userData.role)}>
                              {userData.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog open={isRoleDialogOpen && selectedUser?.id === userData.id} 
                               onOpenChange={(open) => {
                                 if (!open) {
                                   setIsRoleDialogOpen(false);
                                   setSelectedUser(null);
                                 }
                               }}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(userData);
                                setIsRoleDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change User Role</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>User: {userData.email}</Label>
                                <Label>Current Role: {userData.role}</Label>
                              </div>
                              <div>
                                <Label htmlFor="new-role">New Role</Label>
                                <Select 
                                  defaultValue={userData.role} 
                                  onValueChange={(value: any) => handleRoleChange(userData.id, value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="researcher">Researcher</SelectItem>
                                    <SelectItem value="archivist">Archivist</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteUser(userData.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
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

export default UserManagement;

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTeamMembers } from '@/hooks/useAboutContent';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Edit3, Trash2, Save, X, ArrowLeft, Users, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  description?: string;
  image_url?: string;
  order_index: number;
  is_active: boolean;
}

const TeamMembersManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: teamMembers, refetch } = useTeamMembers();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newMember, setNewMember] = useState<TeamMember>({
    name: '',
    role: '',
    description: '',
    image_url: '',
    order_index: 0,
    is_active: true
  });

  const handleSave = async (member: TeamMember) => {
    try {
      if (member.id) {
        // Update existing
        const { error } = await supabase
          .from('team_members')
          .update({
            name: member.name,
            role: member.role,
            description: member.description,
            image_url: member.image_url,
            order_index: member.order_index,
            is_active: member.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', member.id);

        if (error) throw error;
        toast({ title: "Team member updated successfully" });
      } else {
        // Create new
        const { error } = await supabase
          .from('team_members')
          .insert([{
            name: member.name,
            role: member.role,
            description: member.description,
            image_url: member.image_url,
            order_index: member.order_index,
            is_active: member.is_active
          }]);

        if (error) throw error;
        toast({ title: "Team member added successfully" });
      }

      setEditingMember(null);
      setIsAdding(false);
      setNewMember({ 
        name: '', 
        role: '', 
        description: '', 
        image_url: '',
        order_index: 0, 
        is_active: true 
      });
      refetch();
    } catch (error) {
      toast({ title: "Error saving team member", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Team member removed successfully" });
      refetch();
    } catch (error) {
      toast({ title: "Error removing team member", variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast({ title: `Team member ${!currentStatus ? 'activated' : 'deactivated'}` });
      refetch();
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    }
  };

  const commonRoles = [
    'Director', 'Assistant Director', 'Librarian', 'Archivist', 
    'Research Coordinator', 'Technical Support', 'Administrator',
    'Faculty Member', 'Student Assistant', 'IT Specialist'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/admin/content')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage team member profiles and information</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-dlsl-green to-dlsl-green-light hover:from-dlsl-green-dark hover:to-dlsl-green text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>

          {/* Add New Member Form */}
          {isAdding && (
            <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Add New Team Member
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role/Position</label>
                    <Input
                      value={newMember.role}
                      onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                      placeholder="Select or enter role"
                      list="roles"
                    />
                    <datalist id="roles">
                      {commonRoles.map(role => (
                        <option key={role} value={role} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description/Bio</label>
                  <Textarea
                    value={newMember.description || ''}
                    onChange={(e) => setNewMember({...newMember, description: e.target.value})}
                    placeholder="Enter a brief description or bio"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Profile Image URL</label>
                    <Input
                      value={newMember.image_url || ''}
                      onChange={(e) => setNewMember({...newMember, image_url: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Display Order</label>
                    <Input
                      type="number"
                      value={newMember.order_index}
                      onChange={(e) => setNewMember({...newMember, order_index: parseInt(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleSave(newMember)}>
                    <Save className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Members List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teamMembers?.map((member: any) => (
              <Card key={member.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  {editingMember?.id === member.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Full Name</label>
                          <Input
                            value={editingMember.name}
                            onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Role/Position</label>
                          <Input
                            value={editingMember.role}
                            onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}
                            list="roles"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description/Bio</label>
                        <Textarea
                          value={editingMember.description || ''}
                          onChange={(e) => setEditingMember({...editingMember, description: e.target.value})}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Profile Image URL</label>
                          <Input
                            value={editingMember.image_url || ''}
                            onChange={(e) => setEditingMember({...editingMember, image_url: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Display Order</label>
                          <Input
                            type="number"
                            value={editingMember.order_index}
                            onChange={(e) => setEditingMember({...editingMember, order_index: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleSave(editingMember)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingMember(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-dlsl-green to-dlsl-green-light flex items-center justify-center overflow-hidden">
                          {member.image_url ? (
                            <img 
                              src={member.image_url} 
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                            <div className="flex space-x-1">
                              <Badge variant={member.is_active ? "default" : "destructive"}>
                                {member.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-dlsl-green font-medium mb-2">{member.role}</p>
                          {member.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{member.description}</p>
                          )}
                          <div className="text-xs text-gray-500 mb-3">Display order: {member.order_index}</div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit3 className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(member.id, member.is_active)}
                        >
                          {member.is_active ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeamMembersManager;
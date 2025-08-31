import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Edit3, Trash2, Save, X, ArrowLeft, Megaphone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Announcement {
  id?: string;
  title: string;
  content: string;
  type: string;
  is_active: boolean;
  target_roles: string[];
  priority: number;
  expires_at?: string;
}

const AnnouncementsManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({
    title: '',
    content: '',
    type: 'info',
    is_active: true,
    target_roles: ['researcher', 'archivist', 'admin'],
    priority: 1
  });

  // Fetch announcements
  const { data: announcements, refetch } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSave = async (announcement: Announcement) => {
    try {
      if (announcement.id) {
        // Update existing
        const { error } = await supabase
          .from('announcements')
          .update({
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            is_active: announcement.is_active,
            target_roles: announcement.target_roles,
            priority: announcement.priority,
            expires_at: announcement.expires_at || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', announcement.id);

        if (error) throw error;
        toast({ title: "Announcement updated successfully" });
      } else {
        // Create new
        const { error } = await supabase
          .from('announcements')
          .insert([{
            title: announcement.title,
            content: announcement.content,
            type: announcement.type,
            is_active: announcement.is_active,
            target_roles: announcement.target_roles,
            priority: announcement.priority,
            expires_at: announcement.expires_at || null,
            created_by: (await supabase.auth.getUser()).data.user?.id
          }]);

        if (error) throw error;
        toast({ title: "Announcement created successfully" });
      }

      setEditingAnnouncement(null);
      setIsAdding(false);
      setNewAnnouncement({ 
        title: '', 
        content: '', 
        type: 'info',
        is_active: true,
        target_roles: ['researcher', 'archivist', 'admin'],
        priority: 1
      });
      refetch();
    } catch (error) {
      toast({ title: "Error saving announcement", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Announcement deleted successfully" });
      refetch();
    } catch (error) {
      toast({ title: "Error deleting announcement", variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast({ title: `Announcement ${!currentStatus ? 'activated' : 'deactivated'}` });
      refetch();
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    }
  };

  const announcementTypes = ['info', 'warning', 'success', 'error'];
  const roles = ['researcher', 'archivist', 'admin', 'guest_researcher'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
                <p className="text-gray-600 dark:text-gray-300">Create and manage system-wide announcements</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-dlsl-green to-dlsl-green-light hover:from-dlsl-green-dark hover:to-dlsl-green text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Announcement
            </Button>
          </div>

          {/* Add New Announcement Form */}
          {isAdding && (
            <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Megaphone className="w-5 h-5 mr-2" />
                  Create New Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                    placeholder="Enter announcement title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                    placeholder="Enter announcement content"
                    rows={6}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <select 
                      value={newAnnouncement.type}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      {announcementTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priority</label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expires At (optional)</label>
                    <Input
                      type="datetime-local"
                      value={newAnnouncement.expires_at || ''}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, expires_at: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Target Roles</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roles.map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={newAnnouncement.target_roles.includes(role)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                target_roles: [...newAnnouncement.target_roles, role]
                              });
                            } else {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                target_roles: newAnnouncement.target_roles.filter(r => r !== role)
                              });
                            }
                          }}
                        />
                        <label htmlFor={role} className="text-sm capitalize">{role.replace('_', ' ')}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleSave(newAnnouncement)}>
                    <Save className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements List */}
          <div className="space-y-4">
            {announcements?.map((announcement: any) => (
              <Card key={announcement.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  {editingAnnouncement?.id === announcement.id ? (
                    <div className="space-y-4">
                      {/* Edit Form - Similar to Add Form */}
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={editingAnnouncement.title}
                          onChange={(e) => setEditingAnnouncement({...editingAnnouncement, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                          value={editingAnnouncement.content}
                          onChange={(e) => setEditingAnnouncement({...editingAnnouncement, content: e.target.value})}
                          rows={6}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium">Type</label>
                          <select 
                            value={editingAnnouncement.type}
                            onChange={(e) => setEditingAnnouncement({...editingAnnouncement, type: e.target.value})}
                            className="w-full mt-1 p-2 border rounded-md"
                          >
                            {announcementTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Priority</label>
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            value={editingAnnouncement.priority}
                            onChange={(e) => setEditingAnnouncement({...editingAnnouncement, priority: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Expires At</label>
                          <Input
                            type="datetime-local"
                            value={editingAnnouncement.expires_at || ''}
                            onChange={(e) => setEditingAnnouncement({...editingAnnouncement, expires_at: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleSave(editingAnnouncement)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingAnnouncement(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Badge variant={announcement.type === 'error' ? 'destructive' : 
                                          announcement.type === 'warning' ? 'secondary' : 'default'}>
                            {announcement.type}
                          </Badge>
                          <Badge variant={announcement.is_active ? "default" : "destructive"}>
                            {announcement.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-sm text-gray-500">Priority: {announcement.priority}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{announcement.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-3">{announcement.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Roles: {announcement.target_roles.join(', ')}</span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Created: {formatDate(announcement.created_at)}
                          </span>
                          {announcement.expires_at && (
                            <span>Expires: {formatDate(announcement.expires_at)}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingAnnouncement(announcement)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleActive(announcement.id, announcement.is_active)}
                        >
                          {announcement.is_active ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(announcement.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

export default AnnouncementsManager;
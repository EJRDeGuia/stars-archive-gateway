import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAboutContent } from '@/hooks/useAboutContent';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Plus, Edit3, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContentItem {
  id?: string;
  section: string;
  title: string;
  content: string;
  order_index: number;
  is_active: boolean;
}

const AboutContentManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: aboutContent, refetch } = useAboutContent();
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newItem, setNewItem] = useState<ContentItem>({
    section: 'mission',
    title: '',
    content: '',
    order_index: 0,
    is_active: true
  });

  const handleSave = async (item: ContentItem) => {
    try {
      if (item.id) {
        // Update existing
        const { error } = await supabase
          .from('about_content')
          .update({
            section: item.section,
            title: item.title,
            content: item.content,
            order_index: item.order_index,
            is_active: item.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', item.id);

        if (error) throw error;
        toast({ title: "Content updated successfully" });
      } else {
        // Create new
        const { error } = await supabase
          .from('about_content')
          .insert([{
            section: item.section,
            title: item.title,
            content: item.content,
            order_index: item.order_index,
            is_active: item.is_active
          }]);

        if (error) throw error;
        toast({ title: "Content created successfully" });
      }

      setEditingItem(null);
      setIsAdding(false);
      setNewItem({ section: 'mission', title: '', content: '', order_index: 0, is_active: true });
      refetch();
    } catch (error) {
      toast({ title: "Error saving content", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Content deleted successfully" });
      refetch();
    } catch (error) {
      toast({ title: "Error deleting content", variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('about_content')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast({ title: `Content ${!currentStatus ? 'activated' : 'deactivated'}` });
      refetch();
    } catch (error) {
      toast({ title: "Error updating status", variant: "destructive" });
    }
  };

  const sections = ['mission', 'vision', 'history', 'goals', 'team', 'other'];

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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">About Page Content</h1>
                <p className="text-gray-600 dark:text-gray-300">Manage about page sections and content</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-dlsl-green to-dlsl-green-light hover:from-dlsl-green-dark hover:to-dlsl-green text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Content
            </Button>
          </div>

          {/* Add New Item Form */}
          {isAdding && (
            <Card className="mb-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Add New About Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Section</label>
                  <select 
                    value={newItem.section}
                    onChange={(e) => setNewItem({...newItem, section: e.target.value})}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="Enter title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newItem.content}
                    onChange={(e) => setNewItem({...newItem, content: e.target.value})}
                    placeholder="Enter content"
                    rows={6}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Order Index</label>
                  <Input
                    type="number"
                    value={newItem.order_index}
                    onChange={(e) => setNewItem({...newItem, order_index: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => handleSave(newItem)}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content List */}
          <div className="space-y-4">
            {aboutContent?.map((item: any) => (
              <Card key={item.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-6">
                  {editingItem?.id === item.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Section</label>
                        <select 
                          value={editingItem.section}
                          onChange={(e) => setEditingItem({...editingItem, section: e.target.value})}
                          className="w-full mt-1 p-2 border rounded-md"
                        >
                          {sections.map(section => (
                            <option key={section} value={section}>{section}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                          value={editingItem.title}
                          onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                          value={editingItem.content}
                          onChange={(e) => setEditingItem({...editingItem, content: e.target.value})}
                          rows={6}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Order Index</label>
                        <Input
                          type="number"
                          value={editingItem.order_index}
                          onChange={(e) => setEditingItem({...editingItem, order_index: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => handleSave(editingItem)}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditingItem(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant="secondary">{item.section}</Badge>
                          <Badge variant={item.is_active ? "default" : "destructive"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <span className="text-sm text-gray-500">Order: {item.order_index}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{item.content}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleActive(item.id, item.is_active)}
                        >
                          {item.is_active ? 'Hide' : 'Show'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
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

export default AboutContentManager;
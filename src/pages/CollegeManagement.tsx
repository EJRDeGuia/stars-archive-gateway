
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Building,
  Search,
  Plus,
  Edit,
  Settings,
  ArrowLeft,
  Code,
  Calculator,
  Microscope,
  HeartPulse,
  UtensilsCrossed,
  Loader2
} from 'lucide-react';

interface College {
  id: string;
  name: string;
  full_name: string;
  description: string | null;
  color: string;
  created_at: string;
  theses_count?: number;
}

const CollegeManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    full_name: '',
    description: '',
    color: '#059669'
  });

  const getCollegeIcon = (name: string) => {
    const iconMap: { [key: string]: any } = {
      'CITE': Code,
      'CBEAM': Calculator,
      'CEAS': Microscope,
      'CON': HeartPulse,
      'CIHTM': UtensilsCrossed
    };
    return iconMap[name] || Building;
  };

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      setLoading(true);
      
      // Load colleges with thesis counts
      const { data: collegesData, error: collegesError } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (collegesError) throw collegesError;

      // Get thesis counts for each college
      const collegesWithCounts = await Promise.all(
        (collegesData || []).map(async (college) => {
          const { count } = await supabase
            .from('theses')
            .select('*', { count: 'exact', head: true })
            .eq('college_id', college.id);

          return {
            ...college,
            theses_count: count || 0
          };
        })
      );

      setColleges(collegesWithCounts);
    } catch (error) {
      console.error('Error loading colleges:', error);
      toast.error('Failed to load colleges');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const { error } = await supabase
        .from('colleges')
        .insert([formData]);

      if (error) throw error;

      toast.success('College created successfully');
      setIsCreateDialogOpen(false);
      setFormData({ name: '', full_name: '', description: '', color: '#059669' });
      loadColleges();
    } catch (error: any) {
      toast.error(`Failed to create college: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCollege) return;

    try {
      const { error } = await supabase
        .from('colleges')
        .update(formData)
        .eq('id', selectedCollege.id);

      if (error) throw error;

      toast.success('College updated successfully');
      setIsEditDialogOpen(false);
      setSelectedCollege(null);
      setFormData({ name: '', full_name: '', description: '', color: '#059669' });
      loadColleges();
    } catch (error: any) {
      toast.error(`Failed to update college: ${error.message}`);
    }
  };

  const openEditDialog = (college: College) => {
    setSelectedCollege(college);
    setFormData({
      name: college.name,
      full_name: college.full_name,
      description: college.description || '',
      color: college.color
    });
    setIsEditDialogOpen(true);
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    college.full_name.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">College Management</h1>
                <p className="text-xl text-gray-600">Configure college settings and programs</p>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search colleges..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-dlsl-green hover:bg-dlsl-green/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New College
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New College</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">College Code/Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., CITE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g., College of Information Technology and Engineering"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the college"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                  <Button 
                    onClick={handleCreate}
                    className="w-full bg-dlsl-green hover:bg-dlsl-green/90"
                    disabled={!formData.name || !formData.full_name}
                  >
                    Create College
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Colleges Grid */}
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-dlsl-green" />
              <p className="mt-2 text-gray-600">Loading colleges...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => {
                const IconComponent = getCollegeIcon(college.name);
                return (
                  <Card key={college.id} className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${college.color}20` }}
                          >
                            <IconComponent 
                              className="w-6 h-6" 
                              style={{ color: college.color }}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold text-gray-900">{college.name}</CardTitle>
                            <Badge className="bg-green-100 text-green-800 border-green-200 mt-1">
                              active
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium text-gray-900 mb-4">{college.full_name}</h3>
                      {college.description && (
                        <p className="text-gray-600 text-sm mb-4">{college.description}</p>
                      )}
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Theses</span>
                          <span className="font-semibold text-gray-900">{college.theses_count || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Created</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(college.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-6">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => openEditDialog(college)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => navigate(`/college/${college.id}`)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit College</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">College Code/Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., CITE"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-full_name">Full Name</Label>
                  <Input
                    id="edit-full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="e.g., College of Information Technology and Engineering"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the college"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handleUpdate}
                  className="w-full bg-dlsl-green hover:bg-dlsl-green/90"
                  disabled={!formData.name || !formData.full_name}
                >
                  Update College
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegeManagement;

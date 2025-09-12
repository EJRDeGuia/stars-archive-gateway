import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ThesisData {
  id: string;
  title: string;
  author: string;
  adviser: string;
  co_adviser: string;
  abstract: string;
  keywords: string[];
  college_id: string;
  program_id: string;
  publish_date: string;
  status: string;
}

interface College {
  id: string;
  name: string;
  full_name: string;
}

interface Program {
  id: string;
  name: string;
  college_id: string;
}

const ThesisEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [thesis, setThesis] = useState<ThesisData | null>(null);
  const [colleges, setColleges] = useState<College[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    adviser: '',
    co_adviser: '',
    abstract: '',
    keywords: '',
    college_id: '',
    program_id: '',
    publish_date: ''
  });

  useEffect(() => {
    if (!user || !['archivist', 'admin'].includes(user.role)) {
      navigate('/');
      return;
    }

    if (id) {
      loadThesisData();
      loadColleges();
    }
  }, [id, user]);

  const loadThesisData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: thesisData, error: thesisError } = await supabase
        .from('theses')
        .select(`
          *,
          colleges (id, name, full_name),
          programs (id, name, college_id)
        `)
        .eq('id', id)
        .single();

      if (thesisError) {
        throw thesisError;
      }

      if (!thesisData) {
        setError('Thesis not found');
        return;
      }

      setThesis(thesisData);
      setFormData({
        title: thesisData.title || '',
        author: thesisData.author || '',
        adviser: thesisData.adviser || '',
        co_adviser: thesisData.co_adviser || '',
        abstract: thesisData.abstract || '',
        keywords: Array.isArray(thesisData.keywords) ? thesisData.keywords.join(', ') : '',
        college_id: thesisData.college_id || '',
        program_id: thesisData.program_id || '',
        publish_date: thesisData.publish_date || ''
      });
    } catch (error) {
      console.error('Error loading thesis:', error);
      setError('Failed to load thesis data');
      toast.error('Failed to load thesis data');
    } finally {
      setLoading(false);
    }
  };

  const loadColleges = async () => {
    try {
      const { data: collegesData, error: collegesError } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (collegesError) throw collegesError;

      setColleges(collegesData || []);

      // Load programs
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .order('name');

      if (programsError) throw programsError;

      setPrograms(programsData || []);
    } catch (error) {
      console.error('Error loading colleges/programs:', error);
      toast.error('Failed to load colleges and programs');
    }
  };

  const handleSave = async () => {
    if (!thesis || !user) return;

    try {
      setSaving(true);

      // Validate required fields
      if (!formData.title.trim() || !formData.author.trim()) {
        toast.error('Title and author are required');
        return;
      }

      // Prepare update data
      const updateData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        adviser: formData.adviser.trim() || null,
        co_adviser: formData.co_adviser.trim() || null,
        abstract: formData.abstract.trim() || null,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : null,
        college_id: formData.college_id || null,
        program_id: formData.program_id || null,
        publish_date: formData.publish_date || null,
        updated_at: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('theses')
        .update(updateData)
        .eq('id', thesis.id);

      if (updateError) {
        throw updateError;
      }

      // Log the edit action
      await supabase.rpc('log_audit_event', {
        _action: 'thesis_metadata_updated',
        _resource_type: 'thesis',
        _resource_id: thesis.id,
        _details: {
          updated_fields: Object.keys(updateData),
          thesis_title: formData.title
        },
        _severity: 'medium',
        _category: 'academic_data'
      });

      toast.success('Thesis metadata updated successfully');
      navigate('/manage-records');
    } catch (error) {
      console.error('Error saving thesis:', error);
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const filteredPrograms = programs.filter(
    program => program.college_id === formData.college_id
  );

  // Check if user has permission
  if (!user || !['archivist', 'admin'].includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-xl text-gray-600 mb-8">You don't have permission to edit thesis metadata.</p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p>Loading thesis data...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !thesis) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || 'Thesis not found'}
              </AlertDescription>
            </Alert>
            <div className="text-center mt-6">
              <Button onClick={() => navigate('/manage-records')}>
                Back to Records
              </Button>
            </div>
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
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <Button 
              onClick={() => navigate('/manage-records')} 
              variant="ghost" 
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Records
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Thesis Metadata</h1>
              <p className="text-xl text-gray-600">
                Update thesis information and metadata
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Thesis Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Thesis title"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="Author name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="adviser">Thesis Adviser</Label>
                  <Input
                    id="adviser"
                    value={formData.adviser}
                    onChange={(e) => setFormData(prev => ({ ...prev, adviser: e.target.value }))}
                    placeholder="Adviser name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="co_adviser">Co-Adviser (Optional)</Label>
                  <Input
                    id="co_adviser"
                    value={formData.co_adviser}
                    onChange={(e) => setFormData(prev => ({ ...prev, co_adviser: e.target.value }))}
                    placeholder="Co-adviser name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="publish_date">Publication Date</Label>
                  <Input
                    id="publish_date"
                    type="date"
                    value={formData.publish_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, publish_date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* College and Program */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="college">College</Label>
                  <Select
                    value={formData.college_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, college_id: value, program_id: '' }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges.map((college) => (
                        <SelectItem key={college.id} value={college.id}>
                          {college.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="program">Program</Label>
                  <Select
                    value={formData.program_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, program_id: value }))}
                    disabled={!formData.college_id}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredPrograms.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Abstract and Keywords */}
              <div>
                <Label htmlFor="abstract">Abstract</Label>
                <Textarea
                  id="abstract"
                  value={formData.abstract}
                  onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                  placeholder="Thesis abstract"
                  className="mt-1 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="Enter keywords separated by commas"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate multiple keywords with commas
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  onClick={handleSave}
                  disabled={saving || !formData.title.trim() || !formData.author.trim()}
                  className="bg-dlsl-green hover:bg-dlsl-green/90"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/manage-records')}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThesisEdit;
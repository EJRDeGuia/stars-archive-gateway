
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, FileText, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useThesis } from '@/hooks/useApi';

const RequestThesisAccess = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: thesis, isLoading } = useThesis(id || '');
  
  const [formData, setFormData] = useState({
    requesterName: user?.name || '',
    requesterEmail: user?.email || '',
    institution: '',
    purpose: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('thesis_access_requests')
        .insert([
          {
            thesis_id: id,
            user_id: user.id,
            requester_name: formData.requesterName,
            requester_email: formData.requesterEmail,
            institution: formData.institution,
            purpose: formData.purpose
          }
        ]);

      if (error) throw error;

      toast.success('Access request submitted successfully!');
      navigate(`/thesis/${id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Thesis not found</h1>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <Button 
            onClick={() => navigate(`/thesis/${id}`)} 
            variant="ghost" 
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Thesis
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Thesis Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-dlsl-green" />
                    Thesis Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{thesis.title}</h3>
                      <p className="text-sm text-gray-600">by {thesis.author}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <strong>College:</strong> {thesis.colleges?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Year:</strong> {thesis.publish_date ? new Date(thesis.publish_date).getFullYear() : 'N/A'}
                      </p>
                    </div>
                    {thesis.abstract && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Abstract:</p>
                        <p className="text-sm text-gray-600 line-clamp-4">{thesis.abstract}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Request Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Request Full Access</CardTitle>
                  <p className="text-sm text-gray-600">
                    Please provide the following information to request full access to this thesis.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="requesterName">Full Name *</Label>
                        <Input
                          id="requesterName"
                          value={formData.requesterName}
                          onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="requesterEmail">Email Address *</Label>
                        <Input
                          id="requesterEmail"
                          type="email"
                          value={formData.requesterEmail}
                          onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="institution">Institution/Organization</Label>
                      <Input
                        id="institution"
                        value={formData.institution}
                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                        placeholder="e.g., De La Salle Lipa, University of the Philippines"
                      />
                    </div>

                    <div>
                      <Label htmlFor="purpose">Purpose of Request *</Label>
                      <Textarea
                        id="purpose"
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="Please describe how you intend to use this thesis (e.g., academic research, literature review, etc.)"
                        rows={4}
                        required
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Your request will be reviewed by our archivists</li>
                        <li>• You'll receive an email notification once reviewed</li>
                        <li>• If approved, the full thesis will be sent to your email</li>
                        <li>• Processing typically takes 1-3 business days</li>
                      </ul>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-dlsl-green hover:bg-dlsl-green/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Access Request
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestThesisAccess;

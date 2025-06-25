
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, FileText, Send, Plus, X, CheckCircle, Clock, User, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useThesis } from '@/hooks/useApi';
import type { Thesis } from '@/types/thesis';

interface RequestFormData {
  requesterName: string;
  requesterEmail: string;
  institution: string;
  purpose: string;
}

const RequestThesisAccess = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requests, setRequests] = useState<RequestFormData[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedRequests, setSubmittedRequests] = useState<string[]>([]);
  
  const { data: thesis, isLoading } = useThesis(id || '') as { data: Thesis | undefined, isLoading: boolean };
  
  const [baseForm, setBaseForm] = useState<RequestFormData>({
    requesterName: user?.name || '',
    requesterEmail: user?.email || '',
    institution: '',
    purpose: ''
  });

  const addRequest = () => {
    setRequests([...requests, { ...baseForm }]);
  };

  const removeRequest = (index: number) => {
    setRequests(requests.filter((_, i) => i !== index));
  };

  const updateRequest = (index: number, field: keyof RequestFormData, value: string) => {
    const updated = [...requests];
    updated[index] = { ...updated[index], [field]: value };
    setRequests(updated);
  };

  const handleSubmitSingle = async (e: React.FormEvent) => {
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
            requester_name: baseForm.requesterName,
            requester_email: baseForm.requesterEmail,
            institution: baseForm.institution,
            purpose: baseForm.purpose
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

  const handleSubmitMultiple = async () => {
    if (!user || !id) return;

    setIsSubmitting(true);
    const failedRequests: number[] = [];

    try {
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        try {
          const { error } = await supabase
            .from('thesis_access_requests')
            .insert([
              {
                thesis_id: id,
                user_id: user.id,
                requester_name: request.requesterName,
                requester_email: request.requesterEmail,
                institution: request.institution,
                purpose: request.purpose
              }
            ]);

          if (error) throw error;
          setSubmittedRequests(prev => [...prev, `request-${i}`]);
        } catch (error) {
          failedRequests.push(i + 1);
        }
      }

      if (failedRequests.length === 0) {
        toast.success(`All ${requests.length} requests submitted successfully!`);
        navigate(`/thesis/${id}`);
      } else {
        toast.error(`Failed to submit requests: ${failedRequests.join(', ')}`);
      }
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
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dlsl-green mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading thesis information...</p>
            </div>
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
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Thesis not found. Please check the URL and try again.
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progressValue = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <Button 
            onClick={() => navigate(`/thesis/${id}`)} 
            variant="ghost" 
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Thesis
          </Button>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Request Progress</span>
              <span>{currentStep}/3</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Choose Type</span>
              <span>Fill Details</span>
              <span>Submit</span>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Thesis Info */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
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
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          by {thesis.author}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          <strong>College:</strong> {thesis.colleges?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
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

              {/* Request Type Selection */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Choose Request Type</CardTitle>
                    <p className="text-sm text-gray-600">
                      Select how you'd like to submit your access request.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card 
                        className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        onClick={() => setCurrentStep(2)}
                      >
                        <CardContent className="p-6 text-center">
                          <User className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Single Request</h3>
                          <p className="text-sm text-gray-600">
                            Submit one request for yourself or on behalf of one person.
                          </p>
                        </CardContent>
                      </Card>

                      <Card 
                        className="cursor-pointer hover:bg-green-50 hover:border-green-200 transition-colors"
                        onClick={() => {
                          addRequest();
                          setCurrentStep(2);
                        }}
                      >
                        <CardContent className="p-6 text-center">
                          <Plus className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <h3 className="font-semibold mb-2">Multiple Requests</h3>
                          <p className="text-sm text-gray-600">
                            Submit requests for multiple people or institutions at once.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Thesis Info */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-dlsl-green" />
                      Thesis Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{thesis.title}</h3>
                        <p className="text-sm text-gray-600">by {thesis.author}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>College:</strong> {thesis.colleges?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Request Forms */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Request Details</span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentStep(1)}
                        >
                          Back
                        </Button>
                        {requests.length === 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addRequest}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Multiple
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {requests.length === 0 ? (
                      // Single Request Form
                      <form onSubmit={handleSubmitSingle} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="requesterName">Full Name *</Label>
                            <Input
                              id="requesterName"
                              value={baseForm.requesterName}
                              onChange={(e) => setBaseForm({ ...baseForm, requesterName: e.target.value })}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="requesterEmail">Email Address *</Label>
                            <Input
                              id="requesterEmail"
                              type="email"
                              value={baseForm.requesterEmail}
                              onChange={(e) => setBaseForm({ ...baseForm, requesterEmail: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="institution">Institution/Organization</Label>
                          <Input
                            id="institution"
                            value={baseForm.institution}
                            onChange={(e) => setBaseForm({ ...baseForm, institution: e.target.value })}
                            placeholder="e.g., De La Salle Lipa, University of the Philippines"
                          />
                        </div>

                        <div>
                          <Label htmlFor="purpose">Purpose of Request *</Label>
                          <Textarea
                            id="purpose"
                            value={baseForm.purpose}
                            onChange={(e) => setBaseForm({ ...baseForm, purpose: e.target.value })}
                            placeholder="Please describe how you intend to use this thesis..."
                            rows={4}
                            required
                          />
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
                    ) : (
                      // Multiple Requests Form
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium">Multiple Requests ({requests.length})</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addRequest}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Another
                          </Button>
                        </div>

                        <div className="space-y-6">
                          {requests.map((request, index) => (
                            <Card key={index} className="border-l-4 border-l-dlsl-green">
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-base">Request #{index + 1}</CardTitle>
                                  {requests.length > 1 && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeRequest(index)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <Label>Full Name *</Label>
                                    <Input
                                      value={request.requesterName}
                                      onChange={(e) => updateRequest(index, 'requesterName', e.target.value)}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label>Email Address *</Label>
                                    <Input
                                      type="email"
                                      value={request.requesterEmail}
                                      onChange={(e) => updateRequest(index, 'requesterEmail', e.target.value)}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <Label>Institution/Organization</Label>
                                  <Input
                                    value={request.institution}
                                    onChange={(e) => updateRequest(index, 'institution', e.target.value)}
                                    placeholder="e.g., De La Salle Lipa"
                                  />
                                </div>

                                <div>
                                  <Label>Purpose of Request *</Label>
                                  <Textarea
                                    value={request.purpose}
                                    onChange={(e) => updateRequest(index, 'purpose', e.target.value)}
                                    placeholder="Describe the intended use..."
                                    rows={3}
                                    required
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        <Button 
                          onClick={handleSubmitMultiple}
                          className="w-full bg-dlsl-green hover:bg-dlsl-green/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>Submitting {requests.length} Requests...</>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit All {requests.length} Requests
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Process Information */}
          <div className="mt-8">
            <Alert className="bg-blue-50 border-blue-200">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Your request(s) will be reviewed by our archivists</li>
                  <li>• You'll receive email notifications once reviewed</li>
                  <li>• If approved, the full thesis will be sent to the specified email address(es)</li>
                  <li>• Processing typically takes 1-3 business days</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestThesisAccess;

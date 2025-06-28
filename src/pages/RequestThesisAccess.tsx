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
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, FileText, Send, Plus, X, CheckCircle, Clock, User, Building2, Search, BookOpen, Heart, History } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useThesis, useUserFavorites } from '@/hooks/useApi';
import { useRecentTheses } from '@/hooks/useRecentTheses';
import type { Thesis } from '@/types/thesis';

interface SelectedThesis {
  id: string;
  title: string;
  author: string;
  college_name?: string;
  publish_date?: string;
}

interface SearchThesis {
  id: string;
  title: string;
  author: string;
  publish_date: string | null;
  colleges: {
    name: string;
  } | null;
}

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
  const [selectedTheses, setSelectedTheses] = useState<SelectedThesis[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchThesis[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: initialThesis, isLoading } = useThesis(id || '') as { data: Thesis | undefined, isLoading: boolean };
  const { data: userFavorites } = useUserFavorites(user?.id);
  const { recentTheses, isLoading: recentLoading } = useRecentTheses();
  
  const [formData, setFormData] = useState<RequestFormData>({
    requesterName: user?.name || user?.email?.split('@')[0] || '',
    requesterEmail: user?.email || '',
    institution: '',
    purpose: ''
  });

  // Add initial thesis to selected theses when loaded
  React.useEffect(() => {
    if (initialThesis && selectedTheses.length === 0) {
      setSelectedTheses([{
        id: initialThesis.id,
        title: initialThesis.title,
        author: initialThesis.author,
        college_name: initialThesis.colleges?.name,
        publish_date: initialThesis.publish_date
      }]);
    }
  }, [initialThesis]);

  const searchTheses = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('theses')
        .select(`
          id,
          title,
          author,
          publish_date,
          colleges (
            name
          )
        `)
        .ilike('title', `%${query}%`)
        .eq('status', 'approved')
        .limit(10);

      if (error) throw error;
      setSearchResults(data as SearchThesis[] || []);
    } catch (error: any) {
      console.error('Search error:', error);
      toast.error('Failed to search theses');
    } finally {
      setIsSearching(false);
    }
  };

  const addThesis = (thesis: SearchThesis | any) => {
    const isAlreadySelected = selectedTheses.some(t => t.id === thesis.id);
    if (isAlreadySelected) {
      toast.info('This thesis is already selected');
      return;
    }

    const newThesis: SelectedThesis = {
      id: thesis.id,
      title: thesis.title,
      author: thesis.author,
      college_name: thesis.colleges?.name || thesis.college_name,
      publish_date: thesis.publish_date
    };

    setSelectedTheses([...selectedTheses, newThesis]);
    setSearchQuery('');
    setSearchResults([]);
    toast.success('Thesis added to request');
  };

  const removeThesis = (thesisId: string) => {
    if (selectedTheses.length === 1) {
      toast.error('You must have at least one thesis in your request');
      return;
    }
    setSelectedTheses(selectedTheses.filter(t => t.id !== thesisId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || selectedTheses.length === 0) {
      toast.error('Please ensure you are logged in and have selected at least one thesis');
      return;
    }

    // Validate required fields
    if (!formData.requesterName.trim() || !formData.requesterEmail.trim() || !formData.purpose.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    let successCount = 0;
    let failureCount = 0;

    try {
      for (const thesis of selectedTheses) {
        try {
          const { data, error } = await supabase
            .from('thesis_access_requests')
            .insert([
              {
                thesis_id: thesis.id,
                user_id: user.id,
                requester_name: formData.requesterName.trim(),
                requester_email: formData.requesterEmail.trim(),
                institution: formData.institution.trim() || null,
                purpose: formData.purpose.trim(),
                status: 'pending'
              }
            ])
            .select()
            .single();

          if (error) throw error;
          successCount++;
        } catch (error: any) {
          console.error('Failed to submit request for thesis:', thesis.title, error);
          failureCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully submitted ${successCount} thesis access request(s)!`);
        setTimeout(() => {
          if (id) {
            navigate(`/thesis/${id}`);
          } else {
            navigate('/explore');
          }
        }, 2000);
      }

      if (failureCount > 0) {
        toast.error(`Failed to submit ${failureCount} request(s). Please try again.`);
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && id) {
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

  const progressValue = currentStep === 1 ? 50 : 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          <Button 
            onClick={() => id ? navigate(`/thesis/${id}`) : navigate('/explore')} 
            variant="ghost" 
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {id ? 'Thesis' : 'Explore'}
          </Button>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Request Progress</span>
              <span>{currentStep}/2</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Select Theses</span>
              <span>Submit Request</span>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Selected Theses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-dlsl-green" />
                      Selected Theses ({selectedTheses.length})
                    </span>
                    <Button
                      onClick={() => setCurrentStep(2)}
                      disabled={selectedTheses.length === 0}
                      className="bg-dlsl-green hover:bg-dlsl-green/90"
                    >
                      Continue to Request Details
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTheses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No theses selected. Search and add theses below.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedTheses.map((thesis) => (
                        <Card key={thesis.id} className="border-l-4 border-l-dlsl-green">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-sm line-clamp-2">{thesis.title}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeThesis(thesis.id)}
                                className="text-red-600 hover:text-red-800 ml-2"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">by {thesis.author}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {thesis.college_name && (
                                <Badge variant="outline">{thesis.college_name}</Badge>
                              )}
                              {thesis.publish_date && (
                                <span>{new Date(thesis.publish_date).getFullYear()}</span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Theses Section */}
              {recentTheses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5 text-dlsl-green" />
                      Recently Viewed Theses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recentTheses.map((thesis) => (
                        <Card key={thesis.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">{thesis.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">by {thesis.author}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                {thesis.college_name && (
                                  <Badge variant="outline" className="text-xs">{thesis.college_name}</Badge>
                                )}
                              </div>
                              <Button size="sm" variant="outline" onClick={() => addThesis(thesis)}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Your Library Section */}
              {userFavorites && userFavorites.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-dlsl-green" />
                      Your Library (Favorites)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                      {userFavorites.slice(0, 6).map((favorite) => (
                        <Card key={favorite.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">Favorite Thesis</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">From your favorites</span>
                              <Button size="sm" variant="outline" onClick={() => {
                                // We need to fetch the actual thesis data for favorites
                                toast.info('Feature coming soon - add from favorites');
                              }}>
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Search and Add Theses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-dlsl-green" />
                    Search and Add More Theses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Input
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          searchTheses(e.target.value);
                        }}
                        placeholder="Search by title..."
                        className="pr-10"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dlsl-green"></div>
                        </div>
                      )}
                    </div>

                    {searchResults.length > 0 && (
                      <div className="border rounded-lg max-h-60 overflow-y-auto">
                        {searchResults.map((thesis) => (
                          <div
                            key={thesis.id}
                            className="p-3 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                            onClick={() => addThesis(thesis)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm line-clamp-1">{thesis.title}</h4>
                                <p className="text-sm text-gray-600">by {thesis.author}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {thesis.colleges?.name && (
                                    <Badge variant="outline" className="text-xs">{thesis.colleges.name}</Badge>
                                  )}
                                  {thesis.publish_date && (
                                    <span className="text-xs text-gray-500">
                                      {new Date(thesis.publish_date).getFullYear()}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Selected Theses Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-dlsl-green" />
                      Request Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium mb-2">Requesting access to {selectedTheses.length} thesis(es):</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {selectedTheses.map((thesis) => (
                            <div key={thesis.id} className="text-sm">
                              <p className="font-medium line-clamp-1">{thesis.title}</p>
                              <p className="text-gray-600">by {thesis.author}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentStep(1)}
                        className="w-full"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Modify Selection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Request Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Details</CardTitle>
                    <p className="text-sm text-gray-600">
                      Provide your information and the purpose for requesting access to these theses.
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
                          placeholder="Please describe how you intend to use these theses..."
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
                          <>Submitting {selectedTheses.length} Request(s)...</>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Access Request for {selectedTheses.length} Thesis(es)
                          </>
                        )}
                      </Button>
                    </form>
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
                  <li>• If approved, the full theses will be sent to your email address</li>
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

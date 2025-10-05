import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LRCApprovalRequestForm from '@/components/LRCApprovalRequestForm';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const RequestSpecificThesisAccess = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thesis, setThesis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      toast.error('No thesis ID provided');
      navigate('/request-access');
      return;
    }

    const fetchThesis = async () => {
      try {
        const { data, error } = await supabase
          .from('theses')
          .select(`
            id,
            title,
            author,
            abstract,
            colleges (
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          toast.error('Thesis not found');
          navigate('/request-access');
          return;
        }

        setThesis(data);
      } catch (error) {
        console.error('Error fetching thesis:', error);
        toast.error('Failed to load thesis information');
        navigate('/request-access');
      } finally {
        setLoading(false);
      }
    };

    fetchThesis();
  }, [id, navigate]);

  const handleSuccess = () => {
    toast.success('Access request submitted successfully!');
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-dlsl-green mx-auto mb-4" />
            <p className="text-gray-600">Loading thesis information...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!thesis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <p className="text-gray-700 mb-4">Thesis not found</p>
              <Button onClick={() => navigate('/request-access')}>
                Browse Theses
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
        <Header />
        
        <main className="flex-1 py-12 px-4">
          <div className="container max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            {/* Thesis Information */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {thesis.title}
                </h1>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Author:</span> {thesis.author}</p>
                  {thesis.colleges && (
                    <p><span className="font-medium">College:</span> {thesis.colleges.name}</p>
                  )}
                </div>
                {thesis.abstract && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Abstract</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{thesis.abstract}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Form */}
            <LRCApprovalRequestForm
              thesisId={thesis.id}
              thesisTitle={thesis.title}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </main>

        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default RequestSpecificThesisAccess;

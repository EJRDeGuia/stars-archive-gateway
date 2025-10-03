import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LRCApprovalRequestForm from '@/components/LRCApprovalRequestForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const RequestThesisAccessForm: React.FC = () => {
  const { thesisId } = useParams<{ thesisId: string }>();
  const navigate = useNavigate();
  const [thesis, setThesis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThesis = async () => {
      if (!thesisId) {
        toast.error('Thesis ID is required');
        navigate('/request-access');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('theses')
          .select('id, title, author, abstract, keywords, colleges(name)')
          .eq('id', thesisId)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast.error('Thesis not found');
          navigate('/request-access');
          return;
        }

        setThesis(data);
      } catch (error: any) {
        console.error('Error fetching thesis:', error);
        toast.error('Failed to load thesis details');
        navigate('/request-access');
      } finally {
        setLoading(false);
      }
    };

    fetchThesis();
  }, [thesisId, navigate]);

  const handleSuccess = () => {
    toast.success('Request submitted successfully');
    navigate('/library');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-dlsl-green" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!thesis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Request Thesis Access</h1>
          <p className="text-muted-foreground">
            Submit a request to the LRC for access to this thesis document
          </p>
        </div>

        {/* Thesis Details Card */}
        <Card className="p-6 mb-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-dlsl-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-dlsl-green" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground mb-2">{thesis.title}</h2>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium">Author:</span> {thesis.author}</p>
                <p><span className="font-medium">College:</span> {thesis.colleges?.name || 'N/A'}</p>
              </div>
              {thesis.abstract && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground line-clamp-3">{thesis.abstract}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Request Form */}
        <LRCApprovalRequestForm
          thesisId={thesisId!}
          thesisTitle={thesis.title}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </main>

      <Footer />
    </div>
  );
};

export default RequestThesisAccessForm;

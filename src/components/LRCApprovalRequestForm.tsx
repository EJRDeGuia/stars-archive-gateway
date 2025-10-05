
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLRCApproval } from '@/hooks/useLRCApproval';
import { FileText, Lock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LRCApprovalRequestFormProps {
  thesisId: string;
  thesisTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LRCApprovalRequestForm: React.FC<LRCApprovalRequestFormProps> = ({
  thesisId,
  thesisTitle,
  onSuccess,
  onCancel
}) => {
  const [requestType, setRequestType] = useState<'full_text_access' | 'download_access'>('full_text_access');
  const [justification, setJustification] = useState('');
  const { submitApprovalRequest, isLoading } = useLRCApproval();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Comprehensive validation
    const trimmedJustification = justification.trim();
    
    if (!trimmedJustification) {
      toast.error('Please provide a justification for your request');
      return;
    }

    if (trimmedJustification.length < 50) {
      toast.error('Justification must be at least 50 characters long');
      return;
    }

    if (!thesisId) {
      toast.error('Invalid thesis ID');
      return;
    }

    try {
      const result = await submitApprovalRequest({
        thesisId,
        requestType,
        justification: trimmedJustification
      });

      if (result.success && onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-dlsl-green" />
          Request Thesis Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Access Request Information</h4>
                <p className="text-blue-800 text-sm mt-1">
                  You are requesting access to: <strong>"{thesisTitle}"</strong>
                </p>
                <p className="text-blue-700 text-sm mt-2">
                  Your request will be reviewed by LRC staff. You will be notified via email when a decision is made.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium">Access Type Requested</Label>
            <RadioGroup value={requestType} onValueChange={(value) => setRequestType(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="full_text_access" id="full_text" />
                <Label htmlFor="full_text" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Full Text Access (View PDF online)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="download_access" id="download" />
                <Label htmlFor="download" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Download Access (Download PDF file)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="justification" className="text-sm font-medium">
              Research Purpose & Justification *
            </Label>
            <Textarea
              id="justification"
              placeholder="Please describe your research purpose, how this thesis relates to your work, and why you need access. Include your institution and supervisor information if applicable."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              rows={6}
              className="resize-none"
              required
            />
            <p className="text-sm text-gray-600">
              Minimum 50 characters. Be specific about your research needs.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
            <ul className="text-yellow-800 text-sm space-y-1">
              <li>• Access is granted for academic and research purposes only</li>
              <li>• Approved access may have time limitations</li>
              <li>• Misuse of access privileges may result in permanent restrictions</li>
              <li>• Contact LRC staff directly for urgent requests</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading || !justification.trim() || justification.length < 50}
              className="bg-dlsl-green hover:bg-dlsl-green/90"
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LRCApprovalRequestForm;

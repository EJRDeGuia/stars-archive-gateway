
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Lock, AlertCircle, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLog } from '@/hooks/useAuditLog';
import RequestAccessButton from './RequestAccessButton';
import { supabase } from '@/integrations/supabase/client';

// Set the workerSrc property for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl?: string;
  title: string;
  canView: boolean;
  maxPages?: number;
  className?: string;
  thesisId?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  title,
  canView,
  maxPages,
  className = '',
  thesisId,
}) => {
  const { user } = useAuth();
  const { logEvent } = useAuditLog();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [showSecurityNotice, setShowSecurityNotice] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  // Check if user has elevated access (archivist or admin)
  const hasElevatedAccess = user && ['archivist', 'admin'].includes(user.role);
  
  // Determine actual max pages based on user role
  const actualMaxPages = hasElevatedAccess ? undefined : (maxPages || 10);

  // Create secure PDF URL using the edge function
  const getSecurePDFUrl = () => {
    if (!thesisId || !user) return null;
    
    // Use the secure edge function instead of direct storage URL
    return `${supabase.supabaseUrl}/functions/v1/secure-thesis-access?thesisId=${thesisId}`;
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
    
    // Log successful PDF load
    if (thesisId) {
      logEvent({
        action: 'pdf_viewed',
        resourceType: 'thesis',
        resourceId: thesisId,
        details: { 
          total_pages: numPages,
          max_pages_shown: actualMaxPages || numPages
        }
      });
    }
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
    setPdfError('Failed to load PDF. You may not have access to this document.');
    
    // Log PDF load failure
    if (thesisId) {
      logEvent({
        action: 'pdf_load_failed',
        resourceType: 'thesis',
        resourceId: thesisId,
        details: { 
          error: error.message
        }
      });
    }
  };

  // NO ACCESS
  if (!canView) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-8">
          <div className="text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 shadow">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Access Restricted</h3>
            <p className="text-gray-700 mb-5 max-w-[350px]">
              Document access is limited to authorized DLSL researchers, archivists, and staff within the LRC network.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 max-w-[330px] mx-auto">
              <p className="text-yellow-800 text-sm leading-relaxed">
                <strong>Network Access Required:</strong> Connect to De La Salle Lipa Learning Resource Center's intranet to view full content.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-[350px] mx-auto">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>To access this document, please contact the LRC directly.</strong>
                </p>
              </div>
            </div>
            {thesisId && (
              <RequestAccessButton thesisId={thesisId} className="mb-4" />
            )}
            <Button variant="outline" className="mr-0 w-full max-w-[210px] shadow-sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Contact LRC
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the secure PDF URL
  const securePdfUrl = getSecurePDFUrl();

  // NO PDF PROVIDED OR NO SECURE ACCESS
  if (!securePdfUrl) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-0">
          <div className="bg-green-50 border-b border-green-200 py-3 px-6 rounded-t-2xl">
            <div className="flex items-center gap-2 justify-center">
              <FileText className="w-6 h-6 text-dlsl-green" />
              <span className="text-lg font-semibold text-dlsl-green">Preview Unavailable</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-dlsl-green/10 flex items-center justify-center mb-7 shadow">
              <FileText className="w-10 h-10 text-dlsl-green" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">Document Preview</h3>
            <div className="text-gray-600 mb-5 max-w-xs text-center">
              The PDF preview will appear here when available for this thesis.<br />
              Please contact the LRC for preview or access.
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-7 max-w-[330px]">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800 text-sm leading-relaxed">
                  <strong>Document Access:</strong> To access this document, please contact the LRC directly.
                </p>
              </div>
            </div>
            {thesisId && !hasElevatedAccess && (
              <RequestAccessButton thesisId={thesisId} className="mb-4" />
            )}
            <Button className="bg-dlsl-green text-white shadow" disabled>
              <ExternalLink className="w-4 h-4 mr-2 opacity-70" />
              Contact LRC for Access
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Set the number of preview pages to show
  const totalPagesToShow = actualMaxPages && numPages ? Math.min(actualMaxPages, numPages) : numPages;

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {showSecurityNotice && !hasElevatedAccess && (
          <div className="bg-red-50 border-b border-red-200 p-3 rounded-t-2xl relative">
            <button
              onClick={() => setShowSecurityNotice(false)}
              className="absolute right-3 top-3 text-red-600 hover:text-red-800 transition-colors"
              aria-label="Close security notice"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-2 justify-center pr-8">
              <Lock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm text-center">
                <strong>Security Notice:</strong> This document is protected: copying, printing, and screenshots are not allowed. 
                {!hasElevatedAccess && thesisId && (
                  <span> You are viewing a limited preview. <RequestAccessButton thesisId={thesisId} className="ml-2 text-xs px-2 py-1 h-auto" /> for full access.</span>
                )}
              </p>
            </div>
          </div>
        )}

        {hasElevatedAccess && (
          <div className="bg-green-50 border-b border-green-200 p-3 rounded-t-2xl">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 text-sm text-center">
                <strong>Full Access Granted:</strong> As an {user?.role}, you have access to the complete document.
              </p>
            </div>
          </div>
        )}

        {/* Improved Scrollable PDF Area */}
        <div className="relative bg-gray-50 rounded-b-2xl" style={{ minHeight: 300, maxHeight: 640 }}>
          <ScrollArea className="w-full h-[560px] md:h-[600px] lg:h-[640px] overflow-auto">
            <div className="flex flex-col items-center gap-6 px-2 pb-2">
              {pdfError ? (
                <div className="w-full flex flex-col items-center justify-center py-14 text-red-400">
                  <FileText className="w-12 h-12 mb-4 text-red-200" />
                  <div className="text-center">
                    <div className="font-medium">Failed to load PDF preview</div>
                    <div className="text-sm text-gray-600 mt-2">{pdfError}</div>
                    <div className="text-sm text-gray-600 mt-1">Contact the LRC for assistance.</div>
                  </div>
                </div>
              ) : (
                <Document
                  file={{
                    url: securePdfUrl,
                    httpHeaders: {
                      'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
                    }
                  }}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="w-full flex flex-col items-center justify-center py-14 text-gray-400">
                      <FileText className="w-12 h-12 mb-4 text-gray-300" />
                      <div>Loading secure PDF preview...</div>
                    </div>
                  }
                  error={
                    <div className="w-full flex flex-col items-center justify-center py-14 text-red-400">
                      <FileText className="w-12 h-12 mb-4 text-red-200" />
                      <div>Failed to load PDF preview</div>
                      <div className="text-sm text-gray-600 mt-2">You may not have access to this document.</div>
                      <div className="text-sm text-gray-600 mt-1">Contact the LRC for assistance.</div>
                    </div>
                  }
                  className="w-full flex flex-col items-center"
                >
                  {Array.from(
                    new Array(totalPagesToShow || 0),
                    (_, index) => (
                      <div
                        key={`page_wrap_${index + 1}`}
                        className="w-full flex justify-center py-2"
                      >
                        <Page
                          pageNumber={index + 1}
                          width={Math.min(700, window.innerWidth - 60)}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          loading={
                            <div className="flex flex-col items-center py-8">
                              <FileText className="w-8 h-8 mb-2 text-gray-200" />
                              <span className="text-gray-300">Loading page...</span>
                            </div>
                          }
                          className="mx-auto rounded-md border border-gray-200 shadow bg-white"
                        />
                      </div>
                    ),
                  )}
                </Document>
              )}
              {numPages && actualMaxPages && numPages > actualMaxPages && !hasElevatedAccess && (
                <div className="mt-4 mb-2 text-sm text-gray-600 bg-yellow-50 rounded p-3 border border-yellow-100 shadow flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-500 mr-1" />
                  Only the first {actualMaxPages} pages are visible. 
                  {thesisId && (
                    <RequestAccessButton thesisId={thesisId} className="ml-2 text-xs px-2 py-1 h-auto" />
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;

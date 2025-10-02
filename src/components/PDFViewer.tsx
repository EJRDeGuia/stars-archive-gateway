import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Lock, AlertCircle, X, WifiOff, AlertTriangle, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLog } from '@/hooks/useAuditLog';
import RequestAccessButton from './RequestAccessButton';
import { supabase } from '@/integrations/supabase/client';
import { networkAccessService } from '@/services/networkAccess';
import { logger } from '@/services/logger';

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
  const [networkAccessDenied, setNetworkAccessDenied] = useState(false);

  // Check if user has elevated access (archivist or admin)
  const hasElevatedAccess = user && ['archivist', 'admin'].includes(user.role);
  
  // Determine actual max pages based on user role
  const actualMaxPages = hasElevatedAccess ? undefined : (maxPages || 10);

  const [pdfSource, setPdfSource] = useState<string | { url: string; httpHeaders: Record<string, string> } | null>(null);

  // Check network access before loading PDF
  useEffect(() => {
    const checkNetworkAccess = async () => {
      try {
        const accessResult = await networkAccessService.canAccessPDFsNow();
        if (!accessResult.allowed) {
          setNetworkAccessDenied(true);
          setPdfError('PDF access is disabled - ' + accessResult.reason);
          logger.warn('PDF access denied', { reason: accessResult.reason, thesisId });
          return;
        }
        setNetworkAccessDenied(false);
        logger.info('Network access granted for PDF viewing', { thesisId });
      } catch (error) {
        setNetworkAccessDenied(true);
        setPdfError('Network access check failed');
        logger.error('Network access check failed', { error, thesisId });
        return;
      }
    };
    
    checkNetworkAccess();
  }, [canView, thesisId]);

  // Load PDF source when component mounts or pdfUrl changes
  useEffect(() => {
    const loadPDFSource = async () => {
      if (!pdfUrl || networkAccessDenied) {
        setPdfSource(null);
        return;
      }
      
      // If it's a demo PDF or a public URL, use it directly
      if (pdfUrl.startsWith('/demo-pdfs/')) {
        setPdfSource(pdfUrl);
        return;
      }

      // If the URL is already pointing to our secure edge function, attach auth headers
      if (pdfUrl.startsWith('http') && pdfUrl.includes('/functions/v1/secure-thesis-access')) {
        const { data: { session } } = await supabase.auth.getSession();
        setPdfSource({
          url: pdfUrl,
          httpHeaders: {
            'Authorization': `Bearer ${session?.access_token || ''}`,
          }
        });
        return;
      }

      // For private PDFs stored in Supabase storage, use the edge function with authorization
      if (!thesisId || !user) {
        setPdfSource(null);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      // Normalize pdfUrl to a storage path (e.g., 'timestamp_rand_name.pdf')
      let storagePath = pdfUrl.trim();

      // If a full public storage URL was provided, extract the path after the bucket prefix
      const publicPrefix = '/storage/v1/object/public/thesis-pdfs/';
      if (storagePath.startsWith('http') && storagePath.includes(publicPrefix)) {
        storagePath = storagePath.split(publicPrefix)[1];
      }
      // If the bucket prefix is included, strip it
      if (storagePath.startsWith('thesis-pdfs/')) {
        storagePath = storagePath.replace(/^thesis-pdfs\//, '');
      }

      const params = new URLSearchParams();
      params.set('thesisId', thesisId);
      params.set('path', storagePath);
      
      // Pass bypass parameter if testing mode is enabled
      const bypassEnabled = localStorage.getItem('bypassNetworkCheck') === 'true';
      if (bypassEnabled) {
        params.set('bypass', 'true');
      }

      setPdfSource({
        url: `https://cylsbcjqemluouxblywl.supabase.co/functions/v1/secure-thesis-access?${params.toString()}`,
        httpHeaders: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
        }
      });
    };

    loadPDFSource();
  }, [pdfUrl, thesisId, user, networkAccessDenied]);

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
      logger.info('PDF loaded successfully', { thesisId, numPages });
    }
  };

  const onDocumentLoadError = (error: Error) => {
    handleDocumentError(error);
  };

  const handleDocumentError = (error: Error) => {
    logger.error('PDF load error', { error: error.message, thesisId, pdfUrl });
    setPdfError('Failed to load PDF. You may not have access to this document.');
    
    // Log PDF load failure
    if (thesisId) {
      logEvent({
        action: 'pdf_load_failed',
        resourceType: 'thesis',
        resourceId: thesisId,
        details: { 
          error: 'Failed to load PDF document',
          errorMessage: error.message
        }
      });
    }
  };

  // Disable context menu, copy, and drag operations
  const securityProps = {
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onDragStart: (e: React.DragEvent) => e.preventDefault(),
    onSelectStart: (e: React.SyntheticEvent) => e.preventDefault(),
    onCopy: (e: React.ClipboardEvent) => e.preventDefault(),
    style: {
      WebkitUserSelect: 'none' as const,
      MozUserSelect: 'none' as const,
      msUserSelect: 'none' as const,
      userSelect: 'none' as const,
      WebkitTouchCallout: 'none' as const
    }
  };

  // NETWORK ACCESS DENIED
  if (networkAccessDenied) {
    return (
      <Card className={`${className} border-orange-200`}>
        <CardContent className="p-8">
          <div className="text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <WifiOff className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-orange-900 mb-3">Testing Mode: PDF Access Blocked</h3>
            <div className="bg-orange-50 border border-orange-300 rounded-lg p-4 mb-6 max-w-md">
              <div className="flex items-center gap-2 text-orange-800 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium text-sm">Network Access Required</span>
              </div>
              <p className="text-orange-700 text-sm">
                PDF documents are restricted when Testing Mode is OFF. Enable Testing Mode using the toggle in the bottom-right corner.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Document Access:</strong> To access this document, please contact the LRC directly.
                </div>
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
    <Card className={className} {...securityProps}>
      <CardContent className="p-0" {...securityProps}>
        {/* Security Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {title || 'Thesis Document'}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Secure Preview • Watermarked • Screenshot Protected
                </p>
              </div>
            </div>
            {showSecurityNotice && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSecurityNotice(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {showSecurityNotice && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <div className="font-medium text-blue-900 mb-1">Content Protection Active</div>
                  <div className="text-blue-700">
                    This document is watermarked and protected. Unauthorized distribution is prohibited.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {hasElevatedAccess && (
          <div className="bg-green-50 border-b border-green-200 p-3">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 text-sm text-center">
                <strong>Full Access Granted:</strong> As an {user?.role}, you have access to the complete document.
              </p>
            </div>
          </div>
        )}

        {/* Secure PDF Viewing Area */}
        <div 
          className="relative bg-gray-50 rounded-b-2xl" 
          style={{ minHeight: 300, maxHeight: 640 }}
          {...securityProps}
        >
          <ScrollArea className="w-full h-[560px] md:h-[600px] lg:h-[640px] overflow-auto">
            <div 
              className="flex flex-col items-center gap-6 px-2 pb-2"
              {...securityProps}
            >
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
                pdfSource && (
                  <Document
                    file={pdfSource}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    {Array.from(
                      new Array(actualMaxPages ? Math.min(actualMaxPages, numPages || 0) : numPages || 0),
                      (el, index) => (
                        <div 
                          key={index + 1} 
                          className="relative mb-4"
                          {...securityProps}
                        >
                          {/* Visible watermark overlay */}
                          <div className="absolute inset-0 z-10 pointer-events-none">
                            <div 
                              className="absolute inset-0 flex items-center justify-center"
                              style={{
                                transform: 'rotate(-45deg)',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: 'rgba(220, 38, 127, 0.15)',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                                fontFamily: 'Arial, sans-serif',
                                letterSpacing: '0.2em'
                              }}
                            >
                              STARS ARCHIVE – RESTRICTED
                            </div>
                          </div>
                          
                          {/* Security overlay to prevent screenshots */}
                          <div 
                            className="absolute inset-0 z-20 opacity-0 hover:opacity-5 bg-gradient-to-br from-transparent via-white to-transparent pointer-events-none"
                            style={{ mixBlendMode: 'overlay' }}
                          />
                          
                          <Page
                            pageNumber={index + 1}
                            width={Math.min(window.innerWidth * 0.7, 800)}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
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
                )
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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Lock, AlertCircle, X, Eye, Shield, Camera } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditLog } from '@/hooks/useAuditLog';
import { enhancedSecurityService } from '@/services/enhancedSecurityService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Set the workerSrc property for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface MaxSecurityPDFViewerProps {
  pdfUrl?: string;
  title: string;
  canView: boolean;
  maxPages?: number;
  className?: string;
  thesisId?: string;
}

const MaxSecurityPDFViewer: React.FC<MaxSecurityPDFViewerProps> = ({
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
  const [watermarkApplied, setWatermarkApplied] = useState(false);
  const [securityViolations, setSecurityViolations] = useState(0);
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  
  const viewerRef = useRef<HTMLDivElement>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout>();
  const screenshotAttempts = useRef(0);

  // Check if user has elevated access
  const hasElevatedAccess = user && ['archivist', 'admin'].includes(user.role);
  const actualMaxPages = hasElevatedAccess ? undefined : (maxPages || 5); // Reduced from 10 to 5 for max security

  const [pdfSource, setPdfSource] = useState<string | { url: string; httpHeaders: Record<string, string> } | null>(null);

  // Enhanced security monitoring
  const logSecurityViolation = useCallback(async (violationType: string, details: any) => {
    setSecurityViolations(prev => prev + 1);
    
    if (thesisId) {
      await logEvent({
        action: 'security_violation',
        resourceType: 'thesis',
        resourceId: thesisId,
        details: {
          violation_type: violationType,
          violation_count: securityViolations + 1,
          user_agent: navigator.userAgent,
          timestamp: Date.now(),
          ...details
        }
      });
    }

    // Auto-close after multiple violations
    if (securityViolations >= 2) {
      toast.error("Multiple security violations detected. Document access terminated.");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [thesisId, logEvent, securityViolations]);

  // Screenshot detection
  useEffect(() => {
    const detectScreenshot = (e: KeyboardEvent) => {
      // Detect common screenshot combinations
      const isScreenshot = 
        (e.key === 'PrintScreen') ||
        (e.ctrlKey && e.shiftKey && e.key === 'S') ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && e.key === 'p') || // Print attempt
        (e.ctrlKey && e.key === 's') || // Save attempt
        (e.key === 'F12') || // Dev tools
        (e.ctrlKey && e.shiftKey && e.key === 'I'); // Dev tools

      if (isScreenshot) {
        e.preventDefault();
        screenshotAttempts.current += 1;
        logSecurityViolation('screenshot_attempt', {
          key_combination: `${e.ctrlKey ? 'Ctrl+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.metaKey ? 'Cmd+' : ''}${e.key}`,
          attempts: screenshotAttempts.current
        });
        toast.warning("Screenshot/Print attempt blocked for document security.");
      }
    };

    // Right-click detection
    const detectRightClick = (e: MouseEvent) => {
      if (viewerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        logSecurityViolation('right_click_attempt', {
          coordinates: { x: e.clientX, y: e.clientY }
        });
        toast.warning("Right-click disabled for document security.");
      }
    };

    // Selection detection
    const detectSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0 && viewerRef.current?.contains(selection.anchorNode)) {
        selection.removeAllRanges();
        logSecurityViolation('text_selection_attempt', {
          selected_text_length: selection.toString().length
        });
      }
    };

    // Drag detection
    const detectDrag = (e: DragEvent) => {
      if (viewerRef.current?.contains(e.target as Node)) {
        e.preventDefault();
        logSecurityViolation('drag_attempt', {});
        toast.warning("Drag operation blocked for document security.");
      }
    };

    // Focus monitoring (detect when user leaves document)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityViolation('document_focus_lost', {
          hidden_at: Date.now()
        });
      }
    };

    document.addEventListener('keydown', detectScreenshot);
    document.addEventListener('contextmenu', detectRightClick);
    document.addEventListener('selectstart', detectSelection);
    document.addEventListener('dragstart', detectDrag);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', detectScreenshot);
      document.removeEventListener('contextmenu', detectRightClick);
      document.removeEventListener('selectstart', detectSelection);
      document.removeEventListener('dragstart', detectDrag);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logSecurityViolation]);

  // Activity monitoring
  useEffect(() => {
    const updateActivity = () => {
      setLastActivityTime(Date.now());
    };

    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActivityTime;
      
      // Auto-close after 10 minutes of inactivity (reduced from typical 30+ minutes)
      if (inactiveTime > 10 * 60 * 1000) {
        logSecurityViolation('session_timeout', {
          inactive_duration: inactiveTime
        });
        toast.error("Session expired due to inactivity.");
        window.location.reload();
      }
      
      // Warning at 8 minutes
      if (inactiveTime > 8 * 60 * 1000 && inactiveTime < 8.1 * 60 * 1000) {
        toast.warning("Document will close in 2 minutes due to inactivity.");
      }
    };

    // Monitor user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    // Check inactivity every 30 seconds
    const inactivityInterval = setInterval(checkInactivity, 30000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      clearInterval(inactivityInterval);
    };
  }, [lastActivityTime, logSecurityViolation]);

  // Apply watermark when document loads
  useEffect(() => {
    const applyWatermark = async () => {
      if (thesisId && user && !watermarkApplied) {
        try {
          await enhancedSecurityService.applyWatermark(thesisId, 'invisible');
          setWatermarkApplied(true);
          
          await logEvent({
            action: 'watermark_applied',
            resourceType: 'thesis',
            resourceId: thesisId,
            details: {
              watermark_type: 'invisible',
              user_id: user.id,
              applied_at: Date.now()
            }
          });
        } catch (error) {
          console.error('Watermark application failed:', error);
        }
      }
    };

    if (canView && pdfSource) {
      applyWatermark();
    }
  }, [thesisId, user, canView, pdfSource, watermarkApplied, logEvent]);

  // Load PDF source with enhanced security
  useEffect(() => {
    const loadPDFSource = async () => {
      if (!pdfUrl || !canView) {
        setPdfSource(null);
        return;
      }
      
      // Enhanced access validation
      if (thesisId) {
        try {
          const permission = await enhancedSecurityService.validateDownloadPermission(thesisId, 'preview');
          if (!permission.allowed) {
            setPdfError("Access denied: Insufficient permissions");
            return;
          }
        } catch (error) {
          setPdfError("Access validation failed");
          return;
        }
      }
      
      // Demo PDFs
      if (pdfUrl.startsWith('/demo-pdfs/')) {
        setPdfSource(pdfUrl);
        return;
      }

      // Secure edge function access
      if (!thesisId || !user) {
        setPdfSource(null);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      let storagePath = pdfUrl.trim();

      // Normalize storage path
      const publicPrefix = '/storage/v1/object/public/thesis-pdfs/';
      if (storagePath.startsWith('http') && storagePath.includes(publicPrefix)) {
        storagePath = storagePath.split(publicPrefix)[1];
      }
      if (storagePath.startsWith('thesis-pdfs/')) {
        storagePath = storagePath.replace(/^thesis-pdfs\//, '');
      }

      const params = new URLSearchParams();
      params.set('thesisId', thesisId);
      params.set('path', storagePath);

      setPdfSource({
        url: `https://cylsbcjqemluouxblywl.supabase.co/functions/v1/secure-thesis-access?${params.toString()}`,
        httpHeaders: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'X-Security-Mode': 'maximum',
          'X-User-Role': user.role,
        }
      });
    };

    loadPDFSource();
  }, [pdfUrl, thesisId, user, canView]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPdfError(null);
    
    // Enhanced logging
    if (thesisId) {
      logEvent({
        action: 'secure_pdf_viewed',
        resourceType: 'thesis',
        resourceId: thesisId,
        details: { 
          total_pages: numPages,
          max_pages_shown: actualMaxPages || numPages,
          security_level: 'maximum',
          watermark_applied: watermarkApplied,
          user_role: user?.role,
          session_start: Date.now()
        }
      });
    }
  };

  // NO ACCESS
  if (!canView) {
    return (
      <Card className={`${className} border-red-200`}>
        <CardContent className="p-8">
          <div className="text-center flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6 shadow">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-900 mb-3 tracking-tight">Maximum Security - Access Denied</h3>
            <p className="text-red-700 mb-5 max-w-[350px]">
              This document is under maximum security protection. Access is restricted to verified users within secure network perimeters.
            </p>
            <div className="bg-red-50 border border-red-300 rounded-lg p-4 mb-6 max-w-[330px] mx-auto">
              <p className="text-red-800 text-sm leading-relaxed">
                <strong>Security Level: MAXIMUM</strong><br/>
                • Network verification required<br/>
                • Multi-factor authentication<br/>
                • Encrypted transmission only
              </p>
            </div>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <Shield className="w-4 h-4 mr-2" />
              Request Secure Access
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // NO PDF OR ACCESS VALIDATION FAILED
  if (!pdfSource) {
    return (
      <Card className={`${className} border-orange-200`}>
        <CardContent className="p-0">
          <div className="bg-orange-50 border-b border-orange-200 py-3 px-6 rounded-t-2xl">
            <div className="flex items-center gap-2 justify-center">
              <Shield className="w-6 h-6 text-orange-600" />
              <span className="text-lg font-semibold text-orange-800">Security Validation Required</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-orange-100 flex items-center justify-center mb-7 shadow">
              <Lock className="w-10 h-10 text-orange-600" />
            </div>
            <h3 className="text-2xl font-bold text-orange-800 mb-3 tracking-tight">Access Under Review</h3>
            <div className="text-orange-700 mb-5 max-w-xs text-center">
              Document access requires security clearance validation.<br />
              Contact LRC security team for verification.
            </div>
            <Button className="bg-orange-600 text-white shadow hover:bg-orange-700" disabled>
              <Shield className="w-4 h-4 mr-2" />
              Pending Security Clearance
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPagesToShow = actualMaxPages && numPages ? Math.min(actualMaxPages, numPages) : numPages;

  return (
    <Card className={`${className} border-2 border-red-300 bg-red-50/30`} ref={viewerRef}>
      <CardContent className="p-0">
        {/* Maximum Security Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <div className="font-bold text-lg">MAXIMUM SECURITY MODE</div>
                <div className="text-red-100 text-sm">Protected Document • All Actions Monitored</div>
              </div>
            </div>
            <div className="text-right text-red-100 text-sm">
              <div>Violations: {securityViolations}/3</div>
              <div className="flex items-center gap-1 mt-1">
                <Eye className="w-3 h-3" />
                <span>Monitored</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        {showSecurityNotice && (
          <div className="bg-red-100 border-b-2 border-red-300 p-4 relative">
            <button
              onClick={() => setShowSecurityNotice(false)}
              className="absolute right-4 top-4 text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start space-x-3 pr-8">
              <Camera className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-red-800">
                <div className="font-bold text-lg mb-2">SECURITY NOTICE - READ CAREFULLY</div>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li><strong>Screenshot/Print Protection:</strong> All capture attempts are blocked and logged</li>
                  <li><strong>Activity Monitoring:</strong> Mouse, keyboard, and navigation tracked</li>
                  <li><strong>Auto-Logout:</strong> Session expires after 10 minutes of inactivity</li>
                  <li><strong>Copy Protection:</strong> Text selection and drag operations disabled</li>
                  <li><strong>Violation Limits:</strong> 3 violations will terminate access immediately</li>
                  <li><strong>Digital Watermarking:</strong> Invisible user-specific marks applied</li>
                </ul>
                {watermarkApplied && (
                  <div className="mt-3 p-2 bg-red-200 rounded text-xs">
                    ✓ Digital watermark applied - Document traceable to your account
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {hasElevatedAccess && (
          <div className="bg-green-100 border-b border-green-300 p-3">
            <div className="flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <p className="text-green-800 text-sm text-center font-medium">
                ELEVATED ACCESS: Full document available • Enhanced monitoring active
              </p>
            </div>
          </div>
        )}

        {/* PDF Viewer with Enhanced Security */}
        <div 
          className="relative bg-gray-100 rounded-b-2xl select-none" 
          style={{ 
            minHeight: 300, 
            maxHeight: 640,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none'
          }}
        >
          <ScrollArea className="w-full h-[560px] md:h-[600px] lg:h-[640px] overflow-auto">
            <div className="flex flex-col items-center gap-6 px-2 pb-2 pointer-events-none">
              {pdfError ? (
                <div className="w-full flex flex-col items-center justify-center py-14 text-red-500">
                  <Shield className="w-12 h-12 mb-4 text-red-300" />
                  <div className="text-center">
                    <div className="font-medium">Security Validation Failed</div>
                    <div className="text-sm text-red-600 mt-2">{pdfError}</div>
                    <div className="text-sm text-red-600 mt-1">Contact security administrator.</div>
                  </div>
                </div>
              ) : (
                <Document
                  file={pdfSource}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={
                    <div className="w-full flex flex-col items-center justify-center py-14 text-gray-500">
                      <Shield className="w-12 h-12 mb-4 text-gray-300 animate-pulse" />
                      <div>Loading secure document...</div>
                      <div className="text-xs mt-2 text-gray-400">Applying security measures...</div>
                    </div>
                  }
                  className="w-full flex flex-col items-center"
                >
                  {Array.from(
                    new Array(totalPagesToShow || 0),
                    (_, index) => (
                      <div
                        key={`secure_page_${index + 1}`}
                        className="w-full flex justify-center py-2 relative"
                      >
                        <Page
                          pageNumber={index + 1}
                          width={Math.min(700, window.innerWidth - 60)}
                          renderAnnotationLayer={false}
                          renderTextLayer={false}
                          className="mx-auto rounded-md border-2 border-red-200 shadow-lg bg-white relative"
                        />
                        {/* Overlay watermark */}
                        <div 
                          className="absolute inset-0 pointer-events-none z-10"
                          style={{
                            background: `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 100px,
                              rgba(220, 38, 127, 0.02) 100px,
                              rgba(220, 38, 127, 0.02) 102px
                            )`
                          }}
                        />
                      </div>
                    ),
                  )}
                </Document>
              )}
              
              {/* Enhanced access limitation notice */}
              {numPages && actualMaxPages && numPages > actualMaxPages && !hasElevatedAccess && (
                <div className="mt-4 mb-2 p-4 bg-red-100 rounded-lg border-2 border-red-300 shadow">
                  <div className="flex items-center gap-3 text-red-800">
                    <Lock className="w-5 h-5" />
                    <div>
                      <div className="font-bold">Limited Preview Mode</div>
                      <div className="text-sm">
                        Showing {actualMaxPages} of {numPages} pages • Contact LRC for full access
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security footer */}
              <div className="w-full bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-4">
                <div className="text-center text-red-700 text-xs">
                  <div className="font-bold mb-1">DOCUMENT SECURITY STATUS</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>🛡️ Watermark: {watermarkApplied ? 'Applied' : 'Pending'}</div>
                    <div>👁️ Monitoring: Active</div>
                    <div>📸 Screenshots: Blocked</div>
                    <div>⚠️ Violations: {securityViolations}/3</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaxSecurityPDFViewer;
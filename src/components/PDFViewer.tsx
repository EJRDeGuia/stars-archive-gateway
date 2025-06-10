
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Lock } from 'lucide-react';

interface PDFViewerProps {
  pdfUrl?: string;
  title: string;
  canView: boolean;
  className?: string;
}

declare global {
  interface Window {
    AdobeDC: any;
  }
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, title, canView, className = '' }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const adobeViewerRef = useRef<any>(null);

  useEffect(() => {
    if (!canView || !pdfUrl) return;

    // Disable right-click context menu and common shortcuts
    const disableInteractions = (e: any) => {
      // Disable right-click
      if (e.type === 'contextmenu') {
        e.preventDefault();
        return false;
      }
      
      // Disable common copy shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.keyCode === 67 || e.keyCode === 65 || e.keyCode === 83 || e.keyCode === 80) {
          e.preventDefault();
          return false;
        }
      }
      
      // Disable F12 (dev tools)
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Disable print screen
      if (e.keyCode === 44) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', disableInteractions);
    document.addEventListener('keydown', disableInteractions);
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    // Load Adobe Acrobat DC View SDK
    const script = document.createElement('script');
    script.src = 'https://documentservices.adobe.com/view-sdk/viewer.js';
    script.onload = initializeViewer;
    document.head.appendChild(script);

    return () => {
      document.removeEventListener('contextmenu', disableInteractions);
      document.removeEventListener('keydown', disableInteractions);
      document.removeEventListener('selectstart', (e) => e.preventDefault());
      document.removeEventListener('dragstart', (e) => e.preventDefault());
      
      if (adobeViewerRef.current) {
        adobeViewerRef.current = null;
      }
    };
  }, [pdfUrl, canView]);

  const initializeViewer = () => {
    if (!window.AdobeDC || !viewerRef.current || !pdfUrl) return;

    window.AdobeDC.readyState.then(() => {
      adobeViewerRef.current = new window.AdobeDC.View({
        clientId: 'YOUR_ADOBE_CLIENT_ID', // Replace with your Adobe client ID
        divId: 'adobe-dc-view',
        locale: 'en-US',
      });

      adobeViewerRef.current.previewFile({
        content: { location: { url: pdfUrl } },
        metaData: { fileName: `${title}.pdf` }
      }, {
        embedMode: 'SIZED_CONTAINER',
        focusOnRendering: false,
        showAnnotationTools: false,
        showLeftHandPanel: true,
        showDownloadPDF: false,
        showPrintPDF: false,
        showZoomControl: true,
        defaultViewMode: 'FIT_PAGE',
        enableFormFilling: false,
        showBookmarks: true,
        showThumbnails: false,
        // Enhanced security options
        enableSearchAPIs: false,
        enableLinksAPIs: false,
        includePDFAnnotations: false,
        showPreviewUnavailableBanner: false,
        disableTextSelection: true,
        disableCopyPaste: true,
        // Additional security measures
        exitPDFViewerType: 'CLOSE',
        defaultViewMode: 'READ_ONLY'
      });

      // Additional security: disable text selection via CSS
      const style = document.createElement('style');
      style.textContent = `
        #adobe-dc-view * {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          -webkit-touch-callout: none !important;
          -webkit-tap-highlight-color: transparent !important;
        }
        
        #adobe-dc-view {
          pointer-events: auto;
        }
        
        /* Disable screenshot tools */
        @media print {
          #adobe-dc-view { display: none !important; }
        }
      `;
      document.head.appendChild(style);
    });
  };

  if (!canView) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Access Restricted</h3>
            <p className="text-gray-600 mb-6">
              Full document access is available only to DLSL researchers, archivists, and administrators connected to the LRC intranet.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                <strong>Network Access Required:</strong> You must be connected to the De La Salle Lipa Learning Resource Center network to view thesis documents.
              </p>
            </div>
            <Button variant="outline" className="mr-4">
              <ExternalLink className="w-4 h-4 mr-2" />
              Request Access
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!pdfUrl) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-dlsl-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-dlsl-green" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Preview</h3>
            <p className="text-gray-600 mb-6">
              PDF document preview would appear here. This is a demonstration version.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Security Notice:</strong> All documents are protected against downloading, copying, and screenshots to preserve intellectual property rights.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Secure Viewer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-0">
        <div className="bg-red-50 border-b border-red-200 p-3">
          <p className="text-red-800 text-sm text-center">
            <strong>Security Notice:</strong> This document is protected. Downloading, copying, and screenshots are disabled.
          </p>
        </div>
        <div 
          id="adobe-dc-view" 
          ref={viewerRef}
          style={{ height: '600px', width: '100%' }}
          className="select-none"
        />
      </CardContent>
    </Card>
  );
};

export default PDFViewer;

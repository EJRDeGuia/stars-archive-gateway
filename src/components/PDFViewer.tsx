
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, ExternalLink, Lock } from 'lucide-react';

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

    // Load Adobe Acrobat DC View SDK
    const script = document.createElement('script');
    script.src = 'https://documentservices.adobe.com/view-sdk/viewer.js';
    script.onload = initializeViewer;
    document.head.appendChild(script);

    return () => {
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
        showDownloadPDF: true,
        showPrintPDF: true,
        showZoomControl: true,
        defaultViewMode: 'FIT_PAGE',
        enableFormFilling: false
      });
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
              Full document access is available only to DLSL researchers, archivists, and administrators.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Contact your institution to upgrade your access level.
            </p>
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
            <div className="flex justify-center gap-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button>
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
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
        <div 
          id="adobe-dc-view" 
          ref={viewerRef}
          style={{ height: '600px', width: '100%' }}
        />
      </CardContent>
    </Card>
  );
};

export default PDFViewer;


import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Lock } from 'lucide-react';

// For react-pdf to work:
// Set the workerSrc property to use the pdfjs-dist CDN build
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfUrl?: string;
  title: string;
  canView: boolean;
  maxPages?: number;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  pdfUrl,
  title,
  canView,
  maxPages,
  className = '',
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // NO ACCESS
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

  // NO PDF PROVIDED
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

  // LIMIT pages shown, if maxPages is set
  const totalPagesToShow = maxPages && numPages ? Math.min(maxPages, numPages) : numPages;

  return (
    <Card className={`${className}`}>
      <CardContent className="p-0">
        <div className="bg-red-50 border-b border-red-200 p-3">
          <p className="text-red-800 text-sm text-center">
            <strong>Security Notice:</strong> This document is protected. Downloading, copying, and printing are disabled in the viewer.
          </p>
        </div>
        <div className="flex flex-col items-center bg-gray-50" style={{ minHeight: 460 }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div className="w-full text-center py-12 text-gray-400">Loading PDF...</div>}
            error={<div className="w-full text-center py-12 text-red-400">Failed to load PDF</div>}
            className="w-full flex flex-col items-center"
          >
            {/* Multiple page preview */}
            {Array.from(
              new Array(totalPagesToShow || 0),
              (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={720}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={<div className="text-center text-gray-300 py-5">Loading page...</div>}
                  className="mx-auto my-2 rounded-lg border border-gray-200 shadow"
                />
              ),
            )}
          </Document>
          {numPages && maxPages && numPages > maxPages && (
            <div className="mt-4 text-sm text-gray-500 bg-yellow-50 rounded p-3 border border-yellow-100">
              Only the first {maxPages} pages are visible. Log in or request access for the full document.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;

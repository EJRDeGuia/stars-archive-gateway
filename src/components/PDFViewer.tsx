
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Lock } from 'lucide-react';

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

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
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
            <Button variant="outline" className="mr-0 w-full max-w-[210px] shadow-sm">
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
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>Security Notice:</strong> All thesis documents are secured against downloading, copying, screenshots, and printing. Access is available for reading only.
              </p>
            </div>
            <Button className="bg-dlsl-green text-white shadow" disabled>
              <ExternalLink className="w-4 h-4 mr-2 opacity-70" />
              Open in Secure Reader
            </Button>
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
        <div className="bg-red-50 border-b border-red-200 p-3 rounded-t-2xl">
          <p className="text-red-800 text-sm text-center">
            <strong>Security Notice:</strong> This document is protected: downloading, copying, printing, and screenshots are not allowed.
          </p>
        </div>
        <div className="flex flex-col items-center bg-gray-50" style={{ minHeight: 460 }}>
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="w-full flex flex-col items-center justify-center py-14 text-gray-400">
                <FileText className="w-12 h-12 mb-4 text-gray-300" />
                <div>Loading PDF preview...</div>
              </div>
            }
            error={
              <div className="w-full flex flex-col items-center justify-center py-14 text-red-400">
                <FileText className="w-12 h-12 mb-4 text-red-200" />
                <div>Failed to load PDF preview</div>
              </div>
            }
            className="w-full flex flex-col items-center"
          >
            {Array.from(
              new Array(totalPagesToShow || 0),
              (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={720}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={
                    <div className="flex flex-col items-center py-8">
                      <FileText className="w-8 h-8 mb-2 text-gray-200" />
                      <span className="text-gray-300">Loading page...</span>
                    </div>
                  }
                  className="mx-auto my-4 rounded-lg border border-gray-200 shadow bg-white"
                />
              ),
            )}
          </Document>
          {numPages && maxPages && numPages > maxPages && (
            <div className="mt-5 text-sm text-gray-600 bg-yellow-50 rounded p-3 border border-yellow-100 shadow flex items-center gap-2">
              <Lock className="w-4 h-4 text-yellow-500 mr-1" />
              Only the first {maxPages} pages are visible. Request full access for the entire document.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;


import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PDFViewer from "./PDFViewer";
import { ClipboardCopy, FileText } from "lucide-react";
import CitationExportPopover from "./CitationExportPopover";

interface ThesisPDFPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
  title: string;
  author: string;
  year: string;
  thesisId: string;
}

const getCitation = (title: string, author: string, year: string) =>
  `${author}. (${year}). ${title}. De La Salle Lipa University.`;

const ThesisPDFPreviewDialog: React.FC<ThesisPDFPreviewDialogProps> = ({
  open,
  onOpenChange,
  pdfUrl,
  title,
  author,
  year,
  thesisId,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(getCitation(title, author, year));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-0 overflow-hidden">
        <div className="bg-white flex flex-col items-stretch">
          <div className="px-6 pt-5 pb-3 border-b flex justify-between items-center">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="text-dlsl-green mr-2" />
              Secure PDF Preview
            </DialogTitle>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-1 ml-2 text-gray-600 hover:text-dlsl-green"
                onClick={handleCopyCitation}
              >
                <ClipboardCopy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy Citation"}
              </Button>
              <CitationExportPopover title={title} author={author} year={year} />
            </div>
          </div>
          <div className="p-0">
            <PDFViewer
              pdfUrl={pdfUrl}
              title={title}
              canView={true}
              maxPages={10}
              thesisId={thesisId}
            />
            <div className="px-8 py-3 text-center text-gray-500 text-xs bg-dlsl-green/5 border-t border-dlsl-green/10">
              Only the first 10 pages are visible in this secure preview. Copying, screenshots, and printing are disabled to protect author rights.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThesisPDFPreviewDialog;


import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, FileText, X, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePDFUpload } from "@/hooks/usePDFUpload";

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface PDFUploadCardProps {
  uploadedFiles: UploadFile[];
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  isExtracting: boolean;
  setIsExtracting: React.Dispatch<React.SetStateAction<boolean>>;
}

const PDFUploadCard: React.FC<PDFUploadCardProps> = ({
  uploadedFiles,
  setUploadedFiles,
  isExtracting,
  setIsExtracting,
}) => {
  const { handleFileUpload } = usePDFUpload({ setUploadedFiles, setIsExtracting });
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    
    // Enhanced PDF validation for drag and drop
    const pdfFiles = files.filter(file => {
      const isPdfType = file.type === "application/pdf";
      const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
      return isPdfType && isPdfExtension;
    });
    
    const invalidFiles = files.filter(file => {
      const isPdfType = file.type === "application/pdf";
      const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
      return !(isPdfType && isPdfExtension);
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: `Please upload PDF files only. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    if (pdfFiles.length === 0) {
      toast({
        title: "No valid files",
        description: "Please upload PDF files only.",
        variant: "destructive",
      });
      return;
    }
    
    if (pdfFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "Please upload a maximum of 5 files at once.",
        variant: "destructive",
      });
      return;
    }
    
    handleFileUpload(pdfFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Enhanced PDF validation
    const pdfFiles = files.filter(file => {
      const isPdfType = file.type === "application/pdf";
      const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
      return isPdfType && isPdfExtension;
    });
    
    const invalidFiles = files.filter(file => {
      const isPdfType = file.type === "application/pdf";
      const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
      return !(isPdfType && isPdfExtension);
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: `Please upload PDF files only. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`,
        variant: "destructive",
      });
      
      // Clear the input to prevent submission
      e.target.value = '';
      return;
    }
    
    if (pdfFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "Please upload a maximum of 5 files at once.",
        variant: "destructive",
      });
      
      // Clear the input
      e.target.value = '';
      return;
    }
    
    handleFileUpload(pdfFiles);
    
    // Clear the input
    e.target.value = '';
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((prev) => prev.filter((uf) => uf.file !== fileToRemove));
  };

  const retryUpload = (fileToRetry: File) => {
    // Remove the failed file and re-upload
    setUploadedFiles((prev) => prev.filter((uf) => uf.file !== fileToRetry));
    handleFileUpload([fileToRetry]);
  };

  const getStatusIcon = (uploadFile: UploadFile) => {
    switch (uploadFile.status) {
      case 'uploading':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-dlsl-green" />;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-dlsl-green';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF Document</CardTitle>
        <CardDescription>
          Drag and drop your PDF files here, or click to browse. Maximum 5 files, 50MB each. Only PDF files are accepted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-dlsl-green bg-dlsl-green/5"
              : "border-gray-300 hover:border-dlsl-green hover:bg-gray-50"
          } ${isExtracting ? "pointer-events-none opacity-50" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop your PDF files here
          </p>
          <p className="text-gray-600 mb-4">
            or click to select files from your computer
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isExtracting}
          />
          <Button 
            asChild 
            className="bg-dlsl-green hover:bg-dlsl-green-dark"
            disabled={isExtracting}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {isExtracting ? "Uploading..." : "Browse Files"}
            </label>
          </Button>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">
                Uploaded Files ({uploadedFiles.length})
              </h4>
              {uploadedFiles.some(f => f.status === 'completed') && (
                <p className="text-sm text-green-600">
                  {uploadedFiles.filter(f => f.status === 'completed').length} completed
                </p>
              )}
            </div>
            
            {uploadedFiles.map((uploadFile, index) => (
              <div 
                key={`${uploadFile.file.name}-${index}`} 
                className={`flex items-center space-x-3 p-4 rounded-lg border ${
                  uploadFile.status === 'error' 
                    ? 'bg-red-50 border-red-200' 
                    : uploadFile.status === 'completed'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {getStatusIcon(uploadFile)}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  
                  {uploadFile.status === 'error' && uploadFile.error && (
                    <p className="text-xs text-red-600 mb-2">
                      Error: {uploadFile.error}
                    </p>
                  )}
                  
                  {uploadFile.status !== 'error' && (
                    <div className="flex items-center space-x-2">
                      <Progress 
                        value={uploadFile.progress} 
                        className="flex-1 h-2"
                      />
                      <span className="text-xs text-gray-500 min-w-[3rem]">
                        {Math.round(uploadFile.progress)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {uploadFile.status === 'error' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => retryUpload(uploadFile.file)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(uploadFile.file)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFUploadCard;

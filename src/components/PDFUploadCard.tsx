
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, FileText, X, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePDFUpload } from "@/hooks/usePDFUpload";

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
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

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    if (files.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only.",
        variant: "destructive",
      });
      return;
    }
    handleFileUpload(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles((prev) => prev.filter((uf) => uf.file !== fileToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF Document</CardTitle>
        <CardDescription>
          Drag and drop your PDF file here, or click to browse
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-dlsl-green bg-dlsl-green/5"
              : "border-gray-300 hover:border-dlsl-green hover:bg-gray-50"
          }`}
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
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
          />
          <Button asChild className="bg-dlsl-green hover:bg-dlsl-green-dark">
            <label htmlFor="file-upload" className="cursor-pointer">
              Browse Files
            </label>
          </Button>
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-gray-900">Uploaded Files</h4>
            {uploadedFiles.map((uploadFile, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-dlsl-green flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadFile.file.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={uploadFile.progress} className="flex-1 h-2" />
                    <span className="text-xs text-gray-500">
                      {uploadFile.progress}%
                    </span>
                  </div>
                </div>
                {uploadFile.status === "completed" && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PDFUploadCard;

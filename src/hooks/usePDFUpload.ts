
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface UsePDFUploadProps {
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  setIsExtracting: React.Dispatch<React.SetStateAction<boolean>>;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
const ALLOWED_TYPES = ['application/pdf'];

/**
 * Enhanced PDF upload hook with proper error handling and validation
 */
export function usePDFUpload({ setUploadedFiles, setIsExtracting }: UsePDFUploadProps) {
  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only PDF files are allowed";
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 50MB";
    }
    
    if (file.size === 0) {
      return "File appears to be empty";
    }
    
    return null;
  };

  const handleFileUpload = useCallback(async (files: File[]) => {
    console.log('[usePDFUpload] Starting upload for files:', files.map(f => f.name));
    
    for (const file of files) {
      // Validate file before processing
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: "File validation failed",
          description: `${file.name}: ${validationError}`,
          variant: "destructive",
        });
        continue;
      }

      const uploadFile: UploadFile = {
        file,
        progress: 0,
        status: "uploading",
      };
      
      setUploadedFiles((prev) => [...prev, uploadFile]);
      setIsExtracting(true);

      try {
        // Create a sanitized file path
        const timestamp = Date.now();
        const sanitizedName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .replace(/_{2,}/g, "_");
        const storagePath = `${timestamp}-${sanitizedName}`;
        
        console.log('[usePDFUpload] Uploading to path:', storagePath);

        // Start progress simulation
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          if (currentProgress < 90) {
            currentProgress += Math.random() * 15;
            setUploadedFiles((prev) =>
              prev.map((uf) =>
                uf.file === file 
                  ? { ...uf, progress: Math.min(currentProgress, 90) } 
                  : uf
              )
            );
          }
        }, 200);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("thesis-pdfs")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false, // Don't overwrite existing files
            contentType: file.type,
          });

        clearInterval(progressInterval);

        if (error) {
          console.error('[usePDFUpload] Upload error:', error);
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error("Upload completed but no data returned");
        }

        console.log('[usePDFUpload] Upload successful:', data);

        // Complete progress and mark as successful
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            uf.file === file 
              ? { ...uf, progress: 100, status: "completed" } 
              : uf
          )
        );

        toast({
          title: "PDF uploaded successfully!",
          description: `${file.name} has been uploaded and is ready for processing.`,
        });

      } catch (err: any) {
        console.error('[usePDFUpload] Upload failed:', err);
        
        const errorMessage = err?.message || "Unknown upload error occurred";
        
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            uf.file === file 
              ? { ...uf, progress: 0, status: "error", error: errorMessage } 
              : uf
          )
        );

        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}: ${errorMessage}`,
          variant: "destructive",
        });
      } finally {
        setIsExtracting(false);
      }
    }
  }, [setUploadedFiles, setIsExtracting]);

  return { handleFileUpload };
}

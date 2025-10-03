
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
  storagePath?: string; // Add storage path to track uploaded files
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
        toast.error(`${file.name}: ${validationError}`);
        continue;
      }

      const uploadFile: UploadFile = {
        file,
        progress: 0,
        status: "uploading",
      };
      
      setUploadedFiles((prev) => [...prev, uploadFile]);
      setIsExtracting(true);

      let progressInterval: NodeJS.Timeout | null = null;

      try {
        // Create a sanitized file path
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 15);
        const sanitizedName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, "_")
          .replace(/_{2,}/g, "_")
          .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
        
        const storagePath = `${timestamp}_${randomId}_${sanitizedName}`;
        
        console.log('[usePDFUpload] Uploading to path:', storagePath);

        // More aggressive progress simulation for better UX
        let currentProgress = 0;
        progressInterval = setInterval(() => {
          if (currentProgress < 95) {
            currentProgress += Math.random() * 20;
            setUploadedFiles((prev) =>
              prev.map((uf) =>
                uf.file === file 
                  ? { ...uf, progress: Math.min(currentProgress, 95) } 
                  : uf
              )
            );
          }
        }, 150);

        // Upload to Supabase Storage with timeout
        const uploadPromise = supabase.storage
          .from("thesis-pdfs")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Upload timeout after 5 minutes')), 5 * 60 * 1000);
        });

        const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

        if (progressInterval) clearInterval(progressInterval);

        if (error) {
          console.error('[usePDFUpload] Upload error:', error);
          throw new Error(`Upload failed: ${error.message}`);
        }

        if (!data) {
          throw new Error("Upload completed but no data returned");
        }

        console.log('[usePDFUpload] Upload successful, starting security scan:', data);

        // Perform lightweight security scan in background
        // Don't block upload completion on scan results for better UX
        supabase.functions.invoke('malware-scan', {
          body: {
            filePath: storagePath,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type
          }
        }).then(({ data: scanData, error: scanError }) => {
          if (scanError) {
            console.warn('[usePDFUpload] Security scan failed:', scanError);
          } else if (scanData?.scanResult === 'malicious') {
            console.warn('[usePDFUpload] File flagged as malicious:', scanData);
            toast.error(`Security alert: ${file.name} was flagged. Please contact an administrator.`);
          } else if (scanData?.scanResult === 'suspicious') {
            console.warn('[usePDFUpload] File flagged as suspicious:', scanData);
            toast.warning(`${file.name} flagged for review. An administrator will verify it.`);
          }
        }).catch(err => {
          console.error('[usePDFUpload] Background scan error:', err);
        });

        // Update the file with storage path and complete status
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            uf.file === file 
              ? { ...uf, progress: 100, status: "completed", storagePath } 
              : uf
          )
        );

        toast.success(`${file.name} uploaded successfully!`);

      } catch (err: any) {
        console.error('[usePDFUpload] Upload failed:', err);
        if (progressInterval) clearInterval(progressInterval);
        
        const errorMessage = err?.message || "Unknown upload error occurred";
        
        setUploadedFiles((prev) =>
          prev.map((uf) =>
            uf.file === file 
              ? { ...uf, progress: 0, status: "error", error: errorMessage } 
              : uf
          )
        );

        toast.error(`Failed to upload ${file.name}: ${errorMessage}`);
      } finally {
        setIsExtracting(false);
      }
    }
  }, [setUploadedFiles, setIsExtracting]);

  return { handleFileUpload };
}


import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

interface UsePDFUploadProps {
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadFile[]>>;
  setIsExtracting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Handles uploading PDF files (no extraction step).
 */
export function usePDFUpload({ setUploadedFiles, setIsExtracting }: UsePDFUploadProps) {
  const handleFileUpload = useCallback(async (files: File[]) => {
    for (const file of files) {
      const uploadFile: UploadFile = {
        file,
        progress: 0,
        status: "uploading",
      };
      setUploadedFiles((prev) => [...prev, uploadFile]);
      setIsExtracting(true);

      const storagePath = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]+/g, "_")}`;
      try {
        // Upload to Supabase Storage
        const { error } = await supabase.storage
          .from("thesis-pdfs")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
          });
        if (error) throw error;

        toast({
          title: "PDF uploaded!",
          description: "Your document was uploaded. No information was extracted automatically.",
        });

        // Simulate progress
        let prog = 0;
        const intv = setInterval(() => {
          prog += 10;
          setUploadedFiles((prev) =>
            prev.map((uf) =>
              uf.file === file ? { ...uf, progress: Math.min(uf.progress + 10, 100) } : uf
            )
          );
        }, 120);

        setTimeout(() => {
          clearInterval(intv);
          setUploadedFiles((prev) =>
            prev.map((uf) =>
              uf.file === file ? { ...uf, progress: 100, status: "completed" } : uf
            )
          );
        }, 1200);

      } catch (err: any) {
        toast({
          title: "Upload failed",
          description: err?.message || "Could not upload PDF",
          variant: "destructive",
        });
        setUploadedFiles((prev) => prev.filter((uf) => uf.file !== file));
      } finally {
        setIsExtracting(false);
      }
    }
  }, [setUploadedFiles, setIsExtracting]);

  return { handleFileUpload };
}

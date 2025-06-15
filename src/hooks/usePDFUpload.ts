
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
  onExtracted: (meta: Partial<Record<string, string>>) => void;
  setIsExtracting: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Handles uploading PDF files and extracting metadata via edge function.
 */
export function usePDFUpload({ setUploadedFiles, onExtracted, setIsExtracting }: UsePDFUploadProps) {
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

        // Call Edge Function to extract metadata
        const response = await fetch(
          `https://cylsbcjqemluouxblywl.supabase.co/functions/v1/extract-thesis-info`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: storagePath }),
          }
        );
        const meta = await response.json();
        if (!response.ok) throw new Error(meta.error || "Metadata extraction failed.");

        onExtracted({
          title: meta.title,
          author: meta.author,
          abstract: meta.abstract,
          advisor: meta.advisor,
          keywords: Array.isArray(meta.keywords) ? meta.keywords.join(", ") : "",
        });

        toast({
          title: "PDF info extracted!",
          description: "Thesis fields were filled automatically from the PDF. Please review and edit as needed.",
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
          description: err?.message || "Could not upload or parse PDF",
          variant: "destructive",
        });
        setUploadedFiles((prev) => prev.filter((uf) => uf.file !== file));
      } finally {
        setIsExtracting(false);
      }
    }
  }, [setUploadedFiles, onExtracted, setIsExtracting]);

  return { handleFileUpload };
}

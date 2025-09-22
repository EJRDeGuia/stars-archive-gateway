import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

interface ChunkUploadOptions {
  file: File;
  onProgress?: (progress: number) => void;
  onChunkComplete?: (chunkIndex: number, totalChunks: number) => void;
  chunkSize?: number;
  bucket?: string;
  path?: string;
  startChunk?: number;
}

interface UploadResult {
  success: boolean;
  path?: string;
  url?: string;
  error?: string;
  fileHash?: string;
}

export class UploadOptimizationService {
  private static instance: UploadOptimizationService;
  private readonly DEFAULT_CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  private readonly chunkSize = this.DEFAULT_CHUNK_SIZE;
  private readonly MAX_RETRIES = 3;
  private activeUploads = new Map<string, AbortController>();

  static getInstance(): UploadOptimizationService {
    if (!this.instance) {
      this.instance = new UploadOptimizationService();
    }
    return this.instance;
  }

  // Calculate file hash for integrity verification
  private async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Split file into chunks
  private createChunks(file: File, chunkSize: number): Blob[] {
    const chunks: Blob[] = [];
    const totalChunks = Math.ceil(file.size / chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      chunks.push(file.slice(start, end));
    }
    
    return chunks;
  }

  // Upload a single chunk with retry logic
  private async uploadChunkWithRetry(
    chunk: Blob,
    chunkIndex: number,
    fileName: string,
    retries: number = 0
  ): Promise<boolean> {
    try {
      // For demonstration - in a real implementation, you'd upload to your storage service
      // This is a placeholder for chunked upload logic
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      // Simulate occasional failures for retry testing
      if (retries === 0 && Math.random() < 0.1) {
        throw new Error('Simulated network error');
      }
      
      return true;
    } catch (error) {
      if (retries < this.MAX_RETRIES) {
        console.warn(`Chunk ${chunkIndex} failed, retrying... (attempt ${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries))); // Exponential backoff
        return this.uploadChunkWithRetry(chunk, chunkIndex, fileName, retries + 1);
      }
      throw error;
    }
  }

  // Main chunked upload function
  async uploadFileInChunks(options: ChunkUploadOptions): Promise<UploadResult> {
    const {
      file,
      onProgress,
      onChunkComplete,
      chunkSize = this.DEFAULT_CHUNK_SIZE,
      bucket = 'thesis-files',
      path = `uploads/${Date.now()}-${file.name}`
    } = options;

    const uploadId = `${Date.now()}-${Math.random()}`;
    const abortController = new AbortController();
    this.activeUploads.set(uploadId, abortController);

    try {
      // Calculate file hash for integrity
      const fileHash = await this.calculateFileHash(file);
      
      // Create chunks
      const chunks = this.createChunks(file, chunkSize);
      const totalChunks = chunks.length;
      
      console.log(`Starting chunked upload: ${totalChunks} chunks for ${file.name}`);
      
      // Upload chunks sequentially (could be parallelized for better performance)
      for (let i = 0; i < chunks.length; i++) {
        if (abortController.signal.aborted) {
          throw new Error('Upload cancelled');
        }

        await this.uploadChunkWithRetry(chunks[i], i, file.name);
        
        // Report progress
        const progress = ((i + 1) / totalChunks) * 100;
        onProgress?.(progress);
        onChunkComplete?.(i, totalChunks);
        
        console.log(`Chunk ${i + 1}/${totalChunks} uploaded`);
      }

      // In a real implementation, you'd finalize the multipart upload here
      // and get the final file URL from your storage service
      
      const finalUrl = `${bucket}/${path}`;
      
      console.log(`Upload completed: ${file.name} -> ${finalUrl}`);
      
      return {
        success: true,
        path,
        url: finalUrl,
        fileHash
      };

    } catch (error) {
      console.error('Chunked upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    } finally {
      this.activeUploads.delete(uploadId);
    }
  }

  // Resume upload functionality
  async resumeUpload(uploadId: string, file: File): Promise<UploadResult> {
    try {
      // Check which chunks were already uploaded
      const { data: existingChunks } = await supabase.storage
        .from('thesis-files')
        .list(`chunks/${uploadId}`);
      
      const uploadedChunks = existingChunks?.length || 0;
      const totalChunks = Math.ceil(file.size / this.chunkSize);
      
      if (uploadedChunks >= totalChunks) {
        return { success: true, path: `chunks/${uploadId}` };
      }
      
      // Resume from the next chunk
      return this.uploadFileInChunks({
        file,
        onProgress: () => {},
        bucket: 'thesis-files', 
        path: uploadId,
        startChunk: uploadedChunks
      });
    } catch (error) {
      logger.error('Resume upload failed', { uploadId, error });
      return { success: false, error: 'Resume failed' };
    }
  }

  // Cancel active upload
  cancelUpload(uploadId: string): boolean {
    const controller = this.activeUploads.get(uploadId);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(uploadId);
      return true;
    }
    return false;
  }

  // Get upload progress for active uploads
  getActiveUploads(): string[] {
    return Array.from(this.activeUploads.keys());
  }

  // Validate file before upload
  validateFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/pdf') {
      return { valid: false, error: 'Only PDF files are allowed' };
    }

    // Check file size (max 20MB for chunked upload)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 20MB' };
    }

    // Check file name
    if (!/^[\w\-. ]+\.pdf$/i.test(file.name)) {
      return { valid: false, error: 'Invalid file name. Use only letters, numbers, spaces, hyphens, and periods.' };
    }

    return { valid: true };
  }

  // Optimize file before upload
  async optimizeFile(file: File): Promise<File> {
    try {
      // Basic optimization: just validate and potentially compress large files
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      // For PDFs larger than 5MB, we could implement compression here
      // This is a placeholder for actual PDF optimization
      if (file.size > 5 * 1024 * 1024) {
        logger.info('Large file detected, optimization recommended', { 
          fileName: file.name, 
          size: file.size 
        });
      }
      
      return file;
    } catch (error) {
      logger.error('File optimization failed', { fileName: file.name, error });
      throw error;
    }
  }
}

export const uploadOptimizationService = UploadOptimizationService.getInstance();
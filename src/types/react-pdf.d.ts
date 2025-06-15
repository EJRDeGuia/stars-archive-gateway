
declare module 'react-pdf' {
  import * as React from 'react';

  export interface DocumentProps {
    file?: string | File | Blob | Uint8Array | null;
    onLoadSuccess?: (pdf: { numPages: number }) => void;
    loading?: React.ReactNode;
    error?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    renderMode?: 'canvas' | 'svg' | 'none';
  }

  export interface PageProps {
    pageNumber?: number;
    width?: number;
    height?: number;
    renderAnnotationLayer?: boolean;
    renderTextLayer?: boolean;
    loading?: React.ReactNode;
    className?: string;
  }

  export const Document: React.FC<DocumentProps>;
  export const Page: React.FC<PageProps>;
  export const pdfjs: any;
}

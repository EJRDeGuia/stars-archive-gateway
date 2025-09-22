import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, AlertCircle, Upload } from 'lucide-react';

interface ChunkedUploadProgressProps {
  fileName: string;
  totalChunks: number;
  completedChunks: number;
  overallProgress: number;
  isComplete: boolean;
  hasError: boolean;
  errorMessage?: string;
  onCancel?: () => void;
  onRetry?: () => void;
}

const ChunkedUploadProgress: React.FC<ChunkedUploadProgressProps> = ({
  fileName,
  totalChunks,
  completedChunks,
  overallProgress,
  isComplete,
  hasError,
  errorMessage,
  onCancel,
  onRetry
}) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span className="truncate">{fileName}</span>
          </div>
          {!isComplete && !hasError && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Overall Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Chunk Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Chunks</span>
            <span>{completedChunks} / {totalChunks}</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalChunks }, (_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i < completedChunks
                    ? 'bg-green-500'
                    : i === completedChunks && !isComplete && !hasError
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-sm">
          {isComplete ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-700">Upload completed successfully</span>
            </>
          ) : hasError ? (
            <>
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700">Upload failed</span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-blue-700">Uploading...</span>
            </>
          )}
        </div>

        {/* Error Message */}
        {hasError && errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-red-800">{errorMessage}</p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-2 h-7 text-xs"
              >
                Retry Upload
              </Button>
            )}
          </div>
        )}

        {/* Success Actions */}
        {isComplete && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-800">
              File uploaded successfully with integrity verification.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChunkedUploadProgress;
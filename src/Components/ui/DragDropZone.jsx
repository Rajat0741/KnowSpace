import React, { useState } from 'react';
import { Upload, Download, FileImage, AlertCircle } from 'lucide-react';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { downloadImageAsFile, isImageUrl } from '@/lib/imageDownloadUtils';

/**
 * DragDropZone Component
 * A visual drag and drop area that handles both file drops and URL drops
 */
const DragDropZone = ({
  onFileSelect,
  onError,
  className = '',
  disabled = false,
  children = null,
  acceptedTypes = ['image/*'],
  maxFiles = 1,
  showInstructions = true,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');

  // Handle file drops (local files)
  const handleFilesDrop = async (acceptedFiles, rejectedFiles) => {
    if (disabled) return;

    if (rejectedFiles.length > 0) {
      onError?.('Some files were rejected. Please only drop image files.');
      return;
    }

    if (acceptedFiles.length === 0) {
      onError?.('No valid image files found.');
      return;
    }

    // For single file mode, take the first file
    const fileToProcess = maxFiles === 1 ? acceptedFiles[0] : acceptedFiles;
    onFileSelect?.(fileToProcess);
  };

  // Handle URL drops (images from internet)
  const handleUrlDrop = async (url) => {
    if (disabled || isDownloading) return;

    try {
      setIsDownloading(true);
      setDownloadProgress('Downloading image from URL...');

      // Validate URL
      if (!isImageUrl(url)) {
        throw new Error('The dropped URL does not appear to be an image.');
      }

      // Download the image
      const file = await downloadImageAsFile(url);
      
      setDownloadProgress('Image downloaded successfully!');
      
      // Pass the downloaded file to the parent component
      onFileSelect?.(file);
      
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress('');
      }, 1000);

    } catch (error) {
      console.error('Error downloading image from URL:', error);
      onError?.(error.message || 'Failed to download image from URL');
      setIsDownloading(false);
      setDownloadProgress('');
    }
  };

  // Setup drag and drop
  const { getRootProps, isDragActive, isDragReject } = useDragAndDrop({
    onFilesDrop: handleFilesDrop,
    onUrlDrop: handleUrlDrop,
    acceptedTypes,
    maxFiles,
  });

  // Determine the current state for styling
  const getZoneState = () => {
    if (disabled) return 'disabled';
    if (isDownloading) return 'downloading';
    if (isDragReject) return 'reject';
    if (isDragActive) return 'active';
    return 'idle';
  };

  const zoneState = getZoneState();

  // Dynamic classes based on state
  const stateClasses = {
    idle: 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30',
    active: 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/50 scale-[1.02] shadow-lg shadow-blue-500/20',
    reject: 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-950/50 scale-[1.02] shadow-lg shadow-red-500/20',
    downloading: 'border-amber-500 dark:border-amber-400 bg-amber-50 dark:bg-amber-950/50',
    disabled: 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed',
  };

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer
        ${stateClasses[zoneState]}
        ${className}
      `}
    >
      {/* Custom content or default content */}
      {children ? (
        children
      ) : (
        <div className="text-center space-y-4">
          {/* Icon based on state */}
          <div className="flex justify-center">
            {isDownloading ? (
              <div className="relative">
                <Download className="w-12 h-12 text-amber-500 dark:text-amber-400 animate-bounce" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse" />
              </div>
            ) : isDragReject ? (
              <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
            ) : isDragActive ? (
              <FileImage className="w-12 h-12 text-blue-500 dark:text-blue-400 animate-pulse" />
            ) : (
              <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500" />
            )}
          </div>

          {/* Text based on state */}
          <div className="space-y-2">
            {isDownloading ? (
              <div>
                <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                  Downloading...
                </p>
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {downloadProgress}
                </p>
              </div>
            ) : isDragReject ? (
              <div>
                <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                  Invalid File Type
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Please drop only image files
                </p>
              </div>
            ) : isDragActive ? (
              <div>
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                  Drop Here!
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Release to upload your image
                </p>
              </div>
            ) : showInstructions ? (
              <div>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  Drag & Drop Images
                </p>
                <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
                  <p>• Drop image files from your device</p>
                  <p>• Drag images directly from websites</p>
                  <p>• Supports JPG, PNG, GIF, WebP & more</p>
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Drag & Drop Images Here
              </p>
            )}
          </div>

          {/* Supported formats indicator */}
          {showInstructions && !isDragActive && !isDownloading && (
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 dark:bg-slate-700 rounded-full text-xs text-slate-600 dark:text-slate-400">
                <FileImage className="w-3 h-3" />
                <span>Images Only</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading overlay */}
      {isDownloading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
              Processing...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDropZone;
import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook for handling drag and drop functionality
 * Supports both file drops and URL drops (like dragging images from web pages)
 */
export const useDragAndDrop = ({
  onFilesDrop,
  onUrlDrop,
  acceptedTypes = ['image/*'],
  maxFiles = 1,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);
  const dragCounter = useRef(0);

  // Helper function to check if file type is accepted
  const isFileAccepted = useCallback((file) => {
    if (acceptedTypes.includes('*')) return true;
    
    return acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType + '/');
      }
      return file.type === type;
    });
  }, [acceptedTypes]);

  // Helper function to extract URLs from drag data
  const extractUrlFromDataTransfer = useCallback((dataTransfer) => {
    // Try to get URL from various data transfer formats
    const url = dataTransfer.getData('text/uri-list') || 
                dataTransfer.getData('text/plain') ||
                dataTransfer.getData('url');
    
    // Check if it's a valid image URL
    if (url && (url.startsWith('http') || url.startsWith('https'))) {
      // Basic check for image file extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
      const urlLower = url.toLowerCase();
      
      // Check if URL ends with image extension or contains image indicators
      const isImageUrl = imageExtensions.some(ext => urlLower.includes(ext)) ||
                        urlLower.includes('image') ||
                        urlLower.includes('img') ||
                        urlLower.includes('photo') ||
                        urlLower.includes('picture');
      
      if (isImageUrl) {
        return url;
      }
    }
    
    return null;
  }, []);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current++;
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
      
      // Check if any files are rejected
      const hasAcceptedFiles = Array.from(e.dataTransfer.items).some(item => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          return file && isFileAccepted(file);
        }
        return true; // Allow non-file items (like URLs)
      });
      
      setIsDragReject(!hasAcceptedFiles && e.dataTransfer.items.length > 0);
    }
  }, [isFileAccepted]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    dragCounter.current--;
    
    if (dragCounter.current === 0) {
      setIsDragActive(false);
      setIsDragReject(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set the appropriate drop effect
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragActive(false);
    setIsDragReject(false);
    dragCounter.current = 0;
    
    try {
      // First, try to handle as files
      const { files } = e.dataTransfer;
      
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        const acceptedFiles = fileArray.filter(isFileAccepted);
        const rejectedFiles = fileArray.filter(file => !isFileAccepted(file));
        
        if (acceptedFiles.length > 0) {
          const filesToProcess = maxFiles === 1 ? [acceptedFiles[0]] : acceptedFiles.slice(0, maxFiles);
          onFilesDrop?.(filesToProcess, rejectedFiles);
          return;
        }
      }
      
      // If no files, try to handle as URL
      const url = extractUrlFromDataTransfer(e.dataTransfer);
      if (url && onUrlDrop) {
        onUrlDrop(url);
        return;
      }
      
      // If nothing was processed, call onFilesDrop with empty arrays
      onFilesDrop?.([], files ? Array.from(files) : []);
      
    } catch (error) {
      console.error('Error handling drop:', error);
      onFilesDrop?.([], []);
    }
  }, [isFileAccepted, maxFiles, onFilesDrop, onUrlDrop, extractUrlFromDataTransfer]);

  // Return the drag and drop props and state
  const getRootProps = useCallback(() => ({
    onDragEnter: handleDragEnter,
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop,
  }), [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return {
    getRootProps,
    isDragActive,
    isDragReject,
  };
};

export default useDragAndDrop;
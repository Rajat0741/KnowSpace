/**
 * Utility functions for downloading and handling images from various sources
 */

/**
 * Downloads an image from a URL and converts it to a File object
 * Handles CORS issues by using a proxy approach when possible
 * @param {string} imageUrl - The URL of the image to download
 * @param {string} filename - Optional custom filename
 * @returns {Promise<File>} - Promise that resolves to a File object
 */
export async function downloadImageAsFile(imageUrl, filename = null) {
  try {
    // Clean and validate the URL
    const cleanUrl = imageUrl.trim();
    if (!cleanUrl || (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://'))) {
      throw new Error('Invalid URL format');
    }

    // Generate filename if not provided
    let finalFilename = filename;
    if (!finalFilename) {
      try {
        const url = new URL(cleanUrl);
        const pathname = url.pathname;
        const urlFilename = pathname.split('/').pop();
        
        // Extract file extension or default to jpg
        const hasExtension = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(urlFilename);
        finalFilename = hasExtension ? urlFilename : `image-${Date.now()}.jpg`;
      } catch {
        finalFilename = `downloaded-image-${Date.now()}.jpg`;
      }
    }

    // First, try direct fetch (works for CORS-enabled images)
    let response;
    try {
      response = await fetch(cleanUrl, {
        mode: 'cors',
        credentials: 'omit',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (corsError) {
      console.log('Direct fetch failed, trying proxy approach:', corsError.message);
      
      // If direct fetch fails due to CORS, try using a CORS proxy
      const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(cleanUrl)}`,
        `https://cors-anywhere.herokuapp.com/${cleanUrl}`,
        `https://thingproxy.freeboard.io/fetch/${cleanUrl}`,
      ];
      
      let proxyWorked = false;
      for (const proxyUrl of proxyUrls) {
        try {
          response = await fetch(proxyUrl, {
            mode: 'cors',
            credentials: 'omit',
          });
          
          if (response.ok) {
            proxyWorked = true;
            break;
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxyUrl} failed:`, proxyError.message);
          continue;
        }
      }
      
      if (!proxyWorked) {
        // Last resort: try to load through an image element and canvas
        return await downloadImageViaCanvas(cleanUrl, finalFilename);
      }
    }

    // Get the blob from the response
    const blob = await response.blob();
    
    // Verify it's actually an image
    if (!blob.type.startsWith('image/')) {
      // Try to determine image type from URL extension
      const extension = finalFilename.split('.').pop().toLowerCase();
      const mimeTypes = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'bmp': 'image/bmp',
      };
      
      const mimeType = mimeTypes[extension] || 'image/jpeg';
      const imageBlob = new Blob([blob], { type: mimeType });
      return new File([imageBlob], finalFilename, { type: mimeType });
    }
    
    // Create and return the File object
    return new File([blob], finalFilename, { type: blob.type });
    
  } catch (error) {
    console.error('Error downloading image:', error);
    throw new Error(`Failed to download image: ${error.message}`);
  }
}

/**
 * Downloads an image using Canvas API as a fallback for CORS issues
 * @param {string} imageUrl - The URL of the image
 * @param {string} filename - The filename for the resulting file
 * @returns {Promise<File>} - Promise that resolves to a File object
 */
async function downloadImageViaCanvas(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Set up CORS handling
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        ctx.drawImage(img, 0, 0);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], filename, { type: blob.type });
            resolve(file);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/jpeg', 0.9);
        
      } catch (error) {
        reject(new Error(`Canvas conversion failed: ${error.message}`));
      }
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image for canvas conversion'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Validates if a URL is likely to be an image
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if the URL appears to be an image
 */
export function isImageUrl(url) {
  if (!url || typeof url !== 'string') return false;
  
  const cleanUrl = url.trim().toLowerCase();
  
  // Check if it's a valid HTTP/HTTPS URL
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    return false;
  }
  
  // Check for common image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const hasImageExtension = imageExtensions.some(ext => cleanUrl.includes(ext));
  
  // Check for image-related keywords in URL
  const imageKeywords = ['image', 'img', 'photo', 'picture', 'pic', 'avatar', 'thumbnail'];
  const hasImageKeyword = imageKeywords.some(keyword => cleanUrl.includes(keyword));
  
  return hasImageExtension || hasImageKeyword;
}

/**
 * Extracts image URLs from various data transfer formats
 * @param {DataTransfer} dataTransfer - The data transfer object from drag event
 * @returns {string|null} - The extracted image URL or null
 */
export function extractImageUrlFromDataTransfer(dataTransfer) {
  try {
    // Try different data formats
    const formats = ['text/uri-list', 'text/plain', 'url', 'text/html'];
    
    for (const format of formats) {
      const data = dataTransfer.getData(format);
      if (data) {
        // For HTML format, try to extract img src
        if (format === 'text/html') {
          const imgMatch = data.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
          if (imgMatch && imgMatch[1]) {
            const url = imgMatch[1];
            if (isImageUrl(url)) return url;
          }
        } else {
          // For other formats, treat as direct URL
          const lines = data.split('\n');
          for (const line of lines) {
            const url = line.trim();
            if (isImageUrl(url)) return url;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting URL from data transfer:', error);
    return null;
  }
}

/**
 * Gets a preview URL for a file (either local File or URL)
 * @param {File|string} source - File object or URL string
 * @returns {string|null} - Preview URL or null
 */
export function getPreviewUrl(source) {
  if (!source) return null;
  
  if (typeof source === 'string') {
    // It's a URL
    return source;
  } else if (source instanceof File) {
    // It's a local file
    return URL.createObjectURL(source);
  }
  
  return null;
}

/**
 * Cleans up a preview URL created with URL.createObjectURL
 * @param {string} url - The URL to clean up
 */
export function cleanupPreviewUrl(url) {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
import conf from '../conf/conf.js';
import { Client, Functions } from 'appwrite';

// Helper class to handle ImageKit operations
export class ImageKitService {
    constructor() {
        this.urlEndpoint = conf.imagekitUrlEndpoint;
        this.publicKey = conf.imagekitPublicKey;
        this.functionId = conf.imagekitFunctionId;
        
        // Initialize Appwrite client for function calls
        this.client = new Client();
        this.client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId);
        this.functions = new Functions(this.client);
    }

    /**
     * Upload file to ImageKit
     * @param {File} file - The file to upload
     * @param {string|null} customName - Custom name for the file (optional)
     * @returns {Promise<Object>} - Upload response with fileId and url
     */
    async uploadFile(file, customName = null) {
        try {
            const fileName = customName || `${Date.now()}_${file.name}`;
            
            // Get authentication parameters for client-side upload
            const authParams = await this.getAuthenticationParameters();
            
            // Create FormData for upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', fileName);
            formData.append('publicKey', this.publicKey);
            formData.append('signature', authParams.signature);
            formData.append('expire', authParams.expire);
            formData.append('token', authParams.token);
            
            // Upload to ImageKit
            const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Upload failed');
            }
            
            const result = await response.json();
            
            return {
                $id: result.fileId,
                fileId: result.fileId,
                url: result.url,
                name: result.name,
                filePath: result.filePath
            };
        } catch (error) {
            console.error('ImageKit upload error:', error);
            throw error;
        }
    }

    /**
     * Get authentication parameters for client-side upload
     * This calls the combined Appwrite function with 'auth' operation
     * @returns {Promise<Object>} - Authentication parameters
     */
    async getAuthenticationParameters() {
        try {
            // Call the combined ImageKit Appwrite function with 'auth' operation using SDK
            const body = JSON.stringify({ operation: 'auth' });
            const execution = await this.functions.createExecution(
                this.functionId,
                body,
                false // Don't wait for completion
            );
            
            const data = JSON.parse(execution.responseBody || '{}');
            
            if (!data.success) {
                throw new Error(data.error || 'Authentication failed');
            }
            
            return {
                token: data.token,
                expire: data.expire,
                signature: data.signature
            };
        } catch (error) {
            console.error('Error getting auth parameters:', error);
            throw error;
        }
    }

    /**
     * Delete file from ImageKit
     * This calls the combined Appwrite function with 'delete' operation
     * @param {string} fileId - The file ID to delete
     * @returns {Promise<boolean>} - Success status
     */
    async deleteFile(fileId) {
        try {
            // Call the combined ImageKit Appwrite function with 'delete' operation using SDK
            const body = JSON.stringify({ 
                operation: 'delete',
                fileId: fileId 
            });
            const execution = await this.functions.createExecution(
                this.functionId,
                body,
                false
            );
            
            const data = JSON.parse(execution.responseBody || '{}');
            
            if (!data.success) {
                throw new Error(data.error || 'Delete failed');
            }
            
            return true;
        } catch (error) {
            console.error('ImageKit delete error:', error);
            return false;
        }
    }

    /**
     * Get file URL from ImageKit
     * @param {string} fileIdOrPathOrUrl - The file ID, path, full URL, or JSON string with url and fileId
     * @returns {string} - File URL
     */
    getFileView(fileIdOrPathOrUrl) {
        if (!fileIdOrPathOrUrl) return '';
        
        // If it's a JSON string with url and fileId, parse and return the url
        if (fileIdOrPathOrUrl.startsWith('{')) {
            try {
                const parsed = JSON.parse(fileIdOrPathOrUrl);
                return parsed.url || '';
            } catch {
                // Not valid JSON, continue
            }
        }
        
        // If it's already a full URL, return it as-is
        if (fileIdOrPathOrUrl.startsWith('http')) {
            return fileIdOrPathOrUrl;
        }
        
        // Construct ImageKit URL from path or fileId
        return `${this.urlEndpoint}/${fileIdOrPathOrUrl}`;
    }

    /**
     * Get optimized/transformed image URL
     * @param {string} fileIdOrPath - The file ID or path
     * @param {Object} transformations - ImageKit transformations
     * @returns {string} - Transformed image URL
     */
    getTransformedUrl(fileIdOrPath, transformations = {}) {
        const baseUrl = this.getFileView(fileIdOrPath);
        
        // Build transformation string
        const params = [];
        if (transformations.width) params.push(`w-${transformations.width}`);
        if (transformations.height) params.push(`h-${transformations.height}`);
        if (transformations.quality) params.push(`q-${transformations.quality}`);
        if (transformations.format) params.push(`f-${transformations.format}`);
        
        if (params.length > 0) {
            const transformStr = params.join(',');
            return baseUrl.replace(this.urlEndpoint, `${this.urlEndpoint}/tr:${transformStr}`);
        }
        
        return baseUrl;
    }
}

const imagekitService = new ImageKitService();
export default imagekitService;

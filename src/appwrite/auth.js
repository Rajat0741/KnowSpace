import conf from '../conf/conf.js'
import { Client, Account, ID, OAuthProvider } from 'appwrite'
import service from './config.js'
import imagekitService from '@/imagekit/imagekit.js';

export class AuthService {
    Client = new Client();
    account

    constructor() {
        this.Client
            .setEndpoint(conf.appWriteUrl)
            .setProject(conf.appWriteProjectId)
        this.account = new Account(this.Client);
    }

    // Google OAuth Login
    async loginWithGoogle() {
        try {
            // Use the base URL from environment or current location
            const baseUrl = import.meta.env.VITE_APP_BASE_URL || window.location.origin;
            const successUrl = `${baseUrl}/auth/callback`;
            const failureUrl = `${baseUrl}/`;

            return this.account.createOAuth2Token(
                OAuthProvider.Google,
                successUrl,
                failureUrl
            );
        } catch (error) {
            console.log("Appwrite service :: loginWithGoogle :: error :", error);
            throw error;
        }
    }

    async handleOAuthCallback(userId, secret) {
        try {
            // First, check if there's already an active session
            try {
                const existingUser = await this.account.get();
                if (existingUser) {
                    await this.account.deleteSessions();
                    // Small delay to ensure session is properly cleared
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            } catch {
                // Expected if no session exists - continue with session creation
            }
            
            const session = await this.account.createSession(userId, secret);
            return session;
        } catch (error) {
            console.log("Appwrite service :: handleOAuthCallback :: error :", error);
            
            // If we get a "session is active" error, try to clear and retry once
            if (error.message && error.message.includes('session is active')) {
                await this.account.deleteSessions();
                // Wait a bit for the session to be fully cleared
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const session = await this.account.createSession(userId, secret);
                return session;
            }
            
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            // Don't log error for guests - this is expected behavior
            if (error.code !== 401) {
                console.log("Appwrite service :: getCurrentUser :: error :", error);
            }
            return null;
        }
    }

    async logout() {
        try {
            // First try to delete all sessions
            await this.account.deleteSessions();
            
            // Verify logout by trying to get current user
            try {
                const user = await this.account.get();
                if (user) {
                    // If user still exists, try to delete current session specifically
                    await this.account.deleteSession('current');
                }
            } catch (verificationError) {
                // This is expected - we should get a 401 error after successful logout
                if (verificationError.code !== 401) {
                    console.log("Unexpected error during logout verification:", verificationError);
                }
            }
            
            return { success: true };
        } catch (error) {
            console.log("Appwrite service :: logout :: error :", error);
            
            // If deleteSessions fails, try deleting current session as fallback
            try {
                await this.account.deleteSession('current');
                return { success: true };
            } catch {
                throw error; // Throw the original error
            }
        }
    }

    // Delete account
    async deleteAccount() {
        try {
            return await this.account.deleteIdentity();
        } catch (error) {
            console.log("Appwrite service :: deleteAccount :: error :", error);
            throw error;
        }
    }

    // Profile Picture Management
    async uploadProfilePicture(file) {
        try {
            const user = await this.getCurrentUser();
            if (!user) throw new Error('User not authenticated');

            // Delete old profile picture if exists
            await this.deleteProfilePicture();

            const uploadedFile = await service.uploadFile(file);

            // Store both URL and fileId in user preferences for easy retrieval and deletion
            if (uploadedFile) {
                await this.updatePreferences({
                    profilePicture: {
                        url: uploadedFile.url,
                        fileId: uploadedFile.fileId
                    }
                });
            }

            return uploadedFile;
        } catch (error) {
            console.log("Appwrite service :: uploadProfilePicture :: error :", error);
            throw error;
        }
    }

    async deleteProfilePicture() {
        try {
            const user = await this.getCurrentUser();
            if (!user) return;

            // Get profile picture data from user preferences
            const prefs = await this.getPreferences();
            const profilePicture = prefs.profilePicture;
            if (profilePicture?.fileId) {
                // Delete from ImageKit first
                await imagekitService.deleteFile(profilePicture?.fileId);
                const updatedPrefs = { ...prefs };
                delete updatedPrefs.profilePicture;
                
                console.log("Updated prefs to save:", updatedPrefs);
                
                // Use replacePreferences to completely replace the prefs object
                await this.replacePreferences(updatedPrefs);
                
                return { success: true, deleted: true };
            }
            
            return { success: true, deleted: false };
        } catch (error) {
            console.log("Appwrite service :: deleteProfilePicture :: error :", error);
            throw error;
        }
    }

    async getProfilePictureUrl() {
        try {
            const user = await this.getCurrentUser();
            if (!user) return null;

            // Get profile picture data from user preferences
            const prefs = await this.getPreferences();
            const profilePicture = prefs.profilePicture;

            if (profilePicture?.url) {
                return profilePicture.url;
            }
            return null;
        } catch (error) {
            console.log("Appwrite service :: getProfilePictureUrl :: error :", error);
            return null;
        }
    }

    // Update user preferences (using Appwrite's built-in prefs)
    async updatePreferences(prefs) {
        try {
            const currentPrefs = await this.getPreferences();
            const newPrefs = { ...currentPrefs, ...prefs };
            return await this.account.updatePrefs(newPrefs);
        } catch (error) {
            console.log("Appwrite service :: updatePreferences :: error :", error);
            throw error;
        }
    }

    // Replace user preferences entirely (for deleting fields)
    async replacePreferences(prefs) {
        try {
            return await this.account.updatePrefs(prefs);
        } catch (error) {
            console.log("Appwrite service :: replacePreferences :: error :", error);
            throw error;
        }
    }

    async getPreferences() {
        try {
            const user = await this.getCurrentUser();
            return user?.prefs || {};
        } catch (error) {
            console.log("Appwrite service :: getPreferences :: error :", error);
            return {};
        }
    }

    async uploadBio(bio) {
        try {
            const currentPrefs = await this.getPreferences();
            return await this.updatePreferences({ ...currentPrefs, ...bio });
        } catch (error) {
            console.log("Appwrite service :: uploadBio :: error :", error);
            throw error;
        }
    }
}

const authService = new AuthService()

export default authService
import conf  from '../conf/conf.js'
import { Client, Account, ID } from 'appwrite'
import service from './config.js'

export class AuthService {
    Client = new Client();
    account
    
    constructor() {
        this.Client
        .setEndpoint(conf.appWriteUrl)
        .setProject(conf.appWriteProjectId)
        this.account = new Account(this.Client);
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // First login the user temporarily
                const session = await this.login({email, password});
                if (session) {
                    // Then send verification email
                    await this.sendVerificationEmail();
                    // Then logout (we'll make them login again after verification)
                    await this.logout();
                }
                return userAccount;
            } else {
                return userAccount;
            }
        } catch (error) {
            return error;
        }
    }

    async login({email, password}){
        try {
            return await this.account.createEmailPasswordSession(email,password);
        } catch (error) {
            console.log("Appwrite service :: login :: error :",error)
            throw error; // Re-throw to handle in the component
        }
    }
    async getCurrentUser() {
        try {
            return await this.account.get()
        } catch (error) {
            // Don't log error for guests - this is expected behavior
            if (error.code !== 401) {
                console.log("Appwrite service :: getCurrentUser :: error :", error)
            }
            return null
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error :",error)
        }
    }

    // Send verification email
    async sendVerificationEmail() {
        try {
            const url = conf.getEmailVerificationUrl();
            return await this.account.createVerification(url);
        } catch (error) {
            console.log("Appwrite service :: sendVerificationEmail :: error :", error);
            throw error;
        }
    }

    // Complete verification with the code from the email
    async confirmVerification(userId, secret) {
        try {
            return await this.account.updateVerification(userId, secret);
        } catch (error) {
            console.log("Appwrite service :: confirmVerification :: error :", error);
            throw error;
        }
    }

    // Check if email is verified
    async isEmailVerified() {
        try {
            const user = await this.getCurrentUser();
            return user && user.emailVerification;
        } catch (error) {
            console.log("Appwrite service :: isEmailVerified :: error :", error);
            return false;
        }
    }

    // Update password
    async updatePassword(newPassword, oldPassword) {
        try {
            return await this.account.updatePassword(newPassword, oldPassword);
        } catch (error) {
            console.log("Appwrite service :: updatePassword :: error :", error);
            throw error;
        }
    }

    // Update name
    async updateName(name) {
        try {
            return await this.account.updateName(name);
        } catch (error) {
            console.log("Appwrite service :: updateName :: error :", error);
            throw error;
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

    // Send password recovery email
    async sendPasswordRecovery(email) {
        try {
            const url = conf.getPasswordResetUrl();
            return await this.account.createRecovery(email, url);
        } catch (error) {
            console.log("Appwrite service :: sendPasswordRecovery :: error :", error);
            throw error;
        }
    }

    // Complete password recovery
    async completePasswordRecovery(userId, secret, newPassword, newPasswordAgain) {
        try {
            return await this.account.updateRecovery(userId, secret, newPassword, newPasswordAgain);
        } catch (error) {
            console.log("Appwrite service :: completePasswordRecovery :: error :", error);
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
                await service.deleteFile(profilePicture.fileId);
                // Remove from user preferences
                const updatedPrefs = { ...prefs };
                delete updatedPrefs.profilePicture;
                await this.updatePreferences(updatedPrefs);
            }
        } catch (error) {
            console.log("Appwrite service :: deleteProfilePicture :: error :", error);
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
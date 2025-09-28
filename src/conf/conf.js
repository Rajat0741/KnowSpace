const conf = {
    appWriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appWriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appWriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appWriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appWriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    
    appBaseUrl: String(import.meta.env.VITE_APP_BASE_URL || 'http://localhost:5173'),
    emailVerificationPath: String(import.meta.env.VITE_EMAIL_VERIFICATION_URL || '/verify-email'),
    passwordResetPath: String(import.meta.env.VITE_PASSWORD_RESET_URL || '/reset-password'),
    
    appWriteFetchUsersFunctionId: String(import.meta.env.VITE_APPWRITE_FETCHUSERS_FUNCTION_ID),
    appWriteFetchUserByIdFunctionId: String(import.meta.env.VITE_APPWRITE_FETCHUSERSBYID_FUNCTION_ID),

    // Helper methods to get full URLs
    getEmailVerificationUrl() {
        return `${this.appBaseUrl}${this.emailVerificationPath}`;
    },
    
    getPasswordResetUrl() {
        return `${this.appBaseUrl}${this.passwordResetPath}`;
    }
}

export default conf
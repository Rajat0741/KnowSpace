const conf = {
    appWriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appWriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appWriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appWriteCollectionId: String(import.meta.env.VITE_APPWRITE_COLLECTION_ID),
    appWriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    appWriteCommentsCollectionId: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID),
    appWriteTrackingCollectionId: String(import.meta.env.VITE_APPWRITE_TRACKING_COLLECTION_ID),
    
    // ImageKit Configuration (Frontend only - private key is in Appwrite function)
    imagekitPublicKey: String(import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY),
    imagekitUrlEndpoint: String(import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT),
    imagekitFunctionId: String(import.meta.env.VITE_IMAGEKIT_FUNCTION_ID),
    
    appBaseUrl: String(import.meta.env.VITE_APP_BASE_URL),
    emailVerificationPath: String(import.meta.env.VITE_EMAIL_VERIFICATION_URL),
    passwordResetPath: String(import.meta.env.VITE_PASSWORD_RESET_URL),
    
    appWriteFetchUsersFunctionId: String(import.meta.env.VITE_APPWRITE_FETCHUSERS_FUNCTION_ID),
    appWriteFetchUserByIdFunctionId: String(import.meta.env.VITE_APPWRITE_FETCHUSERSBYID_FUNCTION_ID),
    appWriteAIGenerationFunctionId: String(import.meta.env.VITE_APPWRITE_AI_GENERATION_FUNCTION_ID),

}

export default conf
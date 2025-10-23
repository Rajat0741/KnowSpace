import React, { useState } from 'react'
import service from '@/appwrite/config'
import { useForm } from 'react-hook-form'
import Button from '@/Components/ui/button'
import RTE from '@/Components/ui/RTE'
import { Input } from '@/Components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Select from '@/Components/ui/Select'
import VaulDrawer from '@/Components/ui/Custom/ImageDrawer/ImageDrawer'
import DragDropZone from '@/Components/ui/DragDropZone'
import { Send, Loader2, FileText, Image, Tag, ToggleLeft, ToggleRight, X, Type, FolderOpen } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

function PostForm({ post = null }) {
    const MAX_CONTENT_LENGTH = 35000;
    const MAX_TITLE_LENGTH = 200;
    const CONTENT_WARNING_LENGTH = 28000;
    const TITLE_WARNING_LENGTH = 160;
    
    const { register, handleSubmit, control, formState: { errors }, setValue, watch } = useForm({
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            status: post?.status || "active",
            category: post?.category || ""
        }
    });
    const [selectedFile, setSelectedFile] = useState(null); // Store selected file
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [imgLink, setImgLink] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const queryClient = useQueryClient();
    const [postCreated, setPostCreated] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Watch content and title for character counting
    const watchedContent = watch("content", "");
    const watchedTitle = watch("title", "");
    
    // Function to get plain text content from TinyMCE editor

    const categoryOptions = [
        "Technology",
        "Programming",
        "Design",
        "Tutorials",
        "News",
        "Reviews",
        "Personal",
        "Other"
    ];

    // Handler for file input change to set preview and update form value
    const handleImageChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedFile(file); // Store file in state
            setValue("featuredimage", e.target.files, { shouldValidate: true });
        } else {
            setPreviewUrl(null);
            setSelectedFile(null);
            setValue("featuredimage", null, { shouldValidate: true });
        }
    };

    // Handler for drag and drop image selection
    const handleDragDropImageSelect = (file) => {
        if (file) {
            // For drag and drop, we get either a single File object or array
            const fileToProcess = Array.isArray(file) ? file[0] : file;
            
            const url = URL.createObjectURL(fileToProcess);
            setPreviewUrl(url);
            setSelectedFile(fileToProcess);
            setValue("featuredimage", [fileToProcess], { shouldValidate: true });
        }
    };

    // Handler for drag and drop errors
    const handleDragDropError = (errorMessage) => {
        toast.error(errorMessage);
    };

    // Handler for image selection from internet - downloads and converts to file
    const handleImageSelectFromInternet = async (image) => {
        try {
            
            const imageUrl = image.largeImageURL || image.webformatURL;
            setPreviewUrl(imageUrl); // Show preview immediately
            setSelectedFile(null); // Clear local file
            
            // Download the image from Pixabay
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error('Failed to download image from Pixabay');
            }
            
            const blob = await response.blob();
            
            // Create a File object from the blob
            const fileName = `pixabay-${image.id}-${Date.now()}.jpg`;
            const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
            
            // Store as selected file (same as local upload)
            setSelectedFile(file);
            setValue("featuredimage", [file], { shouldValidate: true });
            
        } catch (error) {
            console.error('Error downloading Pixabay image:', error);
            toast.error('Failed to download image from Pixabay. Please try again or choose a different image.');
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    };


    const submit = async (data) => {
        setIsSubmitting(true);
        
        // Ensure content is a string and validate length
        const content = typeof data.content === 'string' ? data.content : String(data.content || '');
        
        // Check if content exceeds database limit (100,000 chars)
        if (content.length > MAX_CONTENT_LENGTH) {
            toast.error(`Content is too long (${content.length} characters). Maximum allowed is ${MAX_CONTENT_LENGTH.toLocaleString()} characters. Please shorten your content.`);
            setIsSubmitting(false);
            return;
        }
        
        // Validate content is not empty
        if (!content.trim()) {
            toast.error("Content cannot be empty. Please add some content to your post.");
            setIsSubmitting(false);
            return;
        }
        
        let uploadedFile = null;
        try {
            uploadedFile = null;
            if (post) {
                // Update existing post
                if (!selectedFile && !post.featuredimage) {
                    throw new Error("Featured image is required.");
                }
                
                if (selectedFile) {
                    // Upload file (works for both local files and downloaded Pixabay images)
                    uploadedFile = await service.uploadFile(selectedFile);
                    if (uploadedFile) {
                        // Delete old image if exists
                        if (post.featuredimage) {
                            try {
                                const oldImageData = JSON.parse(post.featuredimage);
                                if (oldImageData.fileId) {
                                    await service.deleteFile(oldImageData.fileId);
                                }
                            } catch {
                                // Old format or external URL, skip deletion
                            }
                        }
                    }
                }
                
                const dbpost = await service.updatePost({
                    id: post.$id,
                    title: data.title,
                    content: content, // Use validated content string
                    featuredimage: uploadedFile 
                        ? JSON.stringify({ url: uploadedFile.url, fileId: uploadedFile.fileId })
                        : post.featuredimage,
                    status: data.status,
                    category: data.category,
                    authorName: post.authorName || userData.name || 'Anonymous'
                });
                if (dbpost) {
                    // Clear preview and revoke local URL
                    if (previewUrl && selectedFile) {
                        URL.revokeObjectURL(previewUrl);
                        setPreviewUrl(null);
                    }
                    setImgLink(null);
                    
                    // Invalidate posts queries to refresh the posts list
                    queryClient.invalidateQueries({ queryKey: ['posts'] });
                    
                    navigate(`/post/${post.$id}`, { state: { updated: true } });
                } else {
                    throw new Error("Failed to update the post. Please try again.");
                }
            } else {
                // Create new post
                if (selectedFile) {
                    // Upload file (works for both local files and downloaded Pixabay images)
                    uploadedFile = await service.uploadFile(selectedFile);
                    if (uploadedFile) {
                        const dbPost = await service.createPost({
                            title: data.title,
                            content: content, // Use validated content string
                            featuredimage: JSON.stringify({ url: uploadedFile.url, fileId: uploadedFile.fileId }),
                            status: data.status,
                            userid: userData.$id,
                            category: data.category,
                            authorName: userData.name || 'Anonymous'
                        });
                        if (dbPost) {
                            setPostCreated(true);
                            // Clear preview and revoke local URL
                            if (previewUrl) {
                                URL.revokeObjectURL(previewUrl);
                                setPreviewUrl(null);
                            }
                            setImgLink(null);
                            navigate(`/post/${dbPost.$id}`);
                        } else {
                            throw new Error("Failed to create post. Please try again.");
                        }
                    } else {
                        throw new Error("Failed to upload image. Please try again.");
                    }
                } else {
                    throw new Error("Featured image is required.");
                }
            }
        } catch (error) {
            toast.error(error.message);
            if (uploadedFile && !postCreated) {
                try {
                    await service.deleteFile(uploadedFile.$id);
                    if (!post) {
                        setImgLink(null);
                    }
                } catch (cleanupError) {
                    console.error("Failed to cleanup uploaded file:", cleanupError);
                }
            }
        } finally {
            // Always revoke preview URL after submit (only for local files)
            if (previewUrl && selectedFile) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
            }
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Subtle, unified background with gentle gradients */}
            <div className="absolute inset-0">
                {/* Minimal ambient lighting effects */}
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/5 dark:bg-purple-400/8 rounded-full blur-3xl" />
            </div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit(submit)} className="space-y-8">
                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Title Section */}
                            <div className="relative group">
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                                            <Type className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Post Title</h3>
                                    </div>
                                    <Input
                                        placeholder="Enter an engaging title for your post..."
                                        className="w-full p-4 text-lg bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                                        {...register("title", { required: "Title is required" })}
                                    />
                                    {/* Title Length Tracker */}
                                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center mt-2 rounded-b-xl">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            📝 Title length (max {MAX_TITLE_LENGTH})
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                (watchedTitle?.length || 0) > MAX_TITLE_LENGTH
                                                    ? 'text-red-500'
                                                    : (watchedTitle?.length || 0) > TITLE_WARNING_LENGTH
                                                        ? 'text-amber-500'
                                                        : 'text-emerald-500'
                                            }`}
                                        >
                                            {watchedTitle?.length || 0} / {MAX_TITLE_LENGTH}
                                        </span>
                                    </div>
                                    {errors.title && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            {errors.title.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="relative group">
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Content</h3>
                                    </div>
                                    <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                                        <RTE 
                                            name="content" 
                                            control={control} 
                                            defaultvalue={post?.content || ""} 
                                            rules={{ required: "Content is required" }}
                                        />
                                        {/* Character Counter */}
                                        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                📝 Content length (including HTML)
                                            </span>
                                            <span className={`text-xs font-medium ${
                                                (watchedContent?.length || 0) > MAX_CONTENT_LENGTH 
                                                    ? 'text-red-500' 
                                                    : (watchedContent?.length || 0) > CONTENT_WARNING_LENGTH 
                                                        ? 'text-amber-500' 
                                                        : 'text-emerald-500'
                                            }`}>
                                                {watchedContent?.length || 0} / {MAX_CONTENT_LENGTH.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Image Optimization Tip */}
                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <div className="text-blue-500 dark:text-blue-400 mt-0.5">
                                                💡
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-1">
                                                    Pro Tip: Add unlimited images without reaching character limits!
                                                </p>
                                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                                    Upload images to <strong>Imgur</strong>, <strong>Cloudinary</strong>, or <strong>Google Drive</strong>, then use the 🖼️ image button in the editor to add them via URL. This way, each image only uses ~50 characters instead of thousands!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {errors.content && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            {errors.content.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            
                            {/* Featured Image Section */}
                            <div className="relative group">
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-sm">
                                            <Image className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Featured Image</h3>
                                    </div>
                                
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Input
                                            type="file"
                                            className="hidden"
                                            id="featured-image"
                                            accept="image/png,image/jpeg,image/gif,image/webp"
                                            {...register("featuredimage")}
                                            onChange={handleImageChange}
                                        />
                                        
                                        {/* Alternative upload options */}
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Choose from Device Button */}
                                            <label 
                                                htmlFor="featured-image"
                                                name="Browse"
                                                className="flex items-center justify-center h-12 border-2 border-dashed border-border/50 rounded-lg cursor-pointer bg-gradient-to-br from-background/50 via-background/30 to-background/20 hover:from-background/60 hover:via-background/40 hover:to-background/30 transition-all duration-300 group/device backdrop-blur-sm"
                                            >
                                                <FolderOpen className="w-4 h-4 text-muted-foreground group-hover/device:text-primary transition-colors mr-2" />
                                                <span className="text-sm text-muted-foreground group-hover/device:text-foreground transition-colors">
                                                    Browse
                                                </span>
                                            </label>
                                            
                                            {/* Choose from Internet Button */}
                                            <VaulDrawer onImageSelect={handleImageSelectFromInternet} />
                                        </div>
                                    </div>
                                    
                                    {/* Drag and Drop Zone */}
                                    <DragDropZone
                                        onFileSelect={handleDragDropImageSelect}
                                        onError={handleDragDropError}
                                        disabled={isSubmitting}
                                        className="min-h-[120px]"
                                        showInstructions={!previewUrl && !post?.featuredimage}
                                    />
                                    
                                    {errors.featuredimage && (
                                        <p className="text-red-500 text-sm flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            {errors.featuredimage.message}
                                        </p>
                                    )}
                                    
                                    {post && !previewUrl && (
                                        <p className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                                            💡 Leave empty to keep your current image
                                        </p>
                                    )}
                                    
                                    {/* Image Preview */}
                                    {(previewUrl || imgLink || (post && post.featuredimage)) && (
                                        <div className="relative group">
                                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                                                <img
                                                    src={
                                                        previewUrl
                                                            ? previewUrl // This could be local blob URL or internet image URL
                                                            : imgLink
                                                                ? service.getFileView(imgLink)
                                                                : post && post.featuredimage
                                                                    ? service.getFileView(post.featuredimage)
                                                                    : ""
                                                    }
                                                    alt={post ? post.title : "Preview"}
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                                {/* Image Source Indicator */}
                                                <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded-md flex items-center gap-1">
                                                    {selectedFile ? (
                                                        selectedFile.name?.includes('pixabay') ? (
                                                            <>🌐 Pixabay</>
                                                        ) : selectedFile.name?.includes('downloaded') || selectedFile.name?.includes('image-') ? (
                                                            <>🎯 Drag & Drop</>
                                                        ) : (
                                                            <>📁 Device</>
                                                        )
                                                    ) : post ? (
                                                        <>💾 Existing</>
                                                    ) : (
                                                        <>📷 Image</>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                            {/* Category Section */}
                            <div className="relative group">
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg shadow-sm">
                                            <Tag className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Category</h3>
                                    </div>
                                    <Select
                                        options={categoryOptions}
                                        className="w-full"
                                        {...register("category", { required: "Category is required" })}
                                    />
                                    {errors.category && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            {errors.category.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Status Section */}
                            <div className="relative group">
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-sm">
                                            {post?.status === "active" ? 
                                                <ToggleRight className="w-5 h-5 text-white" /> : 
                                                <ToggleLeft className="w-5 h-5 text-white/80" />
                                            }
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Status</h3>
                                    </div>
                                    <Select
                                        options={["active", "inactive"]}
                                        className="w-full"
                                        {...register("status", { required: "Status is required" })}
                                    />
                                    {errors.status && (
                                        <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            {errors.status.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="relative group">
                                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Button 
                                        type="submit" 
                                        className={`w-full py-4 text-lg font-semibold transition-all duration-300 relative overflow-hidden ${
                                            post 
                                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20" 
                                                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/20"
                                        } disabled:opacity-50 disabled:cursor-not-allowed text-white`}
                                        disabled={isSubmitting}
                                    >
                                        <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                        {isSubmitting ? (
                                            <div className="relative flex items-center justify-center gap-3">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Processing...</span>
                                            </div>
                                        ) : (
                                            <div className="relative flex items-center justify-center gap-3">
                                                <span>{post ? "Update Post" : "Publish Post"}</span>
                                                <Send className="w-5 h-5" />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    
                </form>
            </div>
        </div>
    );
}

export default PostForm
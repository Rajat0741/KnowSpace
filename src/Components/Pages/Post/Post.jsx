import React, { Suspense, useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import service from '@/appwrite/config';
import { ArrowLeft, Calendar, Tag, Clock, Share2, Edit, Trash2, AlertCircle, Home } from 'lucide-react';
import CommentsDrawer from '@/Components/ui/Custom/CommentsDrawer/CommentsDrawer';
import { toast } from 'sonner';

// Error Boundary Component for Post Not Found
class PostErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Post Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const isFromAITracking = this.props.location?.state?.fromAITracking;

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-400/10 dark:bg-slate-800/20 blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-400/10 dark:bg-slate-700/20 blur-3xl"></div>
          </div>

          <div className="relative max-w-2xl w-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200/50 dark:border-slate-700/60 p-8 md:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40">
                <AlertCircle className="w-16 h-16 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
              Post Not Found
            </h1>

            {/* Description */}
            <p className="text-center text-slate-600 dark:text-slate-400 mb-8 text-lg">
              {isFromAITracking
                ? "This post may have been deleted or is no longer available."
                : "The post you're looking for doesn't exist or has been removed."}
            </p>

            {/* Additional Info for AI Tracking */}
            {isFromAITracking && (
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-purple-200/70 dark:border-purple-800/50 rounded-xl">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  💡 <strong>Tip:</strong> If you recently deleted this post, it will no longer be accessible even though it appears in your AI tracking history.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center">
              <Link
                to="/home"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function createPostResource(id, reduxPost, forceRefresh = false) {
  let status = 'pending';
  let result;
  let suspender;

  // Use Redux data if available and not forcing refresh
  if (reduxPost && !forceRefresh && reduxPost.$id === id) {
    status = 'success';
    result = reduxPost;
  } else {
    // Fetch fresh data only when needed
    suspender = service.getPost(id)
      .then((r) => {
        status = 'success';
        result = r;
      })
      .catch((e) => {
        status = 'error';
        result = e;
      });
  }

  return {
    read() {
      if (status === 'pending') throw suspender;
      if (status === 'error') throw result;
      return result;
    }
  };
}

// Loading skeleton component
function PostSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button Skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="w-20 h-4 bg-muted rounded animate-pulse" />
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="w-3/4 h-8 bg-muted rounded animate-pulse" />
            <div className="w-1/2 h-4 bg-muted rounded animate-pulse" />
            <div className="space-y-3">
              <div className="w-full h-4 bg-muted rounded animate-pulse" />
              <div className="w-5/6 h-4 bg-muted rounded animate-pulse" />
              <div className="w-4/5 h-4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
}

function PostContent({ resource, wasUpdated = false, location }) {
  const post = resource.read();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const queryClient = useQueryClient();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Check if we should show home button instead of back button
  const shouldShowHomeButton = wasUpdated || location.state?.fromPublicPost || location.state?.fromAITracking;
  
  // Activate post functionality
  const handleActivatePost = async () => {
    if (!isOwner || post.status !== 'inactive') return;

    // Check if featured image exists before activating
    if (!post.featuredimage) {
      toast.error('Featured image is required to activate this post.');
      return;
    }

    setIsActivating(true);
    try {
      await service.updatePost({
        id: post.$id,
        title: post.title,
        content: post.content,
        featuredimage: post.featuredimage,
        status: 'active',
        category: post.category,
        authorName: post.authorName || userData?.name || 'Anonymous'
      });
      window.location.reload(); // reload to reflect status change
    } catch (error) {
      console.error('Error activating post:', error);
      toast.error('Failed to activate post. Please try again.');
    } finally {
      setIsActivating(false);
    }
  };

  // Check if current user owns this post
  const isOwner = userData && post && userData.$id === post.userid;

  // Handle navigation button click
  const handleNavigationClick = () => {
    if (shouldShowHomeButton) {
      navigate('/home');
    } else {
      navigate(-1);
    }
  };

  // Delete post functionality
  const handleDeletePost = async () => {
    if (!isOwner) return;
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setIsDeleting(true);
    try {
      // Delete featured image if exists
      if (post.featuredimage) {
        try {
          const imageData = JSON.parse(post.featuredimage);
          if (imageData.fileId) {
            await service.deleteFile(imageData.fileId);
          }
        } catch {
          // Old format or external URL, skip deletion
        }
      }

      // Delete the post
      await service.deletePost(post.$id);

      // Invalidate posts queries to refresh the home page
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      // Navigate back to home
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // Edit post functionality
  const handleEditPost = () => {
    if (!isOwner) return;
    navigate(`/edit-post/${post.$id}`);
  };

  // Dynamic max width - using viewport-based responsive design
  const getMaxWidth = () => {
    return 'max-w-6xl xl:max-w-7xl';
  };

  // Share functionality - Generate public links for sharing
  const sharePost = async (platform) => {
    // Generate public URL for sharing
    const publicUrl = `${window.location.origin}/shared/post/${post.$id}`;
    const url = encodeURIComponent(publicUrl);
    const text = encodeURIComponent(`Check out this article: ${post.title}`);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(publicUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
      return;
    }

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareModal(false);
  };

  const openShareModal = () => {
    setShowShareModal(true);
  };

  useEffect(() => {
    if (post?.featuredimage) {
      const img = new Image();
      img.onload = () => {
        setImageLoaded(true);
      };
      img.onerror = () => setImageError(true);
      // Handle both URLs and Appwrite file IDs
      img.src = post.featuredimage.startsWith('http')
        ? post.featuredimage
        : service.getFileView(post.featuredimage);
    }
  }, [post?.featuredimage]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">📄</div>
          <h2 className="text-2xl font-bold text-foreground">Post not found</h2>
          <p className="text-muted-foreground">The post you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Handle both URLs and Appwrite file IDs for featured image
  const featuredImageUrl = post.featuredimage
    ? (post.featuredimage.startsWith('http')
      ? post.featuredimage
      : service.getFileView(post.featuredimage))
    : null;

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with animated gradient - Settings inspired */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-purple-50/30 to-indigo-50/20 dark:from-slate-900/50 dark:via-slate-800/30 dark:to-slate-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent dark:from-gray-900/70" />
        {/* Floating orbs */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute top-20 left-20 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Hero Section with Featured Image */}
      <div className="relative overflow-hidden">
        <div className={`relative ${getMaxWidth()} mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300`}>
          {/* Navigation */}
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-6 sticky top-4 z-10 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-purple-200/30 dark:border-purple-800/30 rounded-2xl p-3 sm:p-4 shadow-xl shadow-black/10 dark:shadow-black/30">
            <button
              onClick={handleNavigationClick}
              className="group inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-50/90 to-purple-50/90 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 rounded-lg hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400/50 dark:focus:ring-purple-500/50 shadow-md hover:shadow-lg"
              aria-label={shouldShowHomeButton ? "Go to home page" : "Go back to previous page"}
            >
              {shouldShowHomeButton ? (
                <>
                  <Home className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="hidden sm:inline text-sm font-medium text-purple-600 dark:text-purple-400">Home</span>
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-purple-600 dark:text-purple-400" />
                  <span className="hidden sm:inline text-sm font-medium text-purple-600 dark:text-purple-400">Back</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Owner Actions - Edit and Delete Buttons */}
              {isOwner && (
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Activate button if post is inactive */}
                  {post.status === 'inactive' && (
                    <button
                      onClick={handleActivatePost}
                      disabled={isActivating}
                      className="group inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Activate Post"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 group-hover:text-green-300 transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-13h2v6h-2V5zm0 8h2v2h-2v-2z" /></svg>
                      <span className="hidden sm:inline text-xs font-medium text-green-400 group-hover:text-green-300 transition-colors">
                        {isActivating ? 'Activating...' : 'Activate'}
                      </span>
                    </button>
                  )}
                  <button
                    onClick={handleEditPost}
                    className="group inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-purple-500/30 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                    title="Edit Post"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                    <span className="hidden sm:inline text-xs font-medium text-purple-400 group-hover:text-purple-300 transition-colors">Edit</span>
                  </button>

                  <button
                    onClick={handleDeletePost}
                    disabled={isDeleting}
                    className="group inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Post"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 group-hover:text-red-300 transition-colors" />
                    <span className="hidden sm:inline text-xs font-medium text-red-400 group-hover:text-red-300 transition-colors">
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </span>
                  </button>
                </div>
              )}

              {/* Comments Drawer */}
              <CommentsDrawer postId={post.$id} />

              {/* Share Icon - Same size as comments */}
              <button
                onClick={openShareModal}
                className="group inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-purple-500/30 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                title="Share Post"
              >
                <Share2 className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="hidden sm:inline text-sm font-medium text-purple-400 group-hover:text-purple-300 transition-colors">Share</span>
              </button>

              {/* Category Badge with Glow - Always visible but smaller on mobile */}
              {post.category && (
                <div className="inline-flex group items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 backdrop-blur-sm rounded-full border border-purple-500/30 dark:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/20 dark:hover:shadow-purple-500/20 transition-all duration-300 cursor-default shadow-md">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate max-w-20 sm:max-w-none">{post.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Header Layout: Title Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            {/* Title and Metadata - Left Side */}
            <div className="space-y-4 flex flex-col justify-center">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                {post.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Link to={`/user/${post.userid}`}>
                    <span className="text-primary font-medium hover:underline">By {post.authorName || 'Anonymous'}</span>
                  </Link>
                </div>
                {post.$createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.$createdAt)}</span>
                  </div>
                )}
                {post.content && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{getReadingTime(post.content)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image - Right Side */}
            {featuredImageUrl && (
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden">
                  {imageLoaded && !imageError ? (
                    <img
                      src={featuredImageUrl}
                      alt={post.title}
                      className="w-full object-cover"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        height: 'auto'
                      }}
                    />
                  ) : (
                    <div className="w-full h-60 bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex items-center justify-center">
                      <div className="text-muted-foreground">
                        {imageError ? '🖼️ Image unavailable' : '📷 Loading image...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className={`relative ${getMaxWidth()} mx-auto px-4 sm:px-6 lg:px-8 pb-16`}>
        <article className="relative">
          <div className="relative border border-purple-200/40 dark:border-purple-800/40 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg shadow-black/10 dark:shadow-black/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            {/* Content */}
            <div
              className={`post-content max-w-none ${isDarkMode ? 'dark' : ''}`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Enhanced Social Share Section - Hidden on mobile */}
        <div className="hidden sm:block mt-12 sm:mt-16 pt-8 sm:pt-12">
          {/* Decorative divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-400 dark:to-purple-400"></div>
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="w-16 h-px bg-gradient-to-r from-purple-400 to-transparent dark:from-purple-400"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50/60 to-purple-50/60 dark:from-blue-950/30 dark:to-purple-950/30 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/40 dark:border-purple-800/40 shadow-lg shadow-black/10 dark:shadow-black/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Article Engagement Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Link to={`/user/${post.authorId}`}>
                    <span className="text-primary font-medium hover:underline">By {post.authorName || 'Anonymous'}</span>
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Published {formatDate(post.$createdAt)}</span>
                </div>
                {post.content && (
                  <div className="flex items-center gap-2">
                    <span>•</span>
                    <span>{getReadingTime(post.content)}</span>
                  </div>
                )}
              </div>

              {/* Enhanced Share Buttons */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-foreground/80">Share this article:</span>
                <button
                  onClick={openShareModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-purple-500/30 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-400">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
            </div>

            {/* Title and Message */}
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Delete Post</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Are you sure you want to delete this post? This action cannot be undone and will permanently remove the post and its content.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card/95 border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Share This Post</h3>
              <p className="text-muted-foreground text-sm">
                Share "{post.title}" with your friends
              </p>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Twitter */}
              <button
                onClick={() => sharePost('twitter')}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm font-medium text-foreground">Twitter</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => sharePost('facebook')}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600/10 to-blue-700/10 hover:from-blue-600/20 hover:to-blue-700/20 border border-blue-600/20 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-foreground">Facebook</span>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => sharePost('whatsapp')}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 border border-green-500/20 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                <span className="text-sm font-medium text-foreground">WhatsApp</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => sharePost('linkedin')}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-700/10 to-blue-800/10 hover:from-blue-700/20 hover:to-blue-800/20 border border-blue-700/20 rounded-lg transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-sm font-medium text-foreground">LinkedIn</span>
              </button>
            </div>

            {/* Copy Link Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex-1 h-px bg-border"></div>
                <span>or</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <button
                onClick={() => sharePost('copy')}
                className={`w-full flex items-center justify-center gap-3 p-3 border-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg ${copySuccess
                  ? 'bg-green-500/20 border-green-500/30 text-green-600'
                  : 'bg-gray-100 dark:bg-muted hover:bg-gray-200 dark:hover:bg-muted/90 border-gray-300 dark:border-border text-gray-900 dark:text-foreground'
                  }`}
              >
                {copySuccess ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Copy Link</span>
                  </>
                )}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-muted hover:bg-gray-200 dark:hover:bg-muted/90 text-gray-900 dark:text-foreground rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg border-2 border-gray-300 dark:border-border/50 hover:scale-105 hover:border-gray-400 dark:hover:border-border hover:shadow-gray-300/50 dark:hover:shadow-primary/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Post() {
  const { id } = useParams();
  const reduxPost = useSelector((state) => state.post.post);
  const location = useLocation();

  // Check if we need to force refresh
  // timestamp changes on each navigation from AI tracking, forcing fresh data fetch
  const shouldForceRefresh = location.state?.updated || 
                             location.state?.fromAITracking || 
                             location.state?.fromPublicPost ||
                             location.state?.timestamp; // This ensures re-fetch on each navigation

  // Force resource recreation when ID changes or timestamp changes
  const resource = React.useMemo(() => {
    return createPostResource(id, reduxPost, shouldForceRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location.state?.timestamp]); // Only id and timestamp matter for forcing re-creation

  return (
    <PostErrorBoundary location={location}>
      <Suspense fallback={<PostSkeleton />} key={id}>
        <PostContent key={id} resource={resource} wasUpdated={!!location.state?.updated} location={location} />
      </Suspense>
    </PostErrorBoundary>
  );
}

export default Post;

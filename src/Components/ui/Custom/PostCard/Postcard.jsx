import React, { useState, useRef, useEffect } from 'react'
import service from '@/appwrite/config'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Calendar, Tag, Eye, Clock, User } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setPost } from '@/store/postSlice'

function Postcard({ post, className, showMetadata = true, variant = 'default' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  
  // Check if post has a featured image
  const hasFeaturedImage = post.featuredimage && post.featuredimage.trim() !== ''
  
  // Handle both URLs and Appwrite file IDs
  const previewUrl = hasFeaturedImage 
    ? (post.featuredimage?.startsWith('http') 
        ? post.featuredimage 
        : service.getFileView(post.featuredimage))
    : null
  const dispatch = useDispatch()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getReadingTime = (content) => {
    if (!content) return '3 min read'
    const words = content.split(' ').length
    const readingTime = Math.ceil(words / 200)
    return `${readingTime} min read`
  }

  const variants = {
    default: 'aspect-[4/3]'
  }

  // Intersection Observer for lazy loading improvements
  useEffect(() => {
    if (!cardRef.current || !hasFeaturedImage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Preload image when card comes into view
          const img = new Image()
          img.src = previewUrl
        }
      },
      { rootMargin: '100px' }
    )

    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [previewUrl, hasFeaturedImage])

  return (
    <div 
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/post/${post.$id}`}
        onClick={() => dispatch(setPost(post))}
        className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl"
        aria-label={`Read article: ${post.title}`}
      >
        <article className={cn(
          'relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-300',
          'shadow-md hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-black/40',
          'hover:scale-[1.02] hover:border-border',
          'group-focus:scale-[1.02] group-focus:shadow-xl group-focus:shadow-black/20 dark:group-focus:shadow-black/40',
          'transform-gpu flex flex-col min-h-[340px]', // Consistent minimum height for all cards
          className
        )}>
          {/* Image Container */}
          <div className={cn("relative overflow-hidden", variants[variant])}>
            {!hasFeaturedImage ? (
              /* No featured image */
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex items-center justify-center">
                <div className="text-center text-muted-foreground p-6">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">No Featured Image</p>
                </div>
              </div>
            ) : !imageError ? (
              <>
                {/* Loading placeholder */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                
                {/* Main image */}
                <img
                  src={previewUrl}
                  alt={post.title}
                  className={cn(
                    'w-full h-full object-cover transition-all duration-500 transform-gpu',
                    'group-hover:scale-110',
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  loading="lazy"
                  decoding="async"
                />
              </>
            ) : (
              /* Fallback for broken images */
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground p-4">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Image unavailable</p>
                </div>
              </div>
            )}

            {/* Category badge with improved design */}
            {post.category && (
              <div className="absolute top-3 left-3 z-20">
                <span className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200',
                  'bg-primary/90 text-primary-foreground backdrop-blur-sm',
                  'shadow-lg border border-white/20',
                  isHovered && 'bg-primary text-primary-foreground'
                )}>
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
              </div>
            )}
          </div>

          {/* Content area below image */}
          <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-background to-muted/30">
            <h2 className={cn(
              'font-bold text-foreground mb-2 leading-tight line-clamp-2',
              'text-lg sm:text-xl',
              'transition-colors duration-300',
              isHovered && 'text-primary'
            )}>
              {post.title}
            </h2>
            
            {/* Enhanced metadata with better spacing */}
            {showMetadata && (
              <div className='space-y-2'>
                {/* Author on first line with highlighting */}
                <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md text-muted-foreground text-xs w-fit">
                  <User className="w-3 h-3" />
                  <span className="font-medium">{post.authorName || 'Anonymous'}</span>
                </div>
                
                {/* Date and Reading time on second line */}
                <div className="flex items-center justify-between text-muted-foreground text-xs">
                  {post.$createdAt && (
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.$createdAt)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    <span>{getReadingTime(post.content)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accessibility enhancement */}
          <div className="sr-only">
            Article titled "{post.title}"
            {` by ${post.authorName || 'Anonymous'}`}
            {post.category && ` in ${post.category} category`}
            {post.$createdAt && ` published on ${formatDate(post.$createdAt)}`}
            {post.content && ` - ${getReadingTime(post.content)}`}
          </div>
        </article>
      </Link>
    </div>
  )
}

export default Postcard
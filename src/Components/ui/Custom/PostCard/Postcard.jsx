import React, { useState, useRef, useEffect } from 'react'
import service from '@/appwrite/config'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Calendar, Tag, Eye, Clock } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setPost } from '@/store/postSlice'

function Postcard({ post, className, showMetadata = true, variant = 'default' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  // Handle both URLs and Appwrite file IDs
  const previewUrl = post.featuredimage?.startsWith('http') 
    ? post.featuredimage 
    : service.getFileView(post.featuredimage)
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
    default: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
    square: 'aspect-square',
    tall: 'aspect-[3/4]'
  }

  // Intersection Observer for lazy loading improvements
  useEffect(() => {
    if (!cardRef.current) return

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
  }, [previewUrl])

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
          'transform-gpu', // GPU acceleration for better performance
          variants[variant],
          className
        )}>
          {/* Image Container */}
          <div className="relative h-full overflow-hidden">
            {!imageError ? (
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

            {/* Enhanced gradient overlay with animation */}
            <div className={cn(
              'absolute inset-0 transition-all duration-300',
              isHovered 
                ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
                : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'
            )} />
            

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

            {/* Content overlay with improved typography */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h2 className={cn(
                'font-bold text-white mb-2 leading-tight line-clamp-2',
                'text-lg sm:text-xl lg:text-lg xl:text-xl',
                'drop-shadow-lg transition-all duration-300',
                isHovered && 'transform translate-y-[-2px]'
              )}>
                {post.title}
              </h2>
              
              {/* Enhanced metadata with better spacing */}
              {showMetadata && (
                <div className={cn(
                  'flex flex-wrap items-center gap-3 text-white/90 text-xs sm:text-sm transition-all duration-300',
                  isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-80'
                )}>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium">By {post.authorName || 'Anonymous'}</span>
                  </div>
                  
                  {post.$createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(post.$createdAt)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{getReadingTime(post.content)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced hover effect overlay with subtle animation */}
            <div className={cn(
              'absolute inset-0 transition-all duration-300',
              'bg-gradient-to-br from-primary/5 via-transparent to-primary/10',
              isHovered ? 'opacity-100' : 'opacity-0'
            )} />
            
            {/* Subtle border glow on hover */}
            <div className={cn(
              'absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none',
              isHovered 
                ? 'ring-1 ring-primary/50 ring-inset' 
                : 'ring-0 ring-transparent'
            )} />
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
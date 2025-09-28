import React, { useState } from 'react'
import service from '@/appwrite/config'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Calendar, User, Tag, Eye, Clock } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setPost } from '@/store/postSlice'

function FeaturedPostCard({ post, className, compact = false }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  // Handle both URLs and Appwrite file IDs
  const previewUrl = post.featuredimage?.startsWith('http') 
    ? post.featuredimage 
    : service.getFileView(post.featuredimage)
  const dispatch = useDispatch()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: compact ? 'short' : 'long',
      day: 'numeric',
      year: compact ? undefined : 'numeric'
    })
  }

  const getReadingTime = (content) => {
    if (!content) return '5 min read'
    const words = content.split(' ').length
    const readingTime = Math.ceil(words / 200)
    return `${readingTime} min read`
  }

  const aspectRatioClass = compact 
    ? 'aspect-[4/3] sm:aspect-[3/2]' 
    : 'aspect-[21/9] md:aspect-[2/1] lg:aspect-[5/2]'

  return (
    <Link 
      to={`/post/${post.$id}`}
      onClick={() => dispatch(setPost(post))}
      className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl"
      aria-label={`Read featured article: ${post.title}`}
    >
      <article className={cn(
        'relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-500',
        'hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-black/40',
        'hover:scale-[1.01] hover:border-primary/50',
        'group-focus:scale-[1.01] group-focus:shadow-xl',
        aspectRatioClass,
        className
      )}>
        {/* Image Container */}
        <div className="relative h-full overflow-hidden">
          {!imageError ? (
            <>
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                  <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Main image */}
              <img
                src={previewUrl}
                alt={post.title}
                className={cn(
                  'w-full h-full object-cover transition-all duration-700',
                  'group-hover:scale-105',
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            </>
          ) : (
            /* Fallback for broken images */
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="text-center text-muted-foreground p-6">
                <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-base">Featured image unavailable</p>
              </div>
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          
          {/* Featured badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className={cn(
              'inline-flex items-center gap-2 rounded-full font-semibold shadow-lg',
              'bg-primary text-primary-foreground',
              compact 
                ? 'px-2 py-1 text-xs gap-1' 
                : 'px-3 py-1.5 text-sm gap-2'
            )}>
              ⭐ Featured
            </span>
          </div>

          {/* Category badge */}
          {post.category && (
            <div className="absolute top-4 right-4 z-20">
              <span className={cn(
                'inline-flex items-center rounded-full font-medium bg-white/20 text-white backdrop-blur-md',
                compact 
                  ? 'gap-1 px-2 py-1 text-xs' 
                  : 'gap-1.5 px-3 py-1.5 text-sm'
              )}>
                <Tag className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
                {post.category}
              </span>
            </div>
          )}

          {/* Content overlay */}
          <div className={cn(
            'absolute bottom-0 left-0 right-0 z-10',
            compact ? 'p-4' : 'p-6 lg:p-8'
          )}>
            <div className={compact ? 'max-w-full' : 'max-w-2xl'}>
              <h1 className={cn(
                'font-bold text-white mb-3 leading-tight drop-shadow-lg',
                compact 
                  ? 'text-lg sm:text-xl line-clamp-2' 
                  : 'text-2xl sm:text-3xl lg:text-4xl xl:text-5xl'
              )}>
                {post.title}
              </h1>
              
              {/* Excerpt - only show in non-compact mode */}
              {!compact && post.content && (
                <p className="text-white/90 text-base sm:text-lg mb-4 line-clamp-2 drop-shadow-md">
                  {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
              )}
              
              {/* Metadata */}
              <div className={cn(
                'flex flex-wrap items-center gap-4 text-white/80',
                compact ? 'text-xs' : 'text-sm sm:text-base'
              )}>
                <div className="flex items-center gap-1">
                  <span className="font-medium">By {post.authorName || 'Anonymous'}</span>
                </div>
                
                {post.$createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
                    <span>{formatDate(post.$createdAt)}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock className={compact ? 'w-3 h-3' : 'w-4 h-4'} />
                  <span>{getReadingTime(post.content)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Accessibility enhancement */}
        <div className="sr-only">
          Featured article titled "{post.title}"
          {` by ${post.authorName || 'Anonymous'}`}
          {post.category && ` in ${post.category} category`}
          {post.$createdAt && ` published on ${formatDate(post.$createdAt)}`}
          {post.content && ` - ${getReadingTime(post.content)}`}
        </div>
      </article>
    </Link>
  )
}

export default FeaturedPostCard

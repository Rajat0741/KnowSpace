import React, { useState } from 'react'
import service from '@/appwrite/config'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Calendar, Tag, Eye, Clock, ArrowRight } from 'lucide-react'

function CompactPostCard({ post, className, orientation = 'horizontal' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  // Check if post has a featured image
  const hasFeaturedImage = post.featuredimage && post.featuredimage.trim() !== ''
  
  // Handle both URLs and Appwrite file IDs
  const previewUrl = hasFeaturedImage 
    ? (post.featuredimage?.startsWith('http') 
        ? post.featuredimage 
        : service.getFileView(post.featuredimage))
    : null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getReadingTime = (content) => {
    if (!content) return '3 min'
    const words = content.split(' ').length
    const readingTime = Math.ceil(words / 200)
    return `${readingTime} min`
  }

  const isHorizontal = orientation === 'horizontal'

  return (
    <Link 
      to={`/post/${post.$id}`}
      className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
      aria-label={`Read article: ${post.title}`}
    >
      <article className={cn(
        'relative overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300',
        'hover:shadow-md hover:shadow-black/10 dark:hover:shadow-black/20',
        'hover:border-border group-focus:shadow-md',
        isHorizontal ? 'flex' : 'flex flex-col',
        className
      )}>
        {/* Image Container */}
        <div className={cn(
          'relative overflow-hidden bg-muted flex-shrink-0',
          isHorizontal 
            ? 'w-24 sm:w-32 md:w-40 aspect-square' 
            : 'w-full aspect-video'
        )}>
          {!hasFeaturedImage ? (
            /* No featured image */
            <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60 flex items-center justify-center">
              <Eye className="w-8 h-8 text-muted-foreground opacity-30" />
            </div>
          ) : !imageError ? (
            <>
              {/* Loading placeholder */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              {/* Main image */}
              <img
                src={previewUrl}
                alt={post.title}
                className={cn(
                  'w-full h-full object-cover transition-all duration-300',
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
              <Eye className="w-6 h-6 text-muted-foreground opacity-50" />
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex-1 p-4 flex flex-col justify-between min-h-0">
          {/* Header */}
          <div className="flex-1 min-h-0">
            {/* Category */}
            {post.category && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className={cn(
              'font-semibold text-foreground leading-tight mb-2',
              isHorizontal 
                ? 'text-sm sm:text-base line-clamp-2' 
                : 'text-base line-clamp-2'
            )}>
              {post.title}
            </h3>

            {/* Excerpt - only show in vertical layout or larger horizontal cards */}
            {(!isHorizontal || className?.includes('md:')) && post.content && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                {post.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-border/30">
            <div className="flex items-center gap-3 text-muted-foreground text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium">By {post.authorName || 'Anonymous'}</span>
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

            {/* Read more arrow */}
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1 transform" />
          </div>
        </div>

        {/* Accessibility enhancement */}
        <div className="sr-only">
          Article titled "{post.title}"
          {` by ${post.authorName || 'Anonymous'}`}
          {post.category && ` in ${post.category} category`}
          {post.$createdAt && ` published on ${formatDate(post.$createdAt)}`}
          {post.content && ` - ${getReadingTime(post.content)} read`}
        </div>
      </article>
    </Link>
  )
}

export default CompactPostCard

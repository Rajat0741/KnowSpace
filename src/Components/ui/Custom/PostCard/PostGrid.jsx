import React from 'react'
import { cn } from '@/lib/utils'
import { Postcard, CompactPostCard } from './index'

const PostGrid = ({ 
  posts = [], 
  layout = 'grid', 
  className 
}) => {
  if (!posts.length) return null

  const remainingPosts = [...posts]

  const layoutConfigs = {
    grid: {
      container: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
      cardProps: { className: 'h-64 sm:h-72' }
    },
    masonry: {
      container: 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4',
      cardProps: { variant: 'default', showMetadata: true }
    },
    list: {
      container: 'space-y-4',
      cardProps: { orientation: 'horizontal' }
    },
    mixed: {
      container: 'space-y-8',
      cardProps: { variant: 'default', showMetadata: true }
    }
  }

  const config = layoutConfigs[layout] || layoutConfigs.grid

  const renderGrid = () => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10'>
      {remainingPosts.map((post) => (
        <div key={post.$id} className='w-full'>
          <Postcard 
            post={post} 
            className="h-64 sm:h-72 w-full"
          />
        </div>
      ))}
    </div>
  )

  const renderList = () => (
    <div className={cn(config.container, className)}>
      {remainingPosts.map((post) => (
        <CompactPostCard 
          key={post.$id} 
          post={post} 
          {...config.cardProps}
        />
      ))}
    </div>
  )

  const renderMixed = () => (
    <div className={cn(config.container, className)}>
      {/* First section: Regular grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {remainingPosts.slice(0, 8).map((post) => (
          <Postcard 
            key={post.$id} 
            post={post} 
            variant="default"
            showMetadata={true}
            className="h-64 sm:h-72"
          />
        ))}
      </div>

      {/* Second section: Compact horizontal cards */}
      {remainingPosts.length > 8 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {remainingPosts.slice(8, 12).map((post) => (
            <CompactPostCard 
              key={post.$id} 
              post={post} 
              orientation="horizontal"
              className="min-h-[120px]"
            />
          ))}
        </div>
      )}

      {/* Remaining posts: Small grid */}
      {remainingPosts.length > 12 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {remainingPosts.slice(12).map((post) => (
            <Postcard 
              key={post.$id} 
              post={post} 
              variant="square"
              showMetadata={false}
              className="h-48 sm:h-56"
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderMasonry = () => (
    <div className={cn(config.container, className)}>
      {remainingPosts.map((post, index) => (
        <div key={post.$id} className="break-inside-avoid mb-4">
          <Postcard 
            post={post} 
            variant={index % 3 === 0 ? 'tall' : 'default'}
            showMetadata={true}
            className={index % 3 === 0 ? 'h-80' : 'h-64'}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="post-grid-container">
      {/* Main content based on layout */}
      {remainingPosts.length > 0 && (
        <section className="post-section space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Posts</h2>
            <span className="text-sm text-muted-foreground">
              {remainingPosts.length} posts
            </span>
          </div>
          
          {layout === 'grid' && renderGrid()}
          {layout === 'list' && renderList()}
          {layout === 'mixed' && renderMixed()}
          {layout === 'masonry' && renderMasonry()}
        </section>
      )}
    </div>
  )
}

export default PostGrid

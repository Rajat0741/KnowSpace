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
      // Reduced columns: sidebar open (3 posts), sidebar closed (4 posts)
      // Auto height with padding for better content flow
      container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 group-[.sidebar-open]/body:xl:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-7',
      cardProps: { className: '' } // Auto height with padding
    },
    masonry: {
      container: 'columns-1 md:columns-2 lg:columns-3 group-[.sidebar-open]/body:xl:columns-3 xl:columns-4 gap-5 lg:gap-7 space-y-6',
      cardProps: { variant: 'default', showMetadata: true }
    },
    list: {
      container: 'space-y-6',
      cardProps: { orientation: 'horizontal' }
    },
    mixed: {
      container: 'space-y-8',
      cardProps: { variant: 'default', showMetadata: true }
    }
  }

  const config = layoutConfigs[layout] || layoutConfigs.grid

  const renderGrid = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 group-[.sidebar-open]/body:xl:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-7'>
      {remainingPosts.map((post) => (
        <div key={post.$id} className='w-full'>
          <Postcard 
            post={post} 
            className="w-full"
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
      {/* First section: Larger regular grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 group-[.sidebar-open]/body:xl:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-7">
        {remainingPosts.slice(0, 8).map((post) => (
          <Postcard 
            key={post.$id} 
            post={post} 
            variant="default"
            showMetadata={true}
          />
        ))}
      </div>

      {/* Second section: Larger compact horizontal cards */}
      {remainingPosts.length > 8 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {remainingPosts.slice(8, 12).map((post) => (
            <CompactPostCard 
              key={post.$id} 
              post={post} 
              orientation="horizontal"
              className="min-h-[160px]"
            />
          ))}
        </div>
      )}

      {/* Remaining posts: Larger grid */}
      {remainingPosts.length > 12 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {remainingPosts.slice(12).map((post) => (
            <Postcard 
              key={post.$id} 
              post={post} 
              variant="square"
              showMetadata={false}
            />
          ))}
        </div>
      )}
    </div>
  )

  const renderMasonry = () => (
    <div className={cn(config.container, className)}>
      {remainingPosts.map((post, index) => (
        <div key={post.$id} className="break-inside-avoid mb-6">
          <Postcard 
            post={post} 
            variant={index % 3 === 0 ? 'tall' : 'default'}
            showMetadata={true}
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

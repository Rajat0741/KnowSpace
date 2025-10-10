import React, { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostGrid from '../../ui/Custom/PostCard/PostGrid'
import service from '../../../appwrite/config'
import { Query } from 'appwrite'
import {SkeletonCard} from '../../ui/SkeletonCard'
import { Input } from '../../ui/input'
import Select from '../../ui/select'

function Home() {
  // ==========================================
  // CONFIGURATION & CONSTANTS
  // ==========================================
  const POSTS_PER_PAGE = 12
  const categories = ["All Categories", "Technology", "Programming", "Design", "Tutorials", "News", "Reviews", "Personal", "Other"]

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['posts', selectedCategory, searchTerm],
    queryFn: ({ pageParam = null }) => {
      const queries = [
        Query.orderDesc('$createdAt'),
        Query.limit(POSTS_PER_PAGE),
        Query.equal('status', 'active'),
        ...(pageParam ? [Query.cursorAfter(pageParam)] : []),
        ...(selectedCategory !== 'all' ? [Query.equal('category', selectedCategory)] : []),
        ...(searchTerm.trim() ? [Query.contains('title', searchTerm.trim())] : []),
      ]
      return service.getPosts(queries)
    },
    getNextPageParam: (lastPage) => {
      const posts = lastPage.documents || []
      return posts.length === POSTS_PER_PAGE ? posts[posts.length - 1].$id : undefined
    },
    enabled: selectedCategory !== '' || searchTerm !== '',
  })

  // Flatten posts from all pages
  const recentPosts = data?.pages.flatMap(page => page.documents || []) || []

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  /**
   * Clears all search filters and resets to initial state
   */
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('all')
    setHasSearched(false)
  }

  // ==========================================
  // EFFECTS
  // ==========================================

  /**
   * Debounced search effect - triggers search when filters change
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== '' || selectedCategory !== 'all') {
        setHasSearched(true)
      } else if (searchTerm === '' && selectedCategory === 'all' && hasSearched) {
        // Reset to initial state when both filters are cleared
        setHasSearched(false)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory, hasSearched])

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  /**
   * Handles category selection
   */
  const handleCategoryChange = (value) => {
    const category = value === 'All Categories' ? 'all' : value
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-scree">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Search and Filter Section */}
        <div className="mb-6 lg:mb-8">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 lg:flex-[2]">
                <Input
                  type="text"
                  placeholder="Search articles by title or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-xl px-4 py-6 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full text-sm"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex-1">
                <Select
                  options={categories}
                  value={selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                  onChange={(e) => {
                    const value = e.target.value === 'All Categories' ? 'all' : e.target.value;
                    handleCategoryChange(value);
                  }}
                  showIcons={true}
                  className="bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Active filters:
                  </span>
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg text-sm font-medium border border-blue-200 dark:border-blue-700">
                      📂 {selectedCategory}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-lg text-sm font-medium border border-purple-200 dark:border-purple-700">
                      🔍 "{searchTerm}"
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-200 border border-red-200 dark:border-red-700 hover:border-red-300 dark:hover:border-red-600"
                  >
                    ✕ Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results Count */}
        {hasSearched && (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {recentPosts.length > 0 ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Found {recentPosts.length} result{recentPosts.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    No results found
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      
            {/* Posts Layout */}
      {!isLoading && recentPosts.length > 0 && (
        <div className="space-y-6">
          <InfiniteScroll
            dataLength={recentPosts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="flex justify-center items-center py-8">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Loading more articles...
                    </span>
                  </div>
                </div>
              </div>
            }
            endMessage={
              recentPosts.length > POSTS_PER_PAGE && (
                <div className="flex justify-center items-center py-8">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">🎉</span>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        All caught up!
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      You've reached the end of the articles
                    </span>
                  </div>
                </div>
              )
            }
          >
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
              <PostGrid
                posts={recentPosts}
                layout="grid"
                showFeatured={true}
                featuredCount={4}
              />
            </div>
          </InfiniteScroll>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="space-y-8">
            {/* Featured posts skeleton */}
            <div className="space-y-4">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`featured-${index}`} className="space-y-3">
                    <SkeletonCard className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Regular posts skeleton */}
            <div className="space-y-4">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={`regular-${index}`} className="space-y-3">
                    <SkeletonCard className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {recentPosts.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 max-w-md shadow-sm">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-inner">
              <span className="text-3xl">{hasSearched ? '🔍' : '📝'}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {hasSearched ? 'No articles found' : 'No articles available'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-sm">
              {hasSearched 
                ? 'Try adjusting your search terms or explore different categories to find what you\'re looking for.'
                : 'It looks like there are no articles available yet. Check back later or explore different categories.'
              }
            </p>
            {hasSearched && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
              >
                <span>🔄</span>
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Home
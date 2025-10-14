import React, { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostGrid from '../../ui/Custom/PostCard/PostGrid'
import service from '../../../appwrite/config'
import { Query } from 'appwrite'
import {SkeletonCard} from '../../ui/SkeletonCard'
import { Input } from '../../ui/input'
import Select from '../../ui/select'
import { Search, Filter, Sparkles, TrendingUp } from 'lucide-react'

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-400/10 dark:bg-slate-700/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-teal-400/10 dark:bg-slate-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-400/10 dark:bg-slate-700/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Hero Header Section */}
        <div className="mb-8 lg:mb-12">
          <div className="text-center space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 dark:from-teal-600/20 dark:to-cyan-600/20 rounded-full border border-teal-200/50 dark:border-teal-700/50 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-semibold text-teal-900 dark:text-teal-100">Discover Amazing Content</span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Explore <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Knowledge</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Browse through our collection of articles, tutorials, and insights
            </p>
          </div>

          {/* Search and Filter Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input with Icon */}
                <div className="flex-1 lg:flex-[2] relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-teal-500 transition-colors pointer-events-none z-10">
                    <Search className="w-5 h-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Search articles, tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl py-6 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all duration-200 w-full text-base shadow-sm hover:shadow-md"
                  />
                </div>

                {/* Category Dropdown with Icon */}
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 z-10 pointer-events-none">
                    <Filter className="w-5 h-5" />
                  </div>
                  <Select
                    options={categories}
                    value={selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                    onChange={(e) => {
                      const value = e.target.value === 'All Categories' ? 'all' : e.target.value;
                      handleCategoryChange(value);
                    }}
                    showIcons={true}
                    className="pl-12 bg-slate-50/80 dark:bg-slate-800/80 border-slate-300/60 dark:border-slate-600/60 text-slate-900 dark:text-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedCategory !== 'all') && (
                <div className="mt-6 p-4 bg-gradient-to-r from-slate-50/80 to-cyan-50/40 dark:from-slate-800/80 dark:to-slate-700/40 rounded-xl border border-slate-200/60 dark:border-slate-700/50 backdrop-blur-sm">
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Active Filters:
                    </span>
                    {selectedCategory !== 'all' && (
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-600 dark:to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                        📂 {selectedCategory}
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                        🔍 "{searchTerm}"
                      </span>
                    )}
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 text-red-700 dark:text-red-400 hover:text-white dark:hover:text-white bg-red-50 dark:bg-red-900/30 hover:bg-red-600 dark:hover:bg-red-600 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 border border-red-200 dark:border-red-700 hover:border-red-600 dark:hover:border-red-600 transform hover:scale-105 shadow-sm hover:shadow-md"
                    >
                      ✕ Clear All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Results Count */}
        {hasSearched && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl p-4 shadow-lg">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {recentPosts.length > 0 ? (
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></span>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent font-bold">
                      Found {recentPosts.length} result{recentPosts.length !== 1 ? 's' : ''}
                    </span>
                  </span>
                ) : (
                  <span className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-lg shadow-orange-500/50"></span>
                    <span className="text-orange-600 dark:text-orange-400">No results found</span>
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      
            {/* Posts Layout */}
      {!isLoading && recentPosts.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <InfiniteScroll
            dataLength={recentPosts.length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={
              <div className="flex justify-center items-center py-10">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl px-8 py-5 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-6 h-6 border-3 border-purple-500/30 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                    </div>
                    <span className="text-base text-slate-700 dark:text-slate-300 font-semibold">
                      Loading more articles...
                    </span>
                  </div>
                </div>
              </div>
            }
            endMessage={
              recentPosts.length > POSTS_PER_PAGE && (
                <div className="flex justify-center items-center py-10">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-xl border border-blue-200/60 dark:border-slate-600/50 rounded-2xl px-8 py-6 text-center shadow-xl">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-3xl animate-bounce">🎉</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        All Caught Up!
                      </span>
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      You've explored all available articles
                    </span>
                  </div>
                </div>
              )
            }
          >
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <PostGrid
                posts={recentPosts}
                layout="grid"
              />
            </div>
          </InfiniteScroll>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-8 shadow-xl animate-in fade-in duration-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="space-y-4">
                <SkeletonCard className="h-56 bg-slate-200/60 dark:bg-slate-700/60 rounded-xl animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-5/6 bg-slate-200/60 dark:bg-slate-700/60 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-slate-200/60 dark:bg-slate-700/60 rounded animate-pulse"></div>
                  <div className="h-3 w-1/2 bg-slate-200/60 dark:bg-slate-700/60 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {recentPosts.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-3xl p-12 max-w-lg shadow-2xl">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl">{hasSearched ? '🔍' : '📝'}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              {hasSearched ? 'No Articles Found' : 'No Articles Yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 text-base">
              {hasSearched 
                ? 'We couldn\'t find any articles matching your criteria. Try adjusting your search or explore different categories.'
                : 'There are no articles available at the moment. Check back soon for new content!'
              }
            </p>
            {hasSearched && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-teal-500 dark:to-cyan-500 dark:hover:from-teal-600 dark:hover:to-cyan-600 text-white rounded-xl transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="text-xl">🔄</span>
                Clear Filters & Explore
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
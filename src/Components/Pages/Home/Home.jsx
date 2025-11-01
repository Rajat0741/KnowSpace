import React, { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import InfiniteScroll from 'react-infinite-scroll-component'
import PostGrid from '../../ui/Custom/PostCard/PostGrid'
import service from '../../../appwrite/config'
import { Query } from 'appwrite'
import {SkeletonCard} from '../../ui/SkeletonCard'
import { Input } from '../../ui/input'
import { Search, Filter, X } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"
import { Separator } from "@/Components/ui/separator"

function Home() {
  // ==========================================
  // CONFIGURATION & CONSTANTS
  // ==========================================
  const POSTS_PER_PAGE = 8
  const categories = ["All Categories", "Technology", "Programming", "Design", "Tutorials", "News", "Reviews", "Personal", "Other"]

  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('') // Actual search term for query
  const [searchInput, setSearchInput] = useState('') // Input value (not yet searched)
  const [searchType, setSearchType] = useState('title') // 'title' or 'author'
  const [hasSearched, setHasSearched] = useState(false)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['posts', selectedCategory, searchTerm, searchType],
    queryFn: ({ pageParam = null }) => {
      const queries = [
        Query.orderDesc('$createdAt'), // Always sort by newest first
        Query.limit(POSTS_PER_PAGE),
        Query.equal('status', 'active'),
        ...(pageParam ? [Query.cursorAfter(pageParam)] : []),
        ...(selectedCategory !== 'all' ? [Query.equal('category', selectedCategory)] : []),
        // Search by title or author based on searchType
        ...(searchTerm.trim() 
          ? searchType === 'title'
            ? [Query.search('title', searchTerm.trim())]
            : [Query.contains('authorName', searchTerm.trim())]
          : []
        ),
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
   * Handles Enter key press to trigger search
   */
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(searchInput.trim())
      if (searchInput.trim() !== '') {
        setHasSearched(true)
      }
    }
  }

  /**
   * Clears all search filters and resets to initial state
   */
  const handleClearAllFilters = () => {
    setSearchTerm('')
    setSearchInput('')
    setSelectedCategory('all')
    setSearchType('title')
    setHasSearched(false)
  }

  // ==========================================
  // EFFECTS
  // ==========================================

  /**
   * Effect to handle category changes
   */
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setHasSearched(true)
    } else if (searchTerm === '' && selectedCategory === 'all' && hasSearched) {
      // Reset to initial state when both filters are cleared
      setHasSearched(false)
    }
  }, [selectedCategory, searchTerm, hasSearched])

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-slate-700/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 -right-1/4 w-[500px] h-[500px] bg-purple-400/10 dark:bg-slate-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-400/10 dark:bg-slate-700/25 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Compact Filters Section */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/50 rounded-xl shadow-lg p-4">
            {/* Filter Controls - Clean search bar with filters button */}
            <div className="relative flex items-center w-full">
              {/* Search Icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </span>
              {/* Search Input */}
              <Input
                type="text"
                placeholder={searchType === 'title' ? 'Search articles by title... (Press Enter)' : 'Search articles by author name... (Press Enter)'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="h-12 pl-12 pr-32 bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all w-full text-base"
                style={{ boxShadow: '0 2px 8px 0 rgba(80,80,120,0.04)' }}
              />
              {/* Filters Popover - moved left, inside input */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="h-9 px-3 inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium text-sm shadow-sm align-middle">
                      <Filter className="w-4 h-4" />
                      <span className="hidden sm:inline">Filters</span>
                      {(selectedCategory !== 'all' || searchType !== 'title') && (
                        <span className="flex items-center justify-center w-5 h-5 text-xs font-semibold bg-purple-500 text-white rounded-full">
                          {(selectedCategory !== 'all' ? 1 : 0) + (searchType !== 'title' ? 1 : 0)}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-lg rounded-xl">
                    <div className="space-y-4">
                      {/* Search Type */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Search By
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setSearchType('title')}
                            className={`px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${
                              searchType === 'title'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            📝 Title
                          </button>
                          <button
                            onClick={() => setSearchType('author')}
                            className={`px-4 py-2.5 rounded-lg border-2 transition-all font-medium text-sm ${
                              searchType === 'author'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            👤 Author
                          </button>
                        </div>
                      </div>
                      <Separator className="bg-slate-200 dark:bg-slate-700" />
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                          Category
                        </label>
                        <select
                          value={selectedCategory === 'all' ? 'All Categories' : selectedCategory}
                          onChange={(e) => {
                            const value = e.target.value === 'All Categories' ? 'all' : e.target.value;
                            handleCategoryChange(value);
                          }}
                          className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCategory !== 'all' || searchType !== 'title') && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Active Filters:
                  </span>
                  {searchType === 'author' && (
                    <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-md text-xs font-medium border border-indigo-200 dark:border-indigo-800">
                      👤 Search by Author
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-800">
                      📂 {selectedCategory}
                    </span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-md text-xs font-medium border border-purple-200 dark:border-purple-800">
                      � "{searchTerm}"
                    </span>
                  )}
                  <button
                    onClick={handleClearAllFilters}
                    className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-xs font-medium px-2.5 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  >
                    <X className="w-3 h-3" />
                    Clear All
                  </button>
                </div>
              </div>
            )}
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
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/80 dark:to-slate-700/80 backdrop-blur-xl border border-purple-200/60 dark:border-slate-600/50 rounded-2xl px-8 py-6 text-center shadow-xl">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 group-[.sidebar-open]/body:xl:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                {/* Image skeleton with 4:3 aspect ratio */}
                <div className="aspect-[4/3] bg-slate-200/60 dark:bg-slate-700/60 animate-pulse"></div>
                {/* Content area skeleton */}
                <div className="p-4 space-y-2">
                  {/* Title skeleton */}
                  <div className="space-y-2">
                    <div className="h-5 w-5/6 bg-slate-200/60 dark:bg-slate-700/60 rounded animate-pulse"></div>
                    <div className="h-5 w-3/4 bg-slate-200/60 dark:bg-slate-700/60 rounded animate-pulse"></div>
                  </div>
                  {/* Author skeleton */}
                  <div className="h-6 w-24 bg-slate-200/60 dark:bg-slate-700/60 rounded-md animate-pulse"></div>
                  {/* Date and time skeleton */}
                  <div className="flex justify-between">
                    <div className="h-6 w-28 bg-slate-200/60 dark:bg-slate-700/60 rounded-md animate-pulse"></div>
                    <div className="h-6 w-20 bg-slate-200/60 dark:bg-slate-700/60 rounded-md animate-pulse"></div>
                  </div>
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
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white rounded-xl transition-all duration-300 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105"
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
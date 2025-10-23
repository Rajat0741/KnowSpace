import React, { useState, useEffect, useCallback } from 'react'
import { Drawer } from 'vaul'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import InfiniteScroll from 'react-infinite-scroll-component'
import service from '@/appwrite/config'
// Optimized icon imports
import Sparkles from 'lucide-react/dist/esm/icons/sparkles'
import Clock from 'lucide-react/dist/esm/icons/clock'
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2'
import XCircle from 'lucide-react/dist/esm/icons/x-circle'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import X from 'lucide-react/dist/esm/icons/x'
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw'
import Button from '@/Components/ui/button'
import AITrackingDetailDialog from '../AITrackingDetailDialog/AITrackingDetailDialog'

const STATUS_CONFIG = {
  queued: {
    icon: Clock,
    label: 'Queued',
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-900'
  },
  in_progress: {
    icon: Loader2,
    label: 'In Progress',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900'
  },
  inprogress: {
    icon: Loader2,
    label: 'In Progress',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-900'
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-green-500',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-900'
  },
  failed: {
    icon: XCircle,
    label: 'Failed',
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-red-200 dark:border-red-900'
  }
}

function TrackingItem({ item, onViewDetails, onNavigateToPost }) {
  const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.in_progress
  const StatusIcon = statusConfig.icon

  const handleNavigate = (e) => {
    e.stopPropagation()
    if (item.postId) {
      onNavigateToPost(item.postId)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div
      onClick={() => onViewDetails(item)}
      className={`
        group relative p-5 rounded-xl border cursor-pointer 
        hover:-translate-y-0.5 transition-transform duration-200
        ${statusConfig.bgColor} ${statusConfig.borderColor}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 mt-1 p-2 rounded-lg ${
          item.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900' :
          item.status === 'failed' ? 'bg-red-100 dark:bg-red-900' :
          'bg-blue-100 dark:bg-blue-900'
        }`}>
          <StatusIcon className={`${statusConfig.color} ${(item.status === 'in_progress' || item.status === 'inprogress') ? 'animate-spin' : ''}`} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-1 text-slate-800 dark:text-slate-200">
            {item.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={12} />
            <span>{formatDate(item.$createdAt)}</span>
            <span>•</span>
            <span className={`${statusConfig.color} font-medium`}>{statusConfig.label}</span>
          </div>

          {item.category && (
            <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {item.category}
            </span>
          )}

          {item.postId && item.status === 'completed' && (
            <button
              onClick={handleNavigate}
              className="mt-3 flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline"
            >
              <ExternalLink size={12} />
              View Post
            </button>
          )}

          {item.error && item.status === 'failed' && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950">
              <p className="text-xs text-red-600 dark:text-red-400 line-clamp-2">
                <span className="font-semibold">Error:</span> {item.error}
              </p>
            </div>
          )}

          {item.status === 'failed' && !item.error && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950">
              <p className="text-xs text-red-600 dark:text-red-400">
                <span className="font-semibold">Generation failed</span> - No error details available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AITrackingDrawer({ triggerContent = null }) {
  const [isOpen, setIsOpen] = useState(false)
  const [trackingItems, setTrackingItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now())
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  
  const ITEMS_PER_PAGE = 8

  const fetchTrackingItems = useCallback(async (reset = false) => {
    if (!userData?.$id) return
    
    setLoading(true)
    try {
      const currentPage = reset ? 0 : page
      const offset = currentPage * ITEMS_PER_PAGE
      
      const response = await service.getTrackingItems(userData.$id, ITEMS_PER_PAGE, offset)
      const newItems = response.documents || []
      
      if (reset) {
        setTrackingItems(newItems)
        setPage(1)
      } else {
        setTrackingItems(prev => [...prev, ...newItems])
        setPage(prev => prev + 1)
      }
      
      setHasMore(newItems.length === ITEMS_PER_PAGE)
      setLastRefreshTime(Date.now())
    } catch (error) {
      console.error('Error fetching tracking items:', error)
      
      // Check for specific error types
      if (error.message?.includes('network') || error.message?.includes('fetch')) {
        toast.error('Network error loading tracking items', {
          description: 'Please check your connection and try again'
        })
      } else if (error.code === 401) {
        toast.error('Authentication error', {
          description: 'Please log in again to view tracking items'
        })
      } else {
        toast.error('Failed to load tracking items', {
          description: 'Please try refreshing the page'
        })
      }
    } finally {
      setLoading(false)
    }
  }, [userData, page, ITEMS_PER_PAGE])

  useEffect(() => {
    if (isOpen) {
      setPage(0)
      setHasMore(true)
      fetchTrackingItems(true)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const loadMoreItems = useCallback(() => {
    if (!loading) {
      fetchTrackingItems(false)
    }
  }, [loading, fetchTrackingItems])

  // Auto-refresh based on progress status when drawer is open
  useEffect(() => {
    if (!isOpen) return

    const hasInProgressItems = trackingItems.some(item =>
      item.status === 'in_progress' || item.status === 'inprogress'
    )
    const hasQueuedItems = trackingItems.some(item => item.status === 'queued')

    // 10 seconds if there are queued items, 5 seconds if there are items in progress, 1 minute if not
    const intervalMs = hasInProgressItems ? 5000 : hasQueuedItems ? 10000 : 60000

    // Calculate time since last refresh
    const timeSinceLastRefresh = Date.now() - lastRefreshTime
    const remainingTime = Math.max(0, intervalMs - timeSinceLastRefresh)

    const timeout = setTimeout(() => {
      // Reset and fetch from beginning on auto-refresh
      setPage(0)
      setHasMore(true)
      fetchTrackingItems(true)
    }, remainingTime)

    return () => clearTimeout(timeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, trackingItems, lastRefreshTime])

  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setShowDetailDialog(true)
  }

  const handleNavigateToPost = (postId) => {
    setIsOpen(false)
    // Add a small delay to allow drawer to close smoothly before navigation
    setTimeout(() => {
      navigate(`/post/${postId}`, { 
        state: { fromAITracking: true }
      })
    }, 200)
  }

  const inProgressCount = trackingItems.filter(item => 
    item.status === 'in_progress' || item.status === 'inprogress' || item.status === 'queued'
  ).length

  return (
    <>
      <Drawer.Root direction="left" open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger asChild>
          {triggerContent || (
            <button className="relative p-2.5 rounded-xl">
              <div className={`p-2 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-xl ${inProgressCount > 0 ? 'animate-pulse' : ''}`}>
                <Sparkles size={20} className="text-white" />
              </div>
              
              {inProgressCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 font-bold">
                  {inProgressCount}
                </span>
              )}
            </button>
          )}
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/70 z-[9999]" />
          <Drawer.Content
            className="left-0 top-0 bottom-0 fixed z-[10000] outline-none w-[90vw] sm:w-[420px] flex"
            style={{ '--initial-transform': 'calc(100% + 8px)', transform: 'translateZ(0)' }}
          >
            <div className="bg-white dark:bg-slate-900 h-full w-full flex flex-col border-r border-slate-200 dark:border-slate-700">
              {/* Header */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <Drawer.Title className="font-bold text-lg flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-purple-600">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="text-slate-800 dark:text-slate-100">
                      AI Generation Tracking
                    </span>
                  </Drawer.Title>
                  <Drawer.Close asChild>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <X size={18} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </Drawer.Close>
                </div>
                <Drawer.Description className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Track your AI-generated articles and their progress
                </Drawer.Description>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPage(0)
                      setHasMore(true)
                      fetchTrackingItems(true)
                    }}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw size={14} className={(inProgressCount > 0 || loading) ? 'animate-spin' : ''} />
                    <span>{inProgressCount > 0 && !loading ? 'Auto-refreshing' : 'Refresh'}</span>
                  </Button>
                  {inProgressCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2.5 py-1.5 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>{inProgressCount} in progress</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div id="scrollableDiv" className="flex-1 overflow-y-auto p-5">
                {loading && trackingItems.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="animate-spin text-purple-500 mx-auto mb-3" size={32} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Loading tracking data...</p>
                    </div>
                  </div>
                ) : trackingItems.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                    <div className="bg-purple-100 dark:bg-purple-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-purple-600 dark:text-purple-300" />
                    </div>
                    <p className="text-base font-medium mb-2">No AI generations yet</p>
                    <p className="text-sm">Start creating with AI to see tracking here</p>
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={trackingItems.length}
                    next={loadMoreItems}
                    hasMore={hasMore}
                    loader={
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="animate-spin text-purple-500" size={24} />
                      </div>
                    }
                    endMessage={
                      <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">
                        No more tracking items
                      </p>
                    }
                    scrollableTarget="scrollableDiv"
                    className="space-y-4"
                  >
                    {trackingItems.map(item => (
                      <TrackingItem
                        key={item.$id}
                        item={item}
                        onViewDetails={handleViewDetails}
                        onNavigateToPost={handleNavigateToPost}
                      />
                    ))}
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      {/* Detail Dialog */}
      {selectedItem && (
        <AITrackingDetailDialog
          item={selectedItem}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          onNavigateToPost={handleNavigateToPost}
        />
      )}
    </>
  )
}
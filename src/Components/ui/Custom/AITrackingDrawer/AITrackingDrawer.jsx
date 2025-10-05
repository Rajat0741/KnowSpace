import React, { useState, useEffect, useCallback } from 'react'
import { Drawer } from 'vaul'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
        group relative p-4 rounded-lg border cursor-pointer transition-all
        hover:shadow-md ${statusConfig.bgColor} ${statusConfig.borderColor}
      `}
    >
      <div className="flex items-start gap-3">
        <StatusIcon className={`${statusConfig.color} flex-shrink-0 mt-1 ${(item.status === 'in_progress' || item.status === 'inprogress') ? 'animate-spin' : ''}`} size={20} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm line-clamp-1">{item.title}</h3>
          </div>
          
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>{formatDate(item.$createdAt)}</span>
            <span>•</span>
            <span className={statusConfig.color}>{statusConfig.label}</span>
          </div>

          {item.category && (
            <div className="mt-1">
              <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                {item.category}
              </span>
            </div>
          )}

          {item.postId && item.status === 'completed' && (
            <button
              onClick={handleNavigate}
              className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ExternalLink size={12} />
              View Post
            </button>
          )}

          {item.error && item.status === 'failed' && (
            <div className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              <p className="text-xs text-red-600 dark:text-red-400 line-clamp-2">
                <span className="font-medium">Error:</span> {item.error}
              </p>
            </div>
          )}

          {item.status === 'failed' && !item.error && (
            <div className="mt-2 p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              <p className="text-xs text-red-600 dark:text-red-400">
                <span className="font-medium">Generation failed</span> - No error details available
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
  
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()

  const fetchTrackingItems = useCallback(async () => {
    if (!userData?.$id) return
    
    setLoading(true)
    try {
      const response = await service.getTrackingItems(userData.$id)
      setTrackingItems(response.documents || [])
      setLastRefreshTime(Date.now()) // Update last refresh time when data is fetched
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
  }, [userData])

  useEffect(() => {
    if (isOpen) {
      fetchTrackingItems()
    }
  }, [isOpen, fetchTrackingItems])

  // Auto-refresh based on progress status when drawer is open
  useEffect(() => {
    if (!isOpen) return

    const hasInProgressItems = trackingItems.some(item =>
      item.status === 'in_progress' || item.status === 'inprogress'
    )

    // 5 seconds if there are items in progress, 1 minute if not
    const intervalMs = hasInProgressItems ? 10000 : 60000

    // Calculate time since last refresh
    const timeSinceLastRefresh = Date.now() - lastRefreshTime
    const remainingTime = Math.max(0, intervalMs - timeSinceLastRefresh)

    const timeout = setTimeout(() => {
      fetchTrackingItems()
    }, remainingTime)

    return () => clearTimeout(timeout)
  }, [isOpen, trackingItems, lastRefreshTime, fetchTrackingItems])

  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setShowDetailDialog(true)
  }

  const handleNavigateToPost = (postId) => {
    setIsOpen(false)
    navigate(`/post/${postId}`)
  }

  const inProgressCount = trackingItems.filter(item => 
    item.status === 'in_progress' || item.status === 'inprogress'
  ).length

  return (
    <>
      <Drawer.Root direction="left" open={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Trigger asChild>
          {triggerContent || (
            <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
              <Sparkles size={20} />
              {inProgressCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {inProgressCount}
                </span>
              )}
            </button>
          )}
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]" />
          <Drawer.Content
            className="left-0 top-0 bottom-0 fixed z-[10000] outline-none w-[90vw] sm:w-[400px] flex"
            style={{ '--initial-transform': 'calc(100% + 8px)' }}
          >
            <div className="bg-card h-full w-full flex flex-col border-r border-border shadow-2xl">
              {/* Header */}
              <div className="flex-shrink-0 p-4 border-b border-border bg-card/95 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <Drawer.Title className="font-semibold text-lg flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-500" />
                    AI Generation Tracking
                  </Drawer.Title>
                  <Drawer.Close asChild>
                    <button className="p-1 hover:bg-accent rounded">
                      <X size={20} />
                    </button>
                  </Drawer.Close>
                </div>
                <Drawer.Description className="text-sm text-muted-foreground">
                  Track your AI-generated articles
                </Drawer.Description>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchTrackingItems}
                    disabled={loading}
                    className="flex items-center gap-1"
                  >
                    {/* Show spinning icon and alternate label when auto-refreshing is active */}
                    <RefreshCw size={14} className={(inProgressCount > 0 || loading) ? 'animate-spin' : ''} />
                    {inProgressCount > 0 && !loading ? 'Auto-refreshing' : 'Refresh'}
                  </Button>
                  {inProgressCount > 0 && (
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {inProgressCount} in progress
                    </span>
                  )}
                </div>

                {/* Informational note about delays for newly-started generations to appear */}
                <div className="mt-2 text-xs text-muted-foreground">
                  <p>
                    New or recently-started generations may take a few moments to appear in this list. If you just started a
                    generation, please allow up to 5-10 seconds and refresh if it doesn't show up automatically.
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {loading && trackingItems.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-muted-foreground" size={24} />
                  </div>
                ) : trackingItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Sparkles size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No AI generations yet</p>
                    <p className="text-xs mt-1">Start creating with AI to see tracking here</p>
                  </div>
                ) : (
                  trackingItems.map(item => (
                    <TrackingItem
                      key={item.$id}
                      item={item}
                      onViewDetails={handleViewDetails}
                      onNavigateToPost={handleNavigateToPost}
                    />
                  ))
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

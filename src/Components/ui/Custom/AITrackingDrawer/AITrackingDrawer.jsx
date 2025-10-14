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
        group relative p-5 rounded-xl border cursor-pointer transition-all duration-300
        hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 ${statusConfig.bgColor} ${statusConfig.borderColor}
        bg-gradient-to-br from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-700/90
        backdrop-blur-sm border-opacity-60 hover:border-opacity-100
      `}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/5 via-teal-400/5 to-blue-400/5 dark:from-cyan-600/10 dark:via-teal-600/10 dark:to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex items-start gap-4">
        <div className={`flex-shrink-0 mt-1 p-2 rounded-lg bg-gradient-to-br ${
          item.status === 'completed' ? 'from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40' :
          item.status === 'failed' ? 'from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40' :
          'from-cyan-100 to-blue-100 dark:from-cyan-900/40 dark:to-blue-900/40'
        } group-hover:scale-110 transition-transform duration-200`}>
          <StatusIcon className={`${statusConfig.color} ${(item.status === 'in_progress' || item.status === 'inprogress') ? 'animate-spin' : ''}`} size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-1 text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
              {item.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock size={12} />
            <span>{formatDate(item.$createdAt)}</span>
            <span>•</span>
            <span className={`${statusConfig.color} font-medium`}>{statusConfig.label}</span>
          </div>

          {item.category && (
            <div className="mt-2">
              <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/50 dark:border-slate-600/50">
                {item.category}
              </span>
            </div>
          )}

          {item.postId && item.status === 'completed' && (
            <button
              onClick={handleNavigate}
              className="mt-3 flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 hover:underline font-medium bg-cyan-50/50 dark:bg-cyan-950/20 hover:bg-cyan-100/70 dark:hover:bg-cyan-950/30 px-2.5 py-1.5 rounded-lg transition-all duration-200"
            >
              <ExternalLink size={12} />
              View Post
            </button>
          )}

          {item.error && item.status === 'failed' && (
            <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-200/50 dark:border-red-900/50">
              <p className="text-xs text-red-600 dark:text-red-400 line-clamp-2 leading-relaxed">
                <span className="font-semibold">Error:</span> {item.error}
              </p>
            </div>
          )}

          {item.status === 'failed' && !item.error && (
            <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 border border-red-200/50 dark:border-red-900/50">
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
    const hasQueuedItems = trackingItems.some(item => item.status === 'queued')

    // 10 seconds if there are queued items, 5 seconds if there are items in progress, 1 minute if not
    const intervalMs = hasInProgressItems ? 5000 : hasQueuedItems ? 10000 : 60000

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
            <button className="relative group p-2.5 rounded-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                {/* Enhanced main icon container - only animate when in progress */}
                <div className={`relative p-2 bg-gradient-to-br from-cyan-500 via-teal-600 to-blue-600 dark:from-cyan-600 dark:via-teal-700 dark:to-blue-700 rounded-xl shadow-lg border border-white/20 dark:border-white/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl ${inProgressCount > 0 ? 'animate-pulse' : ''}`}>
                  <Sparkles size={20} className="text-white drop-shadow-sm" />
                  
                  {/* Enhanced inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent rounded-xl"></div>
                  
                  {/* Animated pulse ring - only show when in progress */}
                  {inProgressCount > 0 && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-400/20 animate-pulse"></div>
                  )}
                </div>
                
                {/* Floating sparkle - only show when in progress */}
                {inProgressCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                )}
              </div>
              
              {inProgressCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 font-bold animate-bounce">
                  {inProgressCount}
                </span>
              )}
            </button>
          )}
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999]" />
          <Drawer.Content
            className="left-0 top-0 bottom-0 fixed z-[10000] outline-none w-[90vw] sm:w-[420px] flex"
            style={{ '--initial-transform': 'calc(100% + 8px)' }}
          >
            <div className="bg-gradient-to-br from-white via-slate-50/95 to-cyan-50/80 dark:from-slate-900/98 dark:via-slate-800/95 dark:to-slate-900/98 backdrop-blur-xl h-full w-full flex flex-col border-r border-cyan-200/50 dark:border-slate-700/50 shadow-2xl relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-400/15 via-teal-400/10 to-blue-400/15 dark:from-cyan-600/8 dark:via-teal-600/5 dark:to-blue-600/8 blur-2xl"></div>
                <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full bg-gradient-to-tr from-purple-400/10 via-pink-400/8 to-cyan-400/10 dark:from-purple-600/5 dark:via-pink-600/3 dark:to-cyan-600/5 blur-2xl"></div>
              </div>

              {/* Header */}
              <div className="relative z-10 flex-shrink-0 p-5 border-b border-cyan-200/40 dark:border-slate-700/40 bg-gradient-to-r from-white/80 via-slate-50/70 to-cyan-50/70 dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <Drawer.Title className="font-bold text-lg flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                      <Sparkles size={18} className="text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                      AI Generation Tracking
                    </span>
                  </Drawer.Title>
                  <Drawer.Close asChild>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
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
                    onClick={fetchTrackingItems}
                    disabled={loading}
                    className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-cyan-200/50 dark:border-slate-600/50 hover:bg-cyan-50 dark:hover:bg-slate-700 transition-all"
                  >
                    <RefreshCw size={14} className={(inProgressCount > 0 || loading) ? 'animate-spin' : ''} />
                    <span className="font-medium">
                      {inProgressCount > 0 && !loading ? 'Auto-refreshing' : 'Refresh'}
                    </span>
                  </Button>
                  {inProgressCount > 0 && (
                    <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20 px-2.5 py-1.5 rounded-lg border border-cyan-200/30 dark:border-cyan-800/30">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                      <span className="font-medium">{inProgressCount} in progress</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
                {loading && trackingItems.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="animate-spin text-cyan-500 mx-auto mb-3" size={32} />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Loading tracking data...</p>
                    </div>
                  </div>
                ) : trackingItems.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                    <div className="bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-900/20 dark:to-teal-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles size={32} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <p className="text-base font-medium mb-2">No AI generations yet</p>
                    <p className="text-sm">Start creating with AI to see tracking here</p>
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

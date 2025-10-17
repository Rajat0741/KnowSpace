import React, { memo, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from '@/Components/ui/dialog'
// Optimized icon imports
import Calendar from 'lucide-react/dist/esm/icons/calendar'
import Tag from 'lucide-react/dist/esm/icons/tag'
import Zap from 'lucide-react/dist/esm/icons/zap'
import AlignLeft from 'lucide-react/dist/esm/icons/align-left'
import Link2 from 'lucide-react/dist/esm/icons/link-2'
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle'
import ExternalLink from 'lucide-react/dist/esm/icons/external-link'
import Sparkles from 'lucide-react/dist/esm/icons/sparkles'
import Button from '@/Components/ui/button'

const STATUS_LABELS = {
  inprogress: 'In Progress',
  completed: 'Completed',
  failed: 'Failed'
}

const REQUEST_TYPE_LABELS = {
  basic: 'Normal',
  pro: 'Medium',
  ultra: 'High'
}

const STYLE_LABELS = {
  concise: 'Concise (~2000 words)',
  moderate: 'Moderate (~3000 words)',
  extended: 'Extended (~4000+ words)'
  // Backward compatibility for old values
}

const DetailRow = memo(function DetailRow({ icon: Icon, label, value, className = '' }) {
  if (!value) return null
  
  return (
    <div className="group flex items-start gap-3 sm:gap-4 py-2 sm:py-3 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent dark:hover:from-slate-800/30 dark:hover:to-transparent rounded-lg transition-all duration-150 px-2 -mx-2">
      {Icon && (
        <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-150">
          <Icon size={14} className="sm:size-4 text-purple-600 dark:text-purple-400" />
        </div>
      )}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wide">
          {label}
        </div>
        <div className={`text-sm font-medium leading-relaxed break-words hyphens-auto word-break ${className}`} style={{wordBreak: 'break-word', overflowWrap: 'anywhere'}}>
          {value}
        </div>
      </div>
    </div>
  )
})

const AITrackingDetailDialog = memo(function AITrackingDetailDialog({ item, open, onOpenChange, onNavigateToPost }) {
  const sources = useMemo(() => {
    if (!item) return []
    return item.sources 
      ? (typeof item.sources === 'string' ? item.sources.split(',').filter(Boolean) : item.sources)
      : []
  }, [item])

  if (!item) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-[95vw] sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col px-3 sm:px-6 bg-gradient-to-br from-white via-slate-50/80 to-purple-50/60 dark:from-slate-900 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-xl border border-purple-200/50 dark:border-slate-700/60 shadow-2xl ring-1 ring-white/20 dark:ring-white/10 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-200">
        {/* Simplified decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-indigo-400/20 dark:from-blue-600/10 dark:via-purple-600/8 dark:to-indigo-600/10 blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 rounded-full bg-gradient-to-tr from-purple-400/15 via-pink-400/10 to-indigo-400/15 dark:from-purple-600/8 dark:via-pink-600/5 dark:to-indigo-600/8 blur-2xl"></div>
        </div>

        <DialogHeader className="relative z-10 pb-4 sm:pb-6 border-b border-purple-200/30 dark:border-slate-700/40 shrink-0">
          <div className="flex items-start gap-2 sm:gap-3 mb-2">
            <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <Sparkles size={16} className="sm:size-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <DialogTitle className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent leading-tight break-words hyphens-auto">
                {item.title}
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                AI Generation Request Details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-6 space-y-1" style={{minHeight: 0}}>
          <DetailRow
            icon={Calendar}
            label="Created"
            value={formatDate(item.$createdAt)}
            className="text-slate-700 dark:text-slate-300"
          />

          <DetailRow
            icon={Tag}
            label="Status"
            value={STATUS_LABELS[item.status] || item.status}
            className={
              item.status === 'completed' ? 'text-emerald-600 dark:text-emerald-400 font-semibold' :
              item.status === 'failed' ? 'text-red-600 dark:text-red-400 font-semibold' :
              'text-purple-600 dark:text-purple-400 font-semibold'
            }
          />

          <DetailRow
            icon={Tag}
            label="Category"
            value={item.category}
            className="text-slate-700 dark:text-slate-300"
          />

          <DetailRow
            icon={Zap}
            label="Reasoning effort"
            value={REQUEST_TYPE_LABELS[item.request_type] || item.request_type}
            className="text-slate-700 dark:text-slate-300"
          />

          <DetailRow
            icon={AlignLeft}
            label="Article Length"
            value={STYLE_LABELS[item.style] || item.style}
            className="text-slate-700 dark:text-slate-300"
          />

          {item.prompt && (
            <div className="py-2 sm:py-3">
              <div className="group flex items-start gap-3 sm:gap-4 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent dark:hover:from-slate-800/30 dark:hover:to-transparent rounded-lg transition-all duration-150 px-2 -mx-2">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-150">
                  <AlignLeft size={14} className="sm:size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Prompt
                  </div>
                  <div className="text-sm bg-gradient-to-r from-slate-100/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-700/90 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-slate-200/50 dark:border-slate-600/30 whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 shadow-sm break-words hyphens-auto word-break" style={{wordBreak: 'break-word', overflowWrap: 'anywhere'}}>
                    {item.prompt}
                  </div>
                </div>
              </div>
            </div>
          )}

          {sources.length > 0 && (
            <div className="py-2 sm:py-3">
              <div className="group flex items-start gap-3 sm:gap-4 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent dark:hover:from-slate-800/30 dark:hover:to-transparent rounded-lg transition-all duration-150 px-2 -mx-2">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-150">
                  <Link2 size={14} className="sm:size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Sources ({sources.length})
                  </div>
                  <div className="space-y-2">
                    {sources.map((source, idx) => (
                      <div key={idx} className="group/source w-full">
                        <a
                          href={source.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline transition-colors duration-150 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/70 dark:hover:bg-purple-950/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg group-hover/source:scale-[1.02] transform w-full overflow-hidden"
                        >
                          <ExternalLink size={12} className="flex-shrink-0" />
                          <span className="truncate min-w-0 break-all word-break" style={{wordBreak: 'break-all', overflowWrap: 'anywhere'}}>{source.trim()}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {item.status === 'failed' && (
            <div className="py-2 sm:py-3">
              <div className="group flex items-start gap-3 sm:gap-4 px-2 -mx-2">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40">
                  <AlertCircle size={14} className="sm:size-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                    Error Details
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20 p-3 sm:p-4 rounded-xl border border-red-200/70 dark:border-red-900/50 shadow-sm">
                    <div className="font-semibold mb-2 text-red-700 dark:text-red-300">
                      Generation Failed
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400 leading-relaxed break-words hyphens-auto word-break" style={{wordBreak: 'break-word', overflowWrap: 'anywhere'}}>
                      {item.error || 'No error details available. The AI generation failed during processing.'}
                    </div>
                  </div>

                  <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-purple-200/70 dark:border-purple-800/50 rounded-xl shadow-sm">
                    <div className="text-sm text-purple-700 dark:text-purple-300 font-medium break-words">
                      💡 Your usage credits are preserved and not deducted for failed generations.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {item.postId && item.status === 'completed' && (
          <div className="relative z-10 pt-4 sm:pt-6 border-t border-purple-200/30 dark:border-slate-700/40 flex justify-end shrink-0">
            <Button
              onClick={() => {
                onNavigateToPost(item.postId)
                onOpenChange(false)
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm"
            >
              <ExternalLink size={14} className="sm:size-4" />
              View Generated Post
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
})

export default AITrackingDetailDialog

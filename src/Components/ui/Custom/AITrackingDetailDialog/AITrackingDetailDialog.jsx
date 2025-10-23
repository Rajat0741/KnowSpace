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
    <div className="flex items-start gap-3 sm:gap-4 py-2 sm:py-3 px-2 -mx-2">
      {Icon && (
        <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900">
          <Icon size={14} className="sm:size-4 text-purple-600 dark:text-purple-400" />
        </div>
      )}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase">
          {label}
        </div>
        <div className={`text-sm break-words ${className}`} style={{wordBreak: 'break-word', overflowWrap: 'anywhere'}}>
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
      <DialogContent className="w-[95vw] sm:w-full max-w-[95vw] sm:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col px-3 sm:px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <DialogHeader className="pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-start gap-2 sm:gap-3 mb-2">
            <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-xl bg-purple-600">
              <Sparkles size={16} className="sm:size-5 text-white" />
            </div>
            <div className="flex-1 min-w-0 overflow-hidden">
              <DialogTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight break-words">
                {item.title}
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                AI Generation Request Details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 space-y-1" style={{minHeight: 0}}>
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
              <div className="flex items-start gap-3 sm:gap-4 px-2 -mx-2">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <AlignLeft size={14} className="sm:size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase">
                    Prompt
                  </div>
                  <div className="text-sm bg-slate-50 dark:bg-slate-800 p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-600 whitespace-pre-wrap text-slate-700 dark:text-slate-300 break-words" style={{wordBreak: 'break-word', overflowWrap: 'anywhere'}}>
                    {item.prompt}
                  </div>
                </div>
              </div>
            </div>
          )}

          {sources.length > 0 && (
            <div className="py-2 sm:py-3">
              <div className="flex items-start gap-3 sm:gap-4 px-2 -mx-2">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Link2 size={14} className="sm:size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase">
                    Sources ({sources.length})
                  </div>
                  <div className="space-y-2">
                    {sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline bg-purple-50 dark:bg-purple-950 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg w-full overflow-hidden"
                      >
                        <ExternalLink size={12} className="flex-shrink-0" />
                        <span className="truncate min-w-0 break-all" style={{wordBreak: 'break-all', overflowWrap: 'anywhere'}}>{source.trim()}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {item.status === 'failed' && (
            <div className="py-2 sm:py-3">
              <div className="flex items-start gap-3 sm:gap-4 px-2 -mx-2">
                <div className="flex-shrink-0 mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-lg bg-red-100 dark:bg-red-900">
                  <AlertCircle size={14} className="sm:size-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase">
                    Error Details
                  </div>
                  <div className="bg-red-50 dark:bg-red-950 p-3 sm:p-4 rounded-xl border border-red-200 dark:border-red-900">
                    <div className="font-semibold mb-2 text-red-700 dark:text-red-300">
                      Generation Failed
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400 break-words" style={{wordBreak: 'break-word', overflowWrap: 'anywhere'}}>
                      {item.error || 'No error details available. The AI generation failed during processing.'}
                    </div>
                  </div>

                  <div className="mt-4 p-3 sm:p-4 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <div className="text-sm text-purple-700 dark:text-purple-300 break-words">
                      💡 Your usage credits are preserved and not deducted for failed generations.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {item.postId && item.status === 'completed' && (
          <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end shrink-0">
            <Button
              onClick={() => {
                onNavigateToPost(item.postId)
                onOpenChange(false)
              }}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-sm"
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

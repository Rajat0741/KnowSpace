import React from 'react'
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
import Button from '@/Components/ui/button'

const STATUS_LABELS = {
  inprogress: 'In Progress',
  completed: 'Completed',
  failed: 'Failed'
}

const REQUEST_TYPE_LABELS = {
  basic: 'Basic',
  pro: 'Pro',
  ultra: 'Ultra'
}

const STYLE_LABELS = {
  concise: 'Concise (~2000 words)',
  moderate: 'Moderate (~3000 words)',
  extended: 'Extended (~4000+ words)'
  // Backward compatibility for old values
}

function DetailRow({ icon: Icon, label, value, className = '' }) {
  if (!value) return null
  
  return (
    <div className="flex items-start gap-3 py-2">
      {Icon && <Icon size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
        <div className={`text-sm ${className}`}>{value}</div>
      </div>
    </div>
  )
}

export default function AITrackingDetailDialog({ item, open, onOpenChange, onNavigateToPost }) {
  if (!item) return null

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const sources = item.sources 
    ? (typeof item.sources === 'string' ? item.sources.split(',').filter(Boolean) : item.sources)
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-hide data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-4 duration-250">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.title}</DialogTitle>
          <DialogDescription>
            AI Generation Request Details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 divide-y divide-border">
          <DetailRow
            icon={Calendar}
            label="Created"
            value={formatDate(item.$createdAt)}
          />

          <DetailRow
            icon={Tag}
            label="Status"
            value={STATUS_LABELS[item.status] || item.status}
            className={
              item.status === 'completed' ? 'text-green-600 dark:text-green-400 font-medium' :
              item.status === 'failed' ? 'text-red-600 dark:text-red-400 font-medium' :
              'text-blue-600 dark:text-blue-400 font-medium'
            }
          />

          <DetailRow
            icon={Tag}
            label="Category"
            value={item.category}
          />

          <DetailRow
            icon={Zap}
            label="Request Type"
            value={REQUEST_TYPE_LABELS[item.request_type] || item.request_type}
          />

          <DetailRow
            icon={AlignLeft}
            label="Article Length"
            value={STYLE_LABELS[item.style] || item.style}
          />

          {item.prompt && (
            <div className="py-2">
              <div className="flex items-start gap-3">
                <AlignLeft size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Prompt</div>
                  <div className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                    {item.prompt}
                  </div>
                </div>
              </div>
            </div>
          )}

          {sources.length > 0 && (
            <div className="py-2">
              <div className="flex items-start gap-3">
                <Link2 size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Sources ({sources.length})</div>
                  <ul className="text-sm space-y-1">
                    {sources.map((source, idx) => (
                      <li key={idx}>
                        <a
                          href={source.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                        >
                          {source.trim()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {item.status === 'failed' && (
            <div className="py-2">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Error Details</div>
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-md border border-red-200 dark:border-red-900">
                    <div className="font-medium mb-1">Generation Failed</div>
                    <div className="text-xs opacity-90">
                      {item.error || 'No error details available. The AI generation failed during processing.'}
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                      Your used uses are preserved.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {item.postId && item.status === 'completed' && (
          <div className="pt-4 flex justify-end">
            <Button
              onClick={() => {
                onNavigateToPost(item.postId)
                onOpenChange(false)
              }}
              className="flex items-center gap-2"
            >
              <ExternalLink size={16} />
              View Generated Post
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

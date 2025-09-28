import { Skeleton } from "./Custom/Side-bar/skeleton"
import { cn } from "@/lib/utils"

export function SkeletonCard({ className }) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-card border border-border/50",
      className
    )}>
      {/* Image skeleton */}
      <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      
      {/* Category badge skeleton */}
      <div className="absolute top-3 left-3 z-10">
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      {/* Content overlay skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-2">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4 bg-white/20" />
        <Skeleton className="h-4 w-1/2 bg-white/20" />
        
        {/* Metadata skeleton */}
        <div className="flex gap-3 mt-2">
          <Skeleton className="h-3 w-16 bg-white/20" />
          <Skeleton className="h-3 w-20 bg-white/20" />
        </div>
      </div>
    </div>
  )
}

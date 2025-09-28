import React from 'react'
import { BookOpen, Sparkles } from 'lucide-react'

function Logo({ variant = "default", size = "md" }) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg", 
    lg: "text-2xl",
    xl: "text-3xl"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8", 
    xl: "h-10 w-10"
  }

  if (variant === "icon-only") {
    return (
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <BookOpen className={`${iconSizes[size]} text-white`} />
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300">
          <BookOpen className={`${iconSizes[size]} text-white`} />
          <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className={`font-bold ${sizeClasses[size]} bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300`}>
          KnowSpace
        </span>
        {size !== "sm" && (
          <span className="text-xs text-foreground/60 font-medium group-hover:text-foreground/80 transition-colors duration-300">
            Explore & Create
          </span>
        )}
      </div>
    </div>
  )
}

export default Logo
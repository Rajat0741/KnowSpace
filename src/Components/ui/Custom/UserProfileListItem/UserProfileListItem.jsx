import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import ProfilePicture from '../ProfilePicture/ProfilePicture'

function UserProfileListItem({ user, className, variant = 'default' }) {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    default: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
    list: 'aspect-auto'
  }

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        to={`/user/${user.$id}`}
        state={{ user }}
        className="group block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-xl"
        aria-label={`View profile: ${user.name}`}
      >
        <article className={cn(
          'relative overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-300',
          'hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30',
          'hover:scale-[1.02] hover:border-border hover:ring-2 hover:ring-blue-500/50',
          'hover:bg-gradient-to-br hover:from-blue-500/5 hover:via-transparent hover:to-purple-500/10',
          'group-focus:scale-[1.02] group-focus:shadow-lg',
          'transform-gpu p-6', // GPU acceleration for better performance
          variants[variant],
          className
        )}>
          {/* Background gradient effect */}
          <div className={cn(
            'absolute inset-0 transition-all duration-300',
            'bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/30',
            'dark:from-blue-950/20 dark:via-purple-950/10 dark:to-indigo-950/20',
            isHovered && 'opacity-100 scale-105'
          )} />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Profile Picture */}
            <div className={cn(
              'transition-all duration-300 transform-gpu',
              isHovered && 'scale-110'
            )}>
              <div className="relative">
                <ProfilePicture 
                  size="2xl"
                  className={cn(
                    "shadow-lg ring-4 ring-white/60 dark:ring-slate-700/60 transition-all duration-300",
                    isHovered && "ring-blue-400/60 shadow-blue-400/20 shadow-xl"
                  )}
                  profilePictureId={user?.profilePictureId}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-2 w-full">
              <h3 className={cn(
                'font-bold text-foreground leading-tight',
                'text-lg sm:text-xl transition-all duration-300',
                isHovered && 'text-blue-600 dark:text-blue-400 transform translate-y-[-1px]'
              )}>
                {user.name || 'Anonymous User'}
              </h3>
              
              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.bio || "This user hasn't added a bio yet."}
              </p>
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}

export default UserProfileListItem
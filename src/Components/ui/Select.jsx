import React, { useId } from 'react'
import { cn } from "@/lib/utils"

function Select({
    options = [],
    label,
    className,
    showIcons = false,
    iconMap = {},
    ...props
}, ref) {
    const id = useId()

    // Default icon map for common categories
    const defaultIconMap = {
        "All Categories": "🌟",
        "Technology": "💻",
        "Programming": "👨‍💻",
        "Design": "🎨",
        "Tutorials": "📚",
        "News": "📰",
        "Reviews": "⭐",
        "Personal": "👤",
        "Other": "📂",
        ...iconMap
    }

    return (
        <div className='w-full'>
            {label && (
                <label
                    htmlFor={id}
                    className='block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2'
                >
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    {...props}
                    id={id}
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full min-w-0 rounded-xl border bg-background px-4 py-3 text-sm transition-all duration-200 outline-none",
                        "focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20",
                        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                        "text-foreground placeholder:text-muted-foreground",
                        "hover:border-gray-400 dark:hover:border-gray-500 appearance-none",
                        "pr-10 leading-normal",
                        className
                    )}
                >
                    {options?.map((option) => (
                        <option key={option} value={option}>
                            {showIcons && defaultIconMap[option] ? `${defaultIconMap[option]} ${option}` : option}
                        </option>
                    ))}
                </select> 
            </div>
        </div>
    )
}

export default React.forwardRef(Select)
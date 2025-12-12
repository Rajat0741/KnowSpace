'use client'

import { useSelector, useDispatch } from 'react-redux'
import { SunIcon, MoonIcon } from 'lucide-react'
import Button from '../../button'
import { cn } from '@/lib/utils'
import { toggleDarkMode } from '@/store/darkmodeSlice'

const DarkModeToggle = ({ className }) => {
  const isDark = useSelector((state) => state.darkMode.isDarkMode)
  const dispatch = useDispatch()

  return (
    <Button
      variant='outline'
      size='icon'
      onClick={() => dispatch(toggleDarkMode())}
      aria-label='Toggle dark mode'
      className={cn(
        isDark
          ? 'border-purple-600 text-purple-600! hover:bg-purple-600/10 focus-visible:border-purple-600 focus-visible:ring-purple-600/20 dark:border-purple-400 dark:text-purple-400! dark:hover:bg-purple-400/10 dark:focus-visible:border-purple-400 dark:focus-visible:ring-purple-400/40'
          : 'border-amber-600 text-amber-600! hover:bg-amber-600/10 focus-visible:border-amber-600 focus-visible:ring-amber-600/20 dark:border-amber-400 dark:text-amber-400! dark:hover:bg-amber-400/10 dark:focus-visible:border-amber-400 dark:focus-visible:ring-amber-400/40',
        className
      )}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}

export default DarkModeToggle

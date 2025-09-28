import { useState, useEffect, useMemo, useRef } from "react"
import "./CategoryTabs.css"
import { Tab, TabGroup, TabList } from "@headlessui/react"

export const Tabs = ({ tabClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [clickedIndex, setClickedIndex] = useState(null)
  const rippleRefs = useRef([])

  const tabs = useMemo(() => 
    ["All", "Technology", "Programming", "Design", "Tutorials", "News", "Reviews", "Personal", "Other"],
    []
  )

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = (index) => {
    // Add ripple effect
    setClickedIndex(index)
    
    // Create ripple element
    const ripple = document.createElement('span')
    ripple.className = 'tab-ripple'
    
    if (rippleRefs.current[index]) {
      rippleRefs.current[index].appendChild(ripple)
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple)
        }
      }, 600)
    }

    // Reset click state
    setTimeout(() => setClickedIndex(null), 150)
    
    setSelectedIndex(index)
    const tabName = tabs[index]
    tabClick(tabName.toLowerCase())
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <TabGroup
        selectedIndex={selectedIndex}
        onChange={handleTabChange}
        className="w-full"
      >
        <div className="tab-container">
          <TabList className="flex flex-wrap gap-1 sm:gap-2 w-full justify-start sm:justify-center">
            {tabs.map((tab, index) => (
              <Tab
                key={tab}
                ref={(el) => (rippleRefs.current[index] = el)}
                className={({ selected }) => {
                  const baseClasses = [
                    'tab-base',
                    'text-xs sm:text-sm',
                    'transition-all duration-200 ease-out',
                    'relative',
                    'flex items-center justify-center',
                    'min-w-0 flex-shrink-0',
                    isLoaded && 'tab-animate-in',
                    selected && 'tab-selected',
                    clickedIndex === index && 'transform scale-95'
                  ].filter(Boolean)
                  
                  return baseClasses.join(' ')
                }}
              >
                <span className={`tab-text ${selectedIndex === index ? 'tab-selected-text' : ''}`}>
                  {tab}
                </span>
              </Tab>
            ))}
          </TabList>
        </div>
      </TabGroup>
    </div>
  );
}

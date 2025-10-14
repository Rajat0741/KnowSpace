import React from "react"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
// Optimized individual icon imports to reduce bundle size
import Home from "lucide-react/dist/esm/icons/home"
import NotebookPen from "lucide-react/dist/esm/icons/notebook-pen"
import Search from "lucide-react/dist/esm/icons/search"
import Settings from "lucide-react/dist/esm/icons/settings"
import User from "lucide-react/dist/esm/icons/user"
import BookOpen from "lucide-react/dist/esm/icons/book-open"
import Sparkles from "lucide-react/dist/esm/icons/sparkles"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator
} from "./sidebar"
import { useSidebar } from "./sidebar-utils"
import { useRoutePreloader, routePreloaders } from "../../../../hooks/useRoutePreloader"

const menuItems = [
  { title: "Home", url: "/home", icon: Home, preloader: routePreloaders.home },
  { title: "Profile", url: "/profile", icon: User, preloader: routePreloaders.profile },
  { title: "Create Posts", url: "/create-post", icon: NotebookPen, preloader: routePreloaders.createPost },
  { title: "Write with AI", url: "/write-with-ai", icon: Sparkles, preloader: routePreloaders.writeWithAI },
  { title: "Search", url: "/search", icon: Search, preloader: routePreloaders.search },
  { title: "Settings", url: "/settings", icon: Settings, preloader: routePreloaders.settings },
]

function AppSidebar({ className }) {
  const userStatus = useSelector((state) => state.auth.status);
  const isLoggedIn = (userStatus === true);
  const location = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { preloadRoute } = useRoutePreloader();

  // Function to handle navigation click and close mobile sidebar
  const handleNavigationClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Handle hover-based preloading
  const handleItemHover = (preloader) => {
    if (isLoggedIn && preloader) {
      preloadRoute(preloader);
    }
  };

  return (
    <Sidebar variant="sidebar" className={`${className} knowspace-sidebar sidebar-init`}>
      <SidebarHeader className="relative">
        {/* Gradient Background for Header */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-teal-500/6 to-blue-500/8 dark:from-cyan-700/15 dark:via-teal-700/12 dark:to-blue-700/15 rounded-lg -z-10" />
        
        {/* Brand Logo and Name */}
        <div className="flex items-center gap-3 p-2 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg blur-sm opacity-60 breathing-glow" />
            <div className="relative bg-gradient-to-br from-cyan-500 to-teal-600 p-2 rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent group-hover:from-cyan-500 group-hover:to-teal-500 transition-all duration-300">
              KnowSpace
            </span>
            <span className="text-xs text-sidebar-foreground/60 font-medium group-hover:text-sidebar-foreground/80 transition-colors duration-300">
              Explore & Create
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator className="mx-4 bg-gradient-to-r from-transparent via-sidebar-border to-transparent" />
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-sidebar-foreground/80 font-semibold">
            <Sparkles className="h-4 w-4" />
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu 
              className="space-y-1" 
              role="list"
              aria-label="Main navigation"
              style={{ 
                pointerEvents: isLoggedIn ? 'auto' : 'none', 
                opacity: isLoggedIn ? 1 : 0.5 
              }}
            >
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <li 
                    key={item.title} 
                    className="relative group menu-item-animated"
                    onMouseEnter={() => handleItemHover(item.preloader)}
                    role="listitem"
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-cyan-500 to-teal-600 rounded-r-full shadow-lg shadow-cyan-500/30" />
                    )}
                    
                    <SidebarMenuButton 
                      asChild 
                      className={`
                        relative overflow-hidden transition-all duration-300 ease-out menu-item-glow
                        hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-teal-600/10
                        hover:border-l-2 hover:border-cyan-500/30 hover:transform hover:translate-x-1
                        group-hover:shadow-md group-hover:shadow-cyan-500/10
                        ${isActive 
                          ? 'bg-gradient-to-r from-cyan-500/15 to-teal-600/15 border-l-2 border-cyan-500/50 transform translate-x-1' 
                          : ''
                        }
                      `}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-3 relative"
                        onClick={handleNavigationClick}
                        aria-label={`Navigate to ${item.title}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className={`
                          p-1 rounded-lg transition-all duration-300 sparkle-effect
                          ${isActive 
                            ? 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg' 
                            : 'group-hover:bg-gradient-to-br group-hover:from-cyan-500/20 group-hover:to-teal-600/20 group-hover:scale-110'
                          }
                        `}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className={`
                          font-medium transition-colors duration-300
                          ${isActive ? 'text-cyan-600 dark:text-cyan-400 font-semibold' : ''}
                        `}>
                          {item.title}
                        </span>
                        
                        {/* Subtle interaction indicator */}
                        <div className={`
                          absolute right-2 w-2 h-2 rounded-full transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-cyan-500 to-teal-600 opacity-100' 
                            : 'bg-sidebar-foreground/20 opacity-0 group-hover:opacity-60'
                          }
                        `} />
                      </Link>
                    </SidebarMenuButton>
                  </li>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="relative">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/5 dark:from-cyan-700/12 to-transparent rounded-lg -z-10" />
        
        <div className="flex flex-col items-center gap-2 p-2">
          <div className="sidebar-divider w-16"></div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse"></div>
            <span className="text-xs text-sidebar-foreground/60 font-medium group-hover:text-sidebar-foreground/80 transition-colors duration-300">
              © 2025 KnowSpace
            </span>
          </div>
          <span className="text-xs text-sidebar-foreground/40 group-hover:text-sidebar-foreground/60 transition-colors duration-300">
            Empowering Knowledge
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar
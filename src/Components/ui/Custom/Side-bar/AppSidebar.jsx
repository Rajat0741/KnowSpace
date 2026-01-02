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
    <Sidebar variant="sidebar" className={`${className} knowspace-sidebar`}>
      <SidebarHeader className="bg-purple-600/20 dark:bg-purple-700/25">
        {/* Brand Logo and Name */}
        <div className="flex items-center gap-3 p-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              KnowSpace
            </span>
            <span className="text-xs text-sidebar-foreground/60 font-medium">
              Explore & Create
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-4" />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-semibold">
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
                    onMouseEnter={() => handleItemHover(item.preloader)}
                    role="listitem"
                  >
                    <SidebarMenuButton
                      asChild
                      className={isActive ? 'bg-purple-500/15 border-l-3 border-purple-500' : ''}
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-3"
                        onClick={handleNavigationClick}
                        aria-label={`Navigate to ${item.title}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <div className={`p-1 rounded ${isActive ? 'bg-purple-500 text-white' : ''}`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <span className={isActive ? 'text-purple-600 dark:text-purple-400 font-semibold' : 'font-medium'}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </li>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-purple-600/20 dark:bg-purple-700/25">
        <div className="flex flex-col items-center gap-1 p-2">
          <div className="sidebar-divider w-16"></div>
          <span className="text-xs text-sidebar-foreground/60">
            © 2025 KnowSpace
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar
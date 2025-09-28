

import DarkModeToggle from '../ui/Custom/Dark-mode-button/Darkmode-button';
import { useSidebarContext } from '../ui/Custom/Side-bar/sidebar-utils';
import { SidebarTrigger } from '../ui/Custom/Side-bar/sidebar';
import Logoutbtn from '../ui/Custom/Logout-Button/Logoutbtn';
import Logo from '../ui/Logo';
import ProfilePicture from '../ui/ProfilePicture';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export default function Header() {
  const { open: sidebarOpen } = useSidebarContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Enhanced header styling with gradient background
  const headerBase = "bg-gradient-to-r from-white/95 via-blue-50/90 to-purple-50/95 dark:from-neutral-900/95 dark:via-blue-950/90 dark:to-purple-950/95 backdrop-blur-xl text-black dark:text-white rounded-full shadow-2xl transition-all duration-250 mt-2 border border-blue-200/50 dark:border-purple-800/30 h-16 flex items-center sm:h-14";
  // Simplified header styling - let SidebarInset handle the responsive behavior
  const headerStyle = "mr-2 ml-2 w-auto";

  const userStatus = useSelector((state) => state.auth.status)
  const isLoggedIn = (userStatus === true);

  // Page-based text content
  const getPageInfo = () => {
    const path = location.pathname;
    switch (path) {
      case '/home':
        return { title: 'Dashboard', subtitle: 'Welcome back to KnowSpace' };
      case '/profile':
        return { title: 'Your Profile', subtitle: 'Monitor your account status' };
      case '/create-post':
        return { title: 'Create Post', subtitle: 'Share your knowledge with the world' };
      case '/search':
        return { title: 'Search', subtitle: 'Find knowledge across the platform' };
      case '/settings':
        return { title: 'Settings', subtitle: 'Manage your account and preferences' };
      case '/':
        return { title: 'Welcome', subtitle: 'Please sign in to continue' };
      case '/signup':
        return { title: 'Join KnowSpace', subtitle: 'Create your account today' };
      default:
        if (path.startsWith('/post/')) {
          return { title: 'Reading', subtitle: 'Explore this knowledge piece' };
        } else if (path.startsWith('/edit-post/')) {
          return { title: 'Edit Post', subtitle: 'Update your knowledge piece' };
        }
        return { title: 'KnowSpace', subtitle: 'Explore and create knowledge' };
    }
  };

  const pageInfo = getPageInfo();

  // Scroll direction detection
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < 10) {
            setShowHeader(true);
          } else if (currentScrollY > lastScrollY.current) {
            setShowHeader(false); // scrolling down
          } else if (currentScrollY < lastScrollY.current) {
            setShowHeader(true); // scrolling up
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`${headerBase} ${headerStyle} transition-transform duration-300 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'} sticky top-0 z-50`}
    >
      <nav aria-label="Global" className="flex items-center justify-between px-4 w-full">
        <div className="flex lg:flex-1 items-center gap-3">
          <SidebarTrigger className="w-12 h-12" />
          {!sidebarOpen && (
            <div className="hidden md:block">
              <Logo size="sm" />
            </div>
          )}
        </div>
        <div
          className="hidden lg:flex lg:flex-col lg:items-center text-black dark:text-white"
          style={{ pointerEvents: isLoggedIn ? 'auto' : 'none', opacity: isLoggedIn ? 1 : 0.5 }}
        >
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {pageInfo.title}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            {pageInfo.subtitle}
          </p>
        </div>
        <div className="flex lg:flex-1 lg:justify-end items-center gap-2 lg:gap-4 text-black dark:text-white">
          <DarkModeToggle />
          {isLoggedIn && (
            <>
              <ProfilePicture 
                size="md" 
                onClick={() => navigate('/profile')}
                className="cursor-pointer hover:border-primary/50 transition-colors" 
              />
              <Logoutbtn
                classname={`
                  border-2 border-red-600
                  logout-gradient
                  rounded-full
                  text-black dark:text-white
                  transition-colors duration-150
                `}
              />
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

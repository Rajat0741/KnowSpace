import { useEffect } from "react"
import { Header, AppSidebar } from "./Components/Header"
import { SidebarInset } from "./Components/ui/Custom/Side-bar/sidebar"
import { useDispatch, useSelector } from "react-redux"
import { initializeAuth } from "./store/authThunks"
import { Outlet, useLocation } from "react-router-dom"
import { useRoutePreloader } from "./hooks/useRoutePreloader"
import { Toaster } from "@/Components/ui/sonner"
import DarkModeToggle from "./Components/ui/Custom/Dark-mode-button/Darkmode-button"
import ScrollToTopButton from "./Components/ui/Custom/ScrollToTopButton/ScrollToTopButton"

// ScrollToTopOnRouteChange component to automatically scroll to top on route change
function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const dispatch = useDispatch();
  const { preloadCommonRoutes } = useRoutePreloader();
  const authStatus = useSelector((state) => state.auth.status);
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const location = useLocation();

  // Sync dark mode with Redux state
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Define routes that shouldn't show sidebar/header
  const publicRoutes = ['/', '/auth/callback'];
  const isPublicRoute = publicRoutes.includes(location.pathname) || 
                       location.pathname.startsWith('/public/');

  useEffect(() => {
    // Initialize auth on app start
    dispatch(initializeAuth()).then((result) => {
      // Preload common routes ONLY ONCE after successful authentication
      if (result.payload?.userData) {
        preloadCommonRoutes();
      }
    }).catch(() => {
      // Error is already handled in the thunk
    });
  }, [dispatch, preloadCommonRoutes]);



  // Check if we should hide sidebar/header (public routes or not authenticated)
  const shouldHideSidebarHeader = isPublicRoute || !authStatus;

  return (
    <>
      <ScrollToTopOnRouteChange />
      
      {shouldHideSidebarHeader ? (
        // Public routes layout
        <>
          <DarkModeToggle className="fixed top-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm" />
          <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
            <Outlet />
          </div>
        </>
      ) : (
        // Authenticated routes layout with sidebar/header
        <>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
              <Header />
              <main className="mb-2 p-1 sm:p-3 pt-1 scrollbar-hide flex-1">
                <Outlet />
              </main>
            </div>
          </SidebarInset>
        </>
      )}
      
      <ScrollToTopButton />
      <Toaster />
    </>
  );
}

export default App

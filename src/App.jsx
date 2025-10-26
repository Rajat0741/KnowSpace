import { useEffect, useRef, useState } from "react"
import { Header, AppSidebar } from "./Components/Header"
import { SidebarInset } from "./Components/ui/Custom/Side-bar/sidebar"
import { useDispatch, useSelector } from "react-redux"
import { initializeAuth } from "./store/authThunks"
import { Outlet, useLocation } from "react-router-dom"
// Optimized individual icon import to reduce bundle size
import ArrowUp from "lucide-react/dist/esm/icons/arrow-up";
import { useRoutePreloader } from "./hooks/useRoutePreloader"
import { Toaster } from "@/Components/ui/sonner"
import GlobalDarkModeToggle from "./Components/ui/GlobalDarkModeToggle"

// ScrollToTop component to automatically scroll to top on route change
function ScrollToTop() {
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
  const location = useLocation();

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

  // Scroll-to-top button logic
  const [showScrollTop, setShowScrollTop] = useState(false);
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setShowScrollTop(currentScrollY > 100);
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we should hide sidebar/header (public routes or not authenticated)
  const shouldHideSidebarHeader = isPublicRoute || !authStatus;

  // For public routes, render a completely different layout
  if (shouldHideSidebarHeader) {
    return (
      <>
        <ScrollToTop />
        <GlobalDarkModeToggle />
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
          <Outlet />
        </div>
        
        {/* Scroll to top button for public pages */}
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-6 right-6 z-40 bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 text-white rounded-full shadow-lg p-3 transition-all duration-300 flex items-center justify-center ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
          style={{ boxShadow: "0 4px 24px rgba(147,51,234,0.15)" }}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        
        <Toaster />
      </>
    );
  }

  // For authenticated routes, render with sidebar/header
  return (
    <>
      <ScrollToTop />
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
          <Header />
          <main className="mb-2 p-1 sm:p-3 pt-1 scrollbar-hide flex-1">
            <Outlet />
          </main>
        </div>
        
        {/* Scroll to top button */}
        <button
          type="button"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 transition-all duration-300 flex items-center justify-center ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
          style={{ boxShadow: "0 4px 24px rgba(59,130,246,0.15)" }}
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </SidebarInset>
      
      <Toaster />
    </>
  );
}

export default App

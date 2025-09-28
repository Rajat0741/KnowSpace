import { useEffect, useRef, useState } from "react"
import { Header, AppSidebar } from "./Components/mainComponents"
import { SidebarInset } from "./Components/ui/Custom/Side-bar/sidebar"
import { useDispatch, useSelector } from "react-redux"
import authService from "./appwrite/auth"
import { login, logout } from "./store/authSlice"
import { loadProfilePicture } from "./store/profileSlice"
import { Outlet } from "react-router-dom"
// Optimized individual icon import to reduce bundle size
import ArrowUp from "lucide-react/dist/esm/icons/arrow-up";
import { useRoutePreloader } from "./hooks/useRoutePreloader"

function App() {
  const dispatch = useDispatch();
  const { preloadCommonRoutes } = useRoutePreloader();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData: userData }));
          // Load profile picture when user is authenticated
          dispatch(loadProfilePicture());
          
          // Preload common routes for authenticated users
          preloadCommonRoutes();
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        // Handle any unexpected errors
        console.log("App :: getCurrentUser :: error:", error);
        dispatch(logout());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Preload routes when user becomes authenticated
  useEffect(() => {
    if (authStatus) {
      preloadCommonRoutes();
    }
  }, [authStatus, preloadCommonRoutes]);

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

  return (
    <>
      <AppSidebar />
      <SidebarInset>
                <div className="flex flex-col min-h-screen">
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
    </>
  );
}

export default App

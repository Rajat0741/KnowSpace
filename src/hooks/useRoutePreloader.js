import { useRef } from 'react';

/**
 * Hook for preloading route components
 * This provides a simple API to preload components when user shows intent to navigate
 */
export const useRoutePreloader = () => {
  const preloadedRoutes = useRef(new Set());

  const preloadRoute = async (routeImporter) => {
    try {
      // Check if already preloaded
      const routeKey = routeImporter.toString();
      if (preloadedRoutes.current.has(routeKey)) {
        return;
      }

      // Preload the component - failures won't be cached
      try {
        await routeImporter();
        preloadedRoutes.current.add(routeKey);
      } catch (error) {
        // If preload fails, don't cache the failure
        // Let the actual lazy load handle retry when user navigates
        console.warn('Failed to preload route, will retry on navigation:', error.message);
      }
      
    } catch (error) {
      console.warn('Failed to preload route:', error);
    }
  };

  const preloadCommonRoutes = () => {
    // Preload most commonly accessed routes after initial load
    // These will use the retry logic from the Pages index.js
    setTimeout(() => {
      preloadRoute(() => import('../Components/Pages/Home/Home'));
      preloadRoute(() => import('../Components/Pages/Profile/Profile'));
      preloadRoute(() => import('../Components/Pages/Search/Search'));
      preloadRoute(() => import('../Components/Pages/PostForm/PostForm'));
      preloadRoute(() => import('../Components/Pages/Settings/Settings'));
    }, 2000); // Wait 2 seconds after app load
  };

  return {
    preloadRoute,
    preloadCommonRoutes,
  };
};

/**
 * Route preloader functions for specific routes
 * Can be called from navigation components or on user interactions
 */
export const routePreloaders = {
  home: () => import('../Components/Pages/Home/Home'),
  profile: () => import('../Components/Pages/Profile/Profile'),
  search: () => import('../Components/Pages/Search/Search'),
  createPost: () => import('../Components/Pages/PostForm/PostForm'),
  writeWithAI: () => import('../Components/Pages/Write_with_AI/WriteWithAI'),
  settings: () => import('../Components/Pages/Settings/Settings'),
  post: () => import('../Components/Pages/Post/Post'),
  editPost: () => import('../Components/Pages/EditPost/EditPost'),
  auth: () => import('../Components/Pages/Auth/Auth'),
};

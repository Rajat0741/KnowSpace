import { useRef, useCallback } from 'react';

/**
 * Hook for preloading route components
 * Simple on-demand preloading - only preloads when explicitly called
 */
export const useRoutePreloader = () => {
  const preloadedRoutes = useRef(new Map());

  /**
   * Preload a single route
   */
  const preloadRoute = useCallback(async (routeImporter) => {
    try {
      // Check if already preloaded
      const routeKey = routeImporter.toString();
      if (preloadedRoutes.current.has(routeKey)) {
        return preloadedRoutes.current.get(routeKey);
      }

      // Preload the component
      try {
        const module = await routeImporter();
        preloadedRoutes.current.set(routeKey, {
          status: 'success',
          module,
          timestamp: Date.now(),
        });
        return module;
      } catch (error) {
        // Cache the failure but allow retry later
        preloadedRoutes.current.set(routeKey, {
          status: 'failed',
          error,
          timestamp: Date.now(),
        });
        console.warn('Failed to preload route, will retry on navigation:', error.message);
        return null;
      }
      
    } catch (error) {
      console.warn('Failed to preload route:', error);
      return null;
    }
  }, []);

  /**
   * Preload only critical routes immediately after authentication
   * Just Home page - everything else loads on-demand
   */
  const preloadCommonRoutes = useCallback(() => {
    // Only preload the Home page immediately - it's the first page users see
    preloadRoute(() => import('../Components/Pages/Home/Home'));
    
    // Everything else (Profile, Search, PostForm, Settings) will load on-demand
    // when user navigates to them
  }, [preloadRoute]);

  return {
    preloadRoute,
    preloadCommonRoutes,
  };
};

/**
 * Route preloader functions for specific routes
 * Can be called from navigation components or on user interactions (hover, focus)
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

import { lazy } from 'react';

// Utility function to retry lazy imports
const lazyRetry = (componentImport) => 
  lazy(async () => {
    const pageHasAlreadyBeenForceRefreshed = JSON.parse(
      window.sessionStorage.getItem('page-has-been-force-refreshed') || 'false'
    );

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('page-has-been-force-refreshed', 'false');
      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        // Assuming that the user is not on the latest version of the application.
        // Let's refresh the page immediately.
        window.sessionStorage.setItem('page-has-been-force-refreshed', 'true');
        window.location.reload();
        return { default: () => null }; // Return a dummy component while reloading
      }
      // The page has already been reloaded, throw the error
      throw error;
    }
  });

// Lazy load all page components with retry logic for code splitting
const Home = lazyRetry(() => import("./Home/Home"));
const Auth = lazyRetry(() => import("./Auth/Auth"));
const PostForm = lazyRetry(() => import("./PostForm/PostForm"));
const Profile = lazyRetry(() => import("./Profile/Profile"));
const Post = lazyRetry(() => import("./Post/Post"));
const PublicPost = lazyRetry(() => import("./Post/PublicPost"));
const EditPost = lazyRetry(() => import("./EditPost/EditPost"));
const Search = lazyRetry(() => import("./Search/Search"));
const Settings = lazyRetry(() => import("./Settings/Settings"));
const NotFound = lazyRetry(() => import("./NotFound/NotFound"));

export {
    Home,
    Auth,
    PostForm,
    Profile,
    Post,
    PublicPost,
    EditPost,
    Search,
    Settings,
    NotFound
}
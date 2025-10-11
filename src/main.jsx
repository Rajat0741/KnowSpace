import { StrictMode, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './store/store'
import { SidebarProvider } from './Components/ui/Custom/Side-bar/sidebar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SignupPage, Login, Home, PostForm, Profile, Post, PublicPost, EditPost, Search, Settings, NotFound } from './Components/Pages'
import Protected from './AuthenticatedRouting/AuthLayout'
import LazyRoute from './Components/ui/LazyRoute'
import ErrorBoundary from './Components/ui/Custom/ErrorBoundary/ErrorBoundary'

// Lazy load additional components
const UserProfilePage = lazy(() => import('./Components/Pages/UserProfilePage/UserProfilePage'))
const WriteWithAI = lazy(() => import('./Components/Pages/Write_with_AI/WriteWithAI'))
const AuthCallback = lazy(() => import('./Components/Pages/AuthCallback/AuthCallback'))

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <LazyRoute fallbackMessage="Loading sign in...">
            <Protected authentication={false}><Login /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "home",
        element: (
          <LazyRoute fallbackMessage="Loading dashboard...">
            <Protected authentication={true}><Home /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "signup",
        element: (
          <LazyRoute fallbackMessage="Loading sign up...">
            <Protected authentication={false}><SignupPage /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "create-post",
        element: (
          <LazyRoute fallbackMessage="Loading post editor...">
            <Protected authentication={true}><PostForm /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "edit-post/:id",
        element: (
          <LazyRoute fallbackMessage="Loading post editor...">
            <Protected authentication={true}><EditPost /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "profile",
        element: (
          <LazyRoute fallbackMessage="Loading profile...">
            <Protected authentication={true}><Profile /></Protected>
          </LazyRoute>
        )
      },
      {
        path: 'post/:id',
        element: (
          <LazyRoute fallbackMessage="Loading post...">
            <Protected authentication={true}><Post /></Protected>
          </LazyRoute>
        )
      },
      {
        path: 'public/post/:id',
        element: (
          <LazyRoute fallbackMessage="Loading post...">
            <PublicPost />
          </LazyRoute>
        )
      },
      {
        path: "search",
        element: (
          <LazyRoute fallbackMessage="Loading search...">
            <Protected authentication={true}><Search /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "user/:userId",
        element: (
          <LazyRoute fallbackMessage="Loading user profile...">
            <Protected authentication={true}><UserProfilePage /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "settings",
        element: (
          <LazyRoute fallbackMessage="Loading settings...">
            <Protected authentication={true}><Settings /></Protected>
          </LazyRoute>
        )
      },
      {
        path: "write-with-ai",
        element: (
          <LazyRoute fallbackMessage="Loading...">
            <Protected authentication={true}><WriteWithAI /> </Protected>
          </LazyRoute>
        )
      },
      {
        path: "auth/callback",
        element: (
          <LazyRoute fallbackMessage="Completing authentication...">
            <AuthCallback />
          </LazyRoute>
        )
      },
      {
        path: "*",
        element: (
          <LazyRoute fallbackMessage="Loading page...">
            <NotFound />
          </LazyRoute>
        )
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ErrorBoundary>
              <RouterProvider router={router} />
            </ErrorBoundary>
          </PersistGate>
        </Provider>
      </SidebarProvider>
    </QueryClientProvider>
  </StrictMode>,
)

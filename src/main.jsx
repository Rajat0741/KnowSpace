import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store'
import { SidebarProvider } from './Components/ui/Custom/Side-bar/sidebar'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SignupPage, Login, Home, PostForm, Profile, Post, EditPost, VerifyEmail, Search, Settings, ResetPassword, NotFound } from './Components/Pages'
import UserProfilePage from './Components/Pages/UserProfilePage'
import Protected from './AuthenticatedRouting/AuthLayout'
import LazyRoute from './Components/ui/LazyRoute'

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
        path: "verify-email",
        element: (
          <LazyRoute fallbackMessage="Loading verification...">
            <VerifyEmail />
          </LazyRoute>
        )
      },
      {
        path: "reset-password",
        element: (
          <LazyRoute fallbackMessage="Loading password reset...">
            <ResetPassword />
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
    <SidebarProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </SidebarProvider>
  </StrictMode>,
)

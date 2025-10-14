# KnowSpace - Modern Blog Platform 🚀# Blog Website with React + Vite + Appwrite + ImageKit



<div align="center">A modern, feature-rich blog platform built with React, Vite, Appwrite for backend services, and ImageKit.io for optimized image delivery.



![KnowSpace Banner](https://img.shields.io/badge/KnowSpace-Blog%20Platform-purple?style=for-the-badge)## Features

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)](https://reactjs.org/)

[![Vite](https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat&logo=vite)](https://vitejs.dev/)- 📝 Create, edit, and delete blog posts

[![Appwrite](https://img.shields.io/badge/Appwrite-Backend-F02E65?style=flat&logo=appwrite)](https://appwrite.io/)- 🖼️ Optimized image uploads and delivery with ImageKit CDN

[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.12-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)- 👤 User authentication and profiles

- 💬 Comments system

*A feature-rich, AI-powered blog platform built with cutting-edge technologies*- 🔍 Search and filter posts

- 📱 Responsive design

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Documentation](#documentation)- 🌙 Dark mode support

- ⚡ Fast performance with Vite and ImageKit optimization

</div>

## Tech Stack

---

- **Frontend**: React 19, Vite, TailwindCSS

## 📋 Table of Contents- **Backend**: Appwrite (Database, Authentication, Functions)

- **Image Storage**: ImageKit.io (CDN, Optimization, Transformations)

- [Overview](#overview)- **State Management**: Redux Toolkit

- [Features](#features)- **Form Handling**: React Hook Form

- [Tech Stack](#tech-stack)- **Rich Text Editor**: TinyMCE

- [Architecture](#architecture)- **Routing**: React Router DOM

- [Getting Started](#getting-started)

- [Project Structure](#project-structure)## Quick Start

- [Key Features Explained](#key-features-explained)

- [Environment Variables](#environment-variables)### Prerequisites

- [Available Scripts](#available-scripts)- Node.js 18+ and npm

- [Performance Optimizations](#performance-optimizations)- Appwrite account and project

- [Deployment](#deployment)- ImageKit account

- [Contributing](#contributing)

- [License](#license)### Installation



---1. Clone the repository:

   ```bash

## 🌟 Overview   git clone <your-repo-url>

   cd blog-website

**KnowSpace** is a modern, full-stack blog platform that combines powerful content creation tools with AI assistance, delivering a seamless writing and reading experience. Built with React 19 and powered by Appwrite's Backend-as-a-Service, it offers enterprise-grade features with exceptional performance.   ```



### Why KnowSpace?2. Install dependencies:

   ```bash

- 🤖 **AI-Powered Writing**: Integrated Groq AI for content generation and enhancement   npm install

- 🎨 **Beautiful UI**: Modern, responsive design with Radix UI components and Framer Motion animations   ```

- ⚡ **Lightning Fast**: Optimized with Vite, code splitting, and ImageKit CDN

- 🔐 **Secure Authentication**: Google OAuth integration via Appwrite3. Set up environment variables:

- 📱 **Mobile-First**: Fully responsive design that works on all devices   ```bash

- 🌙 **Dark Mode**: Complete theme support with persistent preferences   cp .env.example .env

- 🖼️ **Smart Image Management**: Pixabay integration + ImageKit optimization   ```

   Then edit `.env` with your credentials (see `.env.example` for required variables)

---

4. Deploy Appwrite functions (required for ImageKit):

## ✨ Features   - See `QUICK_SETUP.md` for 5-minute setup guide

   - Or see `appwrite-functions/README.md` for detailed instructions

### Core Features

5. Start development server:

#### 📝 Content Management   ```bash

- **Rich Text Editor**: Full-featured TinyMCE editor with custom plugins   npm run dev

- **Create & Edit Posts**: Intuitive post creation and editing interface   ```

- **Draft & Publish**: Save drafts or publish posts instantly

- **Category Organization**: Organize content with categories## ImageKit Migration

- **Image Integration**: Upload local images or search Pixabay for free stock photos

- **Post Preview**: Preview posts before publishingThis project uses ImageKit.io for image storage and optimization instead of Appwrite Storage.



#### 🤖 AI-Powered Writing**Setup Guides:**

- **AI Content Generation**: Generate blog posts with Groq AI (Llama 3.3 70B)- 📖 **Quick Setup** (5 minutes): See `QUICK_SETUP.md`

- **Three Generation Tiers**:- 📚 **Complete Guide**: See `IMAGEKIT_MIGRATION_GUIDE.md`

  - **Basic**: Quick content generation (~500 words)- 🔧 **Functions Setup**: See `appwrite-functions/README.md`

  - **Pro**: Enhanced content with better structure (~1000 words)

  - **Ultra**: Research-backed content with citations (~1500 words)**Benefits:**

- **Custom Sources**: Add reference URLs for AI to research- ✅ Automatic image optimization

- **Style Control**: Moderate or aggressive writing styles- ✅ Global CDN delivery

- **Usage Tracking**: Monitor AI generation usage per tier- ✅ Real-time transformations

- ✅ Better performance

#### 👤 User Management- ✅ WebP/AVIF support

- **Google OAuth**: Seamless Google sign-in integration

- **User Profiles**: Customizable profiles with bio and avatar## Project Structure

- **Profile Pictures**: Upload and manage profile images

- **User Discovery**: Search and view other users' profiles```

- **Author Pages**: Dedicated pages for each author's postsblog-website/

├── src/

#### 💬 Social Features│   ├── Components/       # React components

- **Comments System**: Real-time commenting on posts│   ├── appwrite/        # Appwrite services (auth, database)

- **User Interactions**: Comment, edit, and delete functionality│   ├── imagekit/        # ImageKit service wrapper

- **Author Attribution**: Display author information on posts│   ├── store/           # Redux store and slices

- **Public Post Sharing**: Share posts with non-authenticated users│   ├── hooks/           # Custom React hooks

│   └── lib/             # Utility functions

#### 🔍 Discovery & Navigation├── appwrite-functions/  # Appwrite serverless functions

- **Advanced Search**: Search posts by title, author, or category│   ├── imagekit-auth/   # ImageKit authentication

- **Filter by Category**: Browse posts by topic│   └── imagekit-delete/ # ImageKit file deletion

- **Infinite Scroll**: Seamless content loading with React Infinite Scroll└── public/              # Static assets

- **Responsive Sidebar**: Collapsible navigation for better UX```

- **Breadcrumb Navigation**: Clear path indication

## Available Scripts

#### 🎨 UI/UX Excellence

- **Modern Design**: Gradient backgrounds and smooth transitions- `npm run dev` - Start development server

- **Dark Mode**: Complete dark theme support- `npm run build` - Build for production

- **Skeleton Loading**: Graceful loading states- `npm run preview` - Preview production build

- **Toast Notifications**: User-friendly feedback with Sonner- `npm run lint` - Run ESLint

- **Framer Motion**: Smooth animations and transitions

- **Mobile Optimized**: Drawer navigation on mobile devices## Environment Variables

- **Scroll to Top**: Convenient scroll-to-top button

See `.env.example` for all required environment variables:

### Technical Features- Appwrite configuration (URL, project ID, database IDs)

- ImageKit credentials (public key, private key, URL endpoint)

#### ⚡ Performance- Appwrite function URLs (for ImageKit operations)

- **Code Splitting**: Dynamic imports for optimal bundle size

- **Lazy Loading**: Route-based code splitting⚠️ Never commit your `.env` file to version control!

- **Image Optimization**: ImageKit CDN with automatic transformations

- **React Query**: Efficient data fetching and caching## Deployment

- **Redux Persist**: Selective state persistence

- **Bundle Optimization**: Manual chunk splitting for vendors### Deploy Frontend

1. Build the project: `npm run build`

#### 🔐 Security2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

- **Appwrite Authentication**: Secure OAuth 2.0 flow

- **Protected Routes**: Authentication guards### Deploy Appwrite Functions

- **CORS Configuration**: Secure API calls1. Follow instructions in `appwrite-functions/README.md`

- **Environment Variables**: Sensitive data protection2. Deploy both `imagekit-auth` and `imagekit-delete` functions

- **Session Management**: Automatic session handling3. Update `.env` with function URLs



#### 🛠️ Developer Experience## Contributing

- **ESLint**: Code quality enforcement

- **Vite Hot Reload**: Lightning-fast development1. Fork the repository

- **Path Aliases**: Clean import statements with `@/` prefix2. Create a feature branch

- **TypeScript Support**: Type definitions for major libraries3. Make your changes

- **Component Library**: Reusable UI components4. Test thoroughly

5. Submit a pull request

---

## License

## 🛠️ Tech Stack

This project is licensed under the MIT License.

### Frontend Core

- **[React 19.1.1](https://reactjs.org/)** - Latest React with concurrent features## Support

- **[Vite 7.1.2](https://vitejs.dev/)** - Next-generation frontend tooling

- **[React Router DOM 7.8.1](https://reactrouter.com/)** - Client-side routingFor issues and questions:

- **[TailwindCSS 4.1.12](https://tailwindcss.com/)** - Utility-first CSS framework- Check `IMAGEKIT_MIGRATION_GUIDE.md` for ImageKit setup issues

- Review `appwrite-functions/README.md` for function deployment issues

### State Management- Check the browser console and Appwrite logs for errors

- **[Redux Toolkit 2.8.2](https://redux-toolkit.js.org/)** - Efficient Redux development

- **[React Redux 9.2.0](https://react-redux.js.org/)** - Official React bindings## Acknowledgments

- **[Redux Persist 6.0.0](https://github.com/rt2zz/redux-persist)** - State persistence

- **[TanStack Query 5.90.2](https://tanstack.com/query)** - Data fetching and caching- React + Vite template

- Appwrite for backend services

### UI Components & Styling- ImageKit.io for image optimization and CDN

- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components- TailwindCSS for styling

  - Dialog, Dropdown Menu, Popover, Tabs, Tooltip, Label, Separator, Slot- All other open-source libraries used in this project

- **[Framer Motion 12.23.24](https://www.framer.com/motion/)** - Animation library

- **[Lucide React 0.541.0](https://lucide.dev/)** - Beautiful icons
- **[Vaul 1.1.2](https://github.com/emilkowalski/vaul)** - Drawer component
- **[Class Variance Authority](https://cva.style/)** - Component variants
- **[clsx](https://github.com/lukeed/clsx)** & **[Tailwind Merge](https://github.com/dcastil/tailwind-merge)** - Class management

### Backend & Services
- **[Appwrite 18.2.0](https://appwrite.io/)** - Backend-as-a-Service
  - Authentication (OAuth, Session Management)
  - Database (NoSQL document database)
  - Functions (Serverless functions)
  - Real-time subscriptions
- **[ImageKit 5.2.0](https://imagekit.io/)** - Image CDN and optimization

### AI & Content
- **[Groq SDK 0.30.0](https://groq.com/)** - AI content generation (Llama 3.3 70B)
- **[TinyMCE 8.0.2](https://www.tiny.cloud/)** - Rich text editor
- **[@tinymce/tinymce-react 6.3.0](https://www.tiny.cloud/docs/tinymce/6/react-ref/)** - React integration

### Form Management
- **[React Hook Form 7.62.0](https://react-hook-form.com/)** - Performant form validation
- **[HTML React Parser 5.2.6](https://github.com/remarkablemark/html-react-parser)** - Safe HTML parsing

### Utilities
- **[Sonner 2.0.7](https://sonner.emilkowalski.com/)** - Toast notifications
- **[Next Themes 0.4.6](https://github.com/pacocoursey/next-themes)** - Theme management
- **[React Infinite Scroll Component 6.1.0](https://github.com/ankeetmaini/react-infinite-scroll-component)** - Infinite scrolling

### Development Tools
- **[ESLint 9.33.0](https://eslint.org/)** - Linting
- **[@vitejs/plugin-react 5.0.0](https://github.com/vitejs/vite-plugin-react)** - React plugin for Vite
- **[Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)** - Beautiful typography
- **[Tailwind Scrollbar Hide](https://github.com/reslear/tailwind-scrollbar-hide)** - Hide scrollbars

---

## 🏗️ Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Application                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Router    │  │  Redux Store │  │  TanStack    │   │
│  │  (Pages)    │  │  (Auth/Dark) │  │   Query      │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
│         │                 │                  │           │
│         └─────────────────┼──────────────────┘           │
│                           │                              │
│  ┌────────────────────────┼────────────────────────┐    │
│  │         Components Layer                        │    │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐         │    │
│  │  │  Pages  │ │   UI    │ │  Header  │         │    │
│  │  │         │ │ Library │ │ Sidebar  │         │    │
│  │  └─────────┘ └─────────┘ └──────────┘         │    │
│  └──────────────────────────────────────────────────┘   │
│                           │                              │
│  ┌────────────────────────┼────────────────────────┐    │
│  │         Services Layer                          │    │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐        │    │
│  │  │Appwrite │ │ImageKit  │ │  Groq AI │        │    │
│  │  │ Service │ │ Service  │ │  Service │        │    │
│  │  └─────────┘ └──────────┘ └──────────┘        │    │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐    ┌───────▼────┐    ┌───────▼────┐
   │ Appwrite │    │ ImageKit   │    │   Groq     │
   │  Cloud   │    │    CDN     │    │   Cloud    │
   └──────────┘    └────────────┘    └────────────┘
```

### Data Flow

1. **Authentication Flow**: User → Google OAuth → Appwrite → Redux Store → Protected Routes
2. **Post Creation Flow**: User → TinyMCE Editor → ImageKit Upload → Appwrite Database → UI Update
3. **AI Generation Flow**: User → Groq API (via Appwrite Function) → Content → TinyMCE Editor
4. **Image Flow**: Local/Pixabay → ImageKit Upload → CDN URL → Appwrite Database → Optimized Display

### State Management Strategy

- **Redux Store**: Global state for authentication, theme, posts, and profile
- **Redux Persist**: Persists auth and theme preferences
- **TanStack Query**: Server state caching for posts, comments, and user data
- **Local State**: Component-level state for forms and UI interactions

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Appwrite** account ([Create one](https://appwrite.io/))
- **ImageKit** account ([Sign up](https://imagekit.io/))
- **Groq API** key ([Get one](https://groq.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rajat0741/KnowSpace.git
   cd KnowSpace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Appwrite Configuration
   VITE_APPWRITE_URL=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_COLLECTION_ID=your_posts_collection_id
   VITE_APPWRITE_BUCKET_ID=your_bucket_id
   VITE_APPWRITE_COMMENTS_COLLECTION_ID=your_comments_collection_id
   VITE_APPWRITE_TRACKING_COLLECTION_ID=your_tracking_collection_id

   # ImageKit Configuration
   VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   VITE_IMAGEKIT_FUNCTION_ID=your_imagekit_function_id

   # Appwrite Functions
   VITE_APPWRITE_FETCHUSERS_FUNCTION_ID=your_fetch_users_function_id
   VITE_APPWRITE_FETCHUSERSBYID_FUNCTION_ID=your_fetch_user_by_id_function_id
   VITE_APPWRITE_AI_GENERATION_FUNCTION_ID=your_ai_generation_function_id

   # App Configuration
   VITE_APP_BASE_URL=http://localhost:5173
   VITE_EMAIL_VERIFICATION_URL=/verify-email
   VITE_PASSWORD_RESET_URL=/reset-password
   ```

4. **Set up Appwrite**

   - Create a new Appwrite project
   - Set up database collections:
     - **Posts Collection**: title, content, featuredimage, status, userid, category, authorName
     - **Comments Collection**: userid, username, postid, content
     - **Tracking Collection**: userid, title, content, prompt, requestType
   - Configure Google OAuth provider
   - Deploy serverless functions (see below)

5. **Deploy Appwrite Functions**

   Deploy the following functions to your Appwrite project:
   - **ImageKit Auth/Delete**: Handles ImageKit operations
   - **Fetch Users**: Search users by name
   - **Fetch User by ID**: Get user details
   - **AI Generation**: Groq AI content generation

6. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
KnowSpace/
├── public/                          # Static assets
│   ├── robots.txt
│   ├── tinymce-content.css
│   └── tinymce/                     # TinyMCE assets
│       ├── plugins/                 # Editor plugins
│       ├── skins/                   # Editor themes
│       └── themes/                  # Editor themes
│
├── src/
│   ├── main.jsx                     # Application entry point
│   ├── App.jsx                      # Root component with routing
│   ├── index.css                    # Global styles
│   │
│   ├── appwrite/                    # Appwrite services
│   │   ├── auth.js                  # Authentication service
│   │   └── config.js                # Database & storage service
│   │
│   ├── AuthenticatedRouting/        # Route protection
│   │   └── AuthLayout.jsx           # Protected route wrapper
│   │
│   ├── Components/
│   │   ├── Header/                  # Header component
│   │   │   ├── Header.jsx
│   │   │   └── index.js
│   │   │
│   │   ├── Pages/                   # Page components
│   │   │   ├── Auth/                # Login/signup page
│   │   │   ├── AuthCallback/        # OAuth callback handler
│   │   │   ├── EditPost/            # Edit post page
│   │   │   ├── Home/                # Home feed
│   │   │   ├── NotFound/            # 404 page
│   │   │   ├── Post/                # Single post view
│   │   │   ├── PostForm/            # Create post page
│   │   │   ├── Profile/             # User profile page
│   │   │   ├── Search/              # Search page
│   │   │   ├── Settings/            # User settings
│   │   │   ├── UserProfilePage/     # Other user's profile
│   │   │   ├── Write_with_AI/       # AI writing assistant
│   │   │   └── index.js             # Page exports
│   │   │
│   │   └── ui/                      # Reusable UI components
│   │       ├── button.jsx
│   │       ├── dialog.jsx
│   │       ├── drawer.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── Select.jsx
│   │       ├── sonner.jsx
│   │       ├── RTE.jsx              # Rich text editor wrapper
│   │       ├── LazyRoute.jsx        # Lazy loading wrapper
│   │       ├── LoadingFallback.jsx
│   │       ├── Logo.jsx
│   │       ├── SkeletonCard.jsx
│   │       └── Custom/              # Custom components
│   │           ├── ErrorBoundary/
│   │           └── Side-bar/
│   │
│   ├── conf/
│   │   └── conf.js                  # Environment configuration
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-mobile.js            # Mobile detection
│   │   ├── useDragAndDrop.js        # Drag & drop functionality
│   │   ├── useFetchImage.js         # Image fetching
│   │   ├── useMultiIntersectionObserver.js  # Intersection observer
│   │   ├── usePixabayInfinite.js    # Pixabay API integration
│   │   ├── usePosts.js              # Post data fetching
│   │   └── useRoutePreloader.js     # Route preloading
│   │
│   ├── imagekit/
│   │   └── imagekit.js              # ImageKit service
│   │
│   ├── lib/
│   │   ├── imageDownloadUtils.js    # Image utilities
│   │   └── utils.js                 # Common utilities
│   │
│   ├── store/                       # Redux store
│   │   ├── store.js                 # Store configuration
│   │   ├── authSlice.js             # Auth state
│   │   ├── authThunks.js            # Auth async actions
│   │   ├── darkmodeSlice.js         # Theme state
│   │   ├── postSlice.js             # Post state
│   │   └── profileSlice.js          # Profile state
│   │
│   └── utils/                       # Utility functions
│
├── components.json                  # Shadcn UI config
├── eslint.config.js                 # ESLint configuration
├── jsconfig.json                    # JavaScript config
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

---

## 🎯 Key Features Explained

### AI Content Generation

KnowSpace integrates Groq's Llama 3.3 70B model for AI-powered content generation:

- **Three Tiers**: Basic, Pro, and Ultra with increasing depth and quality
- **Research Mode**: Provide URLs for the AI to research and cite
- **Style Control**: Choose between moderate or aggressive writing styles
- **Usage Tracking**: Monitor usage per tier with persistent tracking
- **Instant Preview**: Generated content loads directly into TinyMCE editor

### Image Management

Dual-source image system for maximum flexibility:

1. **Local Upload**: Upload images directly from your device
2. **Pixabay Integration**: Search and use free stock photos
3. **ImageKit CDN**: All images optimized and delivered via CDN
4. **Automatic Optimization**: WebP/AVIF conversion, lazy loading, responsive images

### Rich Text Editor

TinyMCE integration with custom configuration:

- Full formatting toolbar
- Code syntax highlighting
- Table support
- Link management
- Image embedding
- Undo/redo functionality
- Auto-save support

### Performance Optimizations

Multiple strategies for optimal performance:

1. **Code Splitting**: Routes loaded on-demand
2. **Manual Chunks**: Vendor libraries split intelligently
3. **Lazy Loading**: Images and components load when needed
4. **React Query**: Aggressive caching with stale-while-revalidate
5. **Redux Persist**: Only essential state persisted
6. **Bundle Analysis**: Vite analyzer for bundle optimization

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# Appwrite Backend
VITE_APPWRITE_URL=                          # Appwrite API endpoint
VITE_APPWRITE_PROJECT_ID=                   # Your project ID
VITE_APPWRITE_DATABASE_ID=                  # Database ID
VITE_APPWRITE_COLLECTION_ID=                # Posts collection ID
VITE_APPWRITE_BUCKET_ID=                    # Storage bucket ID
VITE_APPWRITE_COMMENTS_COLLECTION_ID=       # Comments collection ID
VITE_APPWRITE_TRACKING_COLLECTION_ID=       # AI tracking collection ID

# ImageKit CDN
VITE_IMAGEKIT_PUBLIC_KEY=                   # ImageKit public key
VITE_IMAGEKIT_URL_ENDPOINT=                 # ImageKit URL endpoint
VITE_IMAGEKIT_FUNCTION_ID=                  # Appwrite function for ImageKit

# Appwrite Functions
VITE_APPWRITE_FETCHUSERS_FUNCTION_ID=       # User search function
VITE_APPWRITE_FETCHUSERSBYID_FUNCTION_ID=   # Get user by ID function
VITE_APPWRITE_AI_GENERATION_FUNCTION_ID=    # AI generation function

# App Configuration
VITE_APP_BASE_URL=                          # Your app's base URL
VITE_EMAIL_VERIFICATION_URL=                # Email verification path
VITE_PASSWORD_RESET_URL=                    # Password reset path
```

⚠️ **Security Note**: Never commit `.env` files to version control!

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server (Vite)
npm run lint             # Run ESLint for code quality

# Production
npm run build            # Build for production
npm run preview          # Preview production build locally
```

---

## ⚡ Performance Optimizations

### Build Optimizations

1. **Manual Chunk Splitting**
   ```javascript
   manualChunks: {
     'react-vendor': ['react', 'react-dom'],
     'router-vendor': ['react-router-dom'],
     'ui-vendor': ['@radix-ui/*'],
     'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
     // ... more chunks
   }
   ```

2. **Tree Shaking**
   - ES modules for all dependencies
   - Unused code elimination
   - Side-effect-free modules

3. **Minification**
   - ESBuild minification (faster than Terser)
   - CSS minification with Tailwind

### Runtime Optimizations

1. **React Query Caching**
   - 5-minute stale time
   - 10-minute garbage collection
   - Smart refetching strategies

2. **Lazy Loading**
   - Route-based code splitting
   - Dynamic imports for heavy components
   - Suspense boundaries with fallbacks

3. **Image Optimization**
   - ImageKit CDN delivery
   - Automatic format conversion (WebP/AVIF)
   - Lazy loading with intersection observer
   - Responsive images with srcset

4. **Redux Optimization**
   - Selective persistence
   - Normalized state structure
   - Memoized selectors

---

## 🚀 Deployment

### Frontend Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Netlify
```bash
# Build
npm run build

# Deploy dist folder
netlify deploy --prod --dir=dist
```

#### Manual Deployment
```bash
# Build
npm run build

# Upload dist/ folder to your hosting provider
```

### Environment Variables in Production

Make sure to set all environment variables in your hosting provider's dashboard:

- Vercel: Settings → Environment Variables
- Netlify: Site settings → Build & deploy → Environment

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Kushwaha Rajat**
- GitHub: [@Rajat0741](https://github.com/Rajat0741)
- Project: [KnowSpace](https://github.com/Rajat0741/KnowSpace)

---

## 🙏 Acknowledgments

- **[Appwrite](https://appwrite.io/)** - Amazing BaaS platform
- **[ImageKit](https://imagekit.io/)** - Powerful image CDN
- **[Groq](https://groq.com/)** - Lightning-fast AI inference
- **[TinyMCE](https://www.tiny.cloud/)** - Feature-rich editor
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **Open Source Community** - For amazing tools and libraries

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Rajat0741/KnowSpace/issues) page
2. Create a new issue with detailed information
3. Review existing documentation
4. Check Appwrite and ImageKit documentation

---

## 🗺️ Roadmap

- [ ] Real-time collaboration
- [ ] Post analytics dashboard
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Bookmarking system
- [ ] Like/reaction system
- [ ] Comment replies (nested comments)
- [ ] User roles (admin, moderator, author, reader)

---

<div align="center">

Made with ❤️ by [Kushwaha Rajat](https://github.com/Rajat0741)

⭐ Star this repo if you find it helpful!

</div>

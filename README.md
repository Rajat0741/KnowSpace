# Blog Website with React + Vite + Appwrite + ImageKit

A modern, feature-rich blog platform built with React, Vite, Appwrite for backend services, and ImageKit.io for optimized image delivery.

## Features

- 📝 Create, edit, and delete blog posts
- 🖼️ Optimized image uploads and delivery with ImageKit CDN
- 👤 User authentication and profiles
- 💬 Comments system
- 🔍 Search and filter posts
- 📱 Responsive design
- 🌙 Dark mode support
- ⚡ Fast performance with Vite and ImageKit optimization

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS
- **Backend**: Appwrite (Database, Authentication, Functions)
- **Image Storage**: ImageKit.io (CDN, Optimization, Transformations)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form
- **Rich Text Editor**: TinyMCE
- **Routing**: React Router DOM

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Appwrite account and project
- ImageKit account

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd blog-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your credentials (see `.env.example` for required variables)

4. Deploy Appwrite functions (required for ImageKit):
   - See `QUICK_SETUP.md` for 5-minute setup guide
   - Or see `appwrite-functions/README.md` for detailed instructions

5. Start development server:
   ```bash
   npm run dev
   ```

## ImageKit Migration

This project uses ImageKit.io for image storage and optimization instead of Appwrite Storage.

**Setup Guides:**
- 📖 **Quick Setup** (5 minutes): See `QUICK_SETUP.md`
- 📚 **Complete Guide**: See `IMAGEKIT_MIGRATION_GUIDE.md`
- 🔧 **Functions Setup**: See `appwrite-functions/README.md`

**Benefits:**
- ✅ Automatic image optimization
- ✅ Global CDN delivery
- ✅ Real-time transformations
- ✅ Better performance
- ✅ WebP/AVIF support

## Project Structure

```
blog-website/
├── src/
│   ├── Components/       # React components
│   ├── appwrite/        # Appwrite services (auth, database)
│   ├── imagekit/        # ImageKit service wrapper
│   ├── store/           # Redux store and slices
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utility functions
├── appwrite-functions/  # Appwrite serverless functions
│   ├── imagekit-auth/   # ImageKit authentication
│   └── imagekit-delete/ # ImageKit file deletion
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.example` for all required environment variables:
- Appwrite configuration (URL, project ID, database IDs)
- ImageKit credentials (public key, private key, URL endpoint)
- Appwrite function URLs (for ImageKit operations)

⚠️ Never commit your `.env` file to version control!

## Deployment

### Deploy Frontend
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

### Deploy Appwrite Functions
1. Follow instructions in `appwrite-functions/README.md`
2. Deploy both `imagekit-auth` and `imagekit-delete` functions
3. Update `.env` with function URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check `IMAGEKIT_MIGRATION_GUIDE.md` for ImageKit setup issues
- Review `appwrite-functions/README.md` for function deployment issues
- Check the browser console and Appwrite logs for errors

## Acknowledgments

- React + Vite template
- Appwrite for backend services
- ImageKit.io for image optimization and CDN
- TailwindCSS for styling
- All other open-source libraries used in this project


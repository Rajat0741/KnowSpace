# KnowSpace - Modern Blog Platform

## Blog Website with React + Vite + Appwrite + ImageKit

<div align="center">
  A modern, feature-rich blog platform built with React, Vite, Appwrite for backend services, and ImageKit.io for optimized image delivery.
  <br /><br />
  <img alt="KnowSpace Banner" src="https://img.shields.io/badge/KnowSpace-Blog%20Platform-purple?style=for-the-badge" />
  <br /><br />
  <a href="https://reactjs.org/">
    <img alt="React" src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react" />
  </a>
  <a href="https://vitejs.dev/">
    <img alt="Vite" src="https://img.shields.io/badge/Vite-7.1.2-646CFF?style=flat&logo=vite" />
  </a>
  <a href="https://appwrite.io/">
    <img alt="Appwrite" src="https://img.shields.io/badge/Appwrite-Backend-F02E65?style=flat&logo=appwrite" />
  </a>
  <a href="https://tailwindcss.com/">
    <img alt="TailwindCSS" src="https://img.shields.io/badge/Tailwind-4.1.12-38B2AC?style=flat&logo=tailwind-css" />
  </a>
</div>

<br />

[Features](#features) • [Tech Stack](#tech-stack) • [Appwrite Functions](#appwrite-functions-knowspace-backend-automation) • [License](#-license) • [Support](#-support)

---

## Features

- 📝 Create, edit, and delete blog posts
- 🖼️ Optimized image uploads and delivery with ImageKit CDN
- 👤 User authentication and profiles
- 💬 Comments system
- 🔍 Search and filter posts
- 📱 Responsive design
- 🌙 Dark mode support
- ⚡ Fast performance with Vite and ImageKit optimization

---

## Tech Stack

- Frontend: React 19, Vite, TailwindCSS
- Backend: Appwrite, ImageKit, Google AI Studio

---

## Appwrite Functions (KnowSpace backend automation)

KnowSpace uses Appwrite Cloud Functions to handle backend workflows and integrations.

- Repository: [Knowspace_Appwrite_Functions](https://github.com/Rajat0741/Knowspace_Appwrite_Functions) (JavaScript)
- What they do:
  - Event-driven handlers for Appwrite Databases/Storage (e.g., when posts are created/updated)
  - HTTP-triggered utilities (webhooks, metadata enrichment, notifications)
  - Optional media-related tasks alongside ImageKit
- How this app interacts:
  - Triggers: database document create/update/delete events; optional scheduled jobs
  - HTTP calls from the app for on-demand tasks when needed
- Deployments:
  - Managed via Appwrite Console or Appwrite CLI
  - Function-specific environment variables and setup are documented in that repo

Quick links:
- Functions repo: [Knowspace_Appwrite_Functions](https://github.com/Rajat0741/Knowspace_Appwrite_Functions)
- Appwrite: [appwrite.io](https://appwrite.io/)
- 
---

## 👨‍💻 Author

**Rajat**
- GitHub: [@Rajat0741](https://github.com/Rajat0741)
- Project: [KnowSpace](https://github.com/Rajat0741/KnowSpace)

---

## 🙏 Acknowledgments

- [Appwrite](https://appwrite.io/) — Amazing BaaS platform
- [ImageKit](https://imagekit.io/) — Powerful image CDN
- [TinyMCE](https://www.tiny.cloud/) — Feature-rich editor
- [Radix UI](https://www.radix-ui.com/) — Accessible component primitives
- Open Source Community — For amazing tools and libraries

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Rajat0741/KnowSpace/issues) page
2. Create a new issue with detailed information
3. Review existing documentation
4. Check Appwrite and ImageKit documentation

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Rajat0741">Rajat</a><br />
  ⭐ Star this repo if you find it helpful!
</div>

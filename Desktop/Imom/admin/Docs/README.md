# Project Knowledge Base

Complete documentation for the Admin Dashboard project. Start here and navigate to specific sections based on your needs.

## 📚 Quick Links by Role

### 👤 For New Developers
**Start here!** 
1. Read this README first
2. → [ONBOARDING.md](./ONBOARDING.md) - Day-by-day guide (5 days)
3. → [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) - Local setup
4. → [ARCHITECTURE.md](./ARCHITECTURE.md) - How project works

### 🚀 For Implementing Features
1. → [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Step-by-step tutorial
2. → [src/services/README.md](./src/services/README.md) - API layer
3. → [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture reference

### 🔒 For Advanced Topics
1. → [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) - Security + Performance
2. → [src/context/README.md](./src/context/README.md) - State management
3. → [src/hooks/COMPREHENSIVE.md](./src/hooks/COMPREHENSIVE.md) - Custom hooks

---

## 🗺️ Project Overview

**Type:** Admin Dashboard / SaaS  
**Stack:** React 19 + TypeScript + Tailwind CSS + Vite  
**Architecture:** Component-driven, Context-based state, Service layer  
**Auth:** OTP-based (phone number)

### Feature Overview
- ✅ Light/Dark mode
- ✅ Responsive sidebar navigation
- ✅ Protected routing (public + private routes)
- ✅ OTP authentication flow
- ✅ Dashboard with statistics
- ✅ User management
- ✅ Toast notifications

---

## 📖 Documentation Index

### Getting Started

| Document | Duration | For |
|----------|----------|-----|
| [ONBOARDING.md](./ONBOARDING.md) | 5 days | New developers (must read first!) |
| [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md) | 30 min | Local environment setup |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 1-2 hours | Understanding project structure |

### Implementation

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete tutorial: Product management feature |
| [src/services/README.md](./src/services/README.md) | How to create API services |
| [src/context/README.md](./src/context/README.md) | Global state management |
| [src/hooks/COMPREHENSIVE.md](./src/hooks/COMPREHENSIVE.md) | Custom React hooks patterns |

### Advanced Topics

| Document | Topics |
|----------|--------|
| [SECURITY_PATTERNS.md](./SECURITY_PATTERNS.md) | Token management, XSS, CSRF, state patterns, performance |

### Folder Guides

| Folder | Purpose | Docs |
|--------|---------|------|
| `src/` | All application code | [src/README.md](./src/README.md) |
| `src/services/` | API & business logic | [services/README.md](./src/services/README.md) |
| `src/context/` | Global state (Theme, Sidebar, Alerts) | [context/README.md](./src/context/README.md) |
| `src/hooks/` | Custom React hooks | [hooks/COMPREHENSIVE.md](./src/hooks/COMPREHENSIVE.md) |
| `src/components/` | Reusable UI components | [components/README.md](./src/components/README.md) |
| `src/pages/` | Page components (routes) | [pages/README.md](./src/pages/README.md) |
| `src/utils/` | Helper functions | [utils/README.md](./src/utils/README.md) |
| `src/icons/` | Icon components | [icons/README.md](./src/icons/README.md) |
| `src/layout/` | Layout wrappers | [layout/README.md](./src/layout/README.md) |

---

## 🏗️ Top-Level Structure

```
admin/                          ← Root project folder
├── Docs/                       ← Documentation (you are here)
│   ├── README.md              ← Documentation index
│   ├── ARCHITECTURE.md        ← Project design
│   ├── DEVELOPMENT_SETUP.md   ← Setup guide
│   ├── IMPLEMENTATION_GUIDE.md ← Feature tutorial
│   ├── ONBOARDING.md          ← 5-day guide
│   ├── SECURITY_PATTERNS.md   ← Advanced patterns
│   └── src/                   ← Folder-specific docs
│       ├── README.md
│       ├── services/README.md
│       ├── context/README.md
│       ├── hooks/README.md
│       ├── components/README.md
│       └── ...
│
├── public/                     ← Static assets (images, etc)
│   └── images/
│
├── src/                        ← Application source code
│   ├── App.tsx                ← Main router
│   ├── main.tsx               ← Entry point
│   ├── index.css              ← Global styles  
│   ├── components/            ← Reusable components
│   ├── pages/                 ← Page components
│   ├── context/               ← Global state
│   ├── services/              ← API calls
│   ├── utils/                 ← Helper functions
│   ├── hooks/                 ← Custom hooks
│   ├── icons/                 ← Icon components
│   └── layout/                ← Layout components
│
├── index.html                 ← Vite entry HTML
├── package.json               ← Dependencies & scripts
├── vite.config.ts             ← Vite configuration
├── tsconfig.json              ← TypeScript config
├── tailwind.config.js         ← Tailwind CSS config
├── eslint.config.js           ← ESLint rules
└── postcss.config.js          ← PostCSS config
```

---

## 🚀 Quick Start

### 1. Install & Run
```bash
git clone <repo>
cd admin
npm install
npm run dev
```
Open http://localhost:5173

### 2. First Steps
- Explore `/` dashboard (login with test credentials)
- Toggle sidebar (hamburger button)
- Switch dark/light mode (button in header)
- Check browser console for no errors

### 3. Read Documentation
1. [ONBOARDING.md](./ONBOARDING.md) - Understand project (5 days)
2. [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Build a feature
3. [ARCHITECTURE.md](./ARCHITECTURE.md) - Deep dive architecture

---

## 🎯 Key Concepts

### Layered Architecture
```
Pages/Components
        ↓
State Management (Context)
        ↓
Services (API calls)
        ↓ 
Utilities/Helpers
        ↓
External Libraries
```

### Authentication Flow
1. User enters phone number
2. Submit → Wait for OTP
3. User enters OTP
4. Verify → Get JWT token
5. Save token to localStorage
6. Access protected routes
7. Logout → Clear token

### Component Organization
```
Page Component
  ├── Custom Hooks (useFetch, etc)
  ├── Service calls (getStatsService, etc)
  ├── State management (useState, useContext)
  └── UI Components
      ├── Cards
      ├── Modals
      ├── Forms
      └── Lists
```

---

## 💾 Technology Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| React | UI framework | 19 |
| TypeScript | Type safety | ~5.7 |
| Tailwind CSS | Styling | 4 |
| React Router | Navigation | 7 |
| Axios | HTTP client | 1.16 |
| Vite | Build tool | 6 |
| React Hook Form | Form handling | 7.75 |
| ApexCharts | Charting | 4.1 |
| FullCalendar | Calendar | 6.1 |

---

## 🔧 Development Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Test production build
npm run lint     # Check code quality
```

---

## 📋 Integration Checklist

### Before Starting to Code
- [ ] Read [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Understand folder structure
- [ ] Know how to run dev server
- [ ] Create first component successfully

### Before Committing Code
- [ ] Wrote TypeScript (no `any` types)
- [ ] Added proper error handling
- [ ] Tested in browser
- [ ] Ran `npm run lint`
- [ ] Updated relevant documentation
- [ ] No console errors/warnings

### Before Asking for Code Review
- [ ] Feature works end-to-end
- [ ] Follows existing patterns
- [ ] Proper file structure
- [ ] All files have proper names
- [ ] Documentation updated

---

## ❓ FAQ

### Q: Where do I add a new API endpoint?
**A:** [src/services/README.md](./src/services/README.md) → Section "Adding a New Service"

### Q: How do I show an alert/toast?
**A:** 
```typescript
import { showAlert } from '@/services/alertService';
showAlert('success', 'Done!');
```

### Q: How do I fetch data from API?
**A:** [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) → "Step 2: Define Types" onwards

### Q: How do I toggle dark mode?
**A:** Use `useTheme()` hook (if it exists) or examine `ThemeContext.tsx`

### Q: Where should I put utility functions?
**A:** `src/utils/` folder. Create descriptive filenames like `stringHelpers.ts`

### Q: How do I protect a route?
**A:** Wrap routes in `<ProtectedRoute>` component. See `src/App.tsx`

### Q: How do I use global state?
**A:** Use context hooks: `useTheme()`, `useSidebar()`. See [src/context/README.md](./src/context/README.md)

### Q: How do components communicate?
**A:** 
1. **Parent → Child:** Props
2. **Sibling → Sibling:** Lift state up or use Context
3. **Distant components:** Use Context or service layer

---

## 🆘 Getting Help

### Debugging Steps
1. Check browser console (F12)
2. Open React DevTools (Chrome extension)
3. Search relevant documentation here
4. Check similar components for patterns
5. Ask a team member

### When Asking for Help
✅ Good: "How do I structure a new service for X feature?"  
✅ Good: "Can you review my implementation?"  
❌ Bad: "How do I code?" (Google this)  
❌ Bad: Without trying first

---

## 📈 Project Roadmap

Recommended learning progression:

**Week 1:**
- Day 1-2: Setup + Architecture understanding
- Day 3-4: Create first component
- Day 5: API integration

**Week 2:**
- Implement a small feature
- Get code review
- Fix feedback

**Week 3+:**
- Implement medium features
- Become familiar with patterns
- Help onboard others

---

## 🤝 Contributing Guidelines

1. **Always read the docs first**
2. **Follow existing patterns**
3. **Test before submitting**
4. **Write clear commit messages**
5. **Ask questions early**

---

## 📚 Additional Resources

### Official Docs
- [React Official](https://react.dev)
- [TypeScript Handbook](https://typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

### Video Learning
- React fundamentals
- TypeScript crash course  
- Tailwind CSS guide
- Context API explained

---

## 📝 Document Version

- **Updated:** May 24, 2026
- **Version:** 2.0
- **Status:** Complete

---

**👉 Next Step:** Start with [ONBOARDING.md](./ONBOARDING.md) or [DEVELOPMENT_SETUP.md](./DEVELOPMENT_SETUP.md)
| `src/pages/AuthPages/` | [src/pages/AuthPages/README.md](./src/pages/AuthPages/README.md) |
| `src/pages/Dashboard/` | [src/pages/Dashboard/README.md](./src/pages/Dashboard/README.md) |
| `src/pages/User/` | [src/pages/User/README.md](./src/pages/User/README.md) |
| `src/services/` | [src/services/README.md](./src/services/README.md) |
| `src/utils/` | [src/utils/README.md](./src/utils/README.md) |
| `public/` | [public/README.md](./public/README.md) |

## Auth Flow Summary

```
User visits any URL
       │
       ▼
  Has token?  ──No──▶  Redirect → /signin
       │
      Yes
       │
       ▼
  Visits /signin? ──Yes──▶  Redirect → /
       │
      No
       │
       ▼
  Render requested page
```

API calls that receive a `401` automatically clear the token and redirect to `/signin` via the Axios response interceptor in `src/services/api.tsx`.

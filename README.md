# 🏋️ SportifyLife Admin Dashboard

Modern and elegant admin dashboard for managing the SportifyLife fitness application. Built with Next.js 15, TypeScript, and shadcn/ui.

## ✨ Features

- 🔐 **Authentication System** - Secure JWT-based authentication with refresh tokens
- 💪 **Exercise Management** - Complete CRUD operations for exercises with seeding functionality
- 🏃 **Workout Management** - Create and manage workout templates
- 👥 **User Management** - Monitor and manage user accounts
- 📊 **Analytics Dashboard** - Real-time insights and performance metrics
- 🎨 **Modern UI** - Beautiful, responsive design with shadcn/ui components
- 🔄 **Real-time Updates** - Live data synchronization
- 📱 **Fully Responsive** - Works perfectly on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table (React Table)
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sportifylife-admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=SportifyLife Admin
NEXT_PUBLIC_APP_VERSION=1.0.0
JWT_SECRET=your-jwt-secret-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
sportifylife-admin/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── exercises/
│   │   │   └── page.tsx          # Exercise management
│   │   ├── workouts/
│   │   │   └── page.tsx          # Workout management
│   │   ├── users/
│   │   │   └── page.tsx          # User management
│   │   └── analytics/
│   │       └── page.tsx          # Analytics dashboard
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── breadcrumb.tsx
│   └── common/
│       ├── data-table.tsx
│       ├── loading-spinner.tsx
│       └── empty-state.tsx
├── lib/
│   ├── api/                       # API client and endpoints
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── exercises.ts
│   │   ├── workouts.ts
│   │   ├── users.ts
│   │   ├── analytics.ts
│   │   ├── notifications.ts
│   │   └── audit-logs.ts
│   ├── stores/
│   │   └── auth-store.ts         # Zustand authentication store
│   ├── config/
│   │   └── constants.ts          # App constants and configs
│   └── utils.ts                  # Utility functions
├── types/
│   ├── index.ts                  # Main type definitions
│   └── api.ts                    # API response types
├── middleware.ts                 # Route protection middleware
└── README.md
```

## 🔑 Authentication

The dashboard uses JWT-based authentication with the following features:

- Secure login with email and password
- Automatic token refresh
- Protected routes via middleware
- Persistent authentication state with Zustand

### Demo Credentials

```
Email: admin@sportifylife.com
Password: admin123
```

## 📱 Pages

### Dashboard Overview
- Real-time statistics and metrics
- Quick action buttons
- Recent activity feed
- System status indicators

### Exercise Management
- Browse and search exercises
- Filter by body part, equipment, and difficulty
- View detailed exercise information
- Seed exercises from external API
- Export exercise data

### Workout Management
- Create custom workout templates
- Edit and delete workouts
- Organize exercises with sets, reps, and rest periods
- Categorize workouts by difficulty and type

### User Management
- View all registered users
- Filter users by role and status
- Monitor user activity
- Manage user permissions
- Export user data

### Analytics
- User growth trends
- Workout completion rates
- Exercise popularity metrics
- Engagement statistics
- Interactive charts and visualizations

## 🎨 UI Components

All UI components are built with shadcn/ui for a consistent, modern design:

- Buttons, inputs, and forms
- Data tables with sorting and pagination
- Modal dialogs and dropdowns
- Cards and badges
- Avatars and tabs
- Toast notifications
- Loading states and skeletons

## 🔧 Development

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Run linter
```bash
npm run lint
```

### Type checking
```bash
npm run type-check
```

## 🌐 API Integration

The dashboard integrates with a NestJS backend API. All API endpoints are configured in `lib/config/constants.ts`.

### API Base URL
Default: `http://localhost:3001/api`

Configure via `NEXT_PUBLIC_API_BASE_URL` environment variable.

### API Endpoints

- **Auth**: `/auth/login`, `/auth/refresh`, `/auth/logout`
- **Exercises**: `/admin/exercises`, `/admin/exercises/:id`, `/admin/exercises/seed`
- **Workouts**: `/admin/workouts`, `/admin/workouts/:id`
- **Users**: `/admin/users`, `/admin/users/:id`
- **Analytics**: `/admin/analytics/overview`, `/admin/analytics/charts`
- **Notifications**: `/admin/notifications`
- **Audit Logs**: `/admin/audit-logs`

## 📝 License

© 2025 SportifyLife. All rights reserved.

## 👨‍💻 Author

Built with ❤️ by the SportifyLife team

---

**Note**: This is an admin-only dashboard. Regular users should access the mobile application.

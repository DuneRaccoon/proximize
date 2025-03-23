# Wallet Pass Manager Frontend

This is the frontend application for the Wallet Pass Manager SaaS platform, built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Project Structure

```
proximize-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication pages (login, register)
│   │   ├── (dashboard)/        # Dashboard and protected pages
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   │   ├── ui/                 # UI components (buttons, inputs, etc.)
│   │   ├── layout/             # Layout components (header, sidebar, etc.)
│   │   ├── dashboard/          # Dashboard-specific components
│   │   ├── customers/          # Customer-specific components
│   │   ├── templates/          # Template-specific components
│   │   ├── passes/             # Pass-specific components
│   │   ├── campaigns/          # Campaign-specific components
│   │   └── locations/          # Location-specific components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions and types
│   │   ├── api/                # API client and services
│   │   ├── utils.ts            # Utility functions
│   │   └── types.ts            # TypeScript type definitions
│   ├── providers/              # Context providers
│   │   └── auth-provider.tsx   # Authentication provider
│   └── styles/                 # Global styles
│       └── globals.css         # Tailwind CSS imports and global styles
├── public/                     # Public assets
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── next.config.js              # Next.js configuration
```

## Key Features

- **Authentication**: Login, registration, and persistent sessions
- **Dashboard**: Overview of key metrics and recent activity
- **Customer Management**: Add, edit, view, and delete customers
- **Pass Templates**: Create and manage wallet pass templates
- **Pass Management**: Issue and track wallet passes
- **Campaign Management**: Create and manage marketing campaigns
- **Location Management**: Manage geo-targeting locations

## API Integration

The frontend integrates with the FastAPI backend through a centralized API client that handles:

- Authentication with JWT tokens
- Token refresh
- API requests with proper headers
- Error handling
- Type-safe responses

Each API endpoint has its own service module for better organization and type safety.

## Getting Started

### Prerequisites

- Node.js (>= 18.0.0)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file based on `.env.example` and fill in your environment variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

## Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
```

## Docker

The application can also be run using Docker:

```bash
docker-compose up -d
```

This will start both the frontend and backend services.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

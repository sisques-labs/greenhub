# Web Application

Next.js 16 web application with React 19, Tailwind CSS 4, and internationalization support. Part of the project-starter monorepo.

## 🚀 Technologies

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.1
- **Styling**: Tailwind CSS 4
- **Internationalization**: next-intl
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Package Manager**: pnpm 9
- **TypeScript**: 5.x
- **Code Quality**: Biome

## 📦 Workspace Dependencies

This application uses shared packages from the monorepo:

- **@repo/sdk**: TypeScript SDK for API interactions (GraphQL client, React hooks)
- **@repo/shared**: Shared UI components and utilities

## 📋 Prerequisites

- **Node.js**: >= 18
- **pnpm**: 9.0.0
- **API Server**: The backend API should be running (default: http://localhost:4100)

## 🏗️ Project Structure

```
apps/web/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Internationalized routes
│   │   ├── auth/            # Authentication pages
│   │   ├── home/            # Home page
│   │   ├── user/            # User pages
│   │   ├── layout.tsx       # Locale layout
│   │   └── page.tsx         # Locale root page
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Root page
├── src/
│   ├── generic/             # Domain-specific features
│   │   ├── auth/            # Authentication feature
│   │   └── users/           # User management feature
│   └── shared/              # Shared utilities
│       └── presentation/    # Shared UI components and providers
├── public/                  # Static assets
├── next.config.ts           # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies

From the project root:

```bash
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` in `apps/web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4100/graphql
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server

From the project root:

```bash
# Run web app only
pnpm dev --filter=web

# Or run all apps (API + Web)
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📜 Available Scripts

### Development

```bash
# Start development server
pnpm dev

# Start with filter from root
pnpm dev --filter=web
```

### Build

```bash
# Build for production
pnpm build

# Build from root
pnpm build --filter=web
```

### Production

```bash
# Start production server
pnpm start
```

### Code Quality

```bash
# Format code
pnpm format

# Check formatting
pnpm format:check

# Lint code
pnpm lint

# Check linting
pnpm lint:check
```

### Release

```bash
# Run semantic release
pnpm release
```

## 🌍 Internationalization

The application uses `next-intl` for internationalization with support for multiple locales.

### Supported Locales

- `en` - English
- `es` - Spanish

### Adding a New Locale

1. Add locale files in `src/shared/presentation/locales/`
2. Update `src/shared/presentation/i18n/routing.ts`
3. Add locale routes in `app/[locale]/`

### Using Translations

```typescript
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('namespace');
  return <h1>{t('title')}</h1>;
}
```

## 🎨 Styling

The application uses **Tailwind CSS 4** for styling. The configuration is in `postcss.config.mjs`.

### Dark Mode

Dark mode is supported and can be toggled using the theme provider.

### Custom Styles

Global styles are defined in `app/globals.css`.

## 🔐 Authentication

Authentication is handled through the `@repo/sdk` package which provides:

- GraphQL client with automatic token management
- React hooks for authentication (`useAuthLogin`, `useAuthRegister`, `useAuthProfileMe`)
- Automatic token refresh
- Protected routes

### Authentication Flow

1. User logs in via the auth page
2. Tokens are stored in HTTP-only cookies (via proxy middleware)
3. SDK client automatically includes tokens in GraphQL requests
4. Protected routes check authentication status

## 📱 State Management

The application uses **Zustand** for client-side state management.

### Example Store

```typescript
import { create } from 'zustand';

interface StoreState {
  count: number;
  increment: () => void;
}

export const useStore = create<StoreState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## 📝 Forms

Forms are handled with **React Hook Form** and validated with **Zod**.

### Example Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormData = z.infer<typeof schema>;

export function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

## 🐳 Docker Deployment

The application includes a `Dockerfile` for containerized deployment.

### Build Docker Image

```bash
docker build -t web-app -f apps/web/Dockerfile .
```

### Run Container

```bash
docker run -p 3000:3000 web-app
```

The Dockerfile uses a multi-stage build for optimized production images.

## 🚢 Deployment

### Production Build

```bash
# Build the application
pnpm build --filter=web

# Start production server
pnpm start --filter=web
```

### Environment Variables

Make sure to set the following environment variables in production:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/graphql
NEXT_PUBLIC_APP_URL=https://app.example.com
```

### Standalone Output

The Next.js configuration uses `output: 'standalone'` for optimized production builds that can be deployed as a standalone Node.js application.

## 📖 API Integration

The application communicates with the backend API through the `@repo/sdk` package.

### Using SDK Hooks

```typescript
import { useAuthProfileMe } from '@/generic/auth/presentation/hooks/use-auth-profile-me';

export function ProfileComponent() {
  const { data, loading, error } = useAuthProfileMe();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Hello, {data?.name}</div>;
}
```

See `packages/sdk/README.md` for complete SDK documentation.

## 🧪 Testing

Currently, the project doesn't include test setup. To add testing:

1. Install testing libraries (Jest, React Testing Library, etc.)
2. Configure test scripts in `package.json`
3. Add test files following Next.js testing best practices

## 🔧 Configuration Files

- **next.config.ts**: Next.js configuration with next-intl plugin
- **postcss.config.mjs**: PostCSS configuration for Tailwind CSS
- **tsconfig.json**: TypeScript configuration
- **biome.json**: Biome configuration for linting and formatting

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React 19 Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app)
- [Zustand Documentation](https://zustand-demo.pmnd.rs)
- [React Hook Form Documentation](https://react-hook-form.com)

## 🤝 Contributing

When contributing to the web application:

1. Follow the existing code structure and patterns
2. Use TypeScript for all new code
3. Ensure proper internationalization for user-facing text
4. Follow the component structure (atoms, molecules, organisms, templates)
5. Write meaningful commit messages
6. Run linting and formatting before committing

## 📝 License

This project is part of the project-starter monorepo. See the root LICENSE file for details.

fix

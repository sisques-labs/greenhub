# Project Starter

A complete and scalable project starter for building modern applications. This project uses a Turborepo monorepo and is designed with DDD (Domain-Driven Design), CQRS (Command Query Responsibility Segregation), and Event-Driven Architecture.

## 🏗️ Project Architecture

This is a monorepo built with **Turborepo** that includes multiple applications and shared packages, all written in **TypeScript**.

### 📦 Monorepo Structure

```
project-starter/
├── apps/
│   ├── api/          # Backend API with DDD/CQRS architecture
│   └── web/          # Next.js web application
├── packages/
│   ├── sdk/          # Shared TypeScript SDK for clients
│   ├── shared/       # Shared UI components and utilities
│   ├── eslint-config/    # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
```

## 🚀 Applications and Packages

### 🔌 API (`apps/api`)

Backend API built with **NestJS** implementing DDD, CQRS, and Event-Driven Architecture. Features GraphQL API with Apollo Server, PostgreSQL (via TypeORM) for transactional data, and MongoDB for Event Store.

Includes bounded contexts:

- **Auth**: Authentication and authorization with JWT
- **User**: User management
- **Saga**: Distributed transaction orchestration
- **Health**: Health checks and monitoring
- **Logging**: Centralized logging with Winston

### 🌐 Web App (`apps/web`)

Next.js 16 web application with React 19 and Tailwind CSS 4.

### 📦 SDK (`packages/sdk`)

Shared TypeScript SDK for interacting with the API from any client. Includes GraphQL client, React hooks, and automatic token management.

See `packages/sdk/README.md` for complete usage examples.

## 🛠️ Main Technologies

- **Monorepo**: Turborepo
- **Backend**: NestJS, GraphQL, TypeORM, MongoDB
- **Frontend**: Next.js 16, React 19, Tailwind CSS 4
- **Language**: TypeScript 5
- **Package Manager**: pnpm 9
- **Databases**: PostgreSQL, MongoDB
- **ORM**: TypeORM

## 📋 Prerequisites

- **Node.js**: >= 18
- **pnpm**: 9.0.0 (recommended to install globally)
- **PostgreSQL**: Main database
- **MongoDB**: For Event Store

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-starter
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create `.env` files in the corresponding folders:

**`apps/api/.env`**:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/project_db"
MONGODB_URI="mongodb://localhost:27017/project_event_store"
JWT_ACCESS_SECRET="your-jwt-access-secret-key"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key"
JWT_ACCESS_EXPIRATION="15m"
JWT_REFRESH_EXPIRATION="7d"
FRONTEND_URL="http://localhost:3000"
PORT=4100
```

### 4. Setup Database

```bash
# From the project root
cd apps/api

# Run TypeORM migrations
pnpm typeorm migration:run

# Or generate a new migration
pnpm typeorm migration:generate -n MigrationName
```

### 5. Start Services

#### Development (all apps)

```bash
# From the project root
pnpm dev
```

#### Development for a specific app

```bash
# API
pnpm dev --filter=api

# Web App
pnpm dev --filter=web
```

### 6. Access Applications

- **GraphQL API**: http://localhost:4100/graphql
- **GraphQL Playground**: http://localhost:4100/graphql (development mode)
- **Web App**: http://localhost:3000

## 🔄 Using the Project Starter

This repository is designed as a **project starter** that provides a solid foundation for building applications. You can use it as a template to start new projects with a well-structured architecture and best practices already in place.

### Getting Started

1. **Clone or use as template:**
   - Clone this repository
   - Or use GitHub's "Use this template" feature

2. **Customize for your project:**
   - Update project name and descriptions
   - Configure environment variables
   - Add your domain-specific bounded contexts
   - Customize the web application

3. **Reset project versions (optional):**
   - If you want to start fresh with versioning, run `pnpm reset`
   - This will reset all package.json versions to 0.0.0, delete all CHANGELOG.md files, and reset the release-please manifest

4. **Start developing:**
   - Follow the architecture patterns established in the codebase
   - Add new features following DDD, CQRS, and Event-Driven principles
   - Use the existing bounded contexts as examples for new ones

## 📜 Available Scripts

### Global Scripts (project root)

```bash
# Development
pnpm dev                    # Start all apps in development mode
pnpm dev --filter=<app>     # Start a specific app

# Build
pnpm build                  # Build all apps and packages
pnpm build --filter=<app>   # Build a specific app

# Linting
pnpm lint                   # Run linting across the project
pnpm lint --filter=<app>    # Run linting for a specific app

# Type Checking
pnpm check-types            # Verify TypeScript types across the project

# Formatting
pnpm format                 # Format code with Prettier

# Project Reset
pnpm reset                  # Reset all package versions to 0.0.0, delete changelogs, and reset release-please manifest
```

### Reset Project Script

The `reset` script is useful when starting a new project from this template. It performs the following actions:

- **Resets all package.json versions** to `0.0.0` (only for packages that have a version field)
- **Deletes all CHANGELOG.md files** in the project
- **Resets `.release-please-manifest.json`** to set all tracked package versions to `0.0.0`

This is particularly useful when:

- Using this repository as a template for a new project
- Starting fresh with versioning after a major refactor
- Resetting the project state for a new release cycle

**Usage:**

```bash
pnpm reset
```

Or directly:

```bash
node scripts/reset-projects.js
```

### API Scripts (`apps/api`)

```bash
# Development
pnpm dev                    # Watch mode
pnpm start                  # Production
pnpm debug                  # Debug mode

# Testing
pnpm test                   # Run tests
pnpm test:watch             # Watch mode
pnpm test:cov               # With coverage
pnpm test:e2e               # End-to-end tests
```

## 🏛️ API Architecture

### DDD (Domain-Driven Design)

The API is organized into **Bounded Contexts**, each representing a specific business domain:

- Each context is independent and has its own domain model
- Contexts communicate through domain events
- Clear separation between domain, application, and infrastructure

### CQRS (Command Query Responsibility Segregation)

- **Commands**: Operations that modify state (write)
- **Queries**: Operations that only read data (read)
- Separation of read and write models
- Independent optimization of each side

### Event-Driven Architecture

- **Domain Events**: Each bounded context publishes domain events for state changes
- **Event Handlers**: Asynchronous event processing to update read models and trigger side effects
- **Event Storage**: Domain events are handled by event handlers that update read models in MongoDB
- **Event Bus**: Uses NestJS CQRS EventBus for event distribution

### Operation Flow

1. **Transport Layer** (GraphQL Resolver) receives the request
2. **Application Layer** (Command/Query Handler) processes the logic
3. **Domain Layer** (Aggregate) executes business rules
4. **Infrastructure Layer** (Repository) persists changes
5. **Event Bus** publishes domain events
6. **Event Handlers** process events (update read models, send notifications, etc.)

## 🔐 Authentication and Authorization

JWT-based authentication with multi-provider support (Local, Google, Apple). Role-based access control at user level.

## 📊 Event-Driven Architecture

The project implements an event-driven architecture where:

- **Domain Events** are published by aggregates when state changes occur
- **Event Handlers** process events asynchronously to update read models in MongoDB
- **Read Models** are maintained separately from write models for optimized query performance
- **Event Bus** (NestJS CQRS) distributes events to registered handlers

Each bounded context publishes its own domain events (e.g., `UserCreatedEvent`, `AuthRegisteredByEmailEvent`, `SagaInstanceCreatedEvent`) which are handled by event handlers that update the corresponding view models in MongoDB.

## 🧪 Testing

```bash
# Unit tests
pnpm test

# Tests with coverage
pnpm test:cov

# End-to-end tests
pnpm test:e2e
```

## 📖 Documentation

### API Documentation

- **GraphQL Playground**: http://localhost:4100/graphql
- **GraphQL Schema**: Automatically generated in `apps/api/src/schema.gql`

### Context Documentation

Each bounded context includes its own README with detailed documentation:

- **Auth**: `apps/api/src/auth-context/auth/README.md`
- **User**: `apps/api/src/user-context/users/README.md`
- **Saga**: `apps/api/src/saga-context/README.md`

### SDK Documentation

See the SDK README at `packages/sdk/README.md` for complete usage examples.

## 🔧 Editor Configuration

The project includes shared configurations for:

- **ESLint**: Configuration in `packages/eslint-config`
- **TypeScript**: Configurations in `packages/typescript-config`
- **Prettier**: Global configuration

## 🚢 Deployment

### API

1. Configure production environment variables
2. Run TypeORM migrations
3. Build: `pnpm build --filter=api`
4. Start: `pnpm start --filter=api`

### Web App

1. Build: `pnpm build --filter=web`
2. Start: `pnpm start --filter=web`

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is an open-source project starter. See the LICENSE file for more details.

## 🎯 Roadmap

- [ ] Webhooks for external events
- [ ] Notifications (email, push, SMS)
- [ ] Analytics and metrics
- [ ] Complete E2E tests
- [ ] Improved API documentation
- [ ] Docker and Docker Compose
- [ ] CI/CD pipelines

## 📞 Support

For questions or support, open an issue in the repository.

---

**Built with ❤️ using software architecture best practices**

# @repo/sdk

TypeScript SDK for the project-starter GraphQL API. Compatible with React Native and web applications. Provides automatic token management, type-safe GraphQL operations, and React hooks.

## 🚀 Features

- 🔐 **Authentication**: Login, register, logout, token refresh, profile management
- 👥 **User Management**: CRUD operations with filtering, sorting, and pagination
- 🌱 **Plant Management**: CRUD operations for plants with status management
- 🪴 **Container Management**: CRUD operations for containers (pots, garden beds, etc.)
- 📊 **Saga Management**: Complete saga orchestration (instances, steps, logs)
- 🏥 **Health Checks**: Monitor API status
- ⚛️ **React Hooks**: Ready-to-use hooks with loading, error, and data states
- 🔄 **Automatic Token Management**: Tokens are automatically stored and refreshed
- 📦 **TypeScript**: Full type definitions for all operations
- 🌐 **GraphQL**: Type-safe GraphQL client with automatic token injection

## 📦 Installation

```bash
pnpm add @repo/sdk
```

## 📋 Prerequisites

- **Node.js**: >= 18
- **React**: ^18.0.0 || ^19.0.0 (for React hooks)

## 🏗️ Architecture

The SDK is built with:

- **GraphQL Client**: Custom client that handles token management and automatic refresh
- **Storage**: Pluggable storage interface (WebStorage for browsers, MemoryStorage for server-side)
- **React Hooks**: Hooks built on top of the SDK for React applications
- **Type Safety**: Full TypeScript support with generated types

## 🚀 Quick Start

### Basic Setup

```typescript
import { SDK } from '@repo/sdk';

// For Next.js / Web (uses localStorage automatically)
const sdk = new SDK({
  apiUrl: 'http://localhost:4100', // Base URL (without /graphql)
});

// For React Native (pass AsyncStorage)
import AsyncStorage from '@react-native-async-storage/async-storage';

const sdk = new SDK({
  apiUrl: 'http://localhost:4100',
  storage: AsyncStorage, // Custom storage for React Native
});
```

**Note**: The `apiUrl` should be the base URL of your API. The SDK automatically appends `/graphql` to all requests.

### Configuration

```typescript
type GraphQLClientConfig = {
  apiUrl: string; // Base API URL (e.g., 'http://localhost:4100')
  accessToken?: string; // Optional initial access token
  refreshToken?: string; // Optional initial refresh token
  headers?: Record<string, string>; // Optional custom headers
  storage?: Storage; // Optional custom storage implementation
  storagePrefix?: string; // Optional storage key prefix (default: '@repo/sdk:')
};
```

## 📖 Usage

### Authentication

```typescript
// Login - tokens are automatically saved to storage
const { accessToken, refreshToken } = await sdk.auth.loginByEmail({
  email: 'user@example.com',
  password: 'password123',
});

// Tokens are automatically stored and used in subsequent requests
// No need to manually set the token!

// Register
const registerResult = await sdk.auth.registerByEmail({
  email: 'newuser@example.com',
  password: 'password123',
});

// Get current user profile
const profile = await sdk.auth.profileMe();

// Refresh token (automatic on 401 errors, but can be manual)
const { accessToken: newToken } = await sdk.auth.refreshToken({
  refreshToken: 'your-refresh-token',
});

// Logout - clears all stored tokens
await sdk.auth.logout({ id: 'user-id' });
```

### Users

```typescript
// Find user by ID
const user = await sdk.users.findById({ id: 'user-id' });

// Find users with filters, sorting, and pagination
const users = await sdk.users.findByCriteria({
  filters: [{ field: 'status', operator: 'EQUALS', value: 'ACTIVE' }],
  sorts: [{ field: 'name', direction: 'ASC' }],
  pagination: { page: 1, perPage: 10 },
});

// Create user
const createResult = await sdk.users.create({
  name: 'John Doe',
  role: 'USER',
  status: 'ACTIVE',
});

// Update user
const updateResult = await sdk.users.update({
  id: 'user-id',
  name: 'Jane Doe',
});

// Delete user
const deleteResult = await sdk.users.delete({ id: 'user-id' });
```

### Saga Instances

```typescript
// Find saga instances
const instances = await sdk.sagaInstances.findByCriteria({
  filters: [{ field: 'status', operator: 'EQUALS', value: 'RUNNING' }],
  pagination: { page: 1, perPage: 10 },
});

// Find by ID
const instance = await sdk.sagaInstances.findById({ id: 'instance-id' });

// Create saga instance
const newInstance = await sdk.sagaInstances.create({
  name: 'Order Processing',
  context: { orderId: '123' },
});

// Update saga instance
await sdk.sagaInstances.update({
  id: 'instance-id',
  name: 'Updated Name',
});

// Change status
await sdk.sagaInstances.changeStatus({
  id: 'instance-id',
  status: 'COMPLETED',
});

// Delete saga instance
await sdk.sagaInstances.delete({ id: 'instance-id' });
```

### Saga Steps

```typescript
// Find saga steps by criteria
const steps = await sdk.sagaSteps.findByCriteria({
  pagination: { page: 1, perPage: 10 },
});

// Find by saga instance ID
const instanceSteps = await sdk.sagaSteps.findBySagaInstanceId({
  sagaInstanceId: 'instance-id',
});

// Create saga step
const step = await sdk.sagaSteps.create({
  sagaInstanceId: 'instance-id',
  name: 'Payment Step',
  order: 1,
});

// Update saga step
await sdk.sagaSteps.update({
  id: 'step-id',
  name: 'Updated Step Name',
});

// Change status
await sdk.sagaSteps.changeStatus({
  id: 'step-id',
  status: 'COMPLETED',
});

// Delete saga step
await sdk.sagaSteps.delete({ id: 'step-id' });
```

### Saga Logs

```typescript
// Find saga logs
const logs = await sdk.sagaLogs.findByCriteria({
  pagination: { page: 1, perPage: 10 },
});

// Find by saga instance ID
const instanceLogs = await sdk.sagaLogs.findBySagaInstanceId({
  sagaInstanceId: 'instance-id',
});

// Find by saga step ID
const stepLogs = await sdk.sagaLogs.findBySagaStepId({
  sagaStepId: 'step-id',
});

// Create saga log
const log = await sdk.sagaLogs.create({
  sagaInstanceId: 'instance-id',
  sagaStepId: 'step-id',
  type: 'INFO',
  message: 'Step completed successfully',
});

// Update saga log
await sdk.sagaLogs.update({
  id: 'log-id',
  message: 'Updated log message',
});

// Delete saga log
await sdk.sagaLogs.delete({ id: 'log-id' });
```

### Health Check

```typescript
const health = await sdk.health.check();
console.log(health.status); // 'ok' | 'error'
```

## ⚛️ React Hooks

For React applications, the SDK provides hooks that manage loading, error, and data states automatically.

### Setup SDK Provider

```typescript
import { SDKAutoProvider } from '@repo/sdk/react';

function App() {
  return (
    <SDKAutoProvider apiUrl="http://localhost:4100">
      <YourApp />
    </SDKAutoProvider>
  );
}
```

Or with custom storage (React Native):

```typescript
import { SDKAutoProvider } from '@repo/sdk/react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  return (
    <SDKAutoProvider apiUrl="http://localhost:4100" storage={AsyncStorage}>
      <YourApp />
    </SDKAutoProvider>
  );
}
```

### Using Hooks

```typescript
import { useAuth, useUsers, useUsersList } from '@repo/sdk/react';

function MyComponent() {
  // Auth hook
  const { loginByEmail, profileMe } = useAuth();

  // Users list hook - automatically fetches on mount
  const usersList = useUsersList();

  // Users operations hook
  const { findById, create, update, delete: deleteUser } = useUsers();

  // Handle login
  const handleLogin = async () => {
    await loginByEmail.execute({
      email: 'user@example.com',
      password: 'password123',
    });
  };

  // Render with states
  if (loginByEmail.loading) return <div>Logging in...</div>;
  if (loginByEmail.error) return <div>Error: {loginByEmail.error.message}</div>;
  if (loginByEmail.success && loginByEmail.data) {
    // Tokens are automatically saved!
  }

  if (usersList.loading) return <div>Loading users...</div>;
  if (usersList.error) return <div>Error: {usersList.error.message}</div>;
  if (usersList.data) {
    return (
      <div>
        {usersList.data.items.map(user => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    );
  }

  return null;
}
```

### Available React Hooks

#### Core Hooks

- `useSDK(config, storage?)` - Create an SDK instance (use within component, not in provider)
- `useSDKContext()` - Get SDK instance from context (requires SDKProvider)
- `useSDKOptional()` - Get SDK instance from context, returns null if not available

#### Module Hooks

- `useAuth()` - Authentication operations (loginByEmail, registerByEmail, logout, refreshToken, profileMe)
- `useUsers()` - User operations (findById, findByCriteria, create, update, delete)
- `useUsersList(input?)` - Auto-fetch users list with pagination and filters
- `usePlants()` - Plant operations (findById, findByCriteria, create, update, delete, changeStatus)
- `usePlantsList(input?)` - Auto-fetch plants list with pagination and filters
- `useContainers()` - Container operations (findById, findByCriteria, create, update, delete)
- `useContainersList(input?)` - Auto-fetch containers list with pagination and filters
- `useHealth()` - Health check operations (check)
- `useSagaInstances()` - Saga instance operations (findById, findByCriteria, create, update, changeStatus, delete)
- `useSagaInstancesList(input?)` - Auto-fetch saga instances list
- `useSagaSteps()` - Saga step operations (findById, findByCriteria, findBySagaInstanceId, create, update, changeStatus, delete)
- `useSagaStepsList(input?)` - Auto-fetch saga steps list
- `useSagaLogs()` - Saga log operations (findById, findByCriteria, findBySagaInstanceId, findBySagaStepId, create, update, delete)
- `useSagaLogsList(input?)` - Auto-fetch saga logs list

### Hook States

Each hook returns an object with:

- `data`: The response data (or null) - **Use this to render your UI**
- `error`: Error object (or null) - **Use this to show error messages**
- `loading`: Boolean indicating if request is in progress - **Use this to show loading spinners**
- `success`: Boolean indicating if request completed successfully - **Use this for success feedback**
- `execute` or `fetch`/`mutate`: Function to trigger the operation
- `reset`: Function to reset all states

## 🔄 Token Management

### Automatic Token Storage

The SDK automatically handles token storage:

- **Web/Next.js**: Uses `localStorage` automatically (via WebStorage)
- **React Native**: Pass `AsyncStorage` as custom storage
- **Server-side**: Falls back to memory storage (tokens are not persisted)

### Token Lifecycle

1. **Login**: Tokens are automatically saved to storage
2. **Requests**: Access token is automatically included in all requests
3. **Refresh**: On 401 errors, the SDK automatically attempts to refresh the token
4. **Logout**: All tokens are cleared from storage

### Manual Token Management

```typescript
// Set access token manually
await sdk.setAccessToken('your-token');

// Get current access token
const token = sdk.getAccessToken();

// Set refresh token manually
await sdk.setRefreshToken('your-refresh-token');

// Get current refresh token
const refreshToken = sdk.getRefreshToken();

// Clear all tokens
await sdk.logout();
```

## 🔍 Filter Operators

When using `findByCriteria`, you can use the following filter operators:

- `EQUALS` - Exact match
- `NOT_EQUALS` - Not equal
- `LIKE` - Pattern matching (SQL LIKE)
- `IN` - Value is in array
- `GREATER_THAN` - Numeric/date comparison
- `LESS_THAN` - Numeric/date comparison
- `GREATER_THAN_OR_EQUAL` - Numeric/date comparison
- `LESS_THAN_OR_EQUAL` - Numeric/date comparison

## 📊 Sort Directions

- `ASC` - Ascending order
- `DESC` - Descending order

## 📜 Available Scripts

From the project root:

```bash
# Build the SDK
pnpm build --filter=@repo/sdk

# Watch mode (development)
pnpm dev --filter=@repo/sdk

# Type checking
pnpm check-types --filter=@repo/sdk

# Format code
pnpm format --filter=@repo/sdk

# Lint code
pnpm lint --filter=@repo/sdk
```

## 🔧 Custom Storage

You can implement a custom storage interface:

```typescript
import type { Storage } from '@repo/sdk';

class CustomStorage implements Storage {
  async getItem(key: string): Promise<string | null> {
    // Your implementation
  }

  async setItem(key: string, value: string): Promise<void> {
    // Your implementation
  }

  async removeItem(key: string): Promise<void> {
    // Your implementation
  }
}

const sdk = new SDK({
  apiUrl: 'http://localhost:4100',
  storage: new CustomStorage(),
});
```

## 🌐 React Native Example

```typescript
import { SDKAutoProvider, useAuth, useUsersList } from '@repo/sdk/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, Button } from 'react-native';

function MyScreen() {
  const { loginByEmail } = useAuth();
  const usersList = useUsersList(); // Auto-fetches on mount

  const handleLogin = () => {
    loginByEmail.execute({
      email: 'user@example.com',
      password: 'password123',
    });
  };

  return (
    <View>
      <Button title="Login" onPress={handleLogin} disabled={loginByEmail.loading} />

      {loginByEmail.loading && <ActivityIndicator />}
      {loginByEmail.error && <Text>Error: {loginByEmail.error.message}</Text>}
      {loginByEmail.success && <Text>Logged in!</Text>}

      {usersList.loading && <ActivityIndicator />}
      {usersList.error && <Text>Error: {usersList.error.message}</Text>}
      {usersList.data && (
        <View>
          {usersList.data.items.map(user => (
            <Text key={user.id}>{user.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

function App() {
  return (
    <SDKAutoProvider apiUrl="https://api.example.com" storage={AsyncStorage}>
      <MyScreen />
    </SDKAutoProvider>
  );
}
```

## 📚 TypeScript Support

The SDK is written in TypeScript and provides full type definitions for:

- All operations (methods and their parameters)
- All responses (return types)
- All input types (mutations and queries)
- React hooks and their return types

## 🐛 Error Handling

The SDK throws errors for:

- Network errors (connection issues)
- GraphQL errors (API errors)
- Authentication errors (401, invalid tokens)
- Validation errors (invalid input)

All errors include a descriptive message and can be caught using try/catch or checked via the `error` state in React hooks.

## 📝 License

This package is part of the project-starter monorepo. See the root LICENSE file for details.

## 🤝 Contributing

When contributing to the SDK:

1. Follow the existing code structure
2. Add TypeScript types for all new operations
3. Update this README with new features
4. Add React hooks for new modules if applicable
5. Ensure compatibility with both web and React Native

# Testing Documentation

This document provides comprehensive guidance on testing in the web application.

## Table of Contents

- [Overview](#overview)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
  - [Testing Components](#testing-components)
  - [Testing Hooks](#testing-hooks)
  - [Testing Utilities](#testing-utilities)
- [Mocking Dependencies](#mocking-dependencies)
- [Coverage Guidelines](#coverage-guidelines)
- [Best Practices](#best-practices)

## Overview

The web application uses the following testing stack:

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/react-hooks**: Hook testing utilities (deprecated but still used for some cases)
- **jsdom**: Browser environment simulation

### Tech Stack

- **Next.js**: 16.0.0
- **React**: 19.2.1
- **TypeScript**: 5.9.2
- **Jest**: Latest (via Next.js integration)
- **React Testing Library**: Latest

## Running Tests

### Basic Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (interactive)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests in CI mode (with coverage, limited workers)
pnpm test:ci
```

### From Root Directory

```bash
# Run all tests across the monorepo
pnpm test

# Run only web tests
turbo run test --filter=web
```

### Running Specific Tests

```bash
# Run tests in a specific file
pnpm test path/to/test.test.ts

# Run tests matching a pattern
pnpm test --testNamePattern="should render"

# Run tests for a specific directory
pnpm test features/auth
```

## Writing Tests

### Testing Components

Components should be tested using React Testing Library with a focus on user behavior rather than implementation details.

#### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('should handle click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button')
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Testing Component with Props

```typescript
import { render, screen } from '@testing-library/react'
import { Alert } from '../alert'

describe('Alert', () => {
  it('should render with different variants', () => {
    const { rerender } = render(<Alert variant="success">Success!</Alert>)
    expect(screen.getByText('Success!')).toBeInTheDocument()

    rerender(<Alert variant="error">Error!</Alert>)
    expect(screen.getByText('Error!')).toBeInTheDocument()
  })
})
```

#### Testing Components with Context

```typescript
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserProfile } from '../user-profile'

describe('UserProfile', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )

  it('should display user information', () => {
    render(<UserProfile userId="123" />, { wrapper })
    // Your assertions here
  })
})
```

### Testing Hooks

Custom hooks should be tested using `renderHook` from React Testing Library.

#### Basic Hook Test

```typescript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from '../use-counter'

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter())

    expect(result.current.count).toBe(0)

    act(() => {
      result.current.increment()
    })

    expect(result.current.count).toBe(1)
  })
})
```

#### Testing Hooks with Dependencies

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthLogin } from '../use-auth-login'

jest.mock('next/navigation')
jest.mock('../../api/auth-api.client')

describe('useAuthLogin', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  it('should handle successful login', async () => {
    const { result } = renderHook(() => useAuthLogin(), { wrapper })

    await result.current.handleLogin({
      email: 'test@example.com',
      password: 'password123',
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
  })
})
```

### Testing Utilities

Utility functions should be tested with straightforward unit tests.

```typescript
import { cn, paginate } from '../utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('foo', 'bar')
      expect(result).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      const result = cn('foo', false && 'bar', 'baz')
      expect(result).toBe('foo baz')
    })
  })

  describe('paginate', () => {
    it('should paginate items correctly', () => {
      const items = [1, 2, 3, 4, 5]
      const result = paginate(items, 1, 2)

      expect(result.items).toEqual([1, 2])
      expect(result.totalPages).toBe(3)
    })
  })
})
```

## Mocking Dependencies

### Mocking Next.js Navigation

The `jest.setup.ts` file automatically mocks `next/navigation`:

```typescript
// This is already configured in jest.setup.ts
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))
```

To customize in a specific test:

```typescript
import { useRouter } from 'next/navigation'

jest.mock('next/navigation')

const mockPush = jest.fn()
;(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
})
```

### Mocking next-intl

Also automatically mocked in `jest.setup.ts`:

```typescript
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))
```

### Mocking API Clients

```typescript
jest.mock('../../api/auth-api.client')

import { authApiClient } from '../../api/auth-api.client'

describe('MyComponent', () => {
  it('should call API', async () => {
    ;(authApiClient.login as jest.Mock).mockResolvedValue({
      accessToken: 'token',
    })

    // Your test here
  })
})
```

### Mocking Environment Variables

```typescript
describe('MyComponent', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_URL: 'http://test-api.com',
    }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should use environment variable', () => {
    // Your test here
  })
})
```

## Coverage Guidelines

### Coverage Thresholds

The project enforces **80% coverage** across all metrics:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### What's Excluded from Coverage

The following files are excluded from coverage reports:

- `**/*.d.ts` - Type definition files
- `**/node_modules/**` - Dependencies
- `**/.next/**` - Next.js build output
- `**/coverage/**` - Coverage reports
- `**/app/**/layout.tsx` - Next.js layout files
- `**/app/**/page.tsx` - Next.js page files (entry points)
- `**/app/**/not-found.tsx` - Error pages
- `**/app/**/error.tsx` - Error boundaries
- `**/app/**/loading.tsx` - Loading states
- `**/*.config.{ts,js,mjs}` - Configuration files
- `**/lib/i18n/request.ts` - Internationalization setup
- `**/lib/i18n/routing.ts` - Route configuration

### Viewing Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# Open HTML coverage report in browser
open coverage/lcov-report/index.html
```

### Coverage Best Practices

1. **Focus on business logic**: Prioritize testing complex business logic over simple getters/setters
2. **Test edge cases**: Ensure edge cases and error paths are covered
3. **Don't game the metrics**: Write meaningful tests, not just tests to increase coverage
4. **Review coverage reports**: Use coverage reports to identify untested code paths

## Best Practices

### General Testing Principles

1. **Test behavior, not implementation**
   - Focus on what the user sees and does
   - Avoid testing internal state or implementation details
   - Use accessible queries (getByRole, getByLabelText, etc.)

2. **Write descriptive test names**
   ```typescript
   // Good
   it('should display error message when login fails')

   // Bad
   it('test login')
   ```

3. **Arrange-Act-Assert pattern**
   ```typescript
   it('should update username', () => {
     // Arrange
     const { result } = renderHook(() => useForm())

     // Act
     act(() => {
       result.current.setUsername('john')
     })

     // Assert
     expect(result.current.username).toBe('john')
   })
   ```

4. **Keep tests isolated**
   - Each test should be independent
   - Use `beforeEach` and `afterEach` for setup/cleanup
   - Clear mocks between tests

### Component Testing Best Practices

1. **Use semantic queries** (in order of preference):
   - `getByRole` (most preferred)
   - `getByLabelText`
   - `getByPlaceholderText`
   - `getByText`
   - `getByTestId` (last resort)

2. **Use userEvent over fireEvent**
   ```typescript
   // Good
   const user = userEvent.setup()
   await user.click(button)

   // Less good
   fireEvent.click(button)
   ```

3. **Wait for async updates**
   ```typescript
   await waitFor(() => {
     expect(screen.getByText('Success')).toBeInTheDocument()
   })
   ```

### Hook Testing Best Practices

1. **Wrap in act() for state updates**
   ```typescript
   act(() => {
     result.current.increment()
   })
   ```

2. **Use waitFor for async operations**
   ```typescript
   await waitFor(() => {
     expect(result.current.data).toBeDefined()
   })
   ```

3. **Provide necessary context**
   ```typescript
   const wrapper = ({ children }: { children: React.ReactNode }) => (
     <QueryClientProvider client={queryClient}>
       {children}
     </QueryClientProvider>
   )

   renderHook(() => useMyHook(), { wrapper })
   ```

### Mocking Best Practices

1. **Mock at the module level**
   ```typescript
   jest.mock('../../api/client')
   ```

2. **Reset mocks between tests**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks()
   })
   ```

3. **Type your mocks**
   ```typescript
   const mockFn = jest.fn() as jest.MockedFunction<typeof originalFn>
   ```

### Debugging Tests

1. **Use screen.debug()**
   ```typescript
   import { screen } from '@testing-library/react'

   screen.debug() // Prints the DOM tree
   ```

2. **Use logRoles**
   ```typescript
   import { logRoles } from '@testing-library/react'

   const { container } = render(<Component />)
   logRoles(container) // Prints available roles
   ```

3. **Run single test**
   ```bash
   pnpm test -- --testNamePattern="should render button"
   ```

4. **Use verbose output**
   ```bash
   pnpm test -- --verbose
   ```

## Common Patterns

### Testing Forms

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../login-form'

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    const handleSubmit = jest.fn()
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /submit/i }))

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

### Testing Async Data Fetching

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserList } from '../user-list'
import { apiClient } from '../../api/client'

jest.mock('../../api/client')

describe('UserList', () => {
  it('should display users after loading', async () => {
    const mockUsers = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' },
    ]

    ;(apiClient.getUsers as jest.Mock).mockResolvedValue(mockUsers)

    const queryClient = new QueryClient()

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    )

    expect(screen.getByText(/loading/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Jane')).toBeInTheDocument()
    })
  })
})
```

### Testing Error States

```typescript
it('should display error message on failure', async () => {
  const error = new Error('Failed to load')
  ;(apiClient.getUsers as jest.Mock).mockRejectedValue(error)

  render(
    <QueryClientProvider client={queryClient}>
      <UserList />
    </QueryClientProvider>
  )

  await waitFor(() => {
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })
})
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing Documentation](https://nextjs.org/docs/app/building-your-application/testing/jest)

## Support

If you encounter issues with the testing setup:

1. Check that all dependencies are installed: `pnpm install`
2. Verify Jest configuration in `jest.config.ts`
3. Check setup file in `jest.setup.ts`
4. Review TypeScript configuration in `tsconfig.json`
5. Consult the [Jest troubleshooting guide](https://jestjs.io/docs/troubleshooting)

For project-specific questions, reach out to the development team.

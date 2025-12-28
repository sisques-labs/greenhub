# @repo/shared

Shared package containing domain value objects, UI components, utilities, and presentation layer code for the project-starter monorepo.

## 🚀 Features

- 🎨 **UI Components**: Complete component library built on Radix UI and Tailwind CSS
- 🏗️ **Domain Layer**: Value objects, entities, exceptions, and interfaces
- 🔧 **Utilities**: Helpers, hooks, and services
- 📐 **Templates**: Page templates and layout components
- 🎯 **Type Safety**: Full TypeScript support
- ♿ **Accessibility**: Built with accessibility in mind (Radix UI)

## 📦 Installation

This package is part of the monorepo workspace and is automatically available to other packages and apps. To use it in your app:

```typescript
import { Button } from '@repo/shared/presentation/components/ui/button';
import { UuidValueObject } from '@repo/shared/domain/value-objects/uuid.vo';
```

## 📋 Prerequisites

- **React**: ^19.0.0
- **Tailwind CSS**: ^4.0.0
- **TypeScript**: ^5.0.0

## 🏗️ Package Structure

```
packages/shared/
├── src/
│   ├── domain/              # Domain layer (shared business logic)
│   │   ├── entities/        # Domain entities (Criteria, PaginatedResult)
│   │   ├── enums/          # Domain enums (FilterOperator, SortDirection)
│   │   ├── exceptions/     # Domain exceptions
│   │   ├── interfaces/     # Domain interfaces
│   │   └── value-objects/  # Value objects (UUID, Email, Date, etc.)
│   ├── application/        # Application layer (shared services)
│   │   ├── exceptions/     # Application exceptions
│   │   └── services/       # Application services
│   └── presentation/       # Presentation layer (UI components)
│       ├── components/     # React components
│       │   ├── ui/         # Base UI components (shadcn/ui based)
│       │   ├── molecules/  # Molecule components
│       │   ├── organisms/  # Organism components
│       │   └── templates/  # Page templates
│       ├── hooks/          # Custom React hooks
│       ├── lib/            # Utility functions
│       ├── mappers/        # Data mappers
│       ├── providers/      # React providers
│       └── styles/         # Global styles
```

## 🎨 UI Components

The package includes a comprehensive set of UI components built on top of Radix UI primitives and styled with Tailwind CSS.

### Base UI Components

Located in `presentation/components/ui/`, these are the building blocks:

- **Layout**: Sidebar, Sheet, Separator, Resizable
- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Label, Form, Field
- **Feedback**: Alert, Alert Dialog, Dialog, Toast (Sonner), Progress, Spinner, Skeleton
- **Navigation**: Breadcrumb, Tabs, Navigation Menu, Menubar, Command, Pagination
- **Data Display**: Table, Data Table, Card, Badge, Avatar, Accordion, Collapsible
- **Overlays**: Popover, Tooltip, Hover Card, Dropdown Menu, Context Menu, Drawer
- **Date & Time**: Calendar, Date Picker
- **Other**: Slider, Toggle, Input OTP, Carousel, Chart, Globe, Empty, KBD

### Using UI Components

```typescript
import { Button } from '@repo/shared/presentation/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/shared/presentation/components/ui/card';
import { Input } from '@repo/shared/presentation/components/ui/input';

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Enter text..." />
        <Button>Submit</Button>
      </CardContent>
    </Card>
  );
}
```

### Molecules

Reusable component combinations:

- `GenericModal` - Generic modal component with customizable content

### Organisms

Complex components built from molecules and atoms:

- `AppSidebar` - Application sidebar with navigation
- `DynamicFilters` - Dynamic filter component with operators
- `PageHeader` - Page header with title and actions
- `SearchForm` - Search form component
- `TableLayout` - Table layout with pagination and filters

### Templates

Page-level templates:

- `PageTemplate` - Standard page template
- `PageWithSidebarTemplate` - Page template with sidebar layout

## 🏛️ Domain Layer

### Value Objects

Type-safe domain value objects with validation:

- **Identifiers**: `UuidValueObject`, `AuthUuidValueObject`, `UserUuidValueObject`
- **Strings**: `StringValueObject`, `EmailValueObject`, `UrlValueObject`, `SlugValueObject`
- **Numbers**: `NumberValueObject`
- **Dates**: `DateValueObject`
- **Enums**: `EnumValueObject`
- **Special**: `BooleanValueObject`, `HexValueObject`, `IpValueObject`, `JsonValueObject`, `LocaleValueObject`, `PasswordValueObject`, `PhoneValueObject`, `PhoneCodeValueObject`, `TimezoneValueObject`, `ColorValueObject`

#### Example Usage

```typescript
import { EmailValueObject } from '@repo/shared/domain/value-objects/email.vo';
import { UuidValueObject } from '@repo/shared/domain/value-objects/uuid.vo';
import { DateValueObject } from '@repo/shared/domain/value-objects/date.vo';

// Create value objects with validation
const email = new EmailValueObject('user@example.com'); // ✅ Valid
const id = new UuidValueObject(); // Generates new UUID
const date = new DateValueObject(new Date());

// Access the value
console.log(email.value); // 'user@example.com'
console.log(id.value); // 'uuid-string'

// Invalid values throw exceptions
try {
  new EmailValueObject('invalid-email'); // ❌ Throws InvalidEmailException
} catch (error) {
  // Handle validation error
}
```

### Entities

- `Criteria` - Query criteria with filters, sorts, and pagination
- `PaginatedResult<T>` - Paginated query result

#### Example Usage

```typescript
import { Criteria } from '@repo/shared/domain/entities/criteria';
import { PaginatedResult } from '@repo/shared/domain/entities/paginated-result.entity';

const criteria = new Criteria(
  [{ field: 'status', operator: 'EQUALS', value: 'ACTIVE' }],
  [{ field: 'name', direction: 'ASC' }],
  { page: 1, perPage: 10 },
);

const result = new PaginatedResult(items, total, page, perPage);
```

### Enums

- `FilterOperator` - Filter operators (EQUALS, NOT_EQUALS, LIKE, IN, etc.)
- `SortDirection` - Sort directions (ASC, DESC)

### Exceptions

Domain and application exceptions:

- **Domain Exceptions**: `BaseDomainException` and specific exceptions for value object validation
- **Application Exceptions**: `BaseApplicationException`

## 🔧 Utilities

### Hooks

Custom React hooks located in `presentation/hooks/`:

- `useDebouncedFilters` - Debounce filter changes
- `useFilterOperators` - Get available filter operators
- `useMobile` - Detect mobile devices

### Services

Application services in `application/services/`:

- `FormatDateService` - Date formatting service

### Utils

Utility functions in `presentation/lib/`:

- `cn` - Utility for merging Tailwind CSS classes (using `clsx` and `tailwind-merge`)

```typescript
import { cn } from '@repo/shared/presentation/lib/utils';

const className = cn(
  'base-class',
  condition && 'conditional-class',
  'another-class',
);
```

### Mappers

Data mappers in `presentation/mappers/`:

- `convertFilters` - Convert filter format
- `convertSorts` - Convert sort format

### Providers

React providers in `presentation/providers/`:

- `QueryClientProvider` - React Query client provider

## 📐 Templates

### PageTemplate

Standard page template with consistent layout:

```typescript
import { PageTemplate } from '@repo/shared/presentation/components/templates/page-template';

function MyPage() {
  return (
    <PageTemplate>
      <h1>My Page Content</h1>
    </PageTemplate>
  );
}
```

### PageWithSidebarTemplate

Page template with sidebar layout:

```typescript
import { PageWithSidebarTemplate } from '@repo/shared/presentation/components/templates/page-with-sidebar-template';

function MyPageWithSidebar() {
  return (
    <PageWithSidebarTemplate sidebar={<MySidebar />}>
      <h1>My Page Content</h1>
    </PageWithSidebarTemplate>
  );
}
```

## 🎨 Styling

The package uses Tailwind CSS 4 for styling. Global styles are available in `presentation/styles/globals.css`.

### Importing Styles

```typescript
import '@repo/shared/presentation/styles/globals.css';
```

### Dark Mode

All components support dark mode through the `next-themes` package. Use the `ThemeProvider` to enable dark mode:

```typescript
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <YourApp />
    </ThemeProvider>
  );
}
```

## 📜 Available Scripts

From the project root:

```bash
# Build the shared package
pnpm build --filter=@repo/shared

# Type checking
pnpm check-types --filter=@repo/shared

# Format code
pnpm format --filter=@repo/shared

# Lint code
pnpm lint --filter=@repo/shared

# Generate new component (using Turborepo generator)
pnpm generate:component --filter=@repo/shared
```

## 📦 Exports

The package uses package.json exports for fine-grained imports:

```typescript
// Domain exports
import { UuidValueObject } from '@repo/shared/domain/value-objects/uuid.vo';
import { Criteria } from '@repo/shared/domain/entities/criteria';

// UI component exports
import { Button } from '@repo/shared/presentation/components/ui/button';
import { Card } from '@repo/shared/presentation/components/ui/card';

// Utility exports
import { cn } from '@repo/shared/presentation/lib/utils';
```

## 🔍 Component Structure

Components follow atomic design principles:

- **Atoms**: Basic building blocks (Button, Input, etc.)
- **Molecules**: Simple combinations (GenericModal)
- **Organisms**: Complex components (AppSidebar, TableLayout)
- **Templates**: Page-level layouts (PageTemplate, PageWithSidebarTemplate)

## 🎯 TypeScript Support

All components and utilities are fully typed with TypeScript. Type definitions are automatically generated and exported.

## ♿ Accessibility

All UI components are built on Radix UI primitives, which provide:

- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader support

## 📚 Resources

- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Hook Form Documentation](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

## 🤝 Contributing

When contributing to the shared package:

1. Follow atomic design principles for components
2. Add TypeScript types for all new components and utilities
3. Ensure accessibility (use Radix UI primitives)
4. Add proper documentation and examples
5. Update this README with new features
6. Follow the existing code structure and naming conventions

## 📝 License

This package is part of the project-starter monorepo. See the root LICENSE file for details.

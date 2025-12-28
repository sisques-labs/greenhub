# Auth Module

A comprehensive authentication and authorization module that provides secure user authentication, JWT token management, and role-based access control. This module follows Clean Architecture principles, implements CQRS (Command Query Responsibility Segregation) pattern, and uses Domain-Driven Design (DDD).

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Domain Model](#domain-model)
- [Commands](#commands)
- [Queries](#queries)
- [Events](#events)
- [JWT Authentication](#jwt-authentication)
- [Guards and Authorization](#guards-and-authorization)
- [Repositories](#repositories)
- [GraphQL API](#graphql-api)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

## Overview

The Auth Module is responsible for managing user authentication and authorization throughout the application. It handles user registration, login, password management, JWT token generation, and provides guards for protecting routes and resources.

### What This Module Does

- **User Registration**: Creates new user accounts with email and password
- **User Login**: Authenticates users and generates JWT tokens
- **Token Management**: Generates, verifies, and refreshes JWT access and refresh tokens
- **Password Security**: Hashes passwords using bcrypt and verifies them securely
- **Authorization**: Provides guards for role-based access control
- **Multi-Provider Support**: Supports LOCAL, GOOGLE, and APPLE authentication providers
- **Event-Driven**: Publishes domain events for authentication state changes

## Architecture

The module is organized following Clean Architecture principles with clear separation of concerns:

```
auth/
├── application/              # Application layer (CQRS)
│   ├── commands/            # Command handlers (write operations)
│   │   ├── auth-create/
│   │   ├── auth-delete/
│   │   ├── auth-login-by-email/
│   │   ├── auth-refresh-token/
│   │   ├── auth-register-by-email/
│   │   └── auth-update/
│   ├── queries/             # Query handlers (read operations)
│   │   └── find-auths-by-criteria/
│   ├── event-handlers/      # Event handlers (async processing)
│   │   ├── auth-created/
│   │   ├── auth-logged-in-by-email/
│   │   ├── auth-registered-by-email/
│   │   └── auth-updated/
│   ├── sagas/              # Saga orchestration
│   │   └── auth-registration/
│   ├── services/           # Application services
│   │   ├── assert-auth-email-exists/
│   │   ├── assert-auth-email-not-exists/
│   │   ├── assert-auth-exists/
│   │   ├── assert-auth-view-model-exists/
│   │   ├── jwt-auth/
│   │   └── password-hashing/
│   └── exceptions/         # Application exceptions
├── domain/                  # Domain layer
│   ├── aggregate/          # Auth aggregate (business logic)
│   ├── repositories/       # Repository interfaces
│   ├── value-objects/      # Value objects (validation)
│   ├── view-models/        # Read models
│   ├── factories/          # Domain factories
│   ├── interfaces/         # Domain interfaces
│   ├── enums/             # Domain enums
│   └── primitives/        # Domain primitives
├── infrastructure/         # Infrastructure layer
│   ├── auth/              # Auth infrastructure
│   ├── database/          # Database repositories
│   │   ├── typeorm/       # Write repository (TypeORM/PostgreSQL)
│   │   └── mongodb/       # Read repository (MongoDB)
│   ├── decorators/        # Decorators
│   ├── guards/            # Authorization guards
│   └── strategies/        # Passport strategies
└── transport/             # Transport layer
    └── graphql/          # GraphQL resolvers and DTOs
```

### Architecture Patterns

#### CQRS (Command Query Responsibility Segregation)

- **Commands**: Write operations that modify state (create, update, delete, login, register)
- **Queries**: Read operations that only query data (findByCriteria)
- **Write Repository**: TypeORM-based repository for write operations (PostgreSQL)
- **Read Repository**: MongoDB-based repository for read operations (optimized for queries)

#### Event-Driven Architecture

The module publishes domain events for important state changes:

- `AuthCreatedEvent` - Published when an auth record is created
- `AuthLoggedInByEmailEvent` - Published when a user logs in
- `AuthRegisteredByEmailEvent` - Published when a user registers
- `AuthUpdatedEvent` - Published when auth is updated
- `AuthUpdatedLastLoginAtEvent` - Published when last login timestamp is updated

Events are handled asynchronously by event handlers to update read models in MongoDB.

#### Global Module

The Auth Module is marked as `@Global()`, which means:

- Guards and services are available throughout the application
- Other modules can use the guards without importing AuthModule
- JWT strategy and guards are automatically available

## Features

- ✅ User registration by email with password
- ✅ User login by email with password verification
- ✅ JWT token generation (access and refresh tokens)
- ✅ Token refresh mechanism
- ✅ Password hashing and verification (bcrypt)
- ✅ Multiple authentication providers (LOCAL, GOOGLE, APPLE)
- ✅ Email verification support
- ✅ Two-factor authentication support
- ✅ Last login tracking
- ✅ GraphQL API for auth operations
- ✅ Event-driven architecture with async event processing
- ✅ CQRS pattern with separate read/write repositories
- ✅ Comprehensive guards (JwtAuthGuard, RolesGuard, OwnerGuard)
- ✅ Saga orchestration for registration flow
- ✅ Global module (exports guards and services for use across the application)

## Domain Model

### Auth Aggregate

The `AuthAggregate` is the main domain entity that encapsulates authentication business logic:

```typescript
class AuthAggregate {
  id: AuthUuidValueObject;
  userId: UserUuidValueObject;
  email: AuthEmailValueObject | null;
  phoneNumber: AuthPhoneNumberValueObject | null;
  emailVerified: AuthEmailVerifiedValueObject;
  lastLoginAt: AuthLastLoginAtValueObject | null;
  password: AuthPasswordValueObject | null;
  provider: AuthProviderValueObject;
  providerId: AuthProviderIdValueObject | null;
  twoFactorEnabled: AuthTwoFactorEnabledValueObject;
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}
```

**Key Methods:**

- `update(props, generateEvent)`: Updates auth properties
- `updateLastLoginAt(lastLoginAt, generateEvent)`: Updates last login timestamp
- `delete(generateEvent)`: Marks auth as deleted
- `registerByEmail(generateEvent)`: Marks auth as registered
- `toPrimitives()`: Converts aggregate to primitive data

### Value Objects

The module uses value objects to encapsulate and validate domain concepts:

- **AuthEmailValueObject**: Validates email format
- **AuthPasswordValueObject**: Validates and stores hashed password
- **AuthProviderValueObject**: Validates authentication provider enum (LOCAL, GOOGLE, APPLE)
- **AuthEmailVerifiedValueObject**: Boolean for email verification status
- **AuthLastLoginAtValueObject**: Timestamp for last login
- **AuthTwoFactorEnabledValueObject**: Boolean for 2FA status
- **AuthPhoneNumberValueObject**: Validates phone number format
- **AuthProviderIdValueObject**: Provider-specific ID (e.g., Google ID, Apple ID)

### View Model

The `AuthViewModel` is optimized for read operations and stored in MongoDB for fast querying. View models are automatically synchronized via event handlers when domain events are published.

## Commands

Commands represent write operations that modify state:

### AuthRegisterByEmailCommand

Registers a new user with email and password.

**Handler:** `AuthRegisterByEmailCommandHandler`

**Process:**

1. Validates email does not already exist
2. Creates `AuthRegistrationRequestedEvent`
3. Triggers `AuthRegistrationSaga` to orchestrate the registration flow:
   - Creates a new user (via `UserCreateCommand`)
   - Hashes the password using bcrypt
   - Creates auth aggregate with LOCAL provider
   - Saves aggregate to write repository (TypeORM - PostgreSQL)
4. Publishes `AuthCreatedEvent` and `AuthRegisteredByEmailEvent`
5. Returns auth ID

**Input:**

```typescript
{
  email: string; // Required, must be unique
  password: string; // Required, will be hashed
}
```

**Output:** `string` (auth ID)

**Business Rules:**

- Email must be unique
- Password is hashed using bcrypt before storage
- User is automatically created during registration
- Email is not verified by default
- Two-factor authentication is disabled by default

### AuthLoginByEmailCommand

Logs in a user with email and password.

**Handler:** `AuthLoginByEmailCommandHandler`

**Process:**

1. Asserts auth exists by email
2. Verifies password using bcrypt
3. Finds user by userId
4. Updates last login timestamp
5. Generates JWT token pair (access + refresh)
6. Publishes `AuthLoggedInByEmailEvent` and `AuthUpdatedLastLoginAtEvent`
7. Returns token pair

**Input:**

```typescript
{
  email: string; // Required
  password: string; // Required
}
```

**Output:** `ITokenPair` (accessToken and refreshToken)

**Business Rules:**

- Email must exist
- Password must match
- User must exist
- JWT tokens include user role

### AuthRefreshTokenCommand

Refreshes an access token using a refresh token.

**Handler:** `AuthRefreshTokenCommandHandler`

**Process:**

1. Verifies refresh token signature and expiration
2. Extracts payload from refresh token
3. Generates new access token with same payload
4. Returns new access token

**Input:**

```typescript
{
  refreshToken: string; // Required
}
```

**Output:** `string` (new access token)

### AuthCreateCommand

Creates a new auth record (used internally by saga).

**Handler:** `AuthCreateCommandHandler`

### AuthUpdateCommand

Updates an existing auth record.

**Handler:** `AuthUpdateCommandHandler`

### AuthDeleteCommand

Deletes an auth record (soft delete).

**Handler:** `AuthDeleteCommandHandler`

## Queries

Queries represent read operations that don't modify state:

### FindAuthsByCriteriaQuery

Finds auth records by criteria with pagination. **Requires ADMIN role.**

**Handler:** `FindAuthsByCriteriaQueryHandler`

**Input:**

```typescript
{
  criteria: Criteria {
    filters?: Filter[];    // Optional filters
    sorts?: Sort[];         // Optional sorting
    pagination?: Pagination; // Optional pagination
  }
}
```

**Output:** `PaginatedResult<AuthViewModel>`

**Example Filters:**

- Filter by provider: `{ field: "provider", operator: "EQUALS", value: "LOCAL" }`
- Filter by email verified: `{ field: "emailVerified", operator: "EQUALS", value: true }`

## Events

The module publishes domain events for important state changes. These events are handled asynchronously by event handlers:

### AuthCreatedEvent

Published when an auth record is created.

**Handler:** `AuthCreatedEventHandler`

**Process:**

1. Creates view model from event data
2. Saves view model to read repository (MongoDB)

### AuthLoggedInByEmailEvent

Published when a user logs in successfully.

**Handler:** `AuthLoggedInByEmailEventHandler`

**Process:**

1. Updates view model with login information
2. Saves view model to read repository (MongoDB)

### AuthRegisteredByEmailEvent

Published when a user registers successfully.

**Handler:** `AuthRegisteredByEmailEventHandler`

**Process:**

1. Updates view model with registration information
2. Saves view model to read repository (MongoDB)

### AuthUpdatedEvent

Published when auth is updated.

**Handler:** `AuthUpdatedEventHandler`

**Process:**

1. Creates or updates view model from event data
2. Saves view model to read repository (MongoDB)

## JWT Authentication

The module provides comprehensive JWT authentication support with access and refresh tokens.

### JWT Payload

The JWT payload includes:

```typescript
interface IJwtPayload {
  id: string; // Auth ID
  userId: string; // User ID
  email?: string; // User email
  username?: string; // Username
  role: string; // User role (ADMIN, USER)
}
```

### Token Pair

The module generates a token pair:

```typescript
interface ITokenPair {
  accessToken: string; // Short-lived access token (default: 15m)
  refreshToken: string; // Long-lived refresh token (default: 7d)
}
```

### JWT Service

The `JwtAuthService` provides the following methods:

- `generateTokenPair(payload)`: Generates both access and refresh tokens
- `generateAccessToken(payload)`: Generates access token only
- `generateRefreshToken(payload)`: Generates refresh token only
- `verifyAccessToken(token)`: Verifies and decodes an access token
- `verifyRefreshToken(token)`: Verifies and decodes a refresh token
- `refreshToken(refreshToken)`: Generates new access token from refresh token
- `decodeToken(token)`: Decodes token without verification

### JWT Strategy

The `JwtStrategy` (Passport strategy) validates JWT tokens:

1. Extracts token from `Authorization: Bearer <token>` header
2. Verifies token signature and expiration
3. Loads auth aggregate from database
4. Attaches user data to request (role, userId, email)

The validated user is attached to the request object and can be accessed via `@CurrentUser()` decorator.

## Guards and Authorization

The module provides comprehensive guards for access control:

### JwtAuthGuard

Validates JWT token and extracts user information.

**Usage:**

```typescript
@UseGuards(JwtAuthGuard)
@Query(() => UserResponseDto)
async getUser() { ... }
```

**Features:**

- Validates JWT token from `Authorization: Bearer <token>` header
- Extracts user data from token
- Attaches user to request object
- Throws `UnauthorizedException` if token is invalid or expired

### RolesGuard

Enforces role-based access control.

**Usage:**

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Query(() => UsersResponseDto)
async getAllUsers() { ... }
```

**Features:**

- Validates user has required role
- Supports multiple roles (OR logic): `@Roles(UserRoleEnum.ADMIN, UserRoleEnum.MODERATOR)`
- Throws `ForbiddenException` if role doesn't match
- Must be used with `JwtAuthGuard`

### OwnerGuard

Ensures users can only access their own resources.

**Usage:**

```typescript
@UseGuards(JwtAuthGuard, OwnerGuard)
@Mutation(() => MutationResponseDto)
async updateUser(@Args('input') input: UpdateUserRequestDto) {
  // User can only update their own profile
}
```

**Features:**

- Validates resource ID matches authenticated user ID
- Admins can access any resource
- Throws `ForbiddenException` if user doesn't own resource
- Extracts resource ID from GraphQL args (`input.id`)

### Public Decorator

Marks endpoints as public (no authentication required).

**Usage:**

```typescript
@Public()
@Mutation(() => LoginResponseDto)
async loginByEmail(@Args('input') input: AuthLoginByEmailRequestDto) {
  // This endpoint is public
}
```

### CurrentUser Decorator

Extracts the authenticated user from the request.

**Usage:**

```typescript
@UseGuards(JwtAuthGuard)
@Query(() => UserResponseDto)
async getCurrentUser(@CurrentUser() user: any) {
  // user contains: id, userId, email, role, etc.
  return user;
}
```

## Repositories

The module uses two repositories following CQRS pattern:

### Write Repository (TypeORM)

**Interface:** `AuthWriteRepository`

**Implementation:** `AuthTypeormRepository`

**Database:** PostgreSQL

**Operations:**

- `findById(id: string): Promise<AuthAggregate | null>`
- `findByEmail(email: string): Promise<AuthAggregate | null>`
- `findByUserId(userId: string): Promise<AuthAggregate | null>`
- `save(auth: AuthAggregate): Promise<AuthAggregate>`
- `delete(id: string): Promise<boolean>`

**Features:**

- Stores auth records in PostgreSQL
- Indexed on `email` and `userId` for performance
- Soft delete support
- Uses TypeORM entities

### Read Repository (MongoDB)

**Interface:** `AuthReadRepository`

**Implementation:** `AuthMongoRepository`

**Database:** MongoDB

**Operations:**

- `findById(id: string): Promise<AuthViewModel | null>`
- `findByCriteria(criteria: Criteria): Promise<PaginatedResult<AuthViewModel>>`
- `save(authViewModel: AuthViewModel): Promise<void>`
- `delete(id: string): Promise<boolean>`

**Features:**

- Optimized for read operations
- Supports complex queries with filters, sorts, and pagination
- Automatically synchronized via event handlers

## GraphQL API

The module exposes a GraphQL API through two resolvers:

### Authentication & Authorization

**Public Endpoints:**

- `loginByEmail` - Public (no authentication required)
- `registerByEmail` - Public (no authentication required)
- `refreshToken` - Public (no authentication required)

**Protected Endpoints:**

- `findAuthsByCriteria` - Requires ADMIN role

### AuthMutationsResolver

Handles write operations (mutations). **Marked as @Public()** - login and register don't require authentication.

#### loginByEmail

Logs in a user with email and password.

```graphql
mutation LoginByEmail($input: AuthLoginByEmailRequestDto!) {
  loginByEmail(input: $input) {
    accessToken
    refreshToken
  }
}
```

**Variables:**

```json
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Response:**

```json
{
  "data": {
    "loginByEmail": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### registerByEmail

Registers a new user with email and password.

```graphql
mutation RegisterByEmail($input: AuthRegisterByEmailRequestDto!) {
  registerByEmail(input: $input) {
    success
    message
    id
  }
}
```

**Variables:**

```json
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

**Response:**

```json
{
  "data": {
    "registerByEmail": {
      "success": true,
      "message": "Auth registered successfully",
      "id": "auth-uuid"
    }
  }
}
```

#### refreshToken

Refreshes an access token using a refresh token.

```graphql
mutation RefreshToken($input: AuthRefreshTokenRequestDto!) {
  refreshToken(input: $input) {
    accessToken
  }
}
```

**Variables:**

```json
{
  "input": {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### AuthQueryResolver

Handles read operations (queries). **Requires ADMIN role.**

#### findAuthsByCriteria

Finds auth records by criteria with pagination.

```graphql
query FindAuthsByCriteria($input: AuthFindByCriteriaRequestDto) {
  findAuthsByCriteria(input: $input) {
    items {
      id
      email
      emailVerified
      provider
      lastLoginAt
      createdAt
    }
    total
    page
    limit
    totalPages
  }
}
```

**Variables:**

```json
{
  "input": {
    "filters": [
      {
        "field": "provider",
        "operator": "EQUALS",
        "value": "LOCAL"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

## Usage Examples

### Complete Authentication Flow

```graphql
# 1. Register a new user
mutation {
  registerByEmail(
    input: { email: "user@example.com", password: "password123" }
  ) {
    success
    message
    id
  }
}

# 2. Login
mutation {
  loginByEmail(input: { email: "user@example.com", password: "password123" }) {
    accessToken
    refreshToken
  }
}

# 3. Use access token in subsequent requests
# Header: Authorization: Bearer <accessToken>

# 4. Refresh token when access token expires
mutation {
  refreshToken(input: { refreshToken: "<refreshToken>" }) {
    accessToken
  }
}
```

### Using Guards in Other Modules

```typescript
import { JwtAuthGuard } from '@/generic/auth/infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '@/generic/auth/infrastructure/guards/roles/roles.guard';
import { OwnerGuard } from '@/generic/auth/infrastructure/guards/owner/owner.guard';
import { Roles } from '@/generic/auth/infrastructure/decorators/roles/roles.decorator';
import { Public } from '@/generic/auth/infrastructure/decorators/public/public.decorator';
import { CurrentUser } from '@/generic/auth/infrastructure/decorators/current-user/current-user.decorator';
import { UserRoleEnum } from '@/shared/domain/enums/user-context/user/user-role/user-role.enum';

// Require authentication
@UseGuards(JwtAuthGuard)
@Query(() => UserResponseDto)
async getUser(@CurrentUser() user: any) {
  return user;
}

// Require ADMIN role
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.ADMIN)
@Query(() => UsersResponseDto)
async getAllUsers() {
  // Only admins can access
}

// Require ownership
@UseGuards(JwtAuthGuard, OwnerGuard)
@Mutation(() => MutationResponseDto)
async updateUser(@Args('input') input: UpdateUserRequestDto) {
  // User can only update their own profile
}

// Public endpoint (no authentication)
@Public()
@Query(() => PublicDataResponseDto)
async getPublicData() {
  // No authentication required
}
```

### Using JWT Service Programmatically

```typescript
import { JwtAuthService } from '@/generic/auth/application/services/jwt-auth/jwt-auth.service';

@Injectable()
export class MyService {
  constructor(private readonly jwtAuthService: JwtAuthService) {}

  async generateTokens(userId: string, email: string, role: string) {
    const tokens = this.jwtAuthService.generateTokenPair({
      id: 'auth-id',
      userId,
      email,
      role,
    });
    return tokens;
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtAuthService.verifyAccessToken(token);
      return payload;
    } catch (error) {
      // Token is invalid or expired
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

## Configuration

### Environment Variables

```env
# JWT Configuration
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Password Hashing (optional, defaults to 10)
BCRYPT_SALT_ROUNDS=10

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/project_db
MONGODB_URI=mongodb://localhost:27017/project_event_store
```

### Module Registration

The Auth Module is automatically registered as a global module in the application. It exports:

- Guards: `JwtAuthGuard`, `RolesGuard`, `OwnerGuard`
- Services: `JwtAuthService`, `PasswordHashingService`, and assertion services
- Decorators: `@Public()`, `@Roles()`, `@CurrentUser()`

These can be used in any module without importing `AuthModule`.

## Troubleshooting

### Common Issues

1. **Invalid Credentials**
   - **Solution**: Verify email and password are correct
   - Check if user exists
   - Verify password hash matches
   - Error: `UnauthorizedException: Invalid credentials`

2. **Email Already Exists**
   - **Solution**: Email must be unique
   - Use a different email or login instead
   - Error: `AuthEmailAlreadyExistsException`

3. **JWT Token Invalid or Expired**
   - **Solution**: Verify token is not expired
   - Check token signature matches secret
   - Ensure token is in `Authorization: Bearer <token>` format
   - Use refresh token to get new access token
   - Error: `UnauthorizedException: Invalid access token`

4. **Insufficient Permissions**
   - **Solution**: Check user has required role
   - Verify user role in JWT payload
   - Error: `ForbiddenException: Insufficient permissions`

5. **User Not Found**
   - **Solution**: Verify auth record exists
   - Check if user was soft deleted
   - Error: `AuthNotFoundException`

6. **Password Verification Failed**
   - **Solution**: Verify password is correct
   - Check if password was hashed correctly
   - Error: `PasswordVerificationFailedException`

### Debugging

Enable debug logging by setting:

```env
LOG_LEVEL=debug
```

This will show detailed logs for:

- Login/register operations
- JWT token generation and validation
- Guard execution
- Password hashing and verification
- Repository operations
- Event handling
- Saga orchestration

### Database Issues

**TypeORM (Write Repository):**

- Ensure PostgreSQL is running
- Check database connection string
- Verify migrations are applied
- Check entity mappings

**MongoDB (Read Repository):**

- Ensure MongoDB is running
- Check MongoDB connection string
- Verify collections are created
- Check event handlers are processing events

## Integration with Other Modules

### User Context

- Creates user automatically during registration via saga
- Links auth to user via `userId`
- Uses user role in JWT payload
- Queries user data during login

### Saga Context

- Uses saga orchestration for registration flow
- Tracks registration steps and compensations
- Provides audit trail for registration process

### Shared Module

- Uses shared value objects and utilities
- Uses shared domain events infrastructure
- Uses shared GraphQL DTOs and mappers

## Best Practices

1. **Password Security**
   - Always hash passwords using bcrypt before storing
   - Never store plain text passwords
   - Use appropriate salt rounds (default: 10)

2. **Token Management**
   - Use short-lived access tokens (15m recommended)
   - Use long-lived refresh tokens (7d recommended)
   - Store tokens securely (httpOnly cookies or secure storage)
   - Implement token rotation for refresh tokens

3. **Authorization**
   - Use appropriate guards for different access levels
   - Always use `JwtAuthGuard` before other guards
   - Mark public endpoints with `@Public()` decorator
   - Use role-based access control for admin operations

4. **Error Handling**
   - Provide clear error messages without exposing sensitive information
   - Don't reveal if email exists during login attempts
   - Log authentication failures for security monitoring

5. **Event Handling**
   - Event handlers update read models asynchronously
   - Don't rely on read models for immediate consistency
   - Use write repository for critical operations

6. **Testing**
   - Mock JWT tokens in tests
   - Test guards independently
   - Test password hashing and verification
   - Test saga compensation flows

## Database Schema

### TypeORM Entity (PostgreSQL)

```typescript
@Entity('auths')
export class AuthTypeormEntity extends BaseTypeormEntity {
  @Column({ type: 'varchar', nullable: true, unique: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string | null;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  twoFactorEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @Column({ type: 'enum', enum: AuthProviderEnum })
  provider: AuthProviderEnum;

  @Column({ type: 'varchar', nullable: true })
  providerId: string | null;

  @Column({ type: 'uuid' })
  userId: string;

  @Index(['email'])
  @Index(['userId'])
}
```

**Note:** Auth records are stored in PostgreSQL. This allows for:

- Centralized authentication
- Efficient auth lookup
- Transactional consistency
- Foreign key relationships with users

### MongoDB Collection (Read Database)

The MongoDB collection stores view models with the same structure, optimized for read operations and complex queries.

## License

This module is part of the Project Starter project.

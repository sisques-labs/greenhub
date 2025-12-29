import { AuthClient } from './auth/client/auth-client.js';
import type { AuthLogoutInput } from './auth/index.js';
import { GrowingUnitClient } from './growing-unit/client/growing-unit-client.js';
import { HealthClient } from './health/client/health-client.js';
import { PlantClient } from './plants/client/plant-client.js';
import { SagaInstanceClient } from './saga-instance/client/saga-instance-client.js';
import { SagaLogClient } from './saga-log/client/saga-log-client.js';
import { SagaStepClient } from './saga-step/client/saga-step-client.js';
import { GraphQLClient } from './shared/client/graphql-client.js';
import type { GraphQLClientConfig } from './shared/types/index.js';
import { UserClient } from './users/client/user-client.js';

export * from './auth/index.js';
export * from './growing-unit/index.js';
export * from './health/index.js';
export * from './plants/index.js';
export * from './saga-instance/index.js';
export * from './saga-log/index.js';
export * from './saga-step/index.js';
// Re-export storage interface for custom implementations
export { MemoryStorage } from './shared/storage/memory-storage.js';
export type { Storage } from './shared/storage/storage.interface.js';
export { WebStorage } from './shared/storage/web-storage.js';
// Re-export types from shared
export type {
  BaseFilter,
  BaseSort,
  FilterOperator,
  GraphQLClientConfig,
  MutationResponse,
  PaginatedResult,
  PaginationInput,
  SortDirection,
} from './shared/types/index.js';
export * from './users/index.js';

export class SDK {
  private client: GraphQLClient;
  private authClient: AuthClient;
  private userClient: UserClient;
  private plantClient: PlantClient;
  private growingUnitClient: GrowingUnitClient;
  private healthClient: HealthClient;
  private sagaInstanceClient: SagaInstanceClient;
  private sagaStepClient: SagaStepClient;
  private sagaLogClient: SagaLogClient;

  constructor(config: GraphQLClientConfig) {
    this.client = new GraphQLClient(config);
    this.authClient = new AuthClient(this.client);
    this.userClient = new UserClient(this.client);
    this.plantClient = new PlantClient(this.client);
    this.growingUnitClient = new GrowingUnitClient(this.client);
    this.healthClient = new HealthClient(this.client);
    this.sagaInstanceClient = new SagaInstanceClient(this.client);
    this.sagaStepClient = new SagaStepClient(this.client);
    this.sagaLogClient = new SagaLogClient(this.client);
  }

  /**
   * Set the access token for authenticated requests
   * Automatically saves to storage
   */
  async setAccessToken(token: string | undefined): Promise<void> {
    await this.client.setAccessToken(token);
  }

  /**
   * Get the current access token
   */
  getAccessToken(): string | undefined {
    return this.client.getAccessToken();
  }

  /**
   * Set the refresh token
   * Automatically saves to storage
   */
  async setRefreshToken(token: string | undefined): Promise<void> {
    await this.client.setRefreshToken(token);
  }

  /**
   * Get the current refresh token
   */
  getRefreshToken(): string | undefined {
    return this.client.getRefreshToken();
  }

  /**
   * Clear all stored tokens
   */
  async logout(): Promise<void> {
    await this.client.clearTokens();
  }

  /**
   * Authentication module
   */
  get auth() {
    return {
      /**
       * Login with email and password
       */
      loginByEmail: this.authClient.loginByEmail.bind(this.authClient),
      /**
       * Register a new user with email and password
       */
      registerByEmail: this.authClient.registerByEmail.bind(this.authClient),
      /**
       * Refresh the access token using a refresh token
       */
      refreshToken: this.authClient.refreshToken.bind(this.authClient),
      /**
       * Logout the current user
       * Clears all stored tokens
       */
      logout: async (input: AuthLogoutInput) => {
        const result = await this.authClient.logout(input);
        await this.client.clearTokens();
        return result;
      },
      /**
       * Get the current authenticated user's profile
       */
      profileMe: this.authClient.profileMe.bind(this.authClient),
    };
  }

  /**
   * Users module
   */
  get users() {
    return {
      /**
       * Find users by criteria with pagination, filters, and sorting
       */
      findByCriteria: this.userClient.findByCriteria.bind(this.userClient),
      /**
       * Find a user by ID
       */
      findById: this.userClient.findById.bind(this.userClient),
      /**
       * Create a new user
       */
      create: this.userClient.create.bind(this.userClient),
      /**
       * Update an existing user
       */
      update: this.userClient.update.bind(this.userClient),
      /**
       * Delete a user
       */
      delete: this.userClient.delete.bind(this.userClient),
    };
  }

  /**
   * Plants module
   */
  get plants() {
    return {
      /**
       * Find a plant by ID
       */
      findById: this.plantClient.findById.bind(this.plantClient),
      /**
       * Update an existing plant
       */
      update: this.plantClient.update.bind(this.plantClient),
      /**
       * Transplant a plant from one growing unit to another
       */
      transplant: this.plantClient.transplant.bind(this.plantClient),
    };
  }

  /**
   * Growing Units module
   */
  get growingUnits() {
    return {
      /**
       * Find growing units by criteria with pagination, filters, and sorting
       */
      findByCriteria: this.growingUnitClient.findByCriteria.bind(
        this.growingUnitClient,
      ),
      /**
       * Find a growing unit by ID
       */
      findById: this.growingUnitClient.findById.bind(this.growingUnitClient),
      /**
       * Create a new growing unit
       */
      create: this.growingUnitClient.create.bind(this.growingUnitClient),
      /**
       * Update an existing growing unit
       */
      update: this.growingUnitClient.update.bind(this.growingUnitClient),
      /**
       * Delete a growing unit
       */
      delete: this.growingUnitClient.delete.bind(this.growingUnitClient),
      /**
       * Add a plant to a growing unit
       */
      plantAdd: this.growingUnitClient.plantAdd.bind(this.growingUnitClient),
      /**
       * Remove a plant from a growing unit
       */
      plantRemove: this.growingUnitClient.plantRemove.bind(
        this.growingUnitClient,
      ),
    };
  }

  /**
   * Health module
   */
  get health() {
    return {
      /**
       * Check the health status of the API
       */
      check: this.healthClient.check.bind(this.healthClient),
    };
  }

  /**
   * Saga Instances module
   */
  get sagaInstances() {
    return {
      /**
       * Find saga instances by criteria with pagination, filters, and sorting
       */
      findByCriteria: this.sagaInstanceClient.findByCriteria.bind(
        this.sagaInstanceClient,
      ),
      /**
       * Find a saga instance by ID
       */
      findById: this.sagaInstanceClient.findById.bind(this.sagaInstanceClient),
      /**
       * Create a new saga instance
       */
      create: this.sagaInstanceClient.create.bind(this.sagaInstanceClient),
      /**
       * Update an existing saga instance
       */
      update: this.sagaInstanceClient.update.bind(this.sagaInstanceClient),
      /**
       * Change the status of a saga instance
       */
      changeStatus: this.sagaInstanceClient.changeStatus.bind(
        this.sagaInstanceClient,
      ),
      /**
       * Delete a saga instance
       */
      delete: this.sagaInstanceClient.delete.bind(this.sagaInstanceClient),
    };
  }

  /**
   * Saga Steps module
   */
  get sagaSteps() {
    return {
      /**
       * Find saga steps by criteria with pagination, filters, and sorting
       */
      findByCriteria: this.sagaStepClient.findByCriteria.bind(
        this.sagaStepClient,
      ),
      /**
       * Find a saga step by ID
       */
      findById: this.sagaStepClient.findById.bind(this.sagaStepClient),
      /**
       * Find saga steps by saga instance ID
       */
      findBySagaInstanceId: this.sagaStepClient.findBySagaInstanceId.bind(
        this.sagaStepClient,
      ),
      /**
       * Create a new saga step
       */
      create: this.sagaStepClient.create.bind(this.sagaStepClient),
      /**
       * Update an existing saga step
       */
      update: this.sagaStepClient.update.bind(this.sagaStepClient),
      /**
       * Change the status of a saga step
       */
      changeStatus: this.sagaStepClient.changeStatus.bind(this.sagaStepClient),
      /**
       * Delete a saga step
       */
      delete: this.sagaStepClient.delete.bind(this.sagaStepClient),
    };
  }

  /**
   * Saga Logs module
   */
  get sagaLogs() {
    return {
      /**
       * Find saga logs by criteria with pagination, filters, and sorting
       */
      findByCriteria: this.sagaLogClient.findByCriteria.bind(
        this.sagaLogClient,
      ),
      /**
       * Find a saga log by ID
       */
      findById: this.sagaLogClient.findById.bind(this.sagaLogClient),
      /**
       * Find saga logs by saga instance ID
       */
      findBySagaInstanceId: this.sagaLogClient.findBySagaInstanceId.bind(
        this.sagaLogClient,
      ),
      /**
       * Find saga logs by saga step ID
       */
      findBySagaStepId: this.sagaLogClient.findBySagaStepId.bind(
        this.sagaLogClient,
      ),
      /**
       * Create a new saga log
       */
      create: this.sagaLogClient.create.bind(this.sagaLogClient),
      /**
       * Update an existing saga log
       */
      update: this.sagaLogClient.update.bind(this.sagaLogClient),
      /**
       * Delete a saga log
       */
      delete: this.sagaLogClient.delete.bind(this.sagaLogClient),
    };
  }
}

import { createClerkClient, verifyToken } from '@clerk/backend';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Clerk Auth Service
 * Handles authentication and user management via Clerk
 */
@Injectable()
export class ClerkAuthService {
	private readonly logger = new Logger(ClerkAuthService.name);
	private readonly clerkSecretKey: string;

	constructor(private readonly configService: ConfigService) {
		this.clerkSecretKey =
			this.configService.get<string>('CLERK_SECRET_KEY') || '';
		if (!this.clerkSecretKey) {
			this.logger.warn('CLERK_SECRET_KEY is not set');
		}
	}

	/**
	 * Validates authentication from request headers using Clerk
	 *
	 * @param requestHeaders - The request headers object
	 * @returns The auth object with userId and sessionId if valid
	 * @throws {UnauthorizedException} If the authentication is invalid
	 */
	async verifyRequest(
		requestHeaders: Record<string, string | string[] | undefined>,
	) {
		try {
			this.logger.log('Verifying Clerk authentication');

			const token = this.extractTokenFromHeaders(requestHeaders);

			if (!token) {
				throw new UnauthorizedException('No token provided');
			}

			// Verify session token using Clerk
			const payload = await verifyToken(token, {
				secretKey: this.clerkSecretKey,
			});

			if (!payload.sub) {
				throw new UnauthorizedException('Invalid authentication');
			}

			this.logger.log(`Authentication verified for user: ${payload.sub}`);

			return {
				userId: payload.sub,
				sessionId: payload.sid || null,
			};
		} catch (error) {
			this.logger.error(`Authentication verification failed: ${error.message}`);
			if (error instanceof UnauthorizedException) {
				throw error;
			}
			throw new UnauthorizedException('Invalid or expired token');
		}
	}

	/**
	 * Gets user information from Clerk
	 *
	 * @param userId - The Clerk user ID
	 * @returns The user object
	 */
	async getUser(userId: string) {
		try {
			this.logger.log(`Getting user from Clerk: ${userId}`);

			const client = createClerkClient({
				secretKey: this.clerkSecretKey,
			});

			const user = await client.users.getUser(userId);

			this.logger.log(`User retrieved: ${user.id}`);

			return user;
		} catch (error) {
			this.logger.error(`Failed to get user: ${error.message}`);
			throw new UnauthorizedException('User not found');
		}
	}

	/**
	 * Extracts the authorization token from request headers
	 *
	 * @param headers - The request headers object
	 * @returns The token if found, undefined otherwise
	 */
	private extractTokenFromHeaders(
		headers: Record<string, string | string[] | undefined>,
	): string | undefined {
		const authHeader = headers.authorization;

		if (!authHeader || Array.isArray(authHeader)) {
			return undefined;
		}

		const parts = authHeader.split(' ');
		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			return undefined;
		}

		return parts[1];
	}

	/**
	 * Extracts the authorization token from request headers (legacy method for compatibility)
	 *
	 * @param authHeader - The authorization header value
	 * @returns The token if found, null otherwise
	 */
	extractTokenFromHeader(authHeader: string | undefined): string | null {
		if (!authHeader) {
			return null;
		}

		const parts = authHeader.split(' ');
		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			return null;
		}

		return parts[1];
	}
}


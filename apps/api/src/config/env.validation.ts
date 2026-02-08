import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	MONGODB_URI: z.string().url(),
	JWT_ACCESS_SECRET: z.string().min(32),
	JWT_REFRESH_SECRET: z.string().min(32),
	PORT: z.string().transform(Number),
	FRONTEND_URL: z.string().url(),
	NODE_ENV: z.enum(['development', 'production', 'test']),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates env config for ConfigModule.forRoot({ validate }).
 * Receives the merged config (from .env + process.env) and returns the validated object.
 * Throws on validation failure and prevents the application from bootstrapping.
 *
 * @param config - Raw config object from ConfigModule
 * @returns Validated env for type-safe access via ConfigService
 */
export function validate(config: Record<string, unknown>): Env {
	const result = envSchema.safeParse(config);
	if (!result.success) {
		const message = result.error.flatten().fieldErrors
			? Object.entries(result.error.flatten().fieldErrors)
					.map(([key, errs]) => `${key}: ${(errs as string[]).join(', ')}`)
					.join('; ')
			: result.error.message;
		throw new Error(`Environment validation failed: ${message}`);
	}
	return result.data;
}

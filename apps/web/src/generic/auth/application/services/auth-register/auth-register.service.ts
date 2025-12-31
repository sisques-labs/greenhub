/**
 * Application service for handling registration business logic
 * Separates presentation concerns from business logic
 * Follows DDD pattern: Application layer service
 */

interface IRegisterClient {
	registerByEmail: (input: {
		email: string;
		password: string;
	}) => Promise<{ success: boolean; message?: string; id?: string } | null>;
}

interface IAuthRegisterServiceInput {
	credentials: {
		email: string;
		password: string;
	};
	onSuccess: () => void;
	onError?: (error: Error) => void;
}

export class AuthRegisterService {
	constructor(private readonly registerClient: IRegisterClient) {}

	/**
	 * Executes the registration use case
	 * @param input - Registration credentials and callbacks
	 */
	async execute(input: IAuthRegisterServiceInput): Promise<void> {
		try {
			const result = await this.registerClient.registerByEmail({
				email: input.credentials.email,
				password: input.credentials.password,
			});

			if (result && result.success) {
				input.onSuccess();
			}
		} catch (error) {
			const registerError =
				error instanceof Error ? error : new Error("Registration failed");
			input.onError?.(registerError);
			throw registerError;
		}
	}
}

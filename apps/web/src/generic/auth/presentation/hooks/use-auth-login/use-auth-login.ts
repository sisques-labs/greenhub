import { useAuth } from "@repo/sdk";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { AuthLoginService } from "@/generic/auth/application/services/auth-login/auth-login.service";
import { AuthLoginByEmailFormValues } from "@/generic/auth/presentation/dtos/schemas/auth-login-by-email/auth-login-by-email.schema";
import { useAppRoutes } from "@/shared/hooks/use-routes";

/**
 * Hook that provides login functionality using the AuthLoginService
 * Connects presentation layer to application layer following DDD pattern
 */
export function useAuthLogin() {
	const router = useRouter();
	const { routes } = useAppRoutes();
	const { loginByEmail } = useAuth();

	// Create service instance with SDK login client
	const loginService = useMemo(
		() =>
			new AuthLoginService({
				loginByEmail: async (input) => {
					const result = await loginByEmail.fetch(input);
					return result || null;
				},
			}),
		[loginByEmail],
	);

	const handleLogin = async (values: AuthLoginByEmailFormValues) => {
		await loginService.execute({
			credentials: values,
			onSuccess: () => {
				router.push(`${routes.home}`);
			},
			onError: (error) => {
				// Error handling is delegated to the SDK hook state
				console.error("Login error:", error);
			},
		});
	};

	return {
		handleLogin,
		isLoading: loginByEmail.loading,
		error: loginByEmail.error,
	};
}

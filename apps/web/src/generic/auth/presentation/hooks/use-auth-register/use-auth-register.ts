import { AuthRegisterService } from '@/generic/auth/application/services/auth-register/auth-register.service';
import type { AuthRegisterByEmailFormValues } from '@/generic/auth/presentation/dtos/schemas/auth-register-by-email/auth-register-by-email.schema';
import { useAppRoutes } from '@/shared/presentation/hooks/use-routes';
import { useAuth } from '@repo/sdk';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook that provides registration functionality using the AuthRegisterService
 * Connects presentation layer to application layer following DDD pattern
 * After successful registration, automatically logs in the user
 */
export function useAuthRegister() {
  const router = useRouter();
  const { routes } = useAppRoutes();
  const { registerByEmail, loginByEmail } = useAuth();

  // Create service instance with SDK register client
  const registerService = useMemo(
    () =>
      new AuthRegisterService({
        registerByEmail: async (input) => {
          const result = await registerByEmail.fetch(input);
          return result || null;
        },
      }),
    [registerByEmail],
  );

  const handleRegister = async (values: AuthRegisterByEmailFormValues) => {
    await registerService.execute({
      credentials: {
        email: values.email,
        password: values.password,
      },
      onSuccess: async () => {
        // 01: After successful registration, automatically log in with the same credentials
        try {
          const loginResult = await loginByEmail.fetch({
            email: values.email,
            password: values.password,
          });

          // 02: If login is successful, redirect to dashboard
          if (loginResult && loginResult.accessToken) {
            router.push(`${routes.home}`);
          }
        } catch (error) {
          // If auto-login fails, still redirect to auth page
          // The user can manually log in with their credentials
          console.error('Auto-login after registration error:', error);
          router.push(`${routes.auth}`);
        }
      },
      onError: (error) => {
        // Error handling is delegated to the SDK hook state
        console.error('Registration error:', error);
      },
    });
  };

  return {
    handleRegister,
    isLoading: registerByEmail.loading || loginByEmail.loading,
    error: registerByEmail.error || loginByEmail.error,
  };
}

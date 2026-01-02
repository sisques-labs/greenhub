'use client';

import { SignIn, SignUp } from '@clerk/nextjs';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Authentication page component using Clerk
 * Shows SignIn or SignUp component based on query parameter
 */
const AuthPage = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const mode = searchParams.get('mode') || 'sign-in';

	// Get the auth path from the current pathname (e.g., /es/auth or /en/auth)
	const authPath = pathname?.replace(/\/auth.*$/, '/auth') || '/auth';
	const signInUrl = `${authPath}?mode=sign-in`;
	const signUpUrl = `${authPath}?mode=sign-up`;

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background to-muted/20 p-4">
			{mode === 'sign-up' ? (
				<SignUp
					routing="path"
					path={authPath}
					signInUrl={signInUrl}
					appearance={{
						elements: {
							rootBox: 'mx-auto',
							card: 'shadow-lg',
						},
					}}
				/>
			) : (
				<SignIn
					routing="path"
					path={authPath}
					signUpUrl={signUpUrl}
					appearance={{
						elements: {
							rootBox: 'mx-auto',
							card: 'shadow-lg',
						},
					}}
				/>
			)}
		</div>
	);
};

export default AuthPage;

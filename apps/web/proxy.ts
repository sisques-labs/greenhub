import { routing } from '@/shared/i18n/routing';
import { clerkMiddleware } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

/**
 * Public routes that don't require authentication
 * Use (.*) pattern for catch-all routes
 */
const PUBLIC_ROUTES = ['/auth(.*)'];

/**
 * Checks if a path is a public route
 * Supports regex patterns like /auth(.*)
 */
function isPublicRoute(path: string): boolean {
	return PUBLIC_ROUTES.some((route) => {
		// If route contains regex pattern like (.*)
		if (route.includes('(.*)')) {
			const pattern = route.replace('(.*)', '');
			return path === pattern || path.startsWith(`${pattern}/`);
		}
		// Exact match or starts with route
		return path === route || path.startsWith(`${route}/`);
	});
}

export default clerkMiddleware(async (auth, request: NextRequest) => {
	// Get the pathname without locale
	const pathname = request.nextUrl.pathname;

	// Extract locale from pathname (format: /locale/path)
	const localeMatch = pathname.match(/^\/([^/]+)/);
	const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
	const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

	// Redirect root path to /home
	if (pathWithoutLocale === '/') {
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}/home`;
		return NextResponse.redirect(url);
	}

	// Check if accessing auth page or other public routes
	const isAuthPage =
		pathWithoutLocale === '/auth' || pathWithoutLocale.startsWith('/auth/');
	const isPublic = isPublicRoute(pathWithoutLocale);

	// Get Clerk session
	const { userId } = await auth();

	// Case 1: User is authenticated (has Clerk session) and tries to access auth page
	// Redirect to dashboard
	if (userId && isAuthPage) {
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}/home`;
		return NextResponse.redirect(url);
	}

	// Case 2: User is NOT authenticated (no Clerk session) and tries to access protected route
	// Redirect to auth page
	if (!userId && !isPublic) {
		const url = request.nextUrl.clone();
		url.pathname = `/${locale}/auth`;
		return NextResponse.redirect(url);
	}

	// Continue with intl middleware for all other cases
	return intlMiddleware(request);
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};

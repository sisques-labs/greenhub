import { getRequestConfig } from 'next-intl/server';
import { routing } from 'shared/i18n/routing';

// Helper to merge translations from multiple sources
async function loadMessages(locale: string) {
	const [shared, plants, growingUnits, locations, auth, users, dashboard] =
		await Promise.all([
			import(`@/shared/locales/${locale}.json`).then((m) => m.default),
			import(`@/features/plants/locales/${locale}.json`).then((m) => m.default),
			import(`@/features/growing-units/locales/${locale}.json`).then(
				(m) => m.default,
			),
			import(`@/features/locations/locales/${locale}.json`).then(
				(m) => m.default,
			),
			import(`@/features/auth/locales/${locale}.json`).then((m) => m.default),
			import(`@/features/users/locales/${locale}.json`).then((m) => m.default),
			import(`@/features/dashboard/locales/${locale}.json`).then(
				(m) => m.default,
			),
		]);

	return {
		...shared,
		features: {
			plants,
			growingUnits,
			locations,
			auth,
			users,
			dashboard,
		},
	};
}

export default getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment
	let locale = await requestLocale;

	// Ensure that the incoming locale is valid
	if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
		locale = routing.defaultLocale;
	}

	return {
		locale: locale as string,
		messages: await loadMessages(locale),
		timeZone: 'Europe/Madrid',
	};
});

import { getRequestConfig } from 'next-intl/server';
import { routing } from 'shared/i18n/routing';

/**
 * Deep-merges multiple translation objects. Later keys override earlier ones at the same path.
 */
function deepMerge<T extends Record<string, unknown>>(
	...sources: (T | undefined | null)[]
): T {
	const result = {} as T;
	for (const src of sources) {
		if (!src || typeof src !== 'object') continue;
		for (const key of Object.keys(src)) {
			const value = src[key];
			if (
				value &&
				typeof value === 'object' &&
				!Array.isArray(value) &&
				key in result &&
				typeof (result as Record<string, unknown>)[key] === 'object'
			) {
				(result as Record<string, unknown>)[key] = deepMerge(
					(result as Record<string, unknown>)[key] as Record<string, unknown>,
					value as Record<string, unknown>,
				);
			} else {
				(result as Record<string, unknown>)[key] = value;
			}
		}
	}
	return result;
}

/**
 * Loads and merges all locale JSONs (shared + every feature) into a single messages object.
 * - Root keys from shared (common, nav) stay at root.
 * - Shared UI keys (fields, types, status, time, pagination, validation, units) are under "shared" so t('shared.fields...') works.
 * - Each feature is under "features.{name}" so t('features.plants...') works.
 */
async function loadMessages(locale: string) {
	const [
		shared,
		plants,
		plantSpecies,
		growingUnits,
		locations,
		auth,
		users,
		dashboard,
	] = await Promise.all([
		import(`@/shared/locales/${locale}.json`).then((m) => m.default),
		import(`@/features/plants/locales/${locale}.json`).then((m) => m.default),
		import(`@/features/plant-species/locales/${locale}.json`).then(
			(m) => m.default,
		),
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

	const {
		common,
		nav,
		fields,
		types,
		units,
		status,
		validation,
		pagination,
		time,
		...sharedRest
	} = shared as Record<string, unknown>;

	return deepMerge(
		sharedRest as Record<string, unknown>,
		{
			common,
			nav,
			shared: {
				fields,
				types,
				units,
				status,
				validation,
				pagination,
				time,
			},
			features: {
				plants,
				plantSpecies,
				growingUnits,
				locations,
				auth,
				users,
				dashboard,
			},
		},
	);
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

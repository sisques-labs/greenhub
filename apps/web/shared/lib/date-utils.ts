/**
 * Formats a plant-related date with relative time descriptions.
 * Returns descriptive text for recent dates (today, yesterday, days ago, weeks ago)
 * and falls back to locale date string for older dates.
 *
 * @param date - The date to format (can be null or undefined)
 * @param translations - Translation object with keys for relative time descriptions
 * @returns Formatted date string or '-' if date is null/undefined
 *
 * @example
 * const t = (key: string, params?: any) => translations[key];
 * formatPlantDate(new Date(), t); // Returns today's translation
 * formatPlantDate(null, t); // Returns '-'
 */
export function formatPlantDate(
	date: Date | null | undefined,
	translations: {
		today: string;
		yesterday: string;
		daysAgo: (days: number) => string;
		weeksAgo: (weeks: number) => string;
	},
): string {
	if (!date) return '-';

	const now = new Date();
	const plantDate = new Date(date);

	const toDayKey = (d: Date) =>
		`${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
	const nowKey = toDayKey(now);
	const plantKey = toDayKey(plantDate);
	const diffDays = Math.round(
		(now.getTime() - plantDate.getTime()) / (1000 * 60 * 60 * 24),
	);
	const diffDaysAbs = Math.abs(diffDays);

	if (nowKey === plantKey) return translations.today;
	if (diffDays === 1) return translations.yesterday;
	if (diffDaysAbs < 7) return translations.daysAgo(diffDaysAbs);
	if (diffDaysAbs < 14)
		return translations.weeksAgo(Math.floor(diffDaysAbs / 7));

	return plantDate.toLocaleDateString();
}

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
	const diffTime = Math.abs(now.getTime() - plantDate.getTime());
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return translations.today;
	if (diffDays === 1) return translations.yesterday;
	if (diffDays < 7) return translations.daysAgo(diffDays);
	if (diffDays < 14)
		return translations.weeksAgo(Math.floor(diffDays / 7));

	return plantDate.toLocaleDateString();
}

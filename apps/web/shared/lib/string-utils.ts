/**
 * Generates initials from a name string.
 * Takes the first character of each word, uppercases them, and limits to 2 characters.
 *
 * @param name - The name to generate initials from
 * @param fallback - Default value if name is empty or null (defaults to 'P')
 * @returns Uppercase initials (max 2 characters)
 *
 * @example
 * getInitials('John Doe'); // Returns 'JD'
 * getInitials('Alice'); // Returns 'AL'
 * getInitials(''); // Returns 'P'
 * getInitials(null, 'X'); // Returns 'X'
 */
export function getInitials(
	name: string | null | undefined,
	fallback = 'P',
): string {
	const text = (name ?? '').trim() || fallback;
	const words = text.split(/\s+/).filter(Boolean);
	if (words.length === 0) return fallback.slice(0, 2).toUpperCase();
	if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
	return words
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
}

/**
 * Generates plant initials from plant name or species.
 * Prefers name over species, uses 'P' as ultimate fallback.
 *
 * @param name - Primary name to use
 * @param species - Fallback species name
 * @returns Uppercase initials (max 2 characters)
 *
 * @example
 * getPlantInitials('Monstera Deliciosa', 'Monstera'); // Returns 'MD'
 * getPlantInitials(null, 'Ficus'); // Returns 'FI'
 * getPlantInitials(null, null); // Returns 'P'
 */
export function getPlantInitials(
	name: string | null | undefined,
	species: string | null | undefined,
): string {
	return getInitials(name || species, 'P');
}

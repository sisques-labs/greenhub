import { Badge } from '@repo/shared/presentation/components/ui/badge';

/**
 * Status configuration type for plant status badges.
 */
type StatusConfig = {
	label: string;
	variant: 'default' | 'secondary' | 'destructive' | 'outline';
};

/**
 * Gets the status configuration for a plant status.
 *
 * @param status - The plant status string
 * @param t - The translation function from next-intl
 * @returns The status configuration with label and variant
 */
function getStatusConfig(
	status: string,
	t: (key: string) => string,
): StatusConfig {
	const statusTranslations: Record<string, StatusConfig> = {
		PLANTED: {
			label: t('shared.status.plant.PLANTED'),
			variant: 'outline',
		},
		GROWING: {
			label: t('shared.status.plant.GROWING'),
			variant: 'default',
		},
		HARVESTED: {
			label: t('shared.status.plant.HARVESTED'),
			variant: 'secondary',
		},
		DEAD: {
			label: t('shared.status.plant.DEAD'),
			variant: 'destructive',
		},
		ARCHIVED: {
			label: t('shared.status.plant.ARCHIVED'),
			variant: 'outline',
		},
	};

	return (
		statusTranslations[status] || {
			label: status,
			variant: 'outline' as const,
		}
	);
}

/**
 * Gets a Badge component for a plant status.
 *
 * @param status - The plant status string
 * @param t - The translation function from next-intl
 * @returns A Badge component with the appropriate label and variant
 */
export function getPlantStatusBadge(
	status: string,
	t: (key: string) => string,
) {
	const statusConfig = getStatusConfig(status, t);

	return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
}

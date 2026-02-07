import { MapPinIcon } from 'lucide-react';

/**
 * Returns a location icon component.
 * Provides a consistent map pin icon for location displays.
 *
 * @returns React component for location icon
 *
 * @example
 * <div>{getLocationIcon()}</div>
 */
export function getLocationIcon() {
	return <MapPinIcon className="h-4 w-4 text-muted-foreground" />;
}

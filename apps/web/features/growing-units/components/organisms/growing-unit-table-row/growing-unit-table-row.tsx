'use client';

import { TableCell, TableRow } from '@/shared/components/ui/table';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { GrowingUnitResponse } from '../../../api/types';

interface GrowingUnitTableRowProps {
	growingUnit: GrowingUnitResponse;
}

export function GrowingUnitTableRow({
	growingUnit,
}: GrowingUnitTableRowProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const handleRowClick = () => {
		router.push(`/${locale}/growing-units/${growingUnit.id}`);
	};

	// Determine location based on type (same logic as card)
	const locationLabel =
		growingUnit.type === 'POT' || growingUnit.type === 'WINDOW_BOX'
			? t('features.growingUnits.list.location.indoor', { default: 'INTERIOR' })
			: t('features.growingUnits.list.location.outdoor', {
					default: 'EXTERIOR',
			  });

	return (
		<TableRow
			className="cursor-pointer hover:bg-muted/50 transition-colors"
			onClick={handleRowClick}
		>
			<TableCell>
				<div className="font-medium">{growingUnit.name}</div>
				<div className="text-sm text-muted-foreground">
					{t(`shared.types.growingUnit.${growingUnit.type}`)}
				</div>
			</TableCell>
			<TableCell>
				<div className="text-sm">{growingUnit.location?.name}</div>
				<div className="text-xs text-muted-foreground uppercase">
					{locationLabel}
				</div>
			</TableCell>
			<TableCell>
				<div className="text-sm font-medium">
					{growingUnit.numberOfPlants} / {growingUnit.capacity}
				</div>
				<div className="text-xs text-muted-foreground">
					{t('features.growingUnits.list.table.plantsCapacity', {
						default: 'plants / capacity',
					})}
				</div>
			</TableCell>
			<TableCell>
				<span className="text-sm text-muted-foreground">
					{growingUnit.updatedAt.toLocaleDateString(locale)}
				</span>
			</TableCell>
		</TableRow>
	);
}


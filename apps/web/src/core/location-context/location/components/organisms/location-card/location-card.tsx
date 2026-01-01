'use client';

import type { LocationResponse } from '@repo/sdk';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@repo/shared/presentation/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LocationCardProps {
	location: LocationResponse;
	onEdit?: (location: LocationResponse) => void;
	onDelete?: (id: string) => void;
}

export function LocationCard({
	location,
	onEdit,
	onDelete,
}: LocationCardProps) {
	const t = useTranslations();

	const handleActionClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		onEdit?.(location);
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		onDelete?.(location.id);
	};

	return (
		<Card className="hover:shadow-lg transition-shadow overflow-hidden pt-0!">
			<CardHeader className="p-0! m-0!">
				{/* Image with badge and menu */}
				<div className="relative w-full h-48 bg-muted">
					{/* Image placeholder - TODO: Replace with actual image when available */}
					<div className="w-full h-full flex items-center justify-center">
						<span className="text-muted-foreground text-sm">
							{location.name}
						</span>
					</div>
					{/* Badge overlay in top-left corner */}
					<div className="absolute top-2 left-2">
						<Badge
							variant={
								location.type === 'OUTDOOR_SPACE' ||
								location.type === 'GARDEN' ||
								location.type === 'GREENHOUSE' ||
								location.type === 'BALCONY'
									? 'default'
									: 'secondary'
							}
							className="text-xs"
						>
							{location.type}
						</Badge>
					</div>
					{/* Menu overlay in top-right corner */}
					<div className="absolute top-2 right-2" onClick={handleActionClick}>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent bg-background/80 backdrop-blur-sm">
									<MoreVerticalIcon className="h-4 w-4" />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{onEdit && (
									<DropdownMenuItem onClick={handleEdit}>
										{t('common.edit')}
									</DropdownMenuItem>
								)}
								{onDelete && (
									<DropdownMenuItem
										onClick={handleDelete}
										className="text-destructive"
									>
										{t('common.delete')}
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="p-4 space-y-2">
					<div>
						<CardTitle className="text-lg font-bold">{location.name}</CardTitle>
						<CardDescription className="text-xs uppercase mt-1">
							{location.type}
						</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent className="pt-0 px-4 pb-4">
				{location.description ? (
					<div className="text-sm text-muted-foreground">
						{location.description}
					</div>
				) : (
					<div className="text-sm text-muted-foreground">
						{t('pages.locations.list.noDescription')}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

'use client';

import type { PlantSpeciesResponse } from '@/features/plant-species/api/types/plant-species-response.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui/table';
import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PlantSpeciesTableRow } from './PlantSpeciesTableRow';

interface PlantSpeciesTableProps {
	plantSpecies: PlantSpeciesResponse[];
	isLoading?: boolean;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	page?: number;
	totalPages?: number;
	onPageChange?: (page: number) => void;
	onView?: (plantSpecies: PlantSpeciesResponse) => void;
	onEdit?: (plantSpecies: PlantSpeciesResponse) => void;
	onDelete?: (id: string) => void;
}

export function PlantSpeciesTable({
	plantSpecies,
	isLoading = false,
	searchValue = '',
	onSearchChange,
	page = 1,
	totalPages = 1,
	onPageChange,
	onView,
	onEdit,
	onDelete,
}: PlantSpeciesTableProps) {
	const t = useTranslations();

	return (
		<div className="space-y-4">
			{/* Search */}
			{onSearchChange && (
				<div className="relative">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t('features.plantSpecies.list.searchPlaceholder')}
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-9"
					/>
				</div>
			)}

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">
								{t('features.plantSpecies.list.table.columns.image')}
							</TableHead>
							<TableHead>
								{t('features.plantSpecies.list.table.columns.name')}
							</TableHead>
							<TableHead>
								{t('features.plantSpecies.list.table.columns.category')}
							</TableHead>
							<TableHead>
								{t('features.plantSpecies.list.table.columns.difficulty')}
							</TableHead>
							<TableHead>
								{t('features.plantSpecies.list.table.columns.status')}
							</TableHead>
							<TableHead className="w-16">
								{t('features.plantSpecies.list.table.columns.actions')}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									<td className="p-4">
										<Skeleton className="h-10 w-10 rounded-md" />
									</td>
									<td className="p-4">
										<Skeleton className="h-4 w-32 mb-2" />
										<Skeleton className="h-3 w-24" />
									</td>
									<td className="p-4">
										<Skeleton className="h-5 w-20" />
									</td>
									<td className="p-4">
										<Skeleton className="h-5 w-16" />
									</td>
									<td className="p-4">
										<Skeleton className="h-5 w-20" />
									</td>
									<td className="p-4">
										<Skeleton className="h-8 w-8 rounded-md" />
									</td>
								</TableRow>
							))
						) : plantSpecies.length === 0 ? (
							<TableRow>
								<td
									colSpan={6}
									className="text-center py-8 text-muted-foreground text-sm"
								>
									{t('features.plantSpecies.list.empty')}
								</td>
							</TableRow>
						) : (
							plantSpecies.map((species) => (
								<PlantSpeciesTableRow
									key={species.id}
									plantSpecies={species}
									onView={onView}
									onEdit={onEdit}
									onDelete={onDelete}
								/>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && onPageChange && (
				<div className="flex items-center justify-between">
					<div className="text-sm text-muted-foreground">
						{t('common.pagination.page', { page, totalPages })}
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(page - 1)}
							disabled={page <= 1}
						>
							{t('common.pagination.previous')}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onPageChange(page + 1)}
							disabled={page >= totalPages}
						>
							{t('common.pagination.next')}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

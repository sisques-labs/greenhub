'use client';

import { GrowingUnitUpdateForm } from '@/features/growing-units/components/organisms/growing-unit-update-form/growing-unit-update-form';
import { useGrowingUnitDetailPage } from '@/features/growing-units/hooks/use-growing-unit-detail-page/use-growing-unit-detail-page';
import { PlantCreateForm } from '@/features/plants/components/organisms/plant-create-form/plant-create-form';
import { PlantTableRow } from '@/features/plants/components/organisms/plant-table-row/plant-table-row';
import { PageHeader } from '@/shared/components/organisms/page-header';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/shared/components/ui/table';
import {
	DropletsIcon,
	Grid3x3Icon,
	MountainIcon,
	PencilIcon,
	PlusIcon,
	SunIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export function GrowingUnitDetailPage() {
	const t = useTranslations();
	const params = useParams();
	const id = params?.id as string;

	const {
		growingUnit,
		isLoading,
		error,
		location,
		occupancyPercentage,
		updateDialogOpen,
		setUpdateDialogOpen,
		createPlantDialogOpen,
		setCreatePlantDialogOpen,
		isUpdating,
		updateError,
		isCreatingPlant,
		createPlantError,
		handleUpdateSubmit,
		handlePlantCreateSubmit,
		handleAddPlant,
		handleEditUnit,
	} = useGrowingUnitDetailPage(id);

	if (isLoading || growingUnit === null || growingUnit === undefined) {
		return (
			<div className="mx-auto space-y-6">
				<Skeleton className="h-6 w-64" />
				<Skeleton className="h-12 w-full" />
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton key={i} className="h-24" />
					))}
				</div>
			</div>
		);
	}

	if (error || !growingUnit) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('growingUnit.detail.error.loading', {
							message: (error as Error)?.message || 'Unknown error',
						})}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto space-y-6">
			{/* Header */}
			<PageHeader
				title={growingUnit.name}
				description={
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<Badge variant="default" className="bg-green-500">
								<span className="h-2 w-2 rounded-full bg-green-600 mr-2 inline-block" />
								{t('shared.status.growingUnit.active')}
							</Badge>
							<span className="text-sm text-muted-foreground">
								{t('features.growingUnits.detail.location.label')}:{' '}
								{t(`shared.status.location.${location}`)}
							</span>
							<span className="text-sm text-muted-foreground">|</span>
							<span className="text-sm text-muted-foreground">
								{t('shared.fields.type.label')}:{' '}
								{t(`shared.types.growingUnit.${growingUnit.type}`)}
							</span>
						</div>
					</div>
				}
				actions={[
					<Button key="edit" variant="outline" onClick={handleEditUnit}>
						<PencilIcon className="mr-2 h-4 w-4" />
						{t('features.growingUnits.detail.actions.editUnit')}
					</Button>,
					<Button key="add-plant" onClick={handleAddPlant}>
						<PlusIcon className="mr-2 h-4 w-4" />
						{t('features.growingUnits.detail.actions.addPlant')}
					</Button>,
				]}
			/>

			{/* Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('features.growingUnits.detail.summary.substrate.label')}
						</CardTitle>
						<MountainIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{t('features.growingUnits.detail.summary.substrate.value')}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('features.growingUnits.detail.summary.exposure.label')}
						</CardTitle>
						<SunIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{t('features.growingUnits.detail.summary.exposure.directSun')}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('features.growingUnits.detail.summary.lastWatering.label')}
						</CardTitle>
						<DropletsIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{t('features.growingUnits.detail.summary.lastWatering.today')}
						</div>
						<p className="text-xs text-muted-foreground">08:30 AM</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('features.growingUnits.detail.summary.occupancy.label')}
						</CardTitle>
						<Grid3x3Icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{occupancyPercentage}%</div>
						<p className="text-xs text-muted-foreground">
							{growingUnit.numberOfPlants}/{growingUnit.capacity}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Plants Section */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>
							{t('features.growingUnits.detail.sections.plants.title')}
						</CardTitle>
						<Button variant="link" className="h-auto p-0">
							{t('common.viewAll')}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					{growingUnit.plants.length > 0 ? (
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="w-[80px]">IMG</TableHead>
										<TableHead>
											{t('features.plants.list.table.columns.plant')}
										</TableHead>
										<TableHead>
											{t('features.plants.list.table.columns.location')}
										</TableHead>
										<TableHead>
											{t('features.plants.list.table.columns.status')}
										</TableHead>
										<TableHead>
											{t('features.plants.list.table.columns.lastWatering')}
										</TableHead>
										<TableHead className="w-[80px]">
											{t('features.plants.list.table.columns.actions')}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{growingUnit.plants.map((plant) => (
										<PlantTableRow key={plant.id} plant={plant} />
									))}
								</TableBody>
							</Table>
						</div>
					) : (
						<div className="text-center py-8 text-muted-foreground">
							{t('features.growingUnits.list.noPlants')}
						</div>
					)}
				</CardContent>
			</Card>

			{/* TODO: Add this to the backend */}
			{/* History Section - Placeholder */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>
							{t('features.growingUnits.detail.sections.history.title')}
						</CardTitle>
						<Button variant="link" className="h-auto p-0">
							{t('common.viewAll')}
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8 text-muted-foreground">
						{t('common.loading')}
					</div>
				</CardContent>
			</Card>

			{/* Update Form */}
			{growingUnit && (
				<GrowingUnitUpdateForm
					growingUnit={growingUnit}
					open={updateDialogOpen}
					onOpenChange={setUpdateDialogOpen}
					onSubmit={handleUpdateSubmit}
					isLoading={isUpdating}
					error={updateError}
				/>
			)}

			{/* Create Plant Form */}
			{growingUnit && (
				<PlantCreateForm
					open={createPlantDialogOpen}
					onOpenChange={setCreatePlantDialogOpen}
					onSubmit={handlePlantCreateSubmit}
					isLoading={isCreatingPlant}
					error={createPlantError}
					growingUnitId={growingUnit.id}
				/>
			)}
		</div>
	);
}

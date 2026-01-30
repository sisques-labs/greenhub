'use client';

import { PlantDetailPageSkeleton } from '@/core/plant-context/plant/components/organisms/plant-detail-page-skeleton/plant-detail-page-skeleton';
import { PlantEditDetailsModal } from '@/core/plant-context/plant/components/organisms/plant-edit-details-modal/plant-edit-details-modal';
import { PlantTransplantModal } from '@/core/plant-context/plant/components/organisms/plant-transplant-modal/plant-transplant-modal';
import { usePlantDetailPage } from '@/core/plant-context/plant/hooks/use-plant-detail-page/use-plant-detail-page';
import { getPlantStatusBadge } from '@/core/plant-context/plant/utils/plant-status.utils';
import { TimelineSequence } from '@/presentation/components/molecules/timeline-sequence';
import { Badge } from '@/ui/primitives/badge';
import { Button } from '@/ui/primitives/button';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/ui/primitives/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/ui/primitives/table';
import {
	ArrowRightLeftIcon,
	CalendarIcon,
	CheckIcon,
	CloudIcon,
	DropletsIcon,
	FlowerIcon,
	PackageIcon,
	PencilIcon,
	ScissorsIcon,
	SunIcon,
	ThermometerIcon,
	TrashIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export function PlantDetailPage() {
	const t = useTranslations();
	const params = useParams();
	const id = params?.id as string;

	const {
		plant,
		sourceGrowingUnit,
		targetGrowingUnits,
		plantAgeText,
		upcomingCareGroups,
		isLoading,
		isLoadingTransplant,
		isUpdating,
		error,
		transplantError,
		updateError,
		transplantDialogOpen,
		setTransplantDialogOpen,
		editDetailsDialogOpen,
		setEditDetailsDialogOpen,
		handleTransplantSubmit,
		handleUpdateSubmit,
	} = usePlantDetailPage(id);

	// Show skeleton while loading or if data is not yet available
	if (isLoading || plant === null || plant === undefined) {
		return <PlantDetailPageSkeleton />;
	}

	if (error || !plant) {
		return (
			<div className="mx-auto py-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<p className="text-destructive">
						{t('pages.plants.detail.error.loading', {
							message: (error as Error)?.message || 'Unknown error',
						})}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto space-y-6">
			{/* Plant Image and Details Card */}
			<Card className="py-0">
				<CardContent className="p-0">
					<div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-stretch">
						{/* Left: Plant Image */}
						<div className="min-h-full w-full overflow-hidden bg-muted rounded-l-xl">
							<div className="h-full w-full flex items-center justify-center aspect-square md:aspect-auto">
								<FlowerIcon className="h-16 w-16 text-muted-foreground" />
							</div>
						</div>

						{/* Right: Plant Details */}
						<div className="space-y-6 p-6">
							{/* Header with Title, Scientific Name, and Badges */}
							<div className="space-y-2">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-1">
										<h1 className="text-3xl font-bold">
											{plant.name || t('pages.plants.detail.unnamed')}
										</h1>
										<p className="text-muted-foreground">
											{plant.species || t('common.notSet')} • Araceae
										</p>
									</div>
									<div className="flex items-center gap-2 flex-wrap">
										{getPlantStatusBadge(plant.status, t)}
										<Badge variant="outline">
											{t('pages.plants.detail.location.indoor')}
										</Badge>
									</div>
								</div>
							</div>

							{/* Care Metrics */}
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<DropletsIcon className="h-4 w-4" />
										<span>
											{t('pages.plants.detail.metrics.watering.label')}
										</span>
									</div>
									<p className="font-medium">
										{t('pages.plants.detail.metrics.watering.every7Days')}
									</p>
								</div>
								<div className="space-y-1">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<SunIcon className="h-4 w-4" />
										<span>{t('pages.plants.detail.metrics.light.label')}</span>
									</div>
									<p className="font-medium">
										{t('pages.plants.detail.metrics.light.indirect')}
									</p>
								</div>
								<div className="space-y-1">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<ThermometerIcon className="h-4 w-4" />
										<span>
											{t('pages.plants.detail.metrics.temperature.label')}
										</span>
									</div>
									<p className="font-medium">18-24°C</p>
								</div>
								<div className="space-y-1">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<CloudIcon className="h-4 w-4" />
										<span>
											{t('pages.plants.detail.metrics.humidity.label')}
										</span>
									</div>
									<p className="font-medium">
										{t('pages.plants.detail.metrics.humidity.high')}
									</p>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex items-center gap-2 flex-wrap">
								<Button
									variant="default"
									onClick={() => setEditDetailsDialogOpen(true)}
								>
									<PencilIcon className="mr-2 h-4 w-4" />
									{t('pages.plants.detail.actions.editDetails')}
								</Button>
								<Button variant="outline">
									<DropletsIcon className="mr-2 h-4 w-4" />
									{t('pages.plants.detail.actions.registerWatering')}
								</Button>
								<Button variant="outline">
									<FlowerIcon className="mr-2 h-4 w-4" />
									{t('pages.plants.detail.actions.fertilize')}
								</Button>
								<Button
									variant="outline"
									onClick={() => setTransplantDialogOpen(true)}
								>
									<ArrowRightLeftIcon className="mr-2 h-4 w-4" />
									{t('pages.plants.detail.actions.transplant')}
								</Button>
								<Button variant="ghost" size="icon">
									<TrashIcon className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Estado Actual Section */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('pages.plants.detail.currentStatus.lastWatering.label')}
						</CardTitle>
						<DropletsIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2 mb-2">
							<Badge variant="default" className="bg-green-500">
								{t('pages.plants.detail.currentStatus.lastWatering.onTime')}
							</Badge>
						</div>
						<div className="text-2xl font-bold">
							{t('shared.time.daysAgo', {
								days: 2,
							})}
						</div>
						<p className="text-xs text-muted-foreground">
							{t('pages.plants.detail.currentStatus.lastWatering.next')}:{' '}
							{t('common.tomorrow')}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('pages.plants.detail.currentStatus.lastFertilization.label')}
						</CardTitle>
						<FlowerIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2 mb-2">
							<Badge
								variant="outline"
								className="border-orange-500 text-orange-500"
							>
								{t('common.pending')}
							</Badge>
						</div>
						<div className="text-2xl font-bold">
							{t('shared.time.monthsAgo', {
								months: 1,
							})}
						</div>
						<p className="text-xs text-muted-foreground">
							{t(
								'pages.plants.detail.currentStatus.lastFertilization.suggested',
							)}
							: {t('common.today')}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{t('pages.plants.detail.currentStatus.plantingDate.label')}
						</CardTitle>
						<CalendarIcon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{plant.plantedDate
								? new Date(plant.plantedDate).toLocaleDateString('en-US', {
										day: 'numeric',
										month: 'short',
										year: 'numeric',
									})
								: t('common.notSet')}
						</div>
						{plantAgeText && (
							<p className="text-xs text-muted-foreground">
								{t('pages.plants.detail.currentStatus.plantingDate.age')}:{' '}
								{plantAgeText}
							</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Main Content Grid - Two Columns */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Notas Personales Section */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{t('pages.plants.detail.sections.personalNotes.title')}
								</CardTitle>
								<Button variant="ghost" size="sm">
									{t('pages.plants.detail.sections.personalNotes.edit')}
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground whitespace-pre-wrap">
								{plant.notes ||
									t('pages.plants.detail.sections.personalNotes.empty')}
							</p>
						</CardContent>
					</Card>

					{/* Historial Reciente Section */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{t('pages.plants.detail.sections.recentHistory.title')}
								</CardTitle>
								<Button variant="link" className="h-auto p-0">
									{t('common.viewAll')}
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											{t(
												'pages.plants.detail.sections.recentHistory.table.date',
											)}
										</TableHead>
										<TableHead>
											{t(
												'pages.plants.detail.sections.recentHistory.table.action',
											)}
										</TableHead>
										<TableHead>
											{t(
												'pages.plants.detail.sections.recentHistory.table.details',
											)}
										</TableHead>
										<TableHead>
											{t(
												'pages.plants.detail.sections.recentHistory.table.status',
											)}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>{t('common.today')} - 09:30 AM</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
													<DropletsIcon className="h-4 w-4 text-blue-500" />
												</div>
												<span>
													{t(
														'pages.plants.detail.sections.recentHistory.watering',
													)}
												</span>
											</div>
										</TableCell>
										<TableCell>
											{t(
												'pages.plants.detail.sections.recentHistory.wateringDetails',
											)}
										</TableCell>
										<TableCell>
											<Badge variant="default" className="bg-green-500">
												<CheckIcon className="h-3 w-3 mr-1" />
												{t('common.completed')}
											</Badge>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>12 Oct, 2023</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
													<ScissorsIcon className="h-4 w-4 text-green-500" />
												</div>
												<span>
													{t(
														'pages.plants.detail.sections.recentHistory.pruning',
													)}
												</span>
											</div>
										</TableCell>
										<TableCell>
											{t(
												'pages.plants.detail.sections.recentHistory.pruningDetails',
											)}
										</TableCell>
										<TableCell>
											<Badge variant="default" className="bg-green-500">
												<CheckIcon className="h-3 w-3 mr-1" />
												{t('common.completed')}
											</Badge>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>01 Oct, 2023</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
													<PackageIcon className="h-4 w-4 text-orange-500" />
												</div>
												<span>
													{t(
														'pages.plants.detail.sections.recentHistory.fertilization',
													)}
												</span>
											</div>
										</TableCell>
										<TableCell>
											{t(
												'pages.plants.detail.sections.recentHistory.fertilizationDetails',
											)}
										</TableCell>
										<TableCell>
											<Badge variant="default" className="bg-green-500">
												<CheckIcon className="h-3 w-3 mr-1" />
												{t('common.completed')}
											</Badge>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					{/* Galería de Progreso Section */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>
									{t('pages.plants.detail.sections.progressGallery.title')}
								</CardTitle>
								<Button variant="ghost" size="icon">
									<FlowerIcon className="h-4 w-4" />
								</Button>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-4 gap-4">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="h-24 bg-muted rounded-lg flex items-center justify-center"
									>
										{i === 4 ? (
											<span className="text-xs text-muted-foreground">
												+12{' '}
												{t('pages.plants.detail.sections.progressGallery.more')}
											</span>
										) : (
											<FlowerIcon className="h-8 w-8 text-muted-foreground" />
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Sidebar */}
				<div className="space-y-6">
					{/* Próximos Cuidados Section */}
					<Card>
						<CardHeader>
							<CardTitle>
								{t('pages.plants.detail.sections.upcomingCare.title')}
							</CardTitle>
						</CardHeader>
						<CardContent className="px-6 pb-6">
							<TimelineSequence
								groups={upcomingCareGroups}
								activeColor="green"
							/>
						</CardContent>
					</Card>

					{/* Wiki Planta Section */}
					<Card className="bg-green-50 border-green-200">
						<CardHeader>
							<div className="flex items-center gap-2">
								<FlowerIcon className="h-5 w-5 text-green-600" />
								<CardTitle className="text-green-900">
									{t('pages.plants.detail.sections.wiki.title')}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-green-800 mb-2">
								<strong>
									{t('pages.plants.detail.sections.wiki.didYouKnow')}
								</strong>
							</p>
							<p className="text-green-700 mb-4">
								{t('pages.plants.detail.sections.wiki.description')}
							</p>
							<Button variant="link" className="p-0 text-green-600">
								{t('pages.plants.detail.sections.wiki.readMore')} →
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Transplant Modal */}
			<PlantTransplantModal
				plant={plant}
				sourceGrowingUnit={sourceGrowingUnit}
				targetGrowingUnits={targetGrowingUnits}
				open={transplantDialogOpen}
				onOpenChange={setTransplantDialogOpen}
				onSubmit={handleTransplantSubmit}
				isLoading={isLoadingTransplant}
				error={transplantError}
			/>

			{/* Edit Details Modal */}
			<PlantEditDetailsModal
				plant={plant}
				open={editDetailsDialogOpen}
				onOpenChange={setEditDetailsDialogOpen}
				onSubmit={handleUpdateSubmit}
				isLoading={isUpdating}
				error={updateError}
			/>
		</div>
	);
}

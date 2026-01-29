"use client";

import {
	Card,
	CardContent,
	CardHeader,
} from "@/ui/primitives/card";
import { Skeleton } from "@/ui/primitives/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/ui/primitives/table";

/**
 * Skeleton component for the plant detail page
 * Matches the actual layout structure of the plant detail page
 */
export function PlantDetailPageSkeleton() {
	return (
		<div className="mx-auto space-y-6">
			{/* Plant Image and Details Card */}
			<Card className="py-0">
				<CardContent className="p-0">
					<div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] items-stretch">
						{/* Left: Plant Image Skeleton */}
						<div className="min-h-full w-full overflow-hidden bg-muted rounded-l-xl">
							<Skeleton className="h-full w-full aspect-square md:aspect-auto min-h-[400px]" />
						</div>

						{/* Right: Plant Details Skeleton */}
						<div className="space-y-6 p-6">
							{/* Header with Title, Scientific Name, and Badges */}
							<div className="space-y-2">
								<div className="flex items-start justify-between gap-4">
									<div className="space-y-2 flex-1">
										<Skeleton className="h-9 w-64" />
										<Skeleton className="h-5 w-48" />
									</div>
									<div className="flex items-center gap-2 flex-wrap">
										<Skeleton className="h-6 w-20 rounded-full" />
										<Skeleton className="h-6 w-24 rounded-full" />
									</div>
								</div>
							</div>

							{/* Care Metrics Skeleton */}
							<div className="grid grid-cols-2 gap-4">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="space-y-2">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-5 w-32" />
									</div>
								))}
							</div>

							{/* Action Buttons Skeleton */}
							<div className="flex items-center gap-2 flex-wrap">
								<Skeleton className="h-10 w-32" />
								<Skeleton className="h-10 w-40" />
								<Skeleton className="h-10 w-28" />
								<Skeleton className="h-10 w-32" />
								<Skeleton className="h-10 w-10" />
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Estado Actual Section Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{[1, 2, 3].map((i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-4 w-4 rounded" />
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-2 mb-2">
								<Skeleton className="h-6 w-20 rounded-full" />
							</div>
							<Skeleton className="h-8 w-24 mb-2" />
							<Skeleton className="h-4 w-40" />
						</CardContent>
					</Card>
				))}
			</div>

			{/* Main Content Grid - Two Columns */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Notas Personales Section Skeleton */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-8 w-16" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</CardContent>
					</Card>

					{/* Historial Reciente Section Skeleton */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-4 w-20" />
							</div>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>
											<Skeleton className="h-4 w-20" />
										</TableHead>
										<TableHead>
											<Skeleton className="h-4 w-24" />
										</TableHead>
										<TableHead>
											<Skeleton className="h-4 w-24" />
										</TableHead>
										<TableHead>
											<Skeleton className="h-4 w-20" />
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{[1, 2, 3].map((i) => (
										<TableRow key={i}>
											<TableCell>
												<Skeleton className="h-4 w-32" />
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Skeleton className="h-8 w-8 rounded-full" />
													<Skeleton className="h-4 w-24" />
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-40" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-6 w-20 rounded-full" />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>

					{/* Galería de Progreso Section Skeleton */}
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-8 w-8 rounded" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-4 gap-4">
								{[1, 2, 3, 4].map((i) => (
									<Skeleton key={i} className="h-24 w-full rounded-lg" />
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Sidebar */}
				<div className="space-y-6">
					{/* Próximos Cuidados Section Skeleton */}
					<Card>
						<CardHeader>
							<Skeleton className="h-6 w-40" />
						</CardHeader>
						<CardContent className="px-6 pb-6">
							<div className="space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="space-y-2">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-3/4" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Wiki Planta Section Skeleton */}
					<Card className="bg-green-50 border-green-200">
						<CardHeader>
							<div className="flex items-center gap-2">
								<Skeleton className="h-5 w-5 rounded" />
								<Skeleton className="h-6 w-32" />
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
							<Skeleton className="h-4 w-24 mt-4" />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}


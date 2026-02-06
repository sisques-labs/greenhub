'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';

/**
 * Skeleton component for the user profile page
 * Simulates the structure of the complete user profile page
 */
export function UserProfilePageSkeleton() {
	return (
		<div className="mx-auto space-y-6">
			{/* Header Skeleton */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
						{/* Avatar Skeleton */}
						<Skeleton className="size-24 rounded-full" />
						<div className="flex-1 space-y-2">
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
								{/* Name Skeleton */}
								<Skeleton className="h-9 w-64" />
								{/* Badges Skeleton */}
								<div className="flex gap-2">
									<Skeleton className="h-6 w-20" />
									<Skeleton className="h-6 w-24" />
								</div>
							</div>
							{/* Username Skeleton */}
							<Skeleton className="h-5 w-32" />
							{/* Bio Skeleton */}
							<Skeleton className="h-4 w-full max-w-md" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Grid Layout for Sections */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Personal Information Card Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-6 w-48" />
						</CardTitle>
						<CardDescription>
							<Skeleton className="h-4 w-64" />
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-5 w-40" />
						</div>
						<Skeleton className="h-px w-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-5 w-36" />
						</div>
						<Skeleton className="h-px w-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-5 w-44" />
						</div>
					</CardContent>
				</Card>

				{/* Authentication Information Card Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-6 w-56" />
						</CardTitle>
						<CardDescription>
							<Skeleton className="h-4 w-full max-w-xs" />
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-5 w-48" />
						</div>
						<Skeleton className="h-px w-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-5 w-36" />
						</div>
					</CardContent>
				</Card>

				{/* Account Information Card Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-6 w-52" />
						</CardTitle>
						<CardDescription>
							<Skeleton className="h-4 w-full max-w-xs" />
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-5 w-32" />
						</div>
						<Skeleton className="h-px w-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-5 w-36" />
						</div>
						<Skeleton className="h-px w-full" />
						<div className="space-y-2">
							<Skeleton className="h-4 w-40" />
							<Skeleton className="h-5 w-56" />
						</div>
					</CardContent>
				</Card>

				{/* Contact Information Card Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-6 w-52" />
						</CardTitle>
						<CardDescription>
							<Skeleton className="h-4 w-full max-w-xs" />
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-5 w-56" />
						</div>
					</CardContent>
				</Card>

				{/* Edit Form Card Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>
							<Skeleton className="h-6 w-40" />
						</CardTitle>
						<CardDescription>
							<Skeleton className="h-4 w-60" />
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-36" />
							<Skeleton className="h-10 w-full" />
						</div>
						<Skeleton className="h-10 w-full" />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

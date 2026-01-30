"use client";

import { Skeleton } from "@/ui/primitives/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/ui/primitives/table";

interface PlantsTableSkeletonProps {
	/**
	 * Number of skeleton rows to display
	 * @default 10
	 */
	rows?: number;
}

/**
 * Skeleton component for the plants table only
 * Adapts to the number of rows specified to match the expected page size
 */
export function PlantsTableSkeleton({ rows = 10 }: PlantsTableSkeletonProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[80px]">
							<Skeleton className="h-4 w-12" />
						</TableHead>
						<TableHead>
							<Skeleton className="h-4 w-32" />
						</TableHead>
						<TableHead>
							<Skeleton className="h-4 w-24" />
						</TableHead>
						<TableHead>
							<Skeleton className="h-4 w-20" />
						</TableHead>
						<TableHead>
							<Skeleton className="h-4 w-28" />
						</TableHead>
						<TableHead className="w-[80px]">
							<Skeleton className="h-4 w-20" />
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: rows }).map((_, i) => (
						<TableRow key={i}>
							<TableCell>
								<Skeleton className="h-10 w-10 rounded-full" />
							</TableCell>
							<TableCell>
								<div className="space-y-1">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-3 w-24" />
								</div>
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-20" />
								</div>
							</TableCell>
							<TableCell>
								<Skeleton className="h-5 w-16 rounded-full" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-24" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-8 w-8 rounded-md" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}


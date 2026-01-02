"use client";

import { Skeleton } from "@repo/shared/presentation/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@repo/shared/presentation/components/ui/table";

/**
 * Skeleton component for the plants table only
 */
export function PlantsTableSkeleton() {
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
					{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
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


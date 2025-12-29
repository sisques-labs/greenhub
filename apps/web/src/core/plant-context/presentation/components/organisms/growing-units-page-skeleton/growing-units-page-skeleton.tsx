'use client';

import {
  PageHeaderSkeleton,
  SearchAndFiltersSkeleton,
} from '@/shared/presentation/components/ui/page-skeleton/page-skeleton';
import {
  Card,
  CardContent,
  CardHeader,
} from '@repo/shared/presentation/components/ui/card';
import { Skeleton } from '@repo/shared/presentation/components/ui/skeleton';

/**
 * Skeleton component for a single growing unit card
 */
function GrowingUnitCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          {/* Image placeholder */}
          <Skeleton className="w-full h-32 rounded-md" />
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-2 w-2 rounded-full" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton component for the growing units page
 */
export function GrowingUnitsPageSkeleton() {
  return (
    <div className="mx-auto space-y-6">
      {/* Header */}
      <PageHeaderSkeleton />

      {/* Search and Filters */}
      <SearchAndFiltersSkeleton />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GrowingUnitCardSkeleton key={i} />
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </div>
  );
}

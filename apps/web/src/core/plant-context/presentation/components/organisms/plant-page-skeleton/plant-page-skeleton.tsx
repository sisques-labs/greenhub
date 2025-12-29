'use client';

import {
  Card,
  CardContent,
  CardHeader,
} from '@repo/shared/presentation/components/ui/card';
import { Skeleton } from '@repo/shared/presentation/components/ui/skeleton';

export function PlantPageSkeleton() {
  return (
    <div className="mx-auto space-y-6">
      {/* Header Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-9 w-64" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-48 sm:col-span-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-20 w-full sm:col-span-2" />
          </div>
        </CardContent>
      </Card>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-32 ml-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Skeleton } from '@repo/shared/presentation/components/ui/skeleton';

/**
 * Skeleton component for the plants management page
 * Simulates the structure of the complete plants management page
 */
export function PlantsManagementPageSkeleton() {
  return (
    <div className="mx-auto space-y-6 px-4 sm:px-0">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48 sm:w-64" />
          <Skeleton className="h-5 w-64 sm:w-80" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Skeleton className="h-10 w-full sm:w-32" />
          <Skeleton className="h-10 w-full sm:w-32" />
        </div>
      </div>

      {/* Grid of Container Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 space-y-2 min-w-0">
                  <CardTitle>
                    <Skeleton className="h-6 w-24 sm:w-32" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton className="h-4 w-20 sm:w-24" />
                  </CardDescription>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Skeleton className="h-9 w-9" />
                  <Skeleton className="h-9 w-9" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {/* Plants count and add button */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Skeleton className="h-5 w-20 sm:w-24" />
                <Skeleton className="h-8 w-full sm:w-28" />
              </div>

              {/* Plants list skeleton */}
              <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, plantIndex) => (
                  <Card key={plantIndex} className="bg-muted/50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 space-y-2 min-w-0">
                          <Skeleton className="h-4 w-20 sm:w-24" />
                          <Skeleton className="h-3 w-28 sm:w-32" />
                          <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-3 w-14 sm:w-16" />
                            <Skeleton className="h-3 w-18 sm:w-20" />
                          </div>
                          <Skeleton className="h-3 w-full sm:max-w-xs" />
                        </div>
                        <div className="flex gap-1 ml-2 shrink-0">
                          <Skeleton className="h-6 w-6" />
                          <Skeleton className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

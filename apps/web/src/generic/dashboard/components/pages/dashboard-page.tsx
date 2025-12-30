'use client';

import { DashboardStatsCards } from '@/generic/dashboard/components/organisms/dashboard-stats-cards/dashboard-stats-cards';
import { GrowingUnitsStatusSection } from '@/generic/dashboard/components/organisms/growing-units-status-section/growing-units-status-section';
import { RecentAlertsSection } from '@/generic/dashboard/components/organisms/recent-alerts-section/recent-alerts-section';
import { TodayTasksSection } from '@/generic/dashboard/components/organisms/today-tasks-section/today-tasks-section';
import { useDashboardPage } from '@/generic/dashboard/hooks/use-dashboard-page/use-dashboard-page';
import { useAppRoutes } from '@/shared/hooks/use-routes';
import { PageHeader } from '@repo/shared/presentation/components/organisms/page-header';
import { Button } from '@repo/shared/presentation/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

/**
 * Dashboard page component
 * Main dashboard that displays overview of plants, growing units, alerts, and tasks
 */
export function DashboardPage() {
  const t = useTranslations('dashboard');
  const { routes } = useAppRoutes();
  const {
    stats,
    recentGrowingUnits,
    recentAlerts,
    todayTasks,
    isLoading,
    error,
  } = useDashboardPage();

  if (error) {
    return (
      <div className="mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">
            {t('error.loading', {
              message: (error as Error).message,
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
        title={t('page.title')}
        description={t('page.description')}
        actions={[
          <Button key="add-plant" asChild>
            <Link href={routes.plants}>
              <PlusIcon className="mr-2 h-4 w-4" />
              {t('page.addPlantButton')}
            </Link>
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <DashboardStatsCards
        totalPlants={stats.totalPlants}
        activeUnits={stats.activeUnits}
        readyForHarvest={stats.readyForHarvest}
        criticalAlerts={stats.criticalAlerts}
        isLoading={isLoading}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Growing Units Status */}
        <div className="lg:col-span-2">
          <GrowingUnitsStatusSection
            growingUnits={recentGrowingUnits}
            isLoading={isLoading}
          />
        </div>

        {/* Recent Alerts */}
        <RecentAlertsSection alerts={recentAlerts} isLoading={isLoading} />

        {/* Today's Tasks */}
        <TodayTasksSection tasks={todayTasks} isLoading={isLoading} />
      </div>
    </div>
  );
}

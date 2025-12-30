'use client';

import { usePlantFindById } from '@/core/plant-context/presentation/hooks/use-plant-find-by-id/use-plant-find-by-id';
import { getPlantStatusBadge } from '@/core/plant-context/presentation/utils/plant-status.utils';
import {
  TimelineSequence,
  type TimelineSequenceGroup,
} from '@repo/shared/presentation/components/molecules/timeline-sequence';
import { Badge } from '@repo/shared/presentation/components/ui/badge';
import { Button } from '@repo/shared/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { Skeleton } from '@repo/shared/presentation/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/shared/presentation/components/ui/table';
import {
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
import { useMemo } from 'react';

export function PlantDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const id = params?.id as string;

  const { plant, isLoading, error, refetch } = usePlantFindById(id || '');

  // Prepare upcoming care data for TimelineSequence
  // Must be called before any early returns to maintain hooks order
  // TODO: This should be fetched from the backend and not hardcoded
  const upcomingCareGroups: TimelineSequenceGroup[] = useMemo(() => {
    return [
      {
        id: 'tomorrow',
        label: t('plant.detail.upcomingCare.tomorrow'),
        isActive: true,
        items: [
          {
            id: 'tomorrow-watering',
            title: t('plant.detail.upcomingCare.lightWatering'),
            subtitle: '10:00 AM',
          },
        ],
      },
      {
        id: 'in5days',
        label: t('plant.detail.upcomingCare.in5Days'),
        items: [
          {
            id: 'in5days-cleaning',
            title: t('plant.detail.upcomingCare.cleanLeaves'),
            subtitle: t('plant.detail.upcomingCare.duringDay'),
          },
        ],
      },
      {
        id: 'in2weeks',
        label: t('plant.detail.upcomingCare.in2Weeks'),
        items: [
          {
            id: 'in2weeks-fertilization',
            title: t('plant.detail.upcomingCare.fertilization'),
            subtitle: t('plant.detail.upcomingCare.spring'),
          },
        ],
      },
    ];
  }, [t]);

  if (isLoading) {
    return (
      <div className="mx-auto space-y-6">
        <Skeleton className="h-6 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">
            {t('plant.error.loading', {
              message: (error as Error)?.message || 'Unknown error',
            })}
          </p>
        </div>
      </div>
    );
  }

  // Calculate plant age
  const calculateAge = () => {
    if (!plant.plantedDate) return null;
    const plantedDate = new Date(plant.plantedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - plantedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    if (years > 0 && months > 0) {
      return t('plant.detail.age.yearsMonths', { years, months });
    } else if (years > 0) {
      return t('plant.detail.age.years', { years });
    } else if (months > 0) {
      return t('plant.detail.age.months', { months });
    } else {
      return t('plant.detail.age.days', { days: diffDays });
    }
  };

  const plantAge = calculateAge();

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
                      {plant.name || t('plant.common.unnamed')}
                    </h1>
                    <p className="text-muted-foreground">
                      {plant.species || t('plant.common.notSet')} • Araceae
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getPlantStatusBadge(plant.status, t)}
                    <Badge variant="outline">
                      {t('plant.detail.location.indoor')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Care Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DropletsIcon className="h-4 w-4" />
                    <span>{t('plant.detail.metrics.watering.label')}</span>
                  </div>
                  <p className="font-medium">
                    {t('plant.detail.metrics.watering.every7Days')}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <SunIcon className="h-4 w-4" />
                    <span>{t('plant.detail.metrics.light.label')}</span>
                  </div>
                  <p className="font-medium">
                    {t('plant.detail.metrics.light.indirect')}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ThermometerIcon className="h-4 w-4" />
                    <span>{t('plant.detail.metrics.temperature.label')}</span>
                  </div>
                  <p className="font-medium">18-24°C</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CloudIcon className="h-4 w-4" />
                    <span>{t('plant.detail.metrics.humidity.label')}</span>
                  </div>
                  <p className="font-medium">
                    {t('plant.detail.metrics.humidity.high')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="default">
                  <PencilIcon className="mr-2 h-4 w-4" />
                  {t('plant.detail.actions.editDetails')}
                </Button>
                <Button variant="outline">
                  <DropletsIcon className="mr-2 h-4 w-4" />
                  {t('plant.detail.actions.registerWatering')}
                </Button>
                <Button variant="outline">
                  <FlowerIcon className="mr-2 h-4 w-4" />
                  {t('plant.detail.actions.fertilize')}
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
              {t('plant.detail.currentStatus.lastWatering.label')}
            </CardTitle>
            <DropletsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default" className="bg-green-500">
                {t('plant.detail.currentStatus.lastWatering.onTime')}
              </Badge>
            </div>
            <div className="text-2xl font-bold">
              {t('plant.detail.currentStatus.lastWatering.daysAgo', {
                days: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('plant.detail.currentStatus.lastWatering.next')}:{' '}
              {t('plant.detail.currentStatus.lastWatering.tomorrow')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('plant.detail.currentStatus.lastFertilization.label')}
            </CardTitle>
            <FlowerIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="border-orange-500 text-orange-500"
              >
                {t('plant.detail.currentStatus.lastFertilization.pending')}
              </Badge>
            </div>
            <div className="text-2xl font-bold">
              {t('plant.detail.currentStatus.lastFertilization.monthAgo', {
                months: 1,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('plant.detail.currentStatus.lastFertilization.suggested')}:{' '}
              {t('plant.detail.currentStatus.lastFertilization.today')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('plant.detail.currentStatus.plantingDate.label')}
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
                : t('plant.common.notSet')}
            </div>
            {plantAge && (
              <p className="text-xs text-muted-foreground">
                {t('plant.detail.currentStatus.plantingDate.age')}: {plantAge}
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
                <CardTitle>{t('plant.detail.personalNotes.title')}</CardTitle>
                <Button variant="ghost" size="sm">
                  {t('plant.detail.personalNotes.edit')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {plant.notes || t('plant.detail.personalNotes.empty')}
              </p>
            </CardContent>
          </Card>

          {/* Historial Reciente Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('plant.detail.recentHistory.title')}</CardTitle>
                <Button variant="link" className="h-auto p-0">
                  {t('plant.detail.recentHistory.viewAll')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      {t('plant.detail.recentHistory.table.date')}
                    </TableHead>
                    <TableHead>
                      {t('plant.detail.recentHistory.table.action')}
                    </TableHead>
                    <TableHead>
                      {t('plant.detail.recentHistory.table.details')}
                    </TableHead>
                    <TableHead>
                      {t('plant.detail.recentHistory.table.status')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      {t('plant.detail.recentHistory.today')} - 09:30 AM
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <DropletsIcon className="h-4 w-4 text-blue-500" />
                        </div>
                        <span>{t('plant.detail.recentHistory.watering')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {t('plant.detail.recentHistory.wateringDetails')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        {t('plant.detail.recentHistory.completed')}
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
                        <span>{t('plant.detail.recentHistory.pruning')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {t('plant.detail.recentHistory.pruningDetails')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        {t('plant.detail.recentHistory.completed')}
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
                          {t('plant.detail.recentHistory.fertilization')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {t('plant.detail.recentHistory.fertilizationDetails')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-500">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        {t('plant.detail.recentHistory.completed')}
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
                <CardTitle>{t('plant.detail.progressGallery.title')}</CardTitle>
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
                        +12 {t('plant.detail.progressGallery.more')}
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
              <CardTitle>{t('plant.detail.upcomingCare.title')}</CardTitle>
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
                  {t('plant.detail.wiki.title')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800 mb-2">
                <strong>{t('plant.detail.wiki.didYouKnow')}</strong>
              </p>
              <p className="text-green-700 mb-4">
                {t('plant.detail.wiki.description')}
              </p>
              <Button variant="link" className="p-0 text-green-600">
                {t('plant.detail.wiki.readMore')} →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

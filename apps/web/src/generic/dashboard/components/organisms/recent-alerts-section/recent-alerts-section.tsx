'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/shared/presentation/components/ui/card';
import { AlertTriangleIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  location: string;
  timeAgo: string;
}

interface RecentAlertsSectionProps {
  alerts: Alert[];
  isLoading?: boolean;
}

/**
 * Recent alerts section component
 * Displays recent system alerts and warnings
 */
export function RecentAlertsSection({
  alerts,
  isLoading = false,
}: RecentAlertsSectionProps) {
  const t = useTranslations('dashboard.recentAlerts');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">{t('empty')}</p>
        </CardContent>
      </Card>
    );
  }

  const getAlertStyles = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          text: 'text-red-900',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: 'text-orange-600',
          text: 'text-orange-900',
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          text: 'text-blue-900',
        };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const styles = getAlertStyles(alert.severity);
          return (
            <div
              key={alert.id}
              className={`${styles.bg} ${styles.border} border rounded-lg p-4 flex items-start gap-3`}
            >
              <AlertTriangleIcon
                className={`h-5 w-5 ${styles.icon} mt-0.5 flex-shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold ${styles.text} mb-1`}>
                  {alert.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {alert.description} • {alert.timeAgo}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

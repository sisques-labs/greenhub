'use client';

import { Card } from '@repo/shared/presentation/components/ui/card';
import { cn } from '@repo/shared/presentation/lib/utils';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';

/**
 * Represents a single item in a timeline step group.
 */
export type TimelineSequenceItem = {
  /**
   * Unique identifier for the item.
   */
  id: string;
  /**
   * Main title of the item.
   */
  title: string;
  /**
   * Optional subtitle or additional information.
   */
  subtitle?: string;
  /**
   * Optional action icon element. If provided, renders an action button.
   */
  actionIcon?: React.ReactNode;
  /**
   * Optional callback when the action icon is clicked.
   */
  onActionClick?: () => void;
  /**
   * Optional additional data attached to the item.
   */
  data?: unknown;
};

/**
 * Represents a group of items in the timeline with a label and status.
 */
export type TimelineSequenceGroup = {
  /**
   * Unique identifier for the group.
   */
  id: string;
  /**
   * Label displayed for this group (e.g., "MAÑANA", "EN 5 DÍAS").
   */
  label: string;
  /**
   * Whether this group is active/current. Active groups use primary color.
   */
  isActive?: boolean;
  /**
   * Items belonging to this group.
   */
  items: TimelineSequenceItem[];
};

export type TimelineSequenceProps = {
  /**
   * Title displayed at the top of the timeline.
   */
  title?: string;
  /**
   * Groups of items to display in the timeline.
   */
  groups: TimelineSequenceGroup[];
  /**
   * Optional custom class name for the container.
   */
  className?: string;
  /**
   * Optional callback when an item is clicked.
   */
  onItemClick?: (
    item: TimelineSequenceItem,
    group: TimelineSequenceGroup,
  ) => void;
  /**
   * Color variant for active groups. Defaults to 'green'.
   */
  activeColor?: 'green' | 'blue' | 'purple' | 'orange' | 'red';
};

/**
 * A timeline/sequence component that displays groups of items in a chronological order
 * with a vertical timeline indicator and status colors.
 *
 * @example
 * ```tsx
 * const groups = [
 *   {
 *     id: '1',
 *     label: 'MAÑANA',
 *     isActive: true,
 *     items: [
 *       {
 *         id: '1-1',
 *         title: 'Riego Ligero',
 *         subtitle: '10:00 AM',
 *       },
 *     ],
 *   },
 *   {
 *     id: '2',
 *     label: 'EN 5 DÍAS',
 *     items: [
 *       {
 *         id: '2-1',
 *         title: 'Limpiar Hojas',
 *         subtitle: 'Durante el día',
 *       },
 *     ],
 *   },
 * ];
 *
 * <TimelineSequence title="Próximos Cuidados" groups={groups} />
 * ```
 */
export function TimelineSequence({
  title,
  groups,
  className,
  onItemClick,
  activeColor = 'green',
}: TimelineSequenceProps) {
  const activeColorClasses = {
    green: {
      marker: 'bg-green-500',
      label: 'text-green-600',
    },
    blue: {
      marker: 'bg-blue-500',
      label: 'text-blue-600',
    },
    purple: {
      marker: 'bg-purple-500',
      label: 'text-purple-600',
    },
    orange: {
      marker: 'bg-orange-500',
      label: 'text-orange-600',
    },
    red: {
      marker: 'bg-red-500',
      label: 'text-red-600',
    },
  };

  const colorClasses = activeColorClasses[activeColor];

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <h2 className="mb-4 text-lg font-semibold text-foreground">{title}</h2>
      )}

      <div className="relative pl-0.5">
        {/* Timeline line - rendered dynamically between markers */}
        {groups.length > 0 && (
          <div className="absolute left-[9px] top-4 bottom-0 w-px bg-border" />
        )}

        {/* Groups */}
        <div className="space-y-6">
          {groups.map((group, groupIndex) => {
            const isActive = group.isActive ?? false;

            return (
              <div key={group.id} className="relative">
                {/* Timeline marker */}
                <div className="absolute left-0 top-1 z-10">
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border-2 border-background',
                      isActive ? colorClasses.marker : 'bg-muted-foreground/20',
                    )}
                  />
                </div>

                {/* Group content */}
                <div className="ml-6">
                  {/* Group label */}
                  <div
                    className={cn(
                      'mb-2 text-xs font-semibold uppercase tracking-wide',
                      isActive ? colorClasses.label : 'text-muted-foreground',
                    )}
                  >
                    {group.label}
                  </div>

                  {/* Group items */}
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'flex items-center justify-between rounded-lg border bg-card p-3 transition-colors',
                          onItemClick && 'cursor-pointer hover:bg-accent/50',
                        )}
                        onClick={() => onItemClick?.(item, group)}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-foreground">
                            {item.title}
                          </div>
                          {item.subtitle && (
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {item.subtitle}
                            </div>
                          )}
                        </div>

                        {(item.actionIcon || item.onActionClick) && (
                          <button
                            type="button"
                            className={cn(
                              'ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent',
                            )}
                            onClick={(e) => {
                              e.stopPropagation();
                              item.onActionClick?.();
                            }}
                            aria-label="Action"
                          >
                            {item.actionIcon ?? (
                              <CheckIcon className="h-3.5 w-3.5 text-foreground" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TimelineSequence;

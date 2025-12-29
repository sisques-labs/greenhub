'use client';

import * as React from 'react';

export interface PageHeaderProps {
  /**
   * The title of the page
   */
  title: string;
  /**
   * Optional description text or components below the title
   */
  description?: React.ReactNode;
  /**
   * Array of action buttons or elements to display on the right side
   */
  actions?: React.ReactNode[];
  /**
   * Additional className for the container
   */
  className?: string;
}

/**
 * PageHeader component
 * Displays a page title, optional description, and action buttons
 */
export function PageHeader({
  title,
  description,
  actions = [],
  className,
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className || ''}`}>
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <div className="mt-1">
            {typeof description === 'string' ? (
              <p className="text-muted-foreground">{description}</p>
            ) : (
              description
            )}
          </div>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

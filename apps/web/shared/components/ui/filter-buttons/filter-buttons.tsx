'use client';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface FilterOption {
	value: string;
	label: string;
	icon?: LucideIcon;
}

interface FilterButtonsProps {
	options: FilterOption[];
	selectedValue: string;
	onValueChange: (value: string) => void;
	className?: string;
}

/**
 * Reusable filter buttons component with icons support
 */
export function FilterButtons({
	options,
	selectedValue,
	onValueChange,
	className,
}: FilterButtonsProps) {
	return (
		<div className={cn('flex gap-2 flex-wrap', className)}>
			{options.map((option) => {
				const Icon = option.icon;
				const isSelected = selectedValue === option.value;

				return (
					<Button
						key={option.value}
						variant={isSelected ? 'default' : 'outline'}
						size="sm"
						onClick={() => onValueChange(option.value)}
						className={cn(isSelected && 'bg-primary text-primary-foreground')}
					>
						{Icon && <Icon className="mr-2 h-4 w-4" />}
						{option.label}
					</Button>
				);
			})}
		</div>
	);
}

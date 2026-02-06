'use client';

import type { LocationResponse } from "../../../api/types";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@repo/shared/presentation/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';

interface LocationDeleteDialogProps {
	location: LocationResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => Promise<void>;
	isLoading: boolean;
}

export function LocationDeleteDialog({
	location,
	open,
	onOpenChange,
	onConfirm,
	isLoading,
}: LocationDeleteDialogProps) {
	const t = useTranslations();

	if (!location) {
		return null;
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{t('pages.locations.list.actions.delete.confirm.title')}
					</AlertDialogTitle>
					<AlertDialogDescription>
						{t('pages.locations.list.actions.delete.confirm.description', {
							name: location.name,
						})}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						{t('common.cancel')}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isLoading}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isLoading
							? t('pages.locations.list.actions.delete.loading')
							: t('common.delete')}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

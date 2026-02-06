'use client';

import { Button } from '@/shared/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/dialog';
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import {
	createLocationUpdateSchema,
	type LocationUpdateFormValues,
} from 'features/locations/schemas/location-update/location-update.schema';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import type { LocationResponse } from '../../../api/types';

interface LocationUpdateFormProps {
	location: LocationResponse | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: LocationUpdateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function LocationUpdateForm({
	location,
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: LocationUpdateFormProps) {
	const t = useTranslations();

	// Create schema with translations
	const updateSchema = useMemo(
		() => createLocationUpdateSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [name, setName] = useState('');
	const [type, setType] =
		useState<LocationUpdateFormValues['type']>('INDOOR_SPACE');
	const [description, setDescription] = useState<string | null>(null);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Update form when location changes
	useEffect(() => {
		if (location) {
			setName(location.name);
			setType(location.type as LocationUpdateFormValues['type']);
			setDescription(location.description || null);
			setFormErrors({});
		}
	}, [location]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!location) return;

		// Validate form
		const result = updateSchema.safeParse({
			id: location.id,
			name,
			type,
			description,
		});

		if (!result.success) {
			const errors: Record<string, { message?: string }> = {};
			result.error.issues.forEach((err) => {
				if (err.path[0]) {
					errors[err.path[0] as string] = { message: err.message };
				}
			});
			setFormErrors(errors);
			return;
		}

		setFormErrors({});
		await onSubmit(result.data);
		if (!error) {
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset form
			if (location) {
				setName(location.name);
				setType(location.type as LocationUpdateFormValues['type']);
				setDescription(location.description || null);
			}
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	if (!location) {
		return null;
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t('pages.locations.list.actions.update.title')}
					</DialogTitle>
					<DialogDescription>
						{t('pages.locations.list.actions.update.description')}
					</DialogDescription>
				</DialogHeader>
				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormItem>
							<FormLabel>{t('shared.fields.name.label')}</FormLabel>
							<FormControl>
								<Input
									placeholder={t('shared.fields.name.placeholder')}
									disabled={isLoading}
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</FormControl>
							<FormMessage fieldName="name" />
						</FormItem>

						<FormItem>
							<FormLabel>{t('shared.fields.type.label')}</FormLabel>
							<Select
								onValueChange={(value) =>
									setType(value as LocationUpdateFormValues['type'])
								}
								value={type}
								disabled={isLoading}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder={t('shared.fields.type.placeholder')}
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="ROOM">
										{t('shared.types.location.ROOM')}
									</SelectItem>
									<SelectItem value="BALCONY">
										{t('shared.types.location.BALCONY')}
									</SelectItem>
									<SelectItem value="GARDEN">
										{t('shared.types.location.GARDEN')}
									</SelectItem>
									<SelectItem value="GREENHOUSE">
										{t('shared.types.location.GREENHOUSE')}
									</SelectItem>
									<SelectItem value="OUTDOOR_SPACE">
										{t('shared.types.location.OUTDOOR_SPACE')}
									</SelectItem>
									<SelectItem value="INDOOR_SPACE">
										{t('shared.types.location.INDOOR_SPACE')}
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage fieldName="type" />
						</FormItem>

						<FormItem>
							<FormLabel>{t('shared.fields.description.label')}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t('shared.fields.description.placeholder')}
									disabled={isLoading}
									value={description || ''}
									onChange={(e) => setDescription(e.target.value || null)}
									rows={4}
								/>
							</FormControl>
							<FormMessage fieldName="description" />
						</FormItem>

						{error && (
							<div className="text-sm text-destructive">{error.message}</div>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isLoading}
							>
								{t('common.cancel')}
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? t('pages.locations.list.actions.update.loading')
									: t('pages.locations.list.actions.update.submit')}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

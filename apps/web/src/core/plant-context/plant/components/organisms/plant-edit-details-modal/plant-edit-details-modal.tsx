"use client";

import { PLANT_STATUS } from "@repo/sdk";
import type { PlantResponse } from "@repo/sdk";
import { Button } from "@repo/shared/presentation/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/shared/presentation/components/ui/dialog";
import {
	Form,
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/shared/presentation/components/ui/form";
import { Input } from "@repo/shared/presentation/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@repo/shared/presentation/components/ui/select";
import { Textarea } from "@repo/shared/presentation/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import {
	createPlantUpdateSchema,
	PlantUpdateFormValues,
} from "@/core/plant-context/plant/dtos/schemas/plant-update/plant-update.schema";

interface PlantEditDetailsModalProps {
	plant: PlantResponse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: PlantUpdateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function PlantEditDetailsModal({
	plant,
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: PlantEditDetailsModalProps) {
	const t = useTranslations();

	// Create schema with translations
	const updateSchema = useMemo(
		() => createPlantUpdateSchema((key: string) => t(key)),
		[t],
	);

	// Form state - initialize with plant data
	const [name, setName] = useState(plant.name || "");
	const [species, setSpecies] = useState(plant.species || "");
	const [plantedDate, setPlantedDate] = useState<Date | null>(
		plant.plantedDate ? new Date(plant.plantedDate) : null,
	);
	const [notes, setNotes] = useState(plant.notes || "");
	const [status, setStatus] = useState<PlantUpdateFormValues["status"]>(
		(plant.status as PlantUpdateFormValues["status"]) || PLANT_STATUS.PLANTED,
	);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	// Update form when plant changes
	useEffect(() => {
		if (plant) {
			setName(plant.name || "");
			setSpecies(plant.species || "");
			setPlantedDate(plant.plantedDate ? new Date(plant.plantedDate) : null);
			setNotes(plant.notes || "");
			setStatus(
				(plant.status as PlantUpdateFormValues["status"]) ||
					PLANT_STATUS.PLANTED,
			);
		}
	}, [plant]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = updateSchema.safeParse({
			name: name || undefined,
			species: species || undefined,
			plantedDate: plantedDate || null,
			notes: notes || null,
			status,
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
			// Reset form to plant data
			setName(plant.name || "");
			setSpecies(plant.species || "");
			setPlantedDate(plant.plantedDate ? new Date(plant.plantedDate) : null);
			setNotes(plant.notes || "");
			setStatus(
				(plant.status as PlantUpdateFormValues["status"]) ||
					PLANT_STATUS.PLANTED,
			);
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t("pages.plants.detail.modals.editDetails.title")}
					</DialogTitle>
					<DialogDescription>
						{t("pages.plants.detail.modals.editDetails.description")}
					</DialogDescription>
				</DialogHeader>
				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>
									{t("pages.plants.detail.fields.name.label")}
								</FormLabel>
								<FormControl>
									<Input
										placeholder={t(
											"pages.plants.detail.fields.name.placeholder",
										)}
										disabled={isLoading}
										value={name}
										onChange={(e) => setName(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="name" />
							</FormItem>

							<FormItem>
								<FormLabel>{t("shared.fields.species.label")}</FormLabel>
								<FormControl>
									<Input
										placeholder={t("shared.fields.species.placeholder")}
										disabled={isLoading}
										value={species}
										onChange={(e) => setSpecies(e.target.value)}
									/>
								</FormControl>
								<FormMessage fieldName="species" />
							</FormItem>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>
									{t("pages.plants.detail.fields.plantedDate.label")}
								</FormLabel>
								<FormControl>
									<Input
										type="date"
										disabled={isLoading}
										value={
											plantedDate
												? new Date(plantedDate).toISOString().split("T")[0]
												: ""
										}
										onChange={(e) =>
											setPlantedDate(
												e.target.value ? new Date(e.target.value) : null,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="plantedDate" />
							</FormItem>

							<FormItem>
								<FormLabel>{t("shared.fields.status.label")}</FormLabel>
								<Select
									onValueChange={(value) =>
										setStatus(value as PlantUpdateFormValues["status"])
									}
									value={status}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t("shared.fields.status.placeholder")}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value={PLANT_STATUS.PLANTED}>
											{t("shared.status.plant.PLANTED")}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.GROWING}>
											{t("shared.status.plant.GROWING")}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.HARVESTED}>
											{t("shared.status.plant.HARVESTED")}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.DEAD}>
											{t("shared.status.plant.DEAD")}
										</SelectItem>
										<SelectItem value={PLANT_STATUS.ARCHIVED}>
											{t("shared.status.plant.ARCHIVED")}
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage fieldName="status" />
							</FormItem>
						</div>

						<FormItem>
							<FormLabel>{t("shared.fields.notes.label")}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t("shared.fields.notes.placeholder")}
									disabled={isLoading}
									rows={4}
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
								/>
							</FormControl>
							<FormMessage fieldName="notes" />
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
								{t("common.cancel")}
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? t("pages.plants.detail.modals.editDetails.actions.submit.loading")
									: t("pages.plants.detail.modals.editDetails.actions.submit.label")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}



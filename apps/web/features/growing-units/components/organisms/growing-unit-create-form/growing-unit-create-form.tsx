"use client";

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
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
	createGrowingUnitCreateSchema,
	type GrowingUnitCreateFormValues,
} from "features/growing-units/schemas/growing-unit-create/growing-unit-create.schema";
import { useLocationsList } from "@/core/location-context/location/hooks/use-locations-list/use-locations-list";

interface GrowingUnitCreateFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: GrowingUnitCreateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function GrowingUnitCreateForm({
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: GrowingUnitCreateFormProps) {
	const t = useTranslations();
	const { locations, isLoading: isLoadingLocations } = useLocationsList();

	// Create schema with translations
	const createSchema = useMemo(
		() => createGrowingUnitCreateSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [locationId, setLocationId] = useState<string>("");
	const [name, setName] = useState("");
	const [type, setType] = useState<GrowingUnitCreateFormValues["type"]>("POT");
	const [capacity, setCapacity] = useState(1);
	const [length, setLength] = useState<number | undefined>(undefined);
	const [width, setWidth] = useState<number | undefined>(undefined);
	const [height, setHeight] = useState<number | undefined>(undefined);
	const [unit, setUnit] =
		useState<GrowingUnitCreateFormValues["unit"]>("CENTIMETER");
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = createSchema.safeParse({
			locationId,
			name,
			type,
			capacity,
			length,
			width,
			height,
			unit,
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
			// Reset form
			setLocationId("");
			setName("");
			setType("POT");
			setCapacity(1);
			setLength(undefined);
			setWidth(undefined);
			setHeight(undefined);
			setUnit("CENTIMETER");
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset form
			setLocationId("");
			setName("");
			setType("POT");
			setCapacity(1);
			setLength(undefined);
			setWidth(undefined);
			setHeight(undefined);
			setUnit("CENTIMETER");
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t("pages.growingUnits.list.actions.create.title")}
					</DialogTitle>
					<DialogDescription>
						{t("pages.growingUnits.list.actions.create.description")}
					</DialogDescription>
				</DialogHeader>
				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormItem>
							<FormLabel>{t("shared.fields.locationId.label")}</FormLabel>
							<Select
								onValueChange={(value) => setLocationId(value)}
								value={locationId}
								disabled={isLoading || isLoadingLocations}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder={t("shared.fields.locationId.placeholder")}
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{locations.map((location) => (
										<SelectItem key={location.id} value={location.id}>
											{location.name} ({location.type})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage fieldName="locationId" />
						</FormItem>

						<FormItem>
							<FormLabel>{t("shared.fields.name.label")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t(
										"pages.growingUnits.detail.fields.name.placeholder",
									)}
									disabled={isLoading}
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</FormControl>
							<FormMessage fieldName="name" />
						</FormItem>

						<div className="grid grid-cols-2 gap-4">
							<FormItem>
								<FormLabel>{t("shared.fields.type.label")}</FormLabel>
								<Select
									onValueChange={(value) =>
										setType(value as GrowingUnitCreateFormValues["type"])
									}
									value={type}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t("shared.fields.type.placeholder")}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="POT">
											{t("shared.types.growingUnit.POT")}
										</SelectItem>
										<SelectItem value="GARDEN_BED">
											{t("shared.types.growingUnit.GARDEN_BED")}
										</SelectItem>
										<SelectItem value="HANGING_BASKET">
											{t("shared.types.growingUnit.HANGING_BASKET")}
										</SelectItem>
										<SelectItem value="WINDOW_BOX">
											{t("shared.types.growingUnit.WINDOW_BOX")}
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage fieldName="type" />
							</FormItem>

							<FormItem>
								<FormLabel>{t("shared.fields.capacity.label")}</FormLabel>
								<FormControl>
									<Input
										type="number"
										min="1"
										placeholder={t("shared.fields.capacity.placeholder")}
										disabled={isLoading}
										value={capacity}
										onChange={(e) => setCapacity(Number(e.target.value) || 1)}
									/>
								</FormControl>
								<FormMessage fieldName="capacity" />
							</FormItem>
						</div>

						<div className="grid grid-cols-4 gap-4">
							<FormItem>
								<FormLabel>{t("shared.fields.length.label")}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder={t("shared.fields.length.placeholder")}
										disabled={isLoading}
										value={length || ""}
										onChange={(e) =>
											setLength(
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="length" />
							</FormItem>

							<FormItem>
								<FormLabel>{t("shared.fields.width.label")}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder={t("shared.fields.width.placeholder")}
										disabled={isLoading}
										value={width || ""}
										onChange={(e) =>
											setWidth(
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="width" />
							</FormItem>

							<FormItem>
								<FormLabel>{t("shared.fields.height.label")}</FormLabel>
								<FormControl>
									<Input
										type="number"
										step="0.01"
										placeholder={t("shared.fields.height.placeholder")}
										disabled={isLoading}
										value={height || ""}
										onChange={(e) =>
											setHeight(
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</FormControl>
								<FormMessage fieldName="height" />
							</FormItem>

							<FormItem>
								<FormLabel>{t("shared.fields.unit.label")}</FormLabel>
								<Select
									onValueChange={(value) =>
										setUnit(value as GrowingUnitCreateFormValues["unit"])
									}
									value={unit}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue
												placeholder={t("shared.fields.unit.placeholder")}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="MILLIMETER">
											{t("shared.units.length.MILLIMETER")}
										</SelectItem>
										<SelectItem value="CENTIMETER">
											{t("shared.units.length.CENTIMETER")}
										</SelectItem>
										<SelectItem value="METER">
											{t("shared.units.length.METER")}
										</SelectItem>
										<SelectItem value="INCH">
											{t("shared.units.length.INCH")}
										</SelectItem>
										<SelectItem value="FOOT">
											{t("shared.units.length.FOOT")}
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage fieldName="unit" />
							</FormItem>
						</div>

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
									? t("pages.growingUnits.list.actions.create.loading")
									: t("pages.growingUnits.list.actions.create.submit")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

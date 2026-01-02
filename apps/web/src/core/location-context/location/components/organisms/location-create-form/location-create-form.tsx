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
import { Textarea } from "@repo/shared/presentation/components/ui/textarea";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
	createLocationCreateSchema,
	type LocationCreateFormValues,
} from "@/core/location-context/location/dtos/schemas/location-create/location-create.schema";

interface LocationCreateFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: LocationCreateFormValues) => Promise<void>;
	isLoading: boolean;
	error: Error | null;
}

export function LocationCreateForm({
	open,
	onOpenChange,
	onSubmit,
	isLoading,
	error,
}: LocationCreateFormProps) {
	const t = useTranslations();

	// Create schema with translations
	const createSchema = useMemo(
		() => createLocationCreateSchema((key: string) => t(key)),
		[t],
	);

	// Form state
	const [name, setName] = useState("");
	const [type, setType] = useState<LocationCreateFormValues["type"]>("INDOOR_SPACE");
	const [description, setDescription] = useState<string | null>(null);
	const [formErrors, setFormErrors] = useState<
		Record<string, { message?: string }>
	>({});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		// Validate form
		const result = createSchema.safeParse({
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
			// Reset form
			setName("");
			setType("INDOOR_SPACE");
			setDescription(null);
			onOpenChange(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			// Reset form
			setName("");
			setType("INDOOR_SPACE");
			setDescription(null);
			setFormErrors({});
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{t("pages.locations.list.actions.create.title")}
					</DialogTitle>
					<DialogDescription>
						{t("pages.locations.list.actions.create.description")}
					</DialogDescription>
				</DialogHeader>
				<Form errors={formErrors}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<FormItem>
							<FormLabel>{t("shared.fields.name.label")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t("shared.fields.name.placeholder")}
									disabled={isLoading}
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</FormControl>
							<FormMessage fieldName="name" />
						</FormItem>

						<FormItem>
							<FormLabel>{t("shared.fields.type.label")}</FormLabel>
							<Select
								onValueChange={(value) =>
									setType(value as LocationCreateFormValues["type"])
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
									<SelectItem value="ROOM">
										{t("shared.types.location.ROOM")}
									</SelectItem>
									<SelectItem value="BALCONY">
										{t("shared.types.location.BALCONY")}
									</SelectItem>
									<SelectItem value="GARDEN">
										{t("shared.types.location.GARDEN")}
									</SelectItem>
									<SelectItem value="GREENHOUSE">
										{t("shared.types.location.GREENHOUSE")}
									</SelectItem>
									<SelectItem value="OUTDOOR_SPACE">
										{t("shared.types.location.OUTDOOR_SPACE")}
									</SelectItem>
									<SelectItem value="INDOOR_SPACE">
										{t("shared.types.location.INDOOR_SPACE")}
									</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage fieldName="type" />
						</FormItem>

						<FormItem>
							<FormLabel>{t("shared.fields.description.label")}</FormLabel>
							<FormControl>
								<Textarea
									placeholder={t("shared.fields.description.placeholder")}
									disabled={isLoading}
									value={description || ""}
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
								{t("common.cancel")}
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? t("pages.locations.list.actions.create.loading")
									: t("pages.locations.list.actions.create.submit")}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}


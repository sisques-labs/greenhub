import type { TimelineSequenceGroup } from "@repo/shared/presentation/components/molecules/timeline-sequence";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { useGrowingUnitFindById } from "@/core/plant-context/growing-unit/hooks/use-growing-unit-find-by-id/use-growing-unit-find-by-id";
import { useGrowingUnitsFindByCriteria } from "@/core/plant-context/growing-unit/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria";
import { usePlantFindById } from "@/core/plant-context/plant/hooks/use-plant-find-by-id/use-plant-find-by-id";
import { usePlantTransplant } from "@/core/plant-context/plant/hooks/use-plant-transplant/use-plant-transplant";
import { usePlantUpdate } from "@/core/plant-context/plant/hooks/use-plant-update/use-plant-update";
import { usePlantDetailPageStore } from "@/core/plant-context/plant/stores/plant-detail-page-store";
import type { PlantUpdateFormValues } from "@/core/plant-context/plant/dtos/schemas/plant-update/plant-update.schema";

/**
 * Hook that provides plant detail page functionality
 * Centralizes all logic for the plant detail page
 */
export function usePlantDetailPage(id: string) {
	const t = useTranslations();
	const {
		transplantDialogOpen,
		setTransplantDialogOpen,
		editDetailsDialogOpen,
		setEditDetailsDialogOpen,
	} = usePlantDetailPageStore();

	const { plant, isLoading, error, refetch } = usePlantFindById(id || "");
	const {
		growingUnit: sourceGrowingUnit,
		isLoading: isLoadingSourceGrowingUnit,
	} = useGrowingUnitFindById(plant?.growingUnitId || "", {
		enabled: !!plant?.growingUnitId,
	});
	const { growingUnits, isLoading: isLoadingGrowingUnits } =
		useGrowingUnitsFindByCriteria();
	const {
		handleTransplant,
		isLoading: isTransplanting,
		error: transplantError,
	} = usePlantTransplant();
	const {
		handleUpdate,
		isLoading: isUpdating,
		error: updateError,
	} = usePlantUpdate();

	const handleTransplantSubmit = useCallback(
		async (targetGrowingUnitId: string) => {
			if (!plant) return;
			await handleTransplant(
				{
					sourceGrowingUnitId: plant.growingUnitId,
					targetGrowingUnitId,
					plantId: plant.id,
				},
				() => {
					refetch();
					setTransplantDialogOpen(false);
				},
			);
		},
		[plant, handleTransplant, refetch, setTransplantDialogOpen],
	);

	const handleUpdateSubmit = useCallback(
		async (values: PlantUpdateFormValues) => {
			if (!plant) return;
			await handleUpdate(
				{
					id: plant.id,
					name: values.name,
					species: values.species,
					plantedDate: values.plantedDate,
					notes: values.notes,
					status: values.status,
					// Note: growingUnitId is not included as it's not part of UpdatePlantInput
					// The backend should obtain it from the existing plant
				},
				() => {
					refetch();
					setEditDetailsDialogOpen(false);
				},
			);
		},
		[plant, handleUpdate, refetch, setEditDetailsDialogOpen],
	);

	const calculateAge = useCallback(() => {
		if (!plant?.plantedDate) return null;
		const plantedDate = new Date(plant.plantedDate);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - plantedDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const years = Math.floor(diffDays / 365);
		const months = Math.floor((diffDays % 365) / 30);

		if (years > 0 && months > 0) {
			return { years, months, type: "yearsMonths" as const };
		} else if (years > 0) {
			return { years, type: "years" as const };
		} else if (months > 0) {
			return { months, type: "months" as const };
		} else {
			return { days: diffDays, type: "days" as const };
		}
	}, [plant?.plantedDate]);

	const plantAge = calculateAge();

	// Format plant age for display
	const plantAgeText = useMemo(() => {
		if (!plantAge) return null;
		switch (plantAge.type) {
			case "yearsMonths":
				return t("pages.plants.detail.age.yearsMonths", {
					years: plantAge.years,
					months: plantAge.months,
				});
			case "years":
				return t("pages.plants.detail.age.years", { years: plantAge.years });
			case "months":
				return t("pages.plants.detail.age.months", { months: plantAge.months });
			case "days":
				return t("pages.plants.detail.age.days", { days: plantAge.days });
			default:
				return null;
		}
	}, [plantAge, t]);

	// Prepare upcoming care data for TimelineSequence
	// TODO: This should be fetched from the backend and not hardcoded
	const upcomingCareGroups: TimelineSequenceGroup[] = useMemo(() => {
		return [
			{
				id: "tomorrow",
				label: t("pages.plants.detail.sections.upcomingCare.tomorrow"),
				isActive: true,
				items: [
					{
						id: "tomorrow-watering",
						title: t("pages.plants.detail.sections.upcomingCare.lightWatering"),
						subtitle: "10:00 AM",
					},
				],
			},
			{
				id: "in5days",
				label: t("pages.plants.detail.sections.upcomingCare.in5Days"),
				items: [
					{
						id: "in5days-cleaning",
						title: t("pages.plants.detail.sections.upcomingCare.cleanLeaves"),
						subtitle: t("pages.plants.detail.sections.upcomingCare.duringDay"),
					},
				],
			},
			{
				id: "in2weeks",
				label: t("pages.plants.detail.sections.upcomingCare.in2Weeks"),
				items: [
					{
						id: "in2weeks-fertilization",
						title: t("pages.plants.detail.sections.upcomingCare.fertilization"),
						subtitle: t("pages.plants.detail.sections.upcomingCare.spring"),
					},
				],
			},
		];
	}, [t]);

	return {
		// Data
		plant,
		sourceGrowingUnit,
		targetGrowingUnits: growingUnits?.items || [],
		plantAge,
		plantAgeText,
		upcomingCareGroups,

		// Loading states
		isLoading,
		isLoadingSourceGrowingUnit,
		isLoadingGrowingUnits,
		isTransplanting,
		isUpdating,
		isLoadingTransplant:
			isTransplanting || isLoadingSourceGrowingUnit || isLoadingGrowingUnits,

		// Errors
		error,
		transplantError,
		updateError,

		// Dialog state
		transplantDialogOpen,
		setTransplantDialogOpen,
		editDetailsDialogOpen,
		setEditDetailsDialogOpen,

		// Handlers
		refetch,
		handleTransplantSubmit,
		handleUpdateSubmit,
	};
}

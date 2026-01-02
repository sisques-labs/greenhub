import { PLANT_STATUS, type PlantResponse } from "@repo/sdk";
import { paginate } from "@repo/shared/presentation/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useGrowingUnitsFindByCriteria } from "@/core/plant-context/growing-unit/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria";
import { usePlantAdd } from "@/core/plant-context/plant/hooks/use-plant-add/use-plant-add";
import type { PlantCreateFormValues } from "@/core/plant-context/plant/dtos/schemas/plant-create/plant-create.schema";

const PLANTS_PER_PAGE = 10;

export type PlantWithGrowingUnit = PlantResponse & {
	growingUnitName?: string;
};

export function usePlantsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilter, setSelectedFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PLANTS_PER_PAGE);
	const [createDialogOpen, setCreateDialogOpen] = useState(false);

	// Fetch growing units with their plants
	// Note: We don't send currentPage to backend because pagination is done client-side
	// on the filtered plants. We fetch a large number of growing units to ensure
	// we have all the data needed for client-side filtering and pagination.
	// TODO: Implement pagination on the for the  plants backend.
	const paginationInput = useMemo(
		() => ({
			pagination: {
				page: 1,
				perPage: 1000, // Fetch a large number to get all growing units
			},
		}),
		[],
	);

	const { growingUnits, isLoading, error, refetch } =
		useGrowingUnitsFindByCriteria(paginationInput);

	const {
		handleCreate,
		isLoading: isCreating,
		error: createError,
	} = usePlantAdd();

	// Flatten all plants from all growing units and apply filters
	const allFilteredPlants = useMemo(() => {
		if (!growingUnits) return [];

		// Flatten all plants with their growing unit info
		const allPlants: PlantWithGrowingUnit[] = [];
		growingUnits.items.forEach((unit) => {
			const plants = unit.plants || [];
			plants.forEach((plant) => {
				allPlants.push({
					...plant,
					growingUnitName: unit.name,
				});
			});
		});

		// Apply search filter
		let filtered = allPlants;
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(plant) =>
					plant.name?.toLowerCase().includes(query) ||
					plant.species?.toLowerCase().includes(query) ||
					plant.growingUnitName?.toLowerCase().includes(query),
			);
		}

		// Apply status filter
		if (selectedFilter !== "all") {
			switch (selectedFilter) {
				case "healthy":
					filtered = filtered.filter(
						(plant) => plant.status === PLANT_STATUS.GROWING,
					);
					break;
				// TODO: Add more filter cases when needed
				default:
					break;
			}
		}

		return filtered;
	}, [growingUnits, searchQuery, selectedFilter]);

	// Calculate pagination
	const { items: paginatedPlants, totalPages } = paginate(
		allFilteredPlants,
		currentPage,
		perPage,
	);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, []);

	const handleCreateSubmit = async (values: PlantCreateFormValues) => {
		await handleCreate(values, () => {
			refetch();
			setCreateDialogOpen(false);
		});
	};

	const handleAddClick = () => {
		setCreateDialogOpen(true);
	};

	const handleEdit = (plant: PlantResponse) => {
		// TODO: Open edit dialog
		console.log("Edit plant:", plant);
	};

	const handleDelete = (id: string) => {
		// TODO: Open delete confirmation
		console.log("Delete plant:", id);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// Scroll to top when page changes
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const hasAnyPlants = useMemo(() => {
		return (
			growingUnits &&
			growingUnits.items.some((unit) => (unit.plants?.length || 0) > 0)
		);
	}, [growingUnits]);

	return {
		// State
		searchQuery,
		setSearchQuery,
		selectedFilter,
		setSelectedFilter,
		currentPage,
		perPage,
		setPerPage,
		createDialogOpen,
		setCreateDialogOpen,

		// Data
		growingUnits,
		allFilteredPlants,
		paginatedPlants,
		totalPages,
		isLoading,
		error,

		// Handlers
		handleCreateSubmit,
		handleAddClick,
		handleEdit,
		handleDelete,
		handlePageChange,

		// Loading states
		isCreating,

		// Errors
		createError,

		// Computed
		hasAnyPlants,
	};
}

import { PLANT_STATUS, type PlantResponse } from "@repo/sdk";
import { paginate } from "@repo/shared/presentation/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { useGrowingUnitsFindByCriteria } from "@/core/plant-context/growing-unit/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria";
import { usePlantAdd } from "@/core/plant-context/plant/hooks/use-plant-add/use-plant-add";
import { usePlantsFindByCriteria } from "@/core/plant-context/plant/hooks/use-plants-find-by-criteria/use-plants-find-by-criteria";
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

	// Fetch plants using the new findByCriteria query
	const paginationInput = useMemo(
		() => ({
			pagination: {
				page: currentPage,
				perPage,
			},
		}),
		[currentPage, perPage],
	);

	const { plants, isLoading, error, refetch } =
		usePlantsFindByCriteria(paginationInput);

	// Fetch growing units for mapping names (used in create form and for displaying names)
	const { growingUnits } = useGrowingUnitsFindByCriteria({
		pagination: {
			page: 1,
			perPage: 1000, // Fetch a large number to get all growing units for name mapping
		},
	});

	const {
		handleCreate,
		isLoading: isCreating,
		error: createError,
	} = usePlantAdd();

	// Create a map of growing unit IDs to names for quick lookup
	const growingUnitNameMap = useMemo(() => {
		if (!growingUnits) return new Map<string, string>();
		const map = new Map<string, string>();
		growingUnits.items.forEach((unit) => {
			map.set(unit.id, unit.name);
		});
		return map;
	}, [growingUnits]);

	// Apply filters to plants and add growing unit names
	const allFilteredPlants = useMemo(() => {
		if (!plants) return [];

		// Add growing unit names to plants
		const plantsWithGrowingUnitNames: PlantWithGrowingUnit[] =
			plants.items.map((plant) => ({
				...plant,
				growingUnitName: growingUnitNameMap.get(plant.growingUnitId),
			}));

		// Apply search filter
		let filtered = plantsWithGrowingUnitNames;
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
	}, [plants, growingUnitNameMap, searchQuery, selectedFilter]);

	// For now, use client-side pagination on filtered results
	// TODO: Move filters to backend when supported
	const { items: paginatedPlants, totalPages } = paginate(
		allFilteredPlants,
		currentPage,
		perPage,
	);

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, selectedFilter]);

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
		return plants && plants.items.length > 0;
	}, [plants]);

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

import { useGrowingUnitsFindByCriteria } from 'features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import type { PlantCreateFormValues } from 'features/plants/schemas/plant-create/plant-create.schema';
import { usePlantAdd } from 'features/plants/hooks/use-plant-add/use-plant-add';
import { usePlantsFindByCriteria } from 'features/plants/hooks/use-plants-find-by-criteria/use-plants-find-by-criteria';
import { PLANT_STATUS } from '../../constants/plant-status';
import type { FilterOperator, PlantResponse, PlantStatus } from 'features/plants/api/types';
import { useEffect, useMemo, useState } from 'react';

const PLANTS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_DELAY = 250; // milliseconds

export type PlantWithGrowingUnit = PlantResponse & {
  growingUnitName?: string;
};

export function usePlantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PLANTS_PER_PAGE);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters for backend
  const filters = useMemo(() => {
    const backendFilters: Array<{
      field: string;
      operator: FilterOperator;
      value: string;
    }> = [];

    // Search filter - search in name, species, growing unit name, and location name
    if (debouncedSearchQuery) {
      // For now, we'll search in name and species fields
      // TODO: Add support for searching in nested fields (growingUnit.name, location.name) when backend supports it
      backendFilters.push({
        field: 'name',
        operator: 'LIKE',
        value: debouncedSearchQuery,
      });
    }

    // Status filter
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'healthy':
          backendFilters.push({
            field: 'status',
            operator: 'EQUALS',
            value: PLANT_STATUS.GROWING,
          });
          break;
        // TODO: Add more filter cases when needed
        default:
          break;
      }
    }

    return backendFilters;
  }, [debouncedSearchQuery, selectedFilter]);

  // Fetch plants using findByCriteria with filters and pagination
  const criteriaInput = useMemo(
    () => ({
      filters: filters.length > 0 ? filters : undefined,
      pagination: {
        page: currentPage,
        perPage,
      },
      sorts: [
        {
          field: 'createdAt',
          direction: 'DESC' as const,
        },
      ],
    }),
    [filters, currentPage, perPage]
  );

  const { plants, isLoading, error, refetch } =
    usePlantsFindByCriteria(criteriaInput);

  // Fetch growing units for create form
  const { growingUnits } = useGrowingUnitsFindByCriteria({
    pagination: {
      page: 1,
      perPage: 1000, // Fetch a large number to get all growing units for the create form
    },
  });

  const {
    handleCreate,
    isLoading: isCreating,
    error: createError,
  } = usePlantAdd();

  // Add growing unit names to plants for backward compatibility
  // Now we can also use plant.growingUnit?.name directly
  const allFilteredPlants = useMemo(() => {
    if (!plants) return [];

    return plants.items.map((plant) => ({
      ...plant,
      growingUnitName:
        plant.growingUnit?.name || plant.growingUnitId || undefined,
    }));
  }, [plants]);

  // Use backend pagination
  const paginatedPlants = allFilteredPlants;
  const totalPages = plants?.totalPages || 0;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedFilter]);

  const handleCreateSubmit = async (values: PlantCreateFormValues) => {
    await handleCreate(
      {
        growingUnitId: values.growingUnitId,
        name: values.name,
        species: values.species,
        plantedDate: values.plantedDate?.toISOString() || null,
        notes: values.notes,
        status: values.status as PlantStatus | undefined,
      },
      () => {
        refetch();
        setCreateDialogOpen(false);
      }
    );
  };

  const handleAddClick = () => {
    setCreateDialogOpen(true);
  };

  const handleEdit = (plant: PlantResponse) => {
    // TODO: Open edit dialog
    console.log('Edit plant:', plant);
  };

  const handleDelete = (id: string) => {
    // TODO: Open delete confirmation
    console.log('Delete plant:', id);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasAnyPlants = useMemo(() => {
    return plants && plants.total > 0;
  }, [plants]);

  // Transform growing units for the create form
  const transformedGrowingUnits = useMemo(() => {
    return growingUnits?.items.map((unit: { id: string; name: string }) => ({
      id: unit.id,
      name: unit.name,
    })) || [];
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
    transformedGrowingUnits,
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

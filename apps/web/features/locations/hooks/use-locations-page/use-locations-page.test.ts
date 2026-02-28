import { useLocationsPage } from '@/features/locations/hooks/use-locations-page/use-locations-page';
import { useLocationCreate } from '@/features/locations/hooks/use-location-create/use-location-create';
import { useLocationDelete } from '@/features/locations/hooks/use-location-delete/use-location-delete';
import { useLocationUpdate } from '@/features/locations/hooks/use-location-update/use-location-update';
import { useLocationsFindByCriteria } from '@/features/locations/hooks/use-locations-find-by-criteria/use-locations-find-by-criteria';
import { useLocationsPageStore } from '@/features/locations/stores/locations-page-store';
import { act, renderHook } from '@testing-library/react';

jest.mock(
	'@/features/locations/hooks/use-location-create/use-location-create',
);
jest.mock(
	'@/features/locations/hooks/use-location-delete/use-location-delete',
);
jest.mock(
	'@/features/locations/hooks/use-location-update/use-location-update',
);
jest.mock(
	'@/features/locations/hooks/use-locations-find-by-criteria/use-locations-find-by-criteria',
);
jest.mock('@/features/locations/stores/locations-page-store');

describe('useLocationsPage', () => {
	const mockHandleCreate = jest.fn();
	const mockHandleUpdate = jest.fn();
	const mockHandleDelete = jest.fn();
	const mockRefetch = jest.fn();
	const mockSetCreateDialogOpen = jest.fn();
	const mockSetUpdateDialogOpen = jest.fn();
	const mockSetDeleteDialogOpen = jest.fn();
	const mockSetSelectedLocation = jest.fn();
	const mockSetSearchQuery = jest.fn();
	const mockSetSelectedFilter = jest.fn();
	const mockSetCurrentPage = jest.fn();
	const mockSetPerPage = jest.fn();

	const mockLocations = {
		items: [
			{ id: 'loc-1', name: 'Greenhouse', type: 'INDOOR' },
			{ id: 'loc-2', name: 'Garden', type: 'OUTDOOR' },
		],
		total: 2,
		totalPages: 1,
		page: 1,
		perPage: 10,
	};

	beforeEach(() => {
		jest.clearAllMocks();

		(useLocationsFindByCriteria as jest.Mock).mockReturnValue({
			locations: mockLocations,
			isLoading: false,
			error: null,
			refetch: mockRefetch,
		});

		(useLocationCreate as jest.Mock).mockReturnValue({
			handleCreate: mockHandleCreate,
			isLoading: false,
			error: null,
		});

		(useLocationUpdate as jest.Mock).mockReturnValue({
			handleUpdate: mockHandleUpdate,
			isLoading: false,
			error: null,
		});

		(useLocationDelete as jest.Mock).mockReturnValue({
			handleDelete: mockHandleDelete,
			isLoading: false,
			error: null,
		});

		(useLocationsPageStore as unknown as jest.Mock).mockReturnValue({
			createDialogOpen: false,
			setCreateDialogOpen: mockSetCreateDialogOpen,
			updateDialogOpen: false,
			setUpdateDialogOpen: mockSetUpdateDialogOpen,
			deleteDialogOpen: false,
			setDeleteDialogOpen: mockSetDeleteDialogOpen,
			selectedLocation: null,
			setSelectedLocation: mockSetSelectedLocation,
			searchQuery: '',
			setSearchQuery: mockSetSearchQuery,
			selectedFilter: 'all',
			setSelectedFilter: mockSetSelectedFilter,
			currentPage: 1,
			setCurrentPage: mockSetCurrentPage,
			perPage: 10,
			setPerPage: mockSetPerPage,
		});
	});

	describe('Initialization', () => {
		it('should initialize with data from store and hooks', () => {
			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.createDialogOpen).toBe(false);
			expect(result.current.updateDialogOpen).toBe(false);
			expect(result.current.deleteDialogOpen).toBe(false);
			expect(result.current.selectedLocation).toBeNull();
		});

		it('should return locations data', () => {
			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.locations).toEqual(mockLocations);
		});
	});

	describe('isLoading computation', () => {
		it('should be true when isLoadingLocations is true', () => {
			(useLocationsFindByCriteria as jest.Mock).mockReturnValue({
				locations: null,
				isLoading: true,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.isLoading).toBe(true);
		});

		it('should be true when locations is null', () => {
			(useLocationsFindByCriteria as jest.Mock).mockReturnValue({
				locations: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.isLoading).toBe(true);
		});

		it('should be false when data is loaded', () => {
			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.isLoading).toBe(false);
		});
	});

	describe('filterOptions', () => {
		it('should return filter options array', () => {
			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.filterOptions).toHaveLength(3);
			expect(result.current.filterOptions[0].value).toBe('all');
			expect(result.current.filterOptions[1].value).toBe('indoor');
			expect(result.current.filterOptions[2].value).toBe('outdoor');
		});
	});

	describe('handleAddClick', () => {
		it('should open create dialog', () => {
			const { result } = renderHook(() => useLocationsPage());

			act(() => {
				result.current.handleAddClick();
			});

			expect(mockSetCreateDialogOpen).toHaveBeenCalledWith(true);
		});
	});

	describe('handleEditClick', () => {
		it('should set selected location and open update dialog', () => {
			const { result } = renderHook(() => useLocationsPage());

			const location = { id: 'loc-1', name: 'Greenhouse', type: 'INDOOR' };

			act(() => {
				result.current.handleEditClick(location as any);
			});

			expect(mockSetSelectedLocation).toHaveBeenCalledWith(location);
			expect(mockSetUpdateDialogOpen).toHaveBeenCalledWith(true);
		});
	});

	describe('handleDeleteClick', () => {
		it('should set selected location and open delete dialog', () => {
			const { result } = renderHook(() => useLocationsPage());

			act(() => {
				result.current.handleDeleteClick('loc-1');
			});

			expect(mockSetSelectedLocation).toHaveBeenCalledWith(
				mockLocations.items[0],
			);
			expect(mockSetDeleteDialogOpen).toHaveBeenCalledWith(true);
		});

		it('should not open dialog when location not found', () => {
			const { result } = renderHook(() => useLocationsPage());

			act(() => {
				result.current.handleDeleteClick('non-existent-id');
			});

			expect(mockSetDeleteDialogOpen).not.toHaveBeenCalled();
		});
	});

	describe('handleCreateSubmit', () => {
		it('should call handleCreate with form values', async () => {
			mockHandleCreate.mockImplementation(
				async (_values: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useLocationsPage());

			const formValues = {
				name: 'New Location',
				type: 'INDOOR',
				description: 'Test',
			};

			await act(async () => {
				await result.current.handleCreateSubmit(formValues as any);
			});

			expect(mockHandleCreate).toHaveBeenCalledWith(
				formValues,
				expect.any(Function),
			);
		});

		it('should refetch and close dialog on successful create', async () => {
			mockHandleCreate.mockImplementation(
				async (_values: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useLocationsPage());

			await act(async () => {
				await result.current.handleCreateSubmit({
					name: 'New',
					type: 'INDOOR',
				} as any);
			});

			expect(mockRefetch).toHaveBeenCalled();
			expect(mockSetCreateDialogOpen).toHaveBeenCalledWith(false);
			expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
		});
	});

	describe('handleUpdateSubmit', () => {
		it('should not update when selectedLocation is null', async () => {
			const { result } = renderHook(() => useLocationsPage());

			await act(async () => {
				await result.current.handleUpdateSubmit({
					name: 'Updated',
					type: 'OUTDOOR',
				} as any);
			});

			expect(mockHandleUpdate).not.toHaveBeenCalled();
		});

		it('should call handleUpdate with selected location id', async () => {
			(useLocationsPageStore as unknown as jest.Mock).mockReturnValue({
				createDialogOpen: false,
				setCreateDialogOpen: mockSetCreateDialogOpen,
				updateDialogOpen: true,
				setUpdateDialogOpen: mockSetUpdateDialogOpen,
				deleteDialogOpen: false,
				setDeleteDialogOpen: mockSetDeleteDialogOpen,
				selectedLocation: { id: 'loc-1', name: 'Greenhouse', type: 'INDOOR' },
				setSelectedLocation: mockSetSelectedLocation,
				searchQuery: '',
				setSearchQuery: mockSetSearchQuery,
				selectedFilter: 'all',
				setSelectedFilter: mockSetSelectedFilter,
				currentPage: 1,
				setCurrentPage: mockSetCurrentPage,
				perPage: 10,
				setPerPage: mockSetPerPage,
			});

			mockHandleUpdate.mockImplementation(
				async (_id: string, _values: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useLocationsPage());

			await act(async () => {
				await result.current.handleUpdateSubmit({
					name: 'Updated',
					type: 'OUTDOOR',
				} as any);
			});

			expect(mockHandleUpdate).toHaveBeenCalledWith(
				'loc-1',
				expect.any(Object),
				expect.any(Function),
			);
		});
	});

	describe('handleDeleteSubmit', () => {
		it('should not delete when selectedLocation is null', async () => {
			const { result } = renderHook(() => useLocationsPage());

			await act(async () => {
				await result.current.handleDeleteSubmit();
			});

			expect(mockHandleDelete).not.toHaveBeenCalled();
		});
	});

	describe('handlePageChange', () => {
		it('should call setCurrentPage and scrollTo', () => {
			const scrollToMock = jest.fn();
			Object.defineProperty(window, 'scrollTo', {
				value: scrollToMock,
				writable: true,
			});

			const { result } = renderHook(() => useLocationsPage());

			act(() => {
				result.current.handlePageChange(2);
			});

			expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
			expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
		});
	});

	describe('Loading states', () => {
		it('should expose create loading state', () => {
			(useLocationCreate as jest.Mock).mockReturnValue({
				handleCreate: mockHandleCreate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.isCreating).toBe(true);
		});

		it('should expose update loading state', () => {
			(useLocationUpdate as jest.Mock).mockReturnValue({
				handleUpdate: mockHandleUpdate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.isUpdating).toBe(true);
		});

		it('should expose delete loading state', () => {
			(useLocationDelete as jest.Mock).mockReturnValue({
				handleDelete: mockHandleDelete,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => useLocationsPage());

			expect(result.current.isDeleting).toBe(true);
		});
	});
});

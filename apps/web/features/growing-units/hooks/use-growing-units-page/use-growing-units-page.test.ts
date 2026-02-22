import { useGrowingUnitsPage } from '@/features/growing-units/hooks/use-growing-units-page/use-growing-units-page';
import { useGrowingUnitCreate } from '@/features/growing-units/hooks/use-growing-unit-create/use-growing-unit-create';
import { useGrowingUnitUpdate } from '@/features/growing-units/hooks/use-growing-unit-update/use-growing-unit-update';
import { useGrowingUnitsFindByCriteria } from '@/features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { useGrowingUnitsPageStore } from '@/features/growing-units/stores/growing-units-page-store';
import { act, renderHook } from '@testing-library/react';

jest.mock(
	'@/features/growing-units/hooks/use-growing-unit-create/use-growing-unit-create',
);
jest.mock(
	'@/features/growing-units/hooks/use-growing-unit-update/use-growing-unit-update',
);
jest.mock(
	'@/features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria',
);
jest.mock('@/features/growing-units/stores/growing-units-page-store');

describe('useGrowingUnitsPage', () => {
	const mockHandleCreate = jest.fn();
	const mockHandleUpdate = jest.fn();
	const mockRefetch = jest.fn();
	const mockSetCreateDialogOpen = jest.fn();
	const mockSetUpdateDialogOpen = jest.fn();
	const mockSetSelectedGrowingUnit = jest.fn();
	const mockSetSearchQuery = jest.fn();
	const mockSetSelectedFilter = jest.fn();
	const mockSetCurrentPage = jest.fn();
	const mockSetPerPage = jest.fn();

	const mockGrowingUnits = {
		items: [
			{ id: 'unit-1', name: 'Greenhouse A', type: 'GARDEN_BED', capacity: 20 },
			{ id: 'unit-2', name: 'Balcony Pots', type: 'POT', capacity: 5 },
		],
		total: 2,
		totalPages: 1,
		page: 1,
		perPage: 10,
	};

	beforeEach(() => {
		jest.clearAllMocks();

		(useGrowingUnitsFindByCriteria as jest.Mock).mockReturnValue({
			growingUnits: mockGrowingUnits,
			isLoading: false,
			error: null,
			refetch: mockRefetch,
		});

		(useGrowingUnitCreate as jest.Mock).mockReturnValue({
			handleCreate: mockHandleCreate,
			isLoading: false,
			error: null,
		});

		(useGrowingUnitUpdate as jest.Mock).mockReturnValue({
			handleUpdate: mockHandleUpdate,
			isLoading: false,
			error: null,
		});

		(useGrowingUnitsPageStore as unknown as jest.Mock).mockReturnValue({
			createDialogOpen: false,
			setCreateDialogOpen: mockSetCreateDialogOpen,
			updateDialogOpen: false,
			setUpdateDialogOpen: mockSetUpdateDialogOpen,
			selectedGrowingUnit: null,
			setSelectedGrowingUnit: mockSetSelectedGrowingUnit,
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
			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.createDialogOpen).toBe(false);
			expect(result.current.updateDialogOpen).toBe(false);
			expect(result.current.searchQuery).toBe('');
			expect(result.current.selectedFilter).toBe('all');
		});

		it('should return growing units data', () => {
			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.growingUnits).toEqual(mockGrowingUnits);
		});
	});

	describe('isLoading computation', () => {
		it('should be true when isLoadingGrowingUnits is true', () => {
			(useGrowingUnitsFindByCriteria as jest.Mock).mockReturnValue({
				growingUnits: null,
				isLoading: true,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.isLoading).toBe(true);
		});

		it('should be true when growingUnits is null', () => {
			(useGrowingUnitsFindByCriteria as jest.Mock).mockReturnValue({
				growingUnits: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.isLoading).toBe(true);
		});

		it('should be false when data is loaded', () => {
			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.isLoading).toBe(false);
		});
	});

	describe('filterOptions', () => {
		it('should return filter options array', () => {
			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.filterOptions).toHaveLength(5);
			expect(result.current.filterOptions[0].value).toBe('all');
			expect(result.current.filterOptions[1].value).toBe('indoor');
			expect(result.current.filterOptions[2].value).toBe('outdoor');
			expect(result.current.filterOptions[3].value).toBe('pots');
			expect(result.current.filterOptions[4].value).toBe('beds');
		});
	});

	describe('handleAddClick', () => {
		it('should open create dialog', () => {
			const { result } = renderHook(() => useGrowingUnitsPage());

			act(() => {
				result.current.handleAddClick();
			});

			expect(mockSetCreateDialogOpen).toHaveBeenCalledWith(true);
		});
	});

	describe('handleCreateSubmit', () => {
		it('should call handleCreate with correct values', async () => {
			mockHandleCreate.mockImplementation(
				async (_input: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useGrowingUnitsPage());

			const formValues = {
				locationId: 'loc-1',
				name: 'New Unit',
				type: 'POT',
				capacity: 10,
				length: 1,
				width: 1,
				height: 0.5,
				unit: 'METERS',
			};

			await act(async () => {
				await result.current.handleCreateSubmit(formValues as any);
			});

			expect(mockHandleCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					locationId: 'loc-1',
					name: 'New Unit',
					type: 'POT',
					capacity: 10,
				}),
				expect.any(Function),
			);
		});
	});

	describe('handleUpdateSubmit', () => {
		it('should call handleUpdate with correct values', async () => {
			mockHandleUpdate.mockImplementation(
				async (_input: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useGrowingUnitsPage());

			const formValues = {
				id: 'unit-1',
				locationId: 'loc-1',
				name: 'Updated Unit',
				type: 'POT',
				capacity: 15,
				length: 1,
				width: 1,
				height: 0.5,
				unit: 'METERS',
			};

			await act(async () => {
				await result.current.handleUpdateSubmit(formValues as any);
			});

			expect(mockHandleUpdate).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'unit-1',
					name: 'Updated Unit',
				}),
				expect.any(Function),
			);
		});

		it('should refetch and close dialog after successful update', async () => {
			mockHandleUpdate.mockImplementation(
				async (_input: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => useGrowingUnitsPage());

			await act(async () => {
				await result.current.handleUpdateSubmit({
					id: 'unit-1',
					name: 'Updated',
					locationId: 'loc-1',
				} as any);
			});

			expect(mockRefetch).toHaveBeenCalled();
			expect(mockSetUpdateDialogOpen).toHaveBeenCalledWith(false);
			expect(mockSetSelectedGrowingUnit).toHaveBeenCalledWith(null);
		});
	});

	describe('handlePageChange', () => {
		it('should call setCurrentPage and scrollTo', () => {
			const scrollToMock = jest.fn();
			Object.defineProperty(window, 'scrollTo', {
				value: scrollToMock,
				writable: true,
			});

			const { result } = renderHook(() => useGrowingUnitsPage());

			act(() => {
				result.current.handlePageChange(2);
			});

			expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
			expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
		});
	});

	describe('Loading states', () => {
		it('should expose create loading state', () => {
			(useGrowingUnitCreate as jest.Mock).mockReturnValue({
				handleCreate: mockHandleCreate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.isCreating).toBe(true);
		});

		it('should expose update loading state', () => {
			(useGrowingUnitUpdate as jest.Mock).mockReturnValue({
				handleUpdate: mockHandleUpdate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => useGrowingUnitsPage());

			expect(result.current.isUpdating).toBe(true);
		});
	});
});

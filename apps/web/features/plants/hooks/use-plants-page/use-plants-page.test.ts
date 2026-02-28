import { usePlantsPage } from '@/features/plants/hooks/use-plants-page/use-plants-page';
import { usePlantAdd } from '@/features/plants/hooks/use-plant-add/use-plant-add';
import { usePlantsFindByCriteria } from '@/features/plants/hooks/use-plants-find-by-criteria/use-plants-find-by-criteria';
import { useGrowingUnitsFindByCriteria } from '@/features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { act, renderHook } from '@testing-library/react';

jest.mock('@/features/plants/hooks/use-plant-add/use-plant-add');
jest.mock(
	'@/features/plants/hooks/use-plants-find-by-criteria/use-plants-find-by-criteria',
);
jest.mock(
	'@/features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria',
);

describe('usePlantsPage', () => {
	const mockHandleCreate = jest.fn();
	const mockRefetch = jest.fn();

	const mockPlants = {
		items: [
			{
				id: 'plant-1',
				name: 'Tomato',
				species: 'Solanum lycopersicum',
				status: 'GROWING',
				growingUnitId: 'unit-1',
				growingUnit: { id: 'unit-1', name: 'Greenhouse A', type: 'POT', capacity: 10 },
			},
			{
				id: 'plant-2',
				name: 'Basil',
				species: 'Ocimum basilicum',
				status: 'PLANTED',
				growingUnitId: 'unit-2',
				growingUnit: null,
			},
		],
		total: 2,
		totalPages: 1,
		page: 1,
		perPage: 10,
	};

	const mockGrowingUnits = {
		items: [
			{ id: 'unit-1', name: 'Greenhouse A' },
			{ id: 'unit-2', name: 'Balcony Pots' },
		],
		total: 2,
		totalPages: 1,
		page: 1,
		perPage: 1000,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(console, 'log').mockImplementation(() => {});

		(usePlantsFindByCriteria as jest.Mock).mockReturnValue({
			plants: mockPlants,
			isLoading: false,
			error: null,
			refetch: mockRefetch,
		});

		(useGrowingUnitsFindByCriteria as jest.Mock).mockReturnValue({
			growingUnits: mockGrowingUnits,
			isLoading: false,
			error: null,
		});

		(usePlantAdd as jest.Mock).mockReturnValue({
			handleCreate: mockHandleCreate,
			isLoading: false,
			error: null,
		});
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with default state', () => {
			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.searchQuery).toBe('');
			expect(result.current.selectedFilter).toBe('all');
			expect(result.current.currentPage).toBe(1);
			expect(result.current.createDialogOpen).toBe(false);
		});

		it('should return plants data from hook', () => {
			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
		});
	});

	describe('Plants data processing', () => {
		it('should map plants with growingUnitName from growingUnit.name', () => {
			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.allFilteredPlants[0].growingUnitName).toBe(
				'Greenhouse A',
			);
		});

		it('should use growingUnitId as fallback growingUnitName', () => {
			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.allFilteredPlants[1].growingUnitName).toBe('unit-2');
		});

		it('should return empty array when plants is null', () => {
			(usePlantsFindByCriteria as jest.Mock).mockReturnValue({
				plants: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.allFilteredPlants).toEqual([]);
		});

		it('should calculate totalPages from plants data', () => {
			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.totalPages).toBe(1);
		});

		it('should return totalPages 0 when plants is null', () => {
			(usePlantsFindByCriteria as jest.Mock).mockReturnValue({
				plants: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.totalPages).toBe(0);
		});
	});

	describe('hasAnyPlants', () => {
		it('should be true when plants exist', () => {
			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.hasAnyPlants).toBe(true);
		});

		it('should be false when plants total is 0', () => {
			(usePlantsFindByCriteria as jest.Mock).mockReturnValue({
				plants: { ...mockPlants, items: [], total: 0 },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.hasAnyPlants).toBe(false);
		});
	});

	describe('Growing units transformation', () => {
		it('should transform growing units for create form', () => {
			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.transformedGrowingUnits).toEqual([
				{ id: 'unit-1', name: 'Greenhouse A' },
				{ id: 'unit-2', name: 'Balcony Pots' },
			]);
		});

		it('should return empty array when growingUnits is null', () => {
			(useGrowingUnitsFindByCriteria as jest.Mock).mockReturnValue({
				growingUnits: null,
				isLoading: false,
				error: null,
			});

			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.transformedGrowingUnits).toEqual([]);
		});
	});

	describe('handleAddClick', () => {
		it('should open create dialog', () => {
			const { result } = renderHook(() => usePlantsPage());

			act(() => {
				result.current.handleAddClick();
			});

			expect(result.current.createDialogOpen).toBe(true);
		});
	});

	describe('handleCreateSubmit', () => {
		it('should call handleCreate with correct values', async () => {
			mockHandleCreate.mockImplementation(async (_input: any, callback: () => void) => {
				callback();
			});

			const { result } = renderHook(() => usePlantsPage());

			const formValues = {
				growingUnitId: 'unit-1',
				name: 'New Plant',
				species: 'Tomato',
				status: 'PLANTED',
				plantedDate: new Date('2024-01-15'),
				notes: 'Test notes',
			};

			await act(async () => {
				await result.current.handleCreateSubmit(formValues as any);
			});

			expect(mockHandleCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					growingUnitId: 'unit-1',
					name: 'New Plant',
					species: 'Tomato',
					status: 'PLANTED',
					notes: 'Test notes',
				}),
				expect.any(Function),
			);
		});

		it('should convert plantedDate to ISO string', async () => {
			const { result } = renderHook(() => usePlantsPage());

			const plantedDate = new Date('2024-01-15');
			const formValues = {
				growingUnitId: 'unit-1',
				name: 'New Plant',
				species: 'Tomato',
				status: 'PLANTED',
				plantedDate,
				notes: null,
			};

			await act(async () => {
				await result.current.handleCreateSubmit(formValues as any);
			});

			expect(mockHandleCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					plantedDate: plantedDate.toISOString(),
				}),
				expect.any(Function),
			);
		});

		it('should pass null when plantedDate is undefined', async () => {
			const { result } = renderHook(() => usePlantsPage());

			const formValues = {
				growingUnitId: 'unit-1',
				name: 'New Plant',
				species: 'Tomato',
				status: 'PLANTED',
				plantedDate: undefined,
				notes: null,
			};

			await act(async () => {
				await result.current.handleCreateSubmit(formValues as any);
			});

			expect(mockHandleCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					plantedDate: null,
				}),
				expect.any(Function),
			);
		});
	});

	describe('handlePageChange', () => {
		it('should update current page and call scrollTo', () => {
			const scrollToMock = jest.fn();
			Object.defineProperty(window, 'scrollTo', {
				value: scrollToMock,
				writable: true,
			});

			const { result } = renderHook(() => usePlantsPage());

			act(() => {
				result.current.handlePageChange(3);
			});

			expect(result.current.currentPage).toBe(3);
			expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
		});
	});

	describe('Loading state', () => {
		it('should expose loading state', () => {
			(usePlantsFindByCriteria as jest.Mock).mockReturnValue({
				plants: null,
				isLoading: true,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.isLoading).toBe(true);
		});

		it('should expose create loading state', () => {
			(usePlantAdd as jest.Mock).mockReturnValue({
				handleCreate: mockHandleCreate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => usePlantsPage());

			expect(result.current.isCreating).toBe(true);
		});
	});
});

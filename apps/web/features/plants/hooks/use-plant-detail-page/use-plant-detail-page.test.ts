import { usePlantDetailPage } from '@/features/plants/hooks/use-plant-detail-page/use-plant-detail-page';
import { usePlantFindById } from 'features/plants/hooks/use-plant-find-by-id/use-plant-find-by-id';
import { usePlantTransplant } from 'features/plants/hooks/use-plant-transplant/use-plant-transplant';
import { usePlantUpdate } from 'features/plants/hooks/use-plant-update/use-plant-update';
import { usePlantDetailPageStore } from 'features/plants/stores/plant-detail-page-store';
import { useGrowingUnitsFindByCriteria } from 'features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria';
import { act, renderHook } from '@testing-library/react';

jest.mock('features/plants/hooks/use-plant-find-by-id/use-plant-find-by-id');
jest.mock(
	'features/plants/hooks/use-plant-transplant/use-plant-transplant',
);
jest.mock('features/plants/hooks/use-plant-update/use-plant-update');
jest.mock('features/plants/stores/plant-detail-page-store');
jest.mock(
	'features/growing-units/hooks/use-growing-units-find-by-criteria/use-growing-units-find-by-criteria',
);

describe('usePlantDetailPage', () => {
	const mockRefetch = jest.fn();
	const mockHandleTransplant = jest.fn();
	const mockHandleUpdate = jest.fn();
	const mockSetTransplantDialogOpen = jest.fn();
	const mockSetEditDetailsDialogOpen = jest.fn();

	const mockPlant = {
		id: 'plant-1',
		name: 'Tomato',
		species: 'Solanum lycopersicum',
		status: 'GROWING',
		plantedDate: new Date('2024-01-01'),
		growingUnit: { id: 'unit-1', name: 'Greenhouse', type: 'POT', capacity: 10 },
	};

	const mockGrowingUnits = {
		items: [
			{ id: 'unit-1', name: 'Greenhouse A', type: 'POT', capacity: 10 },
			{ id: 'unit-2', name: 'Garden', type: 'GARDEN_BED', capacity: 20 },
		],
	};

	beforeEach(() => {
		jest.clearAllMocks();

		(usePlantFindById as jest.Mock).mockReturnValue({
			plant: mockPlant,
			isLoading: false,
			error: null,
			refetch: mockRefetch,
		});

		(useGrowingUnitsFindByCriteria as jest.Mock).mockReturnValue({
			growingUnits: mockGrowingUnits,
			isLoading: false,
			error: null,
		});

		(usePlantTransplant as jest.Mock).mockReturnValue({
			handleTransplant: mockHandleTransplant,
			isLoading: false,
			error: null,
		});

		(usePlantUpdate as jest.Mock).mockReturnValue({
			handleUpdate: mockHandleUpdate,
			isLoading: false,
			error: null,
		});

		(usePlantDetailPageStore as unknown as jest.Mock).mockReturnValue({
			transplantDialogOpen: false,
			setTransplantDialogOpen: mockSetTransplantDialogOpen,
			editDetailsDialogOpen: false,
			setEditDetailsDialogOpen: mockSetEditDetailsDialogOpen,
		});
	});

	describe('Initialization', () => {
		it('should initialize with plant data', () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.plant).toEqual(mockPlant);
			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
		});

		it('should pass id to usePlantFindById', () => {
			renderHook(() => usePlantDetailPage('plant-1'));

			expect(usePlantFindById).toHaveBeenCalledWith('plant-1');
		});

		it('should expose source growing unit', () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.sourceGrowingUnit).toEqual(mockPlant.growingUnit);
		});

		it('should expose target growing units', () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.targetGrowingUnits).toEqual(mockGrowingUnits.items);
		});
	});

	describe('Plant age calculation', () => {
		it('should calculate plant age in days', () => {
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 10);

			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: { ...mockPlant, plantedDate: recentDate },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.plantAge).not.toBeNull();
			expect(result.current.plantAge?.type).toBe('days');
		});

		it('should calculate plant age in months', () => {
			const monthsAgoDate = new Date();
			monthsAgoDate.setMonth(monthsAgoDate.getMonth() - 3);

			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: { ...mockPlant, plantedDate: monthsAgoDate },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.plantAge?.type).toBe('months');
		});

		it('should return null age when no plantedDate', () => {
			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: { ...mockPlant, plantedDate: null },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.plantAge).toBeNull();
			expect(result.current.plantAgeText).toBeNull();
		});

		it('should return null when plant is null', () => {
			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.plantAge).toBeNull();
		});
	});

	describe('Formatted planted date', () => {
		it('should format planted date', () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.formattedPlantedDate).not.toBeNull();
			expect(typeof result.current.formattedPlantedDate).toBe('string');
		});

		it('should return null when no planted date', () => {
			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: { ...mockPlant, plantedDate: null },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.formattedPlantedDate).toBeNull();
		});
	});

	describe('handleTransplantSubmit', () => {
		it('should not transplant when plant is null', async () => {
			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			await act(async () => {
				await result.current.handleTransplantSubmit('unit-2');
			});

			expect(mockHandleTransplant).not.toHaveBeenCalled();
		});

		it('should not transplant when plant has no growingUnit', async () => {
			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: { ...mockPlant, growingUnit: null },
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			await act(async () => {
				await result.current.handleTransplantSubmit('unit-2');
			});

			expect(mockHandleTransplant).not.toHaveBeenCalled();
		});

		it('should call handleTransplant with correct params', async () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			await act(async () => {
				await result.current.handleTransplantSubmit('unit-2');
			});

			expect(mockHandleTransplant).toHaveBeenCalledWith(
				{
					sourceGrowingUnitId: 'unit-1',
					targetGrowingUnitId: 'unit-2',
					plantId: 'plant-1',
				},
				expect.any(Function),
			);
		});

		it('should refetch and close dialog after successful transplant', async () => {
			mockHandleTransplant.mockImplementation(
				async (_input: any, callback: () => void) => {
					callback();
				},
			);

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			await act(async () => {
				await result.current.handleTransplantSubmit('unit-2');
			});

			expect(mockRefetch).toHaveBeenCalled();
			expect(mockSetTransplantDialogOpen).toHaveBeenCalledWith(false);
		});
	});

	describe('handleUpdateSubmit', () => {
		it('should not update when plant is null', async () => {
			(usePlantFindById as jest.Mock).mockReturnValue({
				plant: null,
				isLoading: false,
				error: null,
				refetch: mockRefetch,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			await act(async () => {
				await result.current.handleUpdateSubmit({ name: 'Updated' } as any);
			});

			expect(mockHandleUpdate).not.toHaveBeenCalled();
		});

		it('should call handleUpdate with correct values', async () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			const updateValues = {
				name: 'Updated Tomato',
				species: 'Solanum lycopersicum',
				plantedDate: new Date('2024-01-15'),
				notes: 'Updated notes',
				status: 'GROWING',
			};

			await act(async () => {
				await result.current.handleUpdateSubmit(updateValues as any);
			});

			expect(mockHandleUpdate).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'plant-1',
					name: 'Updated Tomato',
					species: 'Solanum lycopersicum',
					notes: 'Updated notes',
					status: 'GROWING',
				}),
				expect.any(Function),
			);
		});
	});

	describe('upcomingCareGroups', () => {
		it('should return 3 upcoming care groups', () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.upcomingCareGroups).toHaveLength(3);
		});

		it('should have tomorrow, in5days, in2weeks groups', () => {
			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			const groupIds = result.current.upcomingCareGroups.map((g) => g.id);
			expect(groupIds).toContain('tomorrow');
			expect(groupIds).toContain('in5days');
			expect(groupIds).toContain('in2weeks');
		});
	});

	describe('Dialog state', () => {
		it('should expose transplant dialog state', () => {
			(usePlantDetailPageStore as unknown as jest.Mock).mockReturnValue({
				transplantDialogOpen: true,
				setTransplantDialogOpen: mockSetTransplantDialogOpen,
				editDetailsDialogOpen: false,
				setEditDetailsDialogOpen: mockSetEditDetailsDialogOpen,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.transplantDialogOpen).toBe(true);
		});

		it('should expose edit details dialog state', () => {
			(usePlantDetailPageStore as unknown as jest.Mock).mockReturnValue({
				transplantDialogOpen: false,
				setTransplantDialogOpen: mockSetTransplantDialogOpen,
				editDetailsDialogOpen: true,
				setEditDetailsDialogOpen: mockSetEditDetailsDialogOpen,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.editDetailsDialogOpen).toBe(true);
		});
	});

	describe('Loading states', () => {
		it('should expose transplanting loading state', () => {
			(usePlantTransplant as jest.Mock).mockReturnValue({
				handleTransplant: mockHandleTransplant,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.isTransplanting).toBe(true);
			expect(result.current.isLoadingTransplant).toBe(true);
		});

		it('should expose updating loading state', () => {
			(usePlantUpdate as jest.Mock).mockReturnValue({
				handleUpdate: mockHandleUpdate,
				isLoading: true,
				error: null,
			});

			const { result } = renderHook(() => usePlantDetailPage('plant-1'));

			expect(result.current.isUpdating).toBe(true);
		});
	});
});

import { EventBus } from "@nestjs/cqrs";
import { GrowingUnitUpdateCommand } from "@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command";
import { GrowingUnitUpdateCommandHandler } from "@/core/plant-context/application/commands/growing-unit/growing-unit-update/growing-unit-update.command-handler";
import { IGrowingUnitUpdateCommandDto } from "@/core/plant-context/application/dtos/commands/growing-unit/growing-unit-update/growing-unit-update-command.dto";
import { AssertGrowingUnitExistsService } from "@/core/plant-context/application/services/growing-unit/assert-growing-unit-exists/assert-growing-unit-exists.service";
import { GrowingUnitAggregate } from "@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate";
import { GrowingUnitTypeEnum } from "@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum";
import { GrowingUnitNameChangedEvent } from "@/core/plant-context/domain/events/growing-unit/growing-unit/field-changed/growing-unit-name-changed/growing-unit-name-changed.event";
import {
	GROWING_UNIT_WRITE_REPOSITORY_TOKEN,
	IGrowingUnitWriteRepository,
} from "@/core/plant-context/domain/repositories/growing-unit/growing-unit-write/growing-unit-write.repository";
import { GrowingUnitCapacityValueObject } from "@/core/plant-context/domain/value-objects/growing-unit/growing-unit-capacity/growing-unit-capacity.vo";
import { GrowingUnitNameValueObject } from "@/core/plant-context/domain/value-objects/growing-unit/growing-unit-name/growing-unit-name.vo";
import { GrowingUnitTypeValueObject } from "@/core/plant-context/domain/value-objects/growing-unit/growing-unit-type/growing-unit-type.vo";
import { PublishIntegrationEventsService } from "@/shared/application/services/publish-integration-events/publish-integration-events.service";
import { LengthUnitEnum } from "@/shared/domain/enums/length-unit/length-unit.enum";
import { DimensionsValueObject } from "@/shared/domain/value-objects/dimensions/dimensions.vo";
import { GrowingUnitUuidValueObject } from "@/shared/domain/value-objects/identifiers/growing-unit-uuid/growing-unit-uuid.vo";

describe("GrowingUnitUpdateCommandHandler", () => {
	let handler: GrowingUnitUpdateCommandHandler;
	let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;
	let mockAssertGrowingUnitExistsService: jest.Mocked<AssertGrowingUnitExistsService>;
	let mockEventBus: jest.Mocked<EventBus>;

	beforeEach(() => {
		mockGrowingUnitWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		mockAssertGrowingUnitExistsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<AssertGrowingUnitExistsService>;

		mockEventBus = {
			publishAll: jest.fn(),
			publish: jest.fn(),
		} as unknown as jest.Mocked<EventBus>;

		handler = new GrowingUnitUpdateCommandHandler(
			mockGrowingUnitWriteRepository,
			mockPublishIntegrationEventsService,
			mockAssertGrowingUnitExistsService,
			mockEventBus,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should update growing unit name successfully", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
				name: "Garden Bed 2",
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockAssertGrowingUnitExistsService.execute).toHaveBeenCalledWith(
				growingUnitId,
			);
			expect(mockGrowingUnit.name.value).toBe("Garden Bed 2");
			expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
				mockGrowingUnit,
			);
			expect(mockEventBus.publishAll).toHaveBeenCalledWith(
				mockGrowingUnit.getUncommittedEvents(),
			);
		});

		it("should update growing unit type successfully", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
				type: GrowingUnitTypeEnum.POT,
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockGrowingUnit.type.value).toBe(GrowingUnitTypeEnum.POT);
		});

		it("should update growing unit capacity successfully", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
				capacity: 20,
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockGrowingUnit.capacity.value).toBe(20);
		});

		it("should update growing unit dimensions successfully", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
				dimensions: {
					length: 200,
					width: 100,
					height: 50,
					unit: LengthUnitEnum.CENTIMETER,
				},
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockGrowingUnit.dimensions).not.toBeNull();
			expect(mockGrowingUnit.dimensions?.toPrimitives()).toEqual({
				length: 200,
				width: 100,
				height: 50,
				unit: LengthUnitEnum.CENTIMETER,
			});
		});

		it("should update multiple properties at once", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
				name: "Garden Bed 2",
				type: GrowingUnitTypeEnum.POT,
				capacity: 20,
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockGrowingUnit.name.value).toBe("Garden Bed 2");
			expect(mockGrowingUnit.type.value).toBe(GrowingUnitTypeEnum.POT);
			expect(mockGrowingUnit.capacity.value).toBe(20);
		});

		it("should not update properties that are undefined", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			const originalName = mockGrowingUnit.name.value;
			const originalType = mockGrowingUnit.type.value;
			const originalCapacity = mockGrowingUnit.capacity.value;

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockEventBus.publishAll.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockGrowingUnit.name.value).toBe(originalName);
			expect(mockGrowingUnit.type.value).toBe(originalType);
			expect(mockGrowingUnit.capacity.value).toBe(originalCapacity);
		});

		it("should publish events after updating", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
				name: "Garden Bed 2",
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockAssertGrowingUnitExistsService.execute.mockResolvedValue(
				mockGrowingUnit,
			);

			// Make save return the same object to preserve events
			mockGrowingUnitWriteRepository.save.mockImplementation(
				async (aggregate) => aggregate,
			);

			// Capture the events that are passed to publishAll
			let capturedEvents: any[] = [];
			mockEventBus.publishAll.mockImplementation(async (events) => {
				capturedEvents = Array.isArray(events) ? [...events] : [];
				return undefined;
			});

			await handler.execute(command);

			expect(mockEventBus.publishAll).toHaveBeenCalledTimes(1);
			expect(capturedEvents.length).toBeGreaterThanOrEqual(1);
			const nameChangedEvent = capturedEvents.find(
				(e) => e instanceof GrowingUnitNameChangedEvent,
			);
			expect(nameChangedEvent).toBeInstanceOf(GrowingUnitNameChangedEvent);
		});

		it("should throw exception when growing unit does not exist", async () => {
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const commandDto: IGrowingUnitUpdateCommandDto = {
				id: growingUnitId,
				name: "Garden Bed 2",
			};

			const command = new GrowingUnitUpdateCommand(commandDto);
			const error = new Error("Growing unit not found");

			mockAssertGrowingUnitExistsService.execute.mockRejectedValue(error);

			await expect(handler.execute(command)).rejects.toThrow(error);
			expect(mockGrowingUnitWriteRepository.save).not.toHaveBeenCalled();
			expect(mockEventBus.publishAll).not.toHaveBeenCalled();
		});
	});
});

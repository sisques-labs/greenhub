import { GrowingUnitCreateCommand } from "@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command";
import { GrowingUnitCreateCommandHandler } from "@/core/plant-context/application/commands/growing-unit/growing-unit-create/growing-unit-create.command-handler";
import { IGrowingUnitCreateCommandDto } from "@/core/plant-context/application/dtos/commands/growing-unit/growing-unit-create/growing-unit-create-command.dto";
import { GrowingUnitCreatedEvent } from "@/core/plant-context/application/events/growing-unit/growing-unit-created/growing-unit-created.event";
import { GrowingUnitAggregate } from "@/core/plant-context/domain/aggregates/growing-unit/growing-unit.aggregate";
import { GrowingUnitTypeEnum } from "@/core/plant-context/domain/enums/growing-unit/growing-unit-type/growing-unit-type.enum";
import { GrowingUnitAggregateFactory } from "@/core/plant-context/domain/factories/aggregates/growing-unit/growing-unit-aggregate.factory";
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

describe("GrowingUnitCreateCommandHandler", () => {
	let handler: GrowingUnitCreateCommandHandler;
	let mockGrowingUnitWriteRepository: jest.Mocked<IGrowingUnitWriteRepository>;
	let mockPublishIntegrationEventsService: jest.Mocked<PublishIntegrationEventsService>;
	let mockGrowingUnitAggregateFactory: jest.Mocked<GrowingUnitAggregateFactory>;

	beforeEach(() => {
		mockGrowingUnitWriteRepository = {
			findById: jest.fn(),
			save: jest.fn(),
			delete: jest.fn(),
		} as unknown as jest.Mocked<IGrowingUnitWriteRepository>;

		mockPublishIntegrationEventsService = {
			execute: jest.fn(),
		} as unknown as jest.Mocked<PublishIntegrationEventsService>;

		mockGrowingUnitAggregateFactory = {
			create: jest.fn(),
			fromPrimitives: jest.fn(),
		} as unknown as jest.Mocked<GrowingUnitAggregateFactory>;

		handler = new GrowingUnitCreateCommandHandler(
			mockGrowingUnitWriteRepository,
			mockGrowingUnitAggregateFactory,
			mockPublishIntegrationEventsService,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("execute", () => {
		it("should create growing unit successfully", async () => {
			const commandDto: IGrowingUnitCreateCommandDto = {
				name: "Garden Bed 1",
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
				length: 100,
				width: 50,
				height: 30,
				unit: LengthUnitEnum.CENTIMETER,
			};

			const command = new GrowingUnitCreateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: new DimensionsValueObject({
					length: 100,
					width: 50,
					height: 30,
					unit: LengthUnitEnum.CENTIMETER,
				}),
				plants: [],
			});

			mockGrowingUnitAggregateFactory.create.mockReturnValue(mockGrowingUnit);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(mockGrowingUnit.id.value);
			expect(mockGrowingUnitAggregateFactory.create).toHaveBeenCalledWith({
				id: command.id,
				name: command.name,
				type: command.type,
				capacity: command.capacity,
				dimensions: command.dimensions,
				plants: [],
			});
			expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledWith(
				mockGrowingUnit,
			);
			expect(mockGrowingUnitWriteRepository.save).toHaveBeenCalledTimes(1);
			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(GrowingUnitCreatedEvent);
			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalledTimes(
				1,
			);
		});

		it("should create growing unit without dimensions", async () => {
			const commandDto: IGrowingUnitCreateCommandDto = {
				name: "Garden Bed 1",
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
			};

			const command = new GrowingUnitCreateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnitAggregateFactory.create.mockReturnValue(mockGrowingUnit);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(mockGrowingUnit.id.value);
			expect(mockGrowingUnitAggregateFactory.create).toHaveBeenCalledWith({
				id: command.id,
				name: command.name,
				type: command.type,
				capacity: command.capacity,
				dimensions: null,
				plants: [],
			});
		});

		it("should publish GrowingUnitCreatedEvent when growing unit is created", async () => {
			const commandDto: IGrowingUnitCreateCommandDto = {
				name: "Garden Bed 1",
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
			};

			const command = new GrowingUnitCreateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnitAggregateFactory.create.mockReturnValue(mockGrowingUnit);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			expect(mockPublishIntegrationEventsService.execute).toHaveBeenCalled();
			const callArgs =
				mockPublishIntegrationEventsService.execute.mock.calls[0][0];
			expect(callArgs).toBeInstanceOf(GrowingUnitCreatedEvent);
		});

		it("should save growing unit before publishing events", async () => {
			const commandDto: IGrowingUnitCreateCommandDto = {
				name: "Garden Bed 1",
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
			};

			const command = new GrowingUnitCreateCommand(commandDto);
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnitAggregateFactory.create.mockReturnValue(mockGrowingUnit);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			await handler.execute(command);

			const saveOrder =
				mockGrowingUnitWriteRepository.save.mock.invocationCallOrder[0];
			const publishOrder =
				mockPublishIntegrationEventsService.execute.mock.invocationCallOrder[0];
			expect(saveOrder).toBeLessThan(publishOrder);
		});

		it("should return the created growing unit id", async () => {
			const commandDto: IGrowingUnitCreateCommandDto = {
				name: "Garden Bed 1",
				type: GrowingUnitTypeEnum.GARDEN_BED,
				capacity: 10,
			};

			const command = new GrowingUnitCreateCommand(commandDto);
			const growingUnitId = "123e4567-e89b-12d3-a456-426614174000";
			const mockGrowingUnit = new GrowingUnitAggregate({
				id: new GrowingUnitUuidValueObject(growingUnitId),
				name: new GrowingUnitNameValueObject("Garden Bed 1"),
				type: new GrowingUnitTypeValueObject(GrowingUnitTypeEnum.GARDEN_BED),
				capacity: new GrowingUnitCapacityValueObject(10),
				dimensions: null,
				plants: [],
			});

			mockGrowingUnitAggregateFactory.create.mockReturnValue(mockGrowingUnit);
			mockGrowingUnitWriteRepository.save.mockResolvedValue(mockGrowingUnit);
			mockPublishIntegrationEventsService.execute.mockResolvedValue(undefined);

			const result = await handler.execute(command);

			expect(result).toBe(growingUnitId);
		});
	});
});

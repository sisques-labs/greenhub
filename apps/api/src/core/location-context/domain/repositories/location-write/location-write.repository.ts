import type { LocationAggregate } from "@/core/location-context/domain/aggregates/location.aggregate";
import type { IBaseWriteRepository } from "@/shared/domain/interfaces/base-write-repository.interface";

export const LOCATION_WRITE_REPOSITORY_TOKEN = Symbol(
	"LocationWriteRepository",
);

/**
 * Type alias for the location write repository.
 * This repository handles write operations (create, update, delete) for locations.
 *
 * @type ILocationWriteRepository
 */
export type ILocationWriteRepository = IBaseWriteRepository<LocationAggregate>;

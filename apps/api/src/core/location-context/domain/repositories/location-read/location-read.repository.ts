import type { LocationViewModel } from "@/core/location-context/domain/view-models/location/location.view-model";
import type { IBaseReadRepository } from "@/shared/domain/interfaces/base-read-repository.interface";

export const LOCATION_READ_REPOSITORY_TOKEN = Symbol("LocationReadRepository");

/**
 * Type alias for the location read repository.
 * This repository handles read operations (queries) for locations.
 *
 * @type ILocationReadRepository
 */
export type ILocationReadRepository = IBaseReadRepository<LocationViewModel>;

import { IBaseViewModelDto } from '@/shared/domain/interfaces/base-view-model-dto.interface';

/**
 * Represents the view model for the data returned for a tenant entity.
 *
 * @remarks
 * This interface defines the structure of data tailored for the presentation layer
 * for a tenant. All properties are formatted as primitives or nullable primitives,
 * as appropriate for API responses or presentation logic.
 *
 * @see ITenantDto for entity data structure
 */
export interface ITenantViewModelDto extends IBaseViewModelDto {
	clerkId: string;
	name: string;
	status: string;
}


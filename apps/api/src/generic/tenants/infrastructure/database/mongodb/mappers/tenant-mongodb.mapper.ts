import { Injectable, Logger } from '@nestjs/common';

import { TenantViewModelBuilder } from '@/generic/tenants/domain/builders/tenant-view-model/tenant-view-model.builder';
import { TenantViewModel } from '@/generic/tenants/domain/view-models/tenant/tenant.view-model';
import { TenantMongoDbDto } from '@/generic/tenants/infrastructure/database/mongodb/dtos/tenant-mongodb.dto';

@Injectable()
export class TenantMongoDBMapper {
	private readonly logger = new Logger(TenantMongoDBMapper.name);

	constructor(private readonly tenantViewModelBuilder: TenantViewModelBuilder) {}

	/**
	 * Converts a MongoDB document to a tenant view model
	 *
	 * @param doc - The MongoDB document to convert
	 * @returns The tenant view model
	 */
	toViewModel(doc: TenantMongoDbDto): TenantViewModel {
		this.logger.log(
			`Converting MongoDB document to tenant view model with id ${doc.id}`,
		);

		return this.tenantViewModelBuilder
			.reset()
			.withId(doc.id)
			.withClerkId(doc.clerkId)
			.withName(doc.name)
			.withStatus(doc.status)
			.withCreatedAt(
				doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
			)
			.withUpdatedAt(
				doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
			)
			.build();
	}

	/**
	 * Converts a tenant view model to a MongoDB document
	 *
	 * @param tenantViewModel - The tenant view model to convert
	 * @returns The MongoDB document
	 */
	toMongoData(tenantViewModel: TenantViewModel): TenantMongoDbDto {
		this.logger.log(
			`Converting tenant view model with id ${tenantViewModel.id} to MongoDB document`,
		);

		return {
			id: tenantViewModel.id,
			clerkId: tenantViewModel.clerkId,
			name: tenantViewModel.name,
			status: tenantViewModel.status,
			createdAt: tenantViewModel.createdAt,
			updatedAt: tenantViewModel.updatedAt,
		};
	}
}


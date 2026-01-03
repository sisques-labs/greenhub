import { Criteria } from '@/shared/domain/entities/criteria';

export class FindTenantsByCriteriaQuery {
	constructor(public readonly criteria: Criteria) {}
}


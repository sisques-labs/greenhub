import type { BaseFilter, BaseSort, PaginationInput } from "../../shared/types/index.js";

export type TenantFindByCriteriaInput = {
	filters?: BaseFilter[];
	sorts?: BaseSort[];
	pagination?: PaginationInput;
};


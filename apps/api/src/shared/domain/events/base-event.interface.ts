import { randomUUID } from "crypto";
import { IEventMetadata } from "@/shared/domain/interfaces/event-metadata.interface";

export abstract class BaseEvent<TData> {
	readonly eventId: string;
	readonly eventType: string;
	readonly aggregateRootId: string;
	readonly aggregateRootType: string;
	readonly ocurredAt: Date;
	readonly entityId: string;
	readonly entityType: string;
	protected readonly _data: TData;

	constructor(metadata: IEventMetadata, data: TData) {
		this.eventId = randomUUID();
		this.eventType = metadata.eventType;
		this.aggregateRootId = metadata.aggregateRootId;
		this.aggregateRootType = metadata.aggregateRootType;
		this.entityId = metadata.entityId;
		this.entityType = metadata.entityType;
		this.ocurredAt = new Date();
		this._data = data;
	}

	public get data(): TData {
		return this._data;
	}
}

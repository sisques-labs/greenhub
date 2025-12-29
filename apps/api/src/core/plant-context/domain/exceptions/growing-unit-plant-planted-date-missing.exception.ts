import { BaseDomainException } from '@/shared/domain/exceptions/base-domain.exception';

export class PlantPlantedDateMissingException extends BaseDomainException {
  constructor(plantId: string) {
    super(`Plant ${plantId} does not have a planted date`);
  }
}

import { Inject, Injectable, Logger } from '@nestjs/common';
import { AuthNotFoundException } from '@/generic/auth/application/exceptions/auth-not-found/auth-not-found.exception';
import {
  AUTH_READ_REPOSITORY_TOKEN,
  AuthReadRepository,
} from '@/generic/auth/domain/repositories/auth-read.repository';
import { AuthViewModel } from '@/generic/auth/domain/view-models/auth.view-model';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

@Injectable()
export class AssertAuthViewModelExistsService
  implements IBaseService<string, AuthViewModel>
{
  private readonly logger = new Logger(AssertAuthViewModelExistsService.name);

  constructor(
    @Inject(AUTH_READ_REPOSITORY_TOKEN)
    private readonly authReadRepository: AuthReadRepository,
  ) {}

  async execute(id: string): Promise<AuthViewModel> {
    this.logger.log(`Asserting auth view model exists by id: ${id}`);

    // 01: Find the auth by id
    const existingAuthViewModel = await this.authReadRepository.findById(id);

    // 02: If the user view model does not exist, throw an error
    if (!existingAuthViewModel) {
      this.logger.error(`Auth view model not found by id: ${id}`);
      throw new AuthNotFoundException(id);
    }

    return existingAuthViewModel;
  }
}

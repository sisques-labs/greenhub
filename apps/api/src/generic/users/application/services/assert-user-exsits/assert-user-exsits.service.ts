import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserNotFoundException } from '@/generic/users/application/exceptions/user-not-found/user-not-found.exception';
import { UserAggregate } from '@/generic/users/domain/aggregates/user.aggregate';
import {
  USER_WRITE_REPOSITORY_TOKEN,
  UserWriteRepository,
} from '@/generic/users/domain/repositories/user-write.repository';
import { IBaseService } from '@/shared/application/services/base-service/base-service.interface';

@Injectable()
export class AssertUserExsistsService
  implements IBaseService<string, UserAggregate>
{
  private readonly logger = new Logger(AssertUserExsistsService.name);

  constructor(
    @Inject(USER_WRITE_REPOSITORY_TOKEN)
    private readonly userWriteRepository: UserWriteRepository,
  ) {}

  async execute(id: string): Promise<UserAggregate> {
    this.logger.log(`Asserting user exists by id: ${id}`);

    // 01: Find the user by id
    const existingUser = await this.userWriteRepository.findById(id);

    // 02: If the user does not exist, throw an error
    if (!existingUser) {
      this.logger.error(`User not found by id: ${id}`);
      throw new UserNotFoundException(id);
    }

    return existingUser;
  }
}

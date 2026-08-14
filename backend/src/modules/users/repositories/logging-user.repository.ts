import { Injectable, Logger } from '@nestjs/common';
import type { UserRepository } from './user.repository';
import { CachedUserRepository } from './cached-user.repository';
import type {
  CreateUserInput,
  UpdateUserInput,
  UserProfileImage,
} from '../interfaces/user.interface';
import type { UserListOptions } from './user.repository';

@Injectable()
export class LoggingUserRepository implements UserRepository {
  private readonly logger = new Logger(LoggingUserRepository.name);

  constructor(private readonly repo: CachedUserRepository) {}

  async findByEmail(email: string) {
    this.logger.log(`Finding user by email: ${email}`);

    try {
      const result = await this.repo.findByEmail(email);

      this.logger.log('User fetched successfully');

      return result;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  async findByGoogleId(googleId: string) {
    this.logger.log('Finding user by Google identity');
    return this.repo.findByGoogleId(googleId);
  }

  async create(input: CreateUserInput, image?: UserProfileImage) {
    this.logger.log('Creating user');

    return this.repo.create(input, image);
  }

  async update(id: string, input: UpdateUserInput, image?: UserProfileImage) {
    this.logger.log(`Updating user ${id}`);

    return this.repo.update(id, input, image);
  }

  async setBlocked(id: string, isBlocked: boolean) {
    this.logger.log(`${isBlocked ? 'Blocking' : 'Unblocking'} user ${id}`);

    return this.repo.setBlocked(id, isBlocked);
  }

  async linkGoogleAccount(id: string, googleId: string) {
    this.logger.log(`Linking Google identity to user ${id}`);
    return this.repo.linkGoogleAccount(id, googleId);
  }

  async updateProfileImage(id: string, image: UserProfileImage | null) {
    this.logger.log(
      `${image ? 'Updating' : 'Removing'} user ${id} profile image`,
    );

    return this.repo.updateProfileImage(id, image);
  }

  async updatePassword(id: string, password: string) {
    this.logger.log(`Updating password for user ${id}`);
    return this.repo.updatePassword(id, password);
  }

  async delete(id: string) {
    this.logger.log(`Deleting user ${id}`);

    return this.repo.delete(id);
  }

  async findById(id: string) {
    return this.repo.findById(id);
  }

  async findAll(options: UserListOptions) {
    this.logger.log(
      `Fetching users ${options.skip}-${options.skip + options.take}`,
    );
    return this.repo.findAll(options);
  }
}

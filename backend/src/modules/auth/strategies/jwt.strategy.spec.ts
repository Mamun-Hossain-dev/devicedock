import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from '../../users/repositories/user.repository';
import { Role } from '../../users/interfaces/user.interface';

describe('JwtStrategy', () => {
  const userId = '00000000-0000-7000-8000-000000000001';
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
  } as unknown as ConfigService;
  const findById = jest.fn();
  const userRepository = {
    findById,
  } as unknown as UserRepository;
  const strategy = new JwtStrategy(configService, userRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects an existing token when its user has been blocked', async () => {
    jest.spyOn(userRepository, 'findById').mockResolvedValue({
      id: userId,
      name: 'Blocked User',
      email: 'blocked@example.com',
      age: 24,
      password: 'hashed-password',
      role: Role.USER,
      isBlocked: true,
    });

    await expect(
      strategy.validate({ sub: userId, email: 'blocked@example.com' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects legacy numeric token subjects before querying users', async () => {
    await expect(
      strategy.validate({ sub: 1 as never, email: 'legacy@example.com' }),
    ).rejects.toThrow('Invalid token subject');
    expect(findById).not.toHaveBeenCalled();
  });
});

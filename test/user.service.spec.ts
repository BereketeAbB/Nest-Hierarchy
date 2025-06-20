import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/entities/user.entity';
import { UserRoleService } from '../src/user/user-role.service';
import { Repository } from 'typeorm';

describe('UserRoleService', () => {
  let service: UserRoleService;
  let userRepository: jest.Mocked<Partial<Repository<User>>>;

  beforeEach(async () => {
    userRepository = {
      createQueryBuilder: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UserRoleService>(UserRoleService);
  });

  describe('getParent', () => {
    it('should return parent if found', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: 1,
          parent: { id: 99, name: 'Parent' },
        }),
      };

      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);

      const result = await service.getParent(1);

      expect(result).toEqual({
        id: 1,
        parent: { id: 99, name: 'Parent' },
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :childId', { childId: 1 });
    });

    it('should return false if user has no parent', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);

      const result = await service.getParent(123);
      expect(result).toBe(false);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../src/entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRoleService } from '../src/user/user-role.service';

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

  it('getParent should return parent if exists', async () => {
    const mockQueryBuilder: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ id: 2, parent: { id: 1 } }),
    };

    userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);

    expect(await service.getParent(2)).toEqual({ id: 2, parent: { id: 1 } });
  });

  it('getChildren should return children if exist', async () => {
    const mockQueryBuilder: any = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ id: 1, children: [{ id: 2 }] }),
    };

    userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);

    expect(await service.getChildren(1)).toEqual({ id: 1, children: [{ id: 2 }] });
  });

  it('addChild should assign parent if no parent exists', async () => {
    userRepository.findOneBy = jest.fn().mockImplementation(({ id }) => {
      if (id === 2) return Promise.resolve({ id: 2, parent: null });
      if (id === 1) return Promise.resolve({ id: 1 });
      return Promise.resolve(null);
    });

    userRepository.save = jest.fn().mockResolvedValue(true);
    const result = await service.addChild(1, 2);

    expect(result).toHaveProperty('parent');
  });

  it('addParent should assign parent if not already assigned', async () => {
    userRepository.findOneBy = jest.fn().mockImplementation(({ id }) => {
      if (id === 2) return Promise.resolve({ id: 2, parent: null });
      if (id === 1) return Promise.resolve({ id: 1 });
      return Promise.resolve(null);
    });

    userRepository.save = jest.fn().mockResolvedValue(true);
    const result = await service.addParent(1, 2);

    expect(result).toHaveProperty('parent');
  });

  // it('getAllChildren should return user tree', async () => {
  //   const mockQueryBuilder: any = {
  //     leftJoinAndSelect: jest.fn().mockReturnThis(),
  //     where: jest.fn().mockReturnThis(),
  //     getOne: jest.fn(),
  //   };

  //   // Response based on userId
  //   const userMap = {
  //     1: { id: 1, children: [{ id: 2 }] },
  //     2: { id: 2, children: [] },
  //   };

  //   // Replace with a closure to capture latest called userId
  //   let currentUserId: number;

  //   mockQueryBuilder.where.mockImplementation((query, params) => {
  //     currentUserId = params.userId;
  //     return mockQueryBuilder;
  //   });

  //   mockQueryBuilder.getOne.mockImplementation(() => {
  //     return Promise.resolve(userMap[currentUserId]);
  //   });

  //   userRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);

  //   const result = await service.getAllChildren(1);

  //   expect(result).toEqual({
  //     id: 1,
  //     children: [
  //       {
  //         id: 2,
  //         children: [],
  //       },
  //     ],
  //   });
  // });


  it('removeUser should detach parent and children', async () => {
    const user = {
      id: 1,
      children: [{ id: 2 }, { id: 3 }],
    };
    userRepository.createQueryBuilder = jest.fn().mockReturnValue({
      leftJoinAndSelect: () => ({
        where: () => ({
          getOne: () => Promise.resolve(user),
        }),
      }),
    });

    userRepository.save = jest.fn().mockResolvedValue(true);
    const result = await service.removeUser(1);

    expect(result.id).toBe(1);
  });

  it('updateRole should update user role and assign parent', async () => {
    userRepository.findOneBy = jest.fn().mockImplementation(({ id }) => {
      if (id === 2) return Promise.resolve({ id: 2, role: 'Manager' });
      if (id === 1) return Promise.resolve({ id: 1 });
      return Promise.resolve(null);
    });
    userRepository.save = jest.fn().mockResolvedValue(true);
    const result = await service.updateRole('Admin', 2, 1);
    expect(result).toHaveProperty('role', 'Admin');
  });

  it('updateRole should throw ForbiddenException if role is CEO', async () => {
    userRepository.findOneBy = jest.fn().mockResolvedValue({ id: 1, role: 'CEO' });
    await expect(service.updateRole('Manager', 1, 2)).rejects.toThrow(ForbiddenException);
  });

  it('updateRole should throw NotFoundException if user or parent is missing', async () => {
    userRepository.findOneBy = jest.fn().mockImplementation(({ id }) => {
      if (id === 1) return Promise.resolve(null);
      return Promise.resolve({ id });
    });
    await expect(service.updateRole('Manager', 1, 2)).rejects.toThrow(NotFoundException);
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../src/user/user.service';
import { User } from '../src/entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UserService', () => {
  let service;
  let userRepository;

  beforeEach(async () => {
    userRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('getAll should return all users', async () => {
    userRepository.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.getAll();
    expect(result).toHaveLength(2);
  });

  it('getUser should return user by id', async () => {
    userRepository.findOneBy.mockResolvedValue({ id: 1 });
    const result = await service.getUser(1);
    expect(result).toEqual({ id: 1 });
  });

  it('addUser should throw NotFoundException if parent does not exist', async () => {
    userRepository.findOneBy.mockResolvedValue(null);
    await expect(
      service.addUser({ email: 'a@a.com', full_name: 'A', role: 'Manager', parent: 999 })
    ).rejects.toThrow(NotFoundException);
  });

  it('addUser should save and return new user if parent exists', async () => {
    const parentUser = { id: 1 };
    const newUser = { id: 2, email: 'b@b.com' };
    userRepository.findOneBy.mockResolvedValue(parentUser);
    userRepository.save.mockResolvedValue(newUser);

    const result = await service.addUser({ email: 'b@b.com', full_name: 'B', role: 'Staff', parent: 1 });
    expect(result).toEqual(newUser);
  });

  it('addCEO should throw ForbiddenException if role is not CEO', async () => {
    await expect(
      service.addCEO({ email: 'c@c.com', full_name: 'C', role: 'Manager' })
    ).rejects.toThrow(ForbiddenException);
  });

  it('addCEO should save and return user if role is CEO', async () => {
    const ceoUser = { id: 1, role: 'CEO' };
    userRepository.save.mockResolvedValue(ceoUser);

    const result = await service.addCEO({ email: 'ceo@company.com', full_name: 'Ceo Name', role: 'CEO' });
    expect(result).toEqual(ceoUser);
  });

  it('removeUserWithChildren should recursively remove user and children', async () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    };

    const child = { id: 2, children: [] };
    const parent = { id: 1, children: [child] };

    mockQueryBuilder.getOne.mockResolvedValueOnce(parent).mockResolvedValueOnce(child);

    userRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    userRepository.remove.mockResolvedValue(true);

    const result = await service.removeUserWithChildren(1);
    expect(userRepository.remove).toHaveBeenCalledTimes(2);
  });
});
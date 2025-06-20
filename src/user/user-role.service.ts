import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

    async getParent(childId: number): Promise<User | boolean> {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.parent', 'parent')
            .where('user.id = :childId', {childId})
            .getOne()  || false
    }

    async getChildren(parentId: number): Promise<User | boolean> {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.children', 'children')
            .where('user.id = :parentId', { parentId })
            .getOne() || false;
    }

    async addChild(parentId: number, userId: number): Promise<User|boolean> {
        const user = await this.userRepository.findOneBy({id:userId})
        const parent = await this.userRepository.findOneBy({id:parentId})
        if(user.parent)
            return false

        user.parent = parent;
        this.userRepository.save(user)

        return user;
    }

    async addParent(parentId: number, userId: number): Promise<User|boolean> {
        const user = await this.userRepository.findOneBy({id:userId})
        const parent = await this.userRepository.findOneBy({id:parentId})

        if(user.parent)
            return false

        user.parent = parent
        this.userRepository.save(user)

        return user;
    }

    async getAllChildren(userId: number): Promise<any> { // Promise<object | []>
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.children', 'children')
            .where('user.id = :userId', { userId })
            .getOne()

        if (user?.children) {
        await Promise.all(
          user.children.map(async (child) => {
            child.children = await this.getAllChildren(child.id);
          })
        );
      }
      return user;
    }

    async removeUser(userId: number): Promise<any> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.children', 'children')
            .where('user.id = :userId', {userId})
            .getOne()

        if(!user)
            throw new NotFoundException()

        user.parent = null;
        this.userRepository.save(user)

        user.children.map(async child => {
            child.parent = null
            this.userRepository.save(child)
        })
        return user
    }

    async updateRole(newRole: string, userId: number, parentId: number): Promise<User|boolean> {
        const user = await this.userRepository.findOneBy({id: userId})
        const parent = await this.userRepository.findOneBy({id: parentId})

        if(user.role == "CEO")
            throw new ForbiddenException()

        if(!user || !parent)
            throw new NotFoundException()

        user.parent = parent;
        user.role = newRole;

        await this.userRepository.save(user)
        return user;
    }
}

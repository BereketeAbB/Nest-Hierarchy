import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from 'src/entities/user.entity';
import { AddUserDto } from './dto/addUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    getAll(): Promise<User[]> {
        return this.userRepository.find({})
    }

    getUser(userId: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id: userId } });
    }

    async addUser(addUserDto: AddUserDto) {
        const parentUser = await this.userRepository.findOneBy( { id: addUserDto.parent || 0 })
        
        if(!parentUser)
            throw new NotFoundException()

        const newUser = new User(addUserDto.email, addUserDto.full_name, addUserDto.role, parentUser);

        const addedUser = await this.userRepository.save(newUser);

        return addedUser
    }

    async getParent(childId: number): Promise<User | undefined> {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.parent', 'parent')
            .where('user.id = :childId', {childId})
            .getOne()
    }

    async getChildren(parentId: number): Promise<User> {
        return await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.children', 'children')
            .where('user.id = :parentId', { parentId })
            .getOne();
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
        
        user.parent = null;
        this.userRepository.save(user)

        user.children.map(async child => {
            child.parent = null
            this.userRepository.save(child)       
        })        
        return user
    }

    async removeUserWithChildren(userId: number): Promise<any> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.children', 'children')
            .where('user.id = :userId', {userId})
            .getOne()

        if(user?.children)
            await Promise.all(
                user.children.map(async child => {
                    await this.removeUserWithChildren(child.id)
                })
            )
        return await this.userRepository.remove(user)
    }
}

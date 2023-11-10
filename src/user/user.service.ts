import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        const newUser = new User();
        newUser.email = addUserDto.email;
        newUser.full_name = addUserDto.full_name;
        newUser.role = addUserDto.role;
        // newUser.children = [];

        // if(!parentUser)
        //     throw new NotFoundException("Parent Not Found")

        const parentUser = await this.userRepository.findOne({ where: { id: addUserDto.parent || 0 } })
        newUser.parent = parentUser ? parentUser : undefined;

        const addedUser = await this.userRepository.save(newUser);

        console.log({ newUser, addedUser, parentUser, addUserDto });
        // if(parentUser){
        //     // newUser.parent = parentUser
        //     if(!parentUser.children)
        //         parentUser.children = []

        //     parentUser.children.push(addedUser)
        //     await this.userRepository.save(parentUser)
        // }

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

        if(!user || !parent)
            throw new NotFoundException()

        user.parent = parent;
        user.role = newRole;
        
        await this.userRepository.save(user)
        return user;
    }

    
}

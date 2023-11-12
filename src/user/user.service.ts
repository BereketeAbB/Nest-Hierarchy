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
        return this.userRepository.findOneBy({ id: userId });
    }

    async addUser(addUserDto: AddUserDto) {
        const parentUser = await this.userRepository.findOneBy( { id: addUserDto.parent || 0 })
        
        if(!parentUser)
            throw new NotFoundException()

        const newUser = new User(addUserDto.email, addUserDto.full_name, addUserDto.role, parentUser);

        const addedUser = await this.userRepository.save(newUser);

        return addedUser
    }

    async addCEO(addUserDto: AddUserDto) {
        if(addUserDto.role != "CEO")
            throw new ForbiddenException()
        
        const newUser = new User(addUserDto.email, addUserDto.full_name, addUserDto.role, null);

        const addedUser = await this.userRepository.save(newUser);

        return addedUser
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

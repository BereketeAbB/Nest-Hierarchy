import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddUserDto } from './dto/addUser.dto';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService
        ){}

    @Post('ceo')
    addCEO(@Body() addUserDto: AddUserDto){
        return this.userService.addCEO(addUserDto)
    }
    @Post('')
    addUser(@Body() addUserDto: AddUserDto){
        return this.userService.addUser(addUserDto)
    }

    @Get('')
    async getUsers(){
        return await this.userService.getAll()
    }

    @Get('/:id')
    async getUser(@Param('id') userId: number){
        return this.userService.getUser(userId)
    }

    @Post('/remove-user/:userId')
    async removeUser(@Param('userId') userId:number) {
        return this.userService.removeUserWithChildren(userId)
    }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddUserDto } from './dto/addUser.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('api/user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Post('ceo')
    @ApiOperation({ summary: 'Add a CEO user' })
    @ApiBody({ type: AddUserDto })
    @ApiResponse({ status: 201, description: 'CEO user added successfully.' })
    addCEO(@Body() addUserDto: AddUserDto){
        return this.userService.addCEO(addUserDto)
    }

    @Post('')
    @ApiOperation({ summary: 'Add a user' })
    @ApiBody({ type: AddUserDto })
    @ApiResponse({ status: 201, description: 'User added successfully.' })
    addUser(@Body() addUserDto: AddUserDto){
        return this.userService.addUser(addUserDto)
    }

    @Get('')
    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, description: 'List of users.' })
    async getUsers(){
        return await this.userService.getAll()
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get a user by ID' })
    @ApiParam({ name: 'id', type: Number })
    @ApiResponse({ status: 200, description: 'User found.' })
    async getUser(@Param('id') userId: number){
        return this.userService.getUser(userId)
    }

    @Post('/remove-user/:userId')
    @ApiOperation({ summary: 'Remove a user and their children by userId' })
    @ApiParam({ name: 'userId', type: Number })
    @ApiResponse({ status: 200, description: 'User and children removed.' })
    async removeUser(@Param('userId') userId:number) {
        return this.userService.removeUserWithChildren(userId)
    }
}

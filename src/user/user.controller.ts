import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddUserDto } from './dto/addUser.dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}


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

    @Get('/:id/child')
    async getChildren(@Param('id') parentId: number) {
        return this.userService.getChildren(parentId)
    }

    @Get('/:id/parent')
    async getParent(@Param('id') childId: number) {
        return this.userService.getParent(childId)
    }
    
    @Post('parent/:userId/:parentId')
    async addParent(@Param('userId') userId: number, @Param('parentId') parentId: number){
        return this.userService.addParent(parentId,userId)
    }

    @Post('child/:userId/:parentId')
    async addChild(@Param('userId') userId: number, @Param('parentId') parentId: number){
        return this.userService.addChild(parentId,userId)
    }

    @Post('/updateRole/:userId')
    async updateRole(
        @Param('userId') userId: number,
        @Body('parentId') parentId: number,
        @Body('newRole') newRole: string,
    ){
        return await this.userService.updateRole(newRole, userId, parentId);
    }

    @Get('/allChildren/:parentId')
    async getAllChildren (@Param('parentId') parentId: number){
        return await this.userService.getAllChildren(parentId)
    }
}

import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { UserRoleService } from './user-role.service';

@Controller('api/user/role')
export class UserRoleController {
    constructor(
        private readonly userRoleService: UserRoleService
        ){}

    @Get('/:id/child')
    async getChildren(@Param('id') parentId: number) {
        return this.userRoleService.getChildren(parentId)
    }

    @Get('/:id/parent')
    async getParent(@Param('id') childId: number) {
        return this.userRoleService.getParent(childId)
    }
    
    @Get('/all-children/:parentId')
    async getAllChildren (@Param('parentId') parentId: number){
        return await this.userRoleService.getAllChildren(parentId)
    }
    
    @Post('parent/:userId/:parentId')
    async addParent(@Param('userId') userId: number, @Param('parentId') parentId: number){
        return this.userRoleService.addParent(parentId,userId)
    }

    @Post('child/:userId/:parentId')
    async addChild(@Param('userId') userId: number, @Param('parentId') parentId: number){
        return this.userRoleService.addChild(parentId,userId)
    }

    @Post('/update-role/:userId')
    async updateRole(
        @Param('userId') userId: number,
        @Body('parentId') parentId: number,
        @Body('newRole') newRole: string,
    ){
        return await this.userRoleService.updateRole(newRole, userId, parentId);
    }


    @Post('/remove-position/:userId')
    async removePosition(@Param('userId') userId:number) {
        return this.userRoleService.removeUser(userId)
    }

}
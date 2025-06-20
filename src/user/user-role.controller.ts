import { Controller, Get, Post, Param, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger'
import { UserRoleService } from './user-role.service';

@ApiTags('User Roles')
@Controller('api/user/role')
export class UserRoleController {
    constructor(
        private readonly userRoleService: UserRoleService
        ){}

    @ApiOperation({ summary: 'Get children of a user role' })
    @ApiParam({ name: 'id', type: Number })
    @Get('/:id/child')
    async getChildren(@Param('id') parentId: number) {
        return this.userRoleService.getChildren(parentId)
    }

    @ApiOperation({ summary: 'Get parent of a user role' })
    @ApiParam({ name: 'id', type: Number })
    @Get('/:id/parent')
    async getParent(@Param('id') childId: number) {
        return this.userRoleService.getParent(childId)
    }

    @ApiOperation({ summary: 'Get all children of a parent role' })
    @ApiParam({ name: 'parentId', type: Number })
    @Get('/all-children/:parentId')
    async getAllChildren (@Param('parentId') parentId: number){
        return await this.userRoleService.getAllChildren(parentId)
    }

    @ApiOperation({ summary: 'Add a parent to a user' })
    @ApiParam({ name: 'userId', type: Number })
    @ApiParam({ name: 'parentId', type: Number })
    @Post('parent/:userId/:parentId')
    async addParent(@Param('userId') userId: number, @Param('parentId') parentId: number){
        return this.userRoleService.addParent(parentId,userId)
    }

    @ApiOperation({ summary: 'Add a child to a user' })
    @ApiParam({ name: 'userId', type: Number })
    @ApiParam({ name: 'parentId', type: Number })
    @Post('child/:userId/:parentId')
    async addChild(@Param('userId') userId: number, @Param('parentId') parentId: number){
        return this.userRoleService.addChild(parentId,userId)
    }

    @ApiOperation({ summary: 'Update user role' })
    @ApiParam({ name: 'userId', type: Number })
    @ApiBody({ schema: { properties: { parentId: { type: 'number' }, newRole: { type: 'string' } } } })
    @Post('/update-role/:userId')
    async updateRole(
        @Param('userId') userId: number,
        @Body('parentId') parentId: number,
        @Body('newRole') newRole: string,
    ){
        return await this.userRoleService.updateRole(newRole, userId, parentId);
    }

    @ApiOperation({ summary: 'Remove user position' })
    @ApiParam({ name: 'userId', type: Number })
    @Post('/remove-position/:userId')
    async removePosition(@Param('userId') userId:number) {
        return this.userRoleService.removeUser(userId)
    }

}
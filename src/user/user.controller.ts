import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  // @Delete(':id')
  // async delete(@Param('id') id: string): Promise<(import("mongoose").Document<unknown, {}, import("c:/Users/Joshua/Desktop/Jogmg/gacs-backend/src/user/entities/user.entity").User, {}, {}> & import("c:/Users/Joshua/Desktop/Jogmg/gacs-backend/src/user/entities/user.entity").User & Required<{ _id: unknown; }> & { __v: number; }) | null> {
  //   return await this.userService.delete(id);
  // }
}

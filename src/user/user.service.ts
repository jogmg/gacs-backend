import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hashPassword } from 'src/shared/utils/hash.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;

    const hashedPassword = await hashPassword(password);
    const newUser = { ...user, password: hashedPassword };
    const createdUser = new this.userModel(newUser);

    return await createdUser.save();
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOneById(id: string) {
    return await this.userModel.findById(id);
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async delete(id: string) {
    return await this.userModel.findByIdAndDelete(id);
  }
}

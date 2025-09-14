import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Program } from 'src/program/entities/program.entity';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Student extends BaseSchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  institution: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Program' })
  program: Program;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  graduationDate: string;

  @Prop()
  imgURL?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';

@Schema({ timestamps: true })
export class Student extends BaseSchema {
  @Prop({ required: true, ref: 'User' })
  institution: string;

  @Prop({ required: true, ref: 'Program' })
  program: string;

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

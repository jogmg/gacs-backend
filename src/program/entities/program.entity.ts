import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';

@Schema({ timestamps: true })
export class Program extends BaseSchema {
  @Prop({ required: true, ref: 'User' })
  institution: string;

  @Prop({ required: true })
  name: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);

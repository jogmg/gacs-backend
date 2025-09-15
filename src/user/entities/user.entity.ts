import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, sparse: true })
  email: string;

  @Prop()
  phoneNumber?: string;

  // ! Admin user should be tied to a particular email, preferably company email.
  // @Prop({ required: true, enum: ['individual', 'organization'] })
  // type: 'individual' | 'organization';

  @Prop({ required: true })
  password: string;

  // @Prop()
  // organization?: string;

  @Prop({ default: 0 })
  studentCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

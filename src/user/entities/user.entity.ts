import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, enum: ['guest', 'admin', 'institution'] })
  userType: 'guest' | 'admin' | 'institution';

  @Prop({ required: true })
  password: string;

  @Prop()
  organization?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

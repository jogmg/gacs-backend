import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';
import { toAcronym } from 'src/shared/utils/helper.utils';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Program extends BaseSchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  institution: User;

  @Prop({ required: true })
  name: string;

  @Virtual({
    get: function (this: Program) {
      return toAcronym(this.name);
    },
  })
  code?: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);

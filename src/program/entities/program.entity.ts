import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';
import { toAcronym } from 'src/shared/utils/helper.utils';

@Schema({ timestamps: true })
export class Program extends BaseSchema {
  @Prop({ required: true, ref: 'User' })
  institution: string;

  @Prop({ required: true })
  name: string;

  @Virtual({
    get: function (this: Program) {
      return toAcronym(this.name);
    },
  })
  code: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);

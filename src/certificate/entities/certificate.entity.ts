import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';

@Schema({ timestamps: true })
export class Certificate extends BaseSchema {
  @Prop({ required: true, ref: 'User' })
  institution: string;

  @Prop({ required: true, ref: 'Student' })
  student: string;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);

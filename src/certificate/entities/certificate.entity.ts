import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/shared/utils/base-schema.utils';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Certificate extends BaseSchema {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  institution: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Student' })
  student: Student;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);

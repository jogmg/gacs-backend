import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { InstitutionModule } from './institution/institution.module';
import { ProgramModule } from './program/program.module';
import { StudentModule } from './student/student.module';
import { UserModule } from './user/user.module';
import { CertificateModule } from './certificate/certificate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    InstitutionModule,
    StudentModule,
    ProgramModule,
    CertificateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

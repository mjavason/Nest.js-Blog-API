import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_CONNECTION_STRING } from 'src/constants';
import { MailModule } from './mail/mail.module';
import { IsObjectIdOrHexString } from './decorators/is_object_id.decorator';

@Module({
  imports: [
    AuthModule,
    BlogModule,
    MailModule,
    UserModule,
    MongooseModule.forRoot(DB_CONNECTION_STRING),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

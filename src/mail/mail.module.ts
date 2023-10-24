import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailTemplateService } from './mail_templates.service';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [MailService, MailTemplateService],
  imports: [UserModule],
  exports: [MailTemplateService],
})
export class MailModule {}

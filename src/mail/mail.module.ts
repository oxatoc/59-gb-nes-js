import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SMTP_HOST, SMTP_PASSWORD, SMTP_USER } from '../../credentials';

const transport = `smtps://${SMTP_USER}:${SMTP_PASSWORD}@${SMTP_HOST}`;
console.log('transport', transport);
console.log('dirname', __dirname);

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [
    MailerModule.forRoot({
      transport: transport,
      defaults: {
        from: `"NestJS робот" <${SMTP_USER}>`,
      },
      template: {
        dir: join(__dirname, '../../mail/templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule {}

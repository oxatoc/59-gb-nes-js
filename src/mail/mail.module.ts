import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [MailService],
  controllers: [MailController],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: `smtps://${config.get<string>(
          'SMTP_USER',
        )}:${config.get<string>('SMTP_PASSWORD')}@${config.get<string>(
          'SMTP_HOST',
        )}`,
        defaults: {
          from: `"NestJS робот" <${config.get<string>('SMTP_USER')}>`,
        },
        template: {
          dir: join(__dirname, '../../src/mail/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [MailService],
})
export class MailModule {}

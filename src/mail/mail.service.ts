import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { NewsChanges } from '../news/news-changes';
import { NewsEntity } from '../news/news.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sentTest() {
    console.log('Отправляется письмо установки');
    return this.mailerService
      .sendMail({
        to: 'regs@rigtaf.ru',
        subject: 'Первое тестовое письмо',
        template: './test',
      })
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  async sendNewNewsForAdmins(
    emails: string[],
    news: NewsEntity,
  ): Promise<void> {
    console.log('Отправляются письма о новой новости администрации ресурса');

    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Создана новая новость: ${news.title}`,
          template: './new-news',
          context: news,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
  async sendChanges(emails: string[], changes: NewsChanges): Promise<void> {
    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Изменения новости id = ${changes.id}`,
          template: './news-changes',
          context: { changes: changes.changes },
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
}

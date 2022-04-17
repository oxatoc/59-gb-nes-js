import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CalcModule } from './calc/calc.module';
import { LoggerMiddleware } from './middlwares/logger.middleware';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsEntity } from './news/news.entity';
import { UsersEntity } from './users/users.entity';
import { CommentsEntity } from './news/comments/comments.entity';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesEntity } from './categories/categories.entity';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RedisCacheModule } from './redis-cache/redis-cache.module';

@Module({
  imports: [
    NewsModule,
    CalcModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
    MailModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        entities: [NewsEntity, UsersEntity, CategoriesEntity, CommentsEntity],
        synchronize: config.get('DB_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CategoriesModule,
    AuthModule,
    EventEmitterModule.forRoot(),
    RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('news');
  }
}

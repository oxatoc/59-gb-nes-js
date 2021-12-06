import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { CalcModule } from './calc/calc.module';

@Module({
  imports: [NewsModule, CalcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

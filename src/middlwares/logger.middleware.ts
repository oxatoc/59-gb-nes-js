import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // console.log('LoggerMiddleware for news call');
    // console.log('middleware for news: ', req);
    next();
  }
}

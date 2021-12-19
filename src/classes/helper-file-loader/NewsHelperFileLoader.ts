import { AbstractHelperFileLoader } from './AbstractHelperFileLoader';
import { Request } from 'express';
import { PUBLIC_PATH } from '../../types/types';

const NEWS_PATH = '/news-static/';

export class NewsHelperFileLoader extends AbstractHelperFileLoader {
  path = NEWS_PATH;

  public destinationPath(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void {
    cb(null, PUBLIC_PATH + NEWS_PATH);
  }
}

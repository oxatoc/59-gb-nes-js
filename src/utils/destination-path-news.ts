import { Request } from 'express';
import { NEWS_PATH, PUBLIC_PATH } from '../types/types';

export function destinationPathNews(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) {
  cb(null, PUBLIC_PATH + NEWS_PATH);
}

import { Request } from 'express';
import { PUBLIC_PATH, AVATARS_PATH } from '../types/types';

export function destinationPathComment(
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, filename: string) => void,
) {
  cb(null, PUBLIC_PATH + AVATARS_PATH);
}

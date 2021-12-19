import { AbstractHelperFileLoader } from './AbstractHelperFileLoader';
import { Request } from 'express';
import { PUBLIC_PATH } from '../../types/types';

const AVATARS_PATH = '/avatars-static/';

export class CommentsHelperFileLoader extends AbstractHelperFileLoader {
  path = AVATARS_PATH;

  public destinationPath(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void {
    cb(null, PUBLIC_PATH + AVATARS_PATH);
  }
}

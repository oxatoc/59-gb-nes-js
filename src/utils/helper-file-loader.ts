import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

const publicPath = './public';
let path = publicPath;
export class HelperFileLoader {
  set path(_path: string) {
    path = publicPath + _path;
  }

  public customFileName(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    const originalName = file.originalname.split('.');
    const fileExtension = originalName[originalName.length - 1];
    cb(null, `${uuidv4()}.${fileExtension}`);
  }

  public destinationPath(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    cb(null, path);
  }
}

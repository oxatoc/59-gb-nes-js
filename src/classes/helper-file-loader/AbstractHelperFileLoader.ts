import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

export abstract class AbstractHelperFileLoader {
  public customFileName(
    req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    const originalName = file.originalname.split('.');
    const fileExtension = originalName[originalName.length - 1];
    cb(null, `${uuidv4()}.${fileExtension}`);
  }

  public abstract destinationPath(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ): void;

  public abstract path: string;
}

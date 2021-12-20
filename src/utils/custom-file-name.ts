import { v4 as uuidv4 } from 'uuid';

export function customFileName(
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, destination: string) => void,
) {
  const originalName = file.originalname.split('.');
  const fileExtension = originalName[originalName.length - 1];

  cb(null, `${uuidv4()}.${fileExtension}`);
}

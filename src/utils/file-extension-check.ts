import { HttpException, HttpStatus } from '@nestjs/common';

export function fileExtensionCheck(
  req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  const ext = file.originalname.split('.').pop() ?? '';
  let error = null;
  if (!['ipg', 'jpeg', 'png', 'gif'].includes(ext)) {
    error = new HttpException(
      `file extension '${ext}' is not valid for graphic files`,
      HttpStatus.BAD_REQUEST,
    );
  }
  cb(error, true);
}

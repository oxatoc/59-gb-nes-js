import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Render,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';
import { CommentCreateDto } from '../../dtos/comment-create-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IdNewsDto } from '../../dtos/id-news-dto';
import { fileExtensionCheck } from '../../utils/file-extension-check';
import { destinationPathComment } from '../../utils/destination-path-comment';
import { customFileName } from '../../utils/custom-file-name';
import { AVATARS_PATH } from '../../types/types';

@Controller('news-comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @Render('comments-index')
  async index() {
    const comments = await this.commentsService.index();
    return { comments };
  }

  @Get('all')
  getAll(@Query('idNews') idNews: number) {
    return this.commentsService.findAll(idNews);
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: destinationPathComment,
        filename: customFileName,
      }),
      fileFilter: fileExtensionCheck,
    }),
  )
  create(
    @Query() params: IdNewsDto,
    @Body() commentCreateDto: CommentCreateDto,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<Comment> {
    let avatarPath = '';
    if (avatar?.filename.length > 0) {
      avatarPath = AVATARS_PATH + avatar.filename;
    }
    return this.commentsService.create(params.idNews, {
      ...commentCreateDto,
      ...{ avatar: avatarPath },
    });
  }

  @Patch(':id')
  update(
    @Param('id') idComment: string,
    @Body() commentCreateDto: CommentCreateDto,
  ) {
    return this.commentsService.update(idComment, commentCreateDto);
  }

  @Delete(':id')
  remove(
    @Query('idNews') idNews: number,
    @Param('id') idComment: string,
  ): Promise<boolean> {
    return this.commentsService.remove(idNews, idComment);
  }

  @Delete('all')
  removeAll(@Query('idNews') idNews: number): Promise<boolean> {
    return this.commentsService.removeAll(idNews);
  }
}

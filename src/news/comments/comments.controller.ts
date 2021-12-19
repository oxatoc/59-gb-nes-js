import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.interface';
import { CommentCreateDto } from '../../dtos/comment-create-dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IdNewsDto } from '../../dtos/id-news-dto';
import { fileExtensionCheck } from '../../utils/file-extension-check';
import { CommentsHelperFileLoader } from '../../classes/helper-file-loader/CommentsHelperFileLoader';

const commentsHelperFileLoader = new CommentsHelperFileLoader();

@Controller('news-comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('all')
  getAll(@Query('idNews') idNews: number): Promise<Comment[] | undefined> {
    return this.commentsService.findAll(idNews);
  }

  @Post()
  @UseInterceptors(
    FilesInterceptor('avatar', 1, {
      storage: diskStorage({
        destination: commentsHelperFileLoader.destinationPath,
        filename: commentsHelperFileLoader.customFileName,
      }),
      fileFilter: fileExtensionCheck,
    }),
  )
  create(
    @Query() params: IdNewsDto,
    @Body() commentCreateDto: CommentCreateDto,
    @UploadedFiles() avatar: Express.Multer.File[],
  ): Promise<Comment> {
    let avatarPath = '';
    const avatarItem = avatar[0];
    if (avatarItem?.filename.length > 0) {
      avatarPath = commentsHelperFileLoader.path + avatarItem.filename;
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

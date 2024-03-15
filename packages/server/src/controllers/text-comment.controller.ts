import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';

import { TextCommentApiDefinition } from '@think/domains';

import { TextCommentDto } from '@dtos/text-comment.dto';
import { TextCommentService } from '@services/text-comment.service';

@Controller('text-comment')
export class TextComentController {
  constructor(private readonly textCommentService: TextCommentService) {}

  /**
   * 新增文本评论
   * @param textComment
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(TextCommentApiDefinition.create.server)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() textComment: TextCommentDto) {
    return await this.textCommentService.createComment(textComment);
  }

  /**
   * 获取文档 文本评论列表
   * @param documentId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(TextCommentApiDefinition.getTextComment.server)
  @HttpCode(HttpStatus.OK)
  async getTextComment(@Query('documentId') documentId: string) {
    return await this.textCommentService.getTextComment(documentId);
  }

  /**
   * 删除文本评论
   * @param textCommentId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(TextCommentApiDefinition.deleteTextComment.server)
  @HttpCode(HttpStatus.OK)
  async deleteTextComment(@Query('textId') textId: string) {
    return await this.textCommentService.deleteTextComment(textId);
  }
}

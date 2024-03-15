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

import { TextCommentReplyApiDefinition } from '@think/domains';

import { TextCommentReplyDto } from '@dtos/text-comment-reply.dto';
import { TextCommentReplyService } from '@services/text-comment-reply.service';

@Controller('text-comment-reply')
export class TextCommentReplyController {
  constructor(private readonly textCommentReplyService: TextCommentReplyService) {}

  /**
   * 获取回复列表
   * @param textId
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(TextCommentReplyApiDefinition.getTextCommentReply.server)
  @HttpCode(HttpStatus.CREATED)
  async getTextCommentReply(@Query('textId') textId: string) {
    return await this.textCommentReplyService.getTextCommentReply(textId);
  }

  /**
   * 创建评论
   * @param textCommentReply
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(TextCommentReplyApiDefinition.create.server)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() textCommentReply: TextCommentReplyDto) {
    return await this.textCommentReplyService.createReply(textCommentReply);
  }

  /**
   * 删除评论
   * @param id 评论回复id
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(TextCommentReplyApiDefinition.deleteTextCommentReply.server)
  @HttpCode(HttpStatus.OK)
  async deleteCommentReply(@Query('id') id: string) {
    return await this.textCommentReplyService.deleteTextCommentReply(id);
  }

  /**
   * 修改评论
   * @param replyInfo
   * @returns
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(TextCommentReplyApiDefinition.editTextCommentReply.server)
  @HttpCode(HttpStatus.OK)
  async editTextCommentReply(@Body() replyInfo) {
    return await this.textCommentReplyService.editTextCommentReply(replyInfo);
  }
}

import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TextCommentDto } from '@dtos/text-comment.dto';
import { TextCommentEntity } from '@entities/text-comment.entity';
import { TextCommentReplyService } from '@services/text-comment-reply.service';
import { Repository } from 'typeorm';

@Injectable()
export class TextCommentService {
  constructor(
    @InjectRepository(TextCommentEntity)
    private readonly textCommentRepo: Repository<TextCommentEntity>,

    @Inject(forwardRef(() => TextCommentReplyService))
    private readonly textCommentReplyService: TextCommentReplyService
  ) {}

  /**
   * 获取文本会话
   * @param documentId
   * @returns
   */
  async getTextComment(documentId) {
    if (!documentId) {
      throw new HttpException('请传入文档 id', HttpStatus.BAD_REQUEST);
    }
    const textComments = await this.textCommentRepo.find({
      documentId,
    });
    const batchs = [];
    for (const item of textComments) {
      const comments = await this.textCommentReplyService.getTextCommentReply(item.textId);
      if (comments.length === 0) {
        await this.textCommentRepo.delete({ id: item.id });
      }
      if (comments.length > 0) {
        batchs.push({
          ...item,
          replies: comments,
        });
      }
    }

    return await Promise.all(batchs);
  }

  /**
   * 创建文本
   * @param commentInfo
   * @returns
   */
  async createComment(commentInfo: TextCommentDto): Promise<TextCommentEntity> {
    const res = await this.textCommentRepo.create(commentInfo);
    const result = await this.textCommentRepo.save(res);
    return result;
  }

  /**
   * 删除文本
   * @param textCommentId
   * @returns
   */
  async deleteTextComment(textId: string) {
    const res = await this.textCommentRepo.delete({ textId });
    return res;
  }
}

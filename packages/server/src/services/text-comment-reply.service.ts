import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TextCommentReplyDto } from '@dtos/text-comment-reply.dto';
import { TextCommentReplyEntity } from '@entities/text-comment-reply.entity';
import { UserService } from '@services/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class TextCommentReplyService {
  constructor(
    @InjectRepository(TextCommentReplyEntity)
    private readonly textCommentReplyRepo: Repository<TextCommentReplyEntity>,

    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  /**
   * 创建文本评论
   * @param reply
   * @returns
   */
  async createReply(reply: TextCommentReplyDto): Promise<TextCommentReplyEntity> {
    const res = await this.textCommentReplyRepo.create(reply);
    const result = await this.textCommentReplyRepo.save(res);
    return result;
  }

  /**
   *
   * @param textId 文本id
   * @returns
   */
  async getTextCommentReply(textId: string) {
    const list = await this.textCommentReplyRepo.find({
      textId,
    });

    if (list.length) {
      return await Promise.all(
        list.map(async (item) => {
          const user = await this.userService.findById(item.userId);
          return {
            ...item,
            user,
          };
        })
      );
    }
    return [];
  }

  /**
   * 修改回复评论
   * @param replyInfo 新评论信息
   * @returns
   */
  async editTextCommentReply(replyInfo: { id: string; content: string }) {
    const { id, content } = replyInfo;
    const reply = await this.textCommentReplyRepo.findOne({ id });

    const res = this.textCommentReplyRepo.merge(reply, {
      content,
    });

    return res;
  }

  /**
   * 删除评论id
   * @param replyId 评论回复id
   * @returns
   */
  async deleteTextCommentReply(replyId: string) {
    const res = await this.textCommentReplyRepo.delete({ id: replyId });

    return res;
  }
}

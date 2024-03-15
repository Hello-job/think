import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TextCommentReplyController } from '@controllers/text-comment-reply.controller';
import { TextCommentReplyEntity } from '@entities/text-comment-reply.entity';
import { UserModule } from '@modules/user.module';
import { TextCommentReplyService } from '@services/text-comment-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([TextCommentReplyEntity]), forwardRef(() => UserModule)],
  providers: [TextCommentReplyService],
  exports: [TextCommentReplyService],
  controllers: [TextCommentReplyController],
})
export class TextCommentReplyModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TextComentController } from '@controllers/text-comment.controller';
import { TextCommentEntity } from '@entities/text-comment.entity';
import { TextCommentService } from '@services/text-comment.service';

import { TextCommentReplyModule } from './text-comment-reply.module';

@Module({
  imports: [TypeOrmModule.forFeature([TextCommentEntity]), forwardRef(() => TextCommentReplyModule)],
  providers: [TextCommentService],
  exports: [TextCommentService],
  controllers: [TextComentController],
})
export class TextCommentModule {}

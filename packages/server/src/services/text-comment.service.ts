import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TextCommentEntity } from '@entities/text-comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TextCommentService {
  constructor(
    @InjectRepository(TextCommentEntity)
    private readonly textCommentRepo: Repository<TextCommentEntity>
  ) {}

  createComment(commentInfo: any): any {
    console.log('>>>>>commentInfo');
  }
}

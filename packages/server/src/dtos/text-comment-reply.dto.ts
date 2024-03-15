import { IsNotEmpty, IsString } from 'class-validator';

export class TextCommentReplyDto {
  @IsString({ message: '文本 Id 类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '文本 Id 不能为空' })
  textId: string;

  @IsString({ message: '文本内容不能为空' })
  content: string;

  @IsString({ message: '用户 Id 类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '用户 Id 不能为空' })
  userId: string;
}

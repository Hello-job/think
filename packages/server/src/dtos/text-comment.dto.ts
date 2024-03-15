import { IsNotEmpty, IsString } from 'class-validator';

export class TextCommentDto {
  @IsString({ message: '文档 Id 类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '文档 Id 不能为空' })
  documentId: string;

  @IsString({ message: '文本内容不能为空' })
  text: string;
}

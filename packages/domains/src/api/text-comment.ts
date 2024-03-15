import { IComment, IDocument } from '../models';

export const TextCommentApiDefinition = {
  /**
   * 新建选中文本
   */
  create: {
    method: 'post' as const,
    server: 'create' as const,
    client: () => '/text-comment/create',
  },
  /**
   * 获取文档文本评论
   */
  getTextComment: {
    method: 'get' as const,
    server: '/' as const,
    client: () => '/text-comment',
  },
  /**
   * 删除文本评论
   */
  deleteTextComment: {
    method: 'delete' as const,
    server: 'delete' as const,
    client: () => '/text-comment/delete',
  },
};
